import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { GENERATION_CONFIG, SYSTEM_PROMPT } from '../config/prompt.config';
import type { ChatMessage } from '../models/chat-message';

/** Base de la API REST de Gemini (Generative Language API). */
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

/** Rol tal y como lo espera la API de Gemini. */
type GeminiRole = 'user' | 'model';

/** Una parte de contenido en el formato de Gemini. */
interface GeminiPart {
  readonly text: string;
}

/** Un turno de contenido en el formato de Gemini. */
interface GeminiContent {
  readonly role: GeminiRole;
  readonly parts: readonly GeminiPart[];
}

/** Cuerpo de la petición a generateContent. */
interface GeminiRequest {
  readonly systemInstruction: { readonly parts: readonly GeminiPart[] };
  readonly contents: readonly GeminiContent[];
  readonly generationConfig: typeof GENERATION_CONFIG;
}

/** Forma (parcial) de la respuesta de generateContent que nos interesa. */
interface GeminiResponse {
  readonly candidates?: ReadonlyArray<{
    readonly content?: { readonly parts?: ReadonlyArray<{ readonly text?: string }> };
    readonly finishReason?: string;
  }>;
  readonly promptFeedback?: { readonly blockReason?: string };
}

/**
 * Cliente de la API REST de Gemini usando `fetch` puro (sin SDK).
 *
 * Envía el system prompt centralizado + el historial de conversación
 * y devuelve el texto de la respuesta del modelo.
 */
@Injectable({ providedIn: 'root' })
export class GeminiService {
  private readonly apiKey = environment.gemini.apiKey;
  private readonly model = environment.gemini.model;

  /** Indica si hay una API key configurada. */
  isConfigured(): boolean {
    return this.apiKey.trim().length > 0;
  }

  /**
   * Genera la respuesta del modelo dado el historial de conversación.
   *
   * @param history Mensajes previos (incluido el último del usuario), en orden cronológico.
   * @returns El texto de la respuesta del modelo.
   * @throws Error si la API key no está configurada o la petición falla.
   */
  async generateReply(history: readonly ChatMessage[]): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error(
        'API key de Gemini no configurada. Crea src/environments/environment.development.ts a partir del .example.',
      );
    }

    const url = `${GEMINI_API_BASE}/models/${encodeURIComponent(this.model)}:generateContent`;

    const body: GeminiRequest = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: this.toGeminiContents(history),
      generationConfig: GENERATION_CONFIG,
    };

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey,
        },
        body: JSON.stringify(body),
      });
    } catch (cause) {
      throw new Error('No se pudo conectar con Gemini. Revisa tu conexión.', { cause });
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`Gemini respondió ${response.status}: ${detail || response.statusText}`);
    }

    const data = (await response.json()) as GeminiResponse;

    const blockReason = data.promptFeedback?.blockReason;
    if (blockReason) {
      throw new Error(`Gemini bloqueó la respuesta (${blockReason}).`);
    }

    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? '')
      .join('')
      .trim();

    if (!text) {
      throw new Error('Gemini no devolvió texto en la respuesta.');
    }

    return text;
  }

  /** Convierte el historial del dominio al formato `contents` de Gemini. */
  private toGeminiContents(history: readonly ChatMessage[]): readonly GeminiContent[] {
    return history.map((message) => ({
      role: message.role,
      parts: [{ text: message.text }],
    }));
  }
}
