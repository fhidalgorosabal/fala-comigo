# Arquitectura

Preparada para **Capacitor/Android**: la voz está detrás de interfaces
(`SpeechInput` / `SpeechOutput`) inyectadas por token. En Android solo se cambia
el provider por un plugin nativo, sin tocar componentes ni lógica.

## Estructura

```
src/
├─ environments/
│  ├─ environment.type.ts              # Contrato AppEnvironment
│  ├─ environment.ts                   # Producción (SIN clave, se commitea)
│  ├─ environment.development.ts       # Local con clave (GITIGNORED)
│  └─ environment.development.ts.example  # Plantilla (se commitea)
└─ app/
   ├─ app.ts                           # Shell: renderiza <app-conversation/>
   ├─ core/
   │  ├─ config/prompt.config.ts       # SYSTEM_PROMPT (profesor pt-BR) + GENERATION_CONFIG
   │  ├─ models/chat-message.ts        # ChatRole, ChatMessage
   │  ├─ gemini/
   │  │  ├─ gemini.service.ts          # Cliente REST fetch a generateContent
   │  │  └─ gemini.service.spec.ts
   │  ├─ conversation/
   │  │  ├─ conversation.store.ts      # Estado con signals + orquesta Gemini
   │  │  └─ conversation.store.spec.ts
   │  └─ speech/
   │     ├─ speech-input.ts            # Interfaz STT + SpeechRecognitionResult
   │     ├─ speech-output.ts           # Interfaz TTS + SpeechSpeakOptions
   │     ├─ speech.tokens.ts           # SPEECH_INPUT / SPEECH_OUTPUT (InjectionToken)
   │     └─ web/
   │        ├─ web-speech-input.ts     # STT con Web Speech Recognition API
   │        ├─ web-speech-output.ts    # TTS con speechSynthesis
   │        └─ web-speech-recognition.types.ts  # Tipos mínimos (no están en TS estándar)
   └─ features/
      └─ conversation/
         ├─ conversation.ts            # Componente de chat (voz + texto)
         └─ conversation.html          # Template Tailwind
```

## Flujo de conversación

```
Voz:   micrófono → WebSpeechInput.listen() → transcript → ConversationStore.send()
                                                              → GeminiService.generateReply()
                                                              → respuesta → WebSpeechOutput.speak()
Texto: input → submitDraft() → ConversationStore.send() → GeminiService → (y también TTS)
```

- `ConversationStore` mantiene el estado con signals: `messages`, `isThinking`,
  `error`, `hasMessages`. La UI solo lee; no muta el estado directamente.
- `GeminiService` envía `systemInstruction` (prompt centralizado) + historial
  mapeado a `contents` + `generationConfig` al endpoint
  `POST .../models/{model}:generateContent` con header `x-goog-api-key`.
