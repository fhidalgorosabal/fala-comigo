import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { environment } from '../../../environments/environment';
import type { ChatMessage } from '../models/chat-message';
import { GeminiService } from './gemini.service';

/** Construye una respuesta fetch simulada. */
function mockFetchResponse(body: unknown, init: { ok?: boolean; status?: number } = {}): Response {
  const ok = init.ok ?? true;
  const status = init.status ?? 200;
  return {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as unknown as Response;
}

const HISTORY: readonly ChatMessage[] = [{ role: 'user', text: 'Oi!', timestamp: 1 }];

describe('GeminiService', () => {
  let service: GeminiService;
  let originalApiKey: string;

  beforeEach(() => {
    // La API key es readonly en el tipo; forzamos un valor de test.
    originalApiKey = environment.gemini.apiKey;
    (environment.gemini as { apiKey: string }).apiKey = 'test-key';

    TestBed.configureTestingModule({});
    service = TestBed.inject(GeminiService);
  });

  afterEach(() => {
    (environment.gemini as { apiKey: string }).apiKey = originalApiKey;
    vi.restoreAllMocks();
  });

  it('devuelve el texto de la respuesta del modelo', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      mockFetchResponse({
        candidates: [{ content: { parts: [{ text: 'Olá, tudo bem?' }] } }],
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const reply = await service.generateReply(HISTORY);

    expect(reply).toBe('Olá, tudo bem?');
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((requestInit.headers as Record<string, string>)['x-goog-api-key']).toBe('test-key');
  });

  it('lanza error cuando la API key no está configurada', async () => {
    (environment.gemini as { apiKey: string }).apiKey = '';
    // Se necesita una instancia nueva que lea la key vacía.
    const freshService = new GeminiService();

    await expect(freshService.generateReply(HISTORY)).rejects.toThrow(/no configurada/i);
  });

  it('lanza error cuando la respuesta HTTP no es ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(mockFetchResponse({ error: 'boom' }, { ok: false, status: 400 })),
    );

    await expect(service.generateReply(HISTORY)).rejects.toThrow(/400/);
  });

  it('lanza error cuando Gemini bloquea la respuesta', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(mockFetchResponse({ promptFeedback: { blockReason: 'SAFETY' } })),
    );

    await expect(service.generateReply(HISTORY)).rejects.toThrow(/SAFETY/);
  });
});
