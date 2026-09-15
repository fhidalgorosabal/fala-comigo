import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GeminiService } from '../gemini/gemini.service';
import { ConversationStore } from './conversation.store';

describe('ConversationStore', () => {
  let store: ConversationStore;
  let generateReply: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    generateReply = vi.fn();
    TestBed.configureTestingModule({
      providers: [{ provide: GeminiService, useValue: { generateReply } }],
    });
    store = TestBed.inject(ConversationStore);
  });

  it('añade el mensaje del usuario y la respuesta del modelo', async () => {
    generateReply.mockResolvedValue('Oi! Tudo bem?');

    const reply = await store.send('Olá');

    expect(reply).toBe('Oi! Tudo bem?');
    const messages = store.messages();
    expect(messages).toHaveLength(2);
    expect(messages[0]).toMatchObject({ role: 'user', text: 'Olá' });
    expect(messages[1]).toMatchObject({ role: 'model', text: 'Oi! Tudo bem?' });
    expect(store.isThinking()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('ignora texto vacío', async () => {
    const reply = await store.send('   ');

    expect(reply).toBeNull();
    expect(store.messages()).toHaveLength(0);
    expect(generateReply).not.toHaveBeenCalled();
  });

  it('guarda el error y mantiene solo el mensaje del usuario cuando Gemini falla', async () => {
    generateReply.mockRejectedValue(new Error('boom'));

    const reply = await store.send('Olá');

    expect(reply).toBeNull();
    expect(store.error()).toBe('boom');
    expect(store.messages()).toHaveLength(1);
    expect(store.isThinking()).toBe(false);
  });

  it('reset limpia mensajes y error', async () => {
    generateReply.mockResolvedValue('Oi!');
    await store.send('Olá');

    store.reset();

    expect(store.messages()).toHaveLength(0);
    expect(store.error()).toBeNull();
    expect(store.hasMessages()).toBe(false);
  });
});
