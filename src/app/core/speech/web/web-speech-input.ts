import { inject, Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

import type { SpeechInput, SpeechRecognitionResult } from '../speech-input';
import {
  getSpeechRecognitionCtor,
  type SpeechRecognition,
} from './web-speech-recognition.types';

/**
 * Implementación de {@link SpeechInput} basada en la Web Speech Recognition API
 * del navegador (`SpeechRecognition` / `webkitSpeechRecognition`).
 *
 * Los eventos de la API son nativos del navegador y se disparan FUERA de la
 * zona de Angular, así que envolvemos las emisiones en `NgZone.run` para que
 * los signals y la detección de cambios reaccionen correctamente.
 *
 * En Android/Capacitor se sustituirá por un plugin nativo que implemente
 * la misma interfaz, sin tocar el resto de la app.
 */
@Injectable({ providedIn: 'root' })
export class WebSpeechInput implements SpeechInput {
  private readonly zone = inject(NgZone);
  private recognition: SpeechRecognition | null = null;

  isSupported(): boolean {
    return getSpeechRecognitionCtor() !== undefined;
  }

  listen(lang: string): Observable<SpeechRecognitionResult> {
    return new Observable<SpeechRecognitionResult>((subscriber) => {
      const Ctor = getSpeechRecognitionCtor();
      if (!Ctor) {
        subscriber.error(new Error('El reconocimiento de voz no está soportado en esta plataforma.'));
        return;
      }

      const recognition = new Ctor();
      this.recognition = recognition;
      recognition.lang = lang;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        this.zone.run(() => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const alternative = result[0];
            subscriber.next({
              transcript: alternative.transcript,
              isFinal: result.isFinal,
            });
          }
        });
      };

      recognition.onerror = (event) => {
        this.zone.run(() => {
          // 'no-speech' y 'aborted' son finales normales, no errores reales.
          if (event.error === 'no-speech' || event.error === 'aborted') {
            subscriber.complete();
            return;
          }
          subscriber.error(new Error(`Error en el reconocimiento de voz: ${event.error}`));
        });
      };

      recognition.onend = () => {
        this.zone.run(() => subscriber.complete());
      };

      recognition.start();

      // Teardown: si se cancela la suscripción, aborta el reconocimiento.
      return () => {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.abort();
        if (this.recognition === recognition) {
          this.recognition = null;
        }
      };
    });
  }

  stop(): void {
    this.recognition?.stop();
  }
}
