import { Injectable } from '@angular/core';

import type { SpeechOutput, SpeechSpeakOptions } from '../speech-output';

/**
 * Implementación de {@link SpeechOutput} basada en la Web Speech API
 * (`speechSynthesis`) del navegador.
 *
 * En Android/Capacitor se sustituirá por un plugin nativo que implemente
 * la misma interfaz, sin tocar el resto de la app.
 */
@Injectable({ providedIn: 'root' })
export class WebSpeechOutput implements SpeechOutput {
  isSupported(): boolean {
    return typeof globalThis.speechSynthesis !== 'undefined' && typeof SpeechSynthesisUtterance !== 'undefined';
  }

  speak(text: string, options: SpeechSpeakOptions): Promise<void> {
    if (!this.isSupported()) {
      return Promise.reject(new Error('La síntesis de voz no está soportada en esta plataforma.'));
    }

    // Cancela cualquier locución en curso antes de empezar.
    this.cancel();

    return new Promise<void>((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang;
      utterance.rate = options.rate ?? 1;
      utterance.pitch = options.pitch ?? 1;

      utterance.onend = () => resolve();
      utterance.onerror = (event) =>
        reject(new Error(`Error en la síntesis de voz: ${event.error ?? 'desconocido'}`));

      globalThis.speechSynthesis.speak(utterance);
    });
  }

  cancel(): void {
    if (this.isSupported()) {
      globalThis.speechSynthesis.cancel();
    }
  }
}
