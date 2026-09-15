import { computed, Injectable, inject, signal } from '@angular/core';

import { GeminiService } from '../gemini/gemini.service';
import type { ChatMessage } from '../models/chat-message';

/**
 * Store de la conversación basado en signals.
 *
 * Mantiene el historial de mensajes y orquesta las llamadas a Gemini.
 * La UI consume los signals de solo lectura; no manipula el estado directamente.
 */
@Injectable({ providedIn: 'root' })
export class ConversationStore {
  private readonly gemini = inject(GeminiService);

  private readonly _messages = signal<readonly ChatMessage[]>([]);
  private readonly _isThinking = signal(false);
  private readonly _error = signal<string | null>(null);

  /** Historial de mensajes en orden cronológico. */
  readonly messages = this._messages.asReadonly();
  /** true mientras se espera la respuesta del modelo. */
  readonly isThinking = this._isThinking.asReadonly();
  /** Último error (o null si no hay). */
  readonly error = this._error.asReadonly();

  /** true si hay al menos un mensaje en la conversación. */
  readonly hasMessages = computed(() => this._messages().length > 0);

  /**
   * Envía un mensaje del usuario, llama a Gemini y añade la respuesta.
   *
   * @param text Texto del usuario (se ignora si está vacío o si ya se está pensando).
   * @returns El texto de la respuesta del modelo, o null si no se envió/ falló.
   */
  async send(text: string): Promise<string | null> {
    const trimmed = text.trim();
    if (!trimmed || this._isThinking()) {
      return null;
    }

    this._error.set(null);
    this.append({ role: 'user', text: trimmed, timestamp: Date.now() });
    this._isThinking.set(true);

    try {
      const reply = await this.gemini.generateReply(this._messages());
      this.append({ role: 'model', text: reply, timestamp: Date.now() });
      return reply;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Error desconocido al hablar con Gemini.';
      this._error.set(message);
      return null;
    } finally {
      this._isThinking.set(false);
    }
  }

  /** Reinicia la conversación. */
  reset(): void {
    this._messages.set([]);
    this._error.set(null);
    this._isThinking.set(false);
  }

  /** Añade un mensaje al historial de forma inmutable. */
  private append(message: ChatMessage): void {
    this._messages.update((current) => [...current, message]);
  }
}
