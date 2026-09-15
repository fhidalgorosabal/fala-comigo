import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ConversationStore } from '../../core/conversation/conversation.store';
import { SPEECH_INPUT, SPEECH_OUTPUT } from '../../core/speech/speech.tokens';

/** Idioma de trabajo de la app: portugués brasileño. */
const LANG = 'pt-BR';

/**
 * Componente principal de conversación por voz (y texto como fallback).
 *
 * Orquesta el ciclo: escuchar (STT) → enviar a Gemini → hablar la respuesta (TTS).
 * Depende de las abstracciones de voz vía tokens, no de las implementaciones Web.
 */
@Component({
  selector: 'app-conversation',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './conversation.html',
})
export class Conversation {
  private readonly speechInput = inject(SPEECH_INPUT);
  private readonly speechOutput = inject(SPEECH_OUTPUT);

  protected readonly store = inject(ConversationStore);

  /** true mientras el micrófono está escuchando. */
  protected readonly isListening = signal(false);
  /** Transcripción parcial mientras se habla. */
  protected readonly interimTranscript = signal('');
  /** Texto del input de fallback. */
  protected readonly draft = signal('');

  /** true si la plataforma soporta reconocimiento de voz. */
  protected readonly speechSupported = this.speechInput.isSupported();

  private listenSub: Subscription | null = null;

  /** Alterna entre empezar y detener la escucha por voz. */
  protected toggleListening(): void {
    if (this.isListening()) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  /** Envía el texto del input de fallback. */
  protected async submitDraft(): Promise<void> {
    const text = this.draft().trim();
    if (!text) {
      return;
    }
    this.draft.set('');
    await this.sendAndSpeak(text);
  }

  /** Reinicia la conversación y detiene voz en curso. */
  protected reset(): void {
    this.stopListening();
    this.speechOutput.cancel();
    this.store.reset();
  }

  private startListening(): void {
    if (!this.speechSupported) {
      return;
    }
    // Silencia cualquier respuesta hablándose antes de escuchar.
    this.speechOutput.cancel();
    this.interimTranscript.set('');
    this.isListening.set(true);

    let finalTranscript = '';

    this.listenSub = this.speechInput.listen(LANG).subscribe({
      next: (result) => {
        if (result.isFinal) {
          finalTranscript += result.transcript;
          this.interimTranscript.set('');
        } else {
          this.interimTranscript.set(result.transcript);
        }
      },
      error: () => {
        this.isListening.set(false);
        this.interimTranscript.set('');
      },
      complete: () => {
        this.isListening.set(false);
        this.interimTranscript.set('');
        const text = finalTranscript.trim();
        if (text) {
          void this.sendAndSpeak(text);
        }
      },
    });
  }

  private stopListening(): void {
    this.speechInput.stop();
    this.listenSub?.unsubscribe();
    this.listenSub = null;
    this.isListening.set(false);
  }

  /** Envía el texto a Gemini y reproduce la respuesta por voz. */
  private async sendAndSpeak(text: string): Promise<void> {
    const reply = await this.store.send(text);
    if (reply && this.speechOutput.isSupported()) {
      try {
        await this.speechOutput.speak(reply, { lang: LANG });
      } catch {
        // La síntesis puede fallar (permiso/soporte); el texto ya está visible.
      }
    }
  }
}
