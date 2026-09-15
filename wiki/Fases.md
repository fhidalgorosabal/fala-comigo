# Fases

## Fase 1 — Fundación
- `environment.type.ts`, `environment.ts` (prod sin clave), `.example` de desarrollo.
- `.gitignore`: ignora `src/environments/environment.development.ts`.
- `angular.json`: `fileReplacements` en config `development` para inyectar el entorno local.
- `prompt.config.ts` (SYSTEM_PROMPT profesor pt-BR + GENERATION_CONFIG).
- Tipos de dominio `chat-message.ts`.
- Interfaces de voz `speech-input.ts` / `speech-output.ts`.

## Fase 2 — Servicio Gemini
- `gemini.service.ts`: cliente REST con `fetch` puro. Maneja errores de red,
  HTTP no-ok, bloqueo por seguridad y respuesta vacía. `isConfigured()`.
- `gemini.service.spec.ts`: 4 tests (mock de `fetch` y de la clave).
- `angular.json`: nueva config de build `test` **sin** `fileReplacements` +
  `test.options.buildTarget = fala-comigo:build:test`, para que los tests no
  requieran `environment.development.ts` (usan `environment.ts` y mockean la clave).

## Fase 3 — Voz (Web Speech)
- `web-speech-output.ts` (`WebSpeechOutput`): TTS con `speechSynthesis`.
- `web-speech-recognition.types.ts`: tipos mínimos de la API + `getSpeechRecognitionCtor()`
  (resuelve el prefijo `webkit`).
- `web-speech-input.ts` (`WebSpeechInput`): STT como `Observable`, resultados
  parciales/finales, teardown que aborta el reconocimiento.

## Fase 4 — UI de chat
- `speech.tokens.ts`: `SPEECH_INPUT` / `SPEECH_OUTPUT` con implementaciones Web por defecto.
- `conversation.store.ts` (+ spec, 4 tests).
- `conversation.ts` + `conversation.html`: chat standalone con burbujas usuario/modelo,
  indicador "Digitando…", errores, input de texto (fallback) y botón de micrófono.
- `app.ts` renderiza `<app-conversation/>`; `app.spec.ts` actualizado; eliminado `app.html` placeholder.

## Correcciones posteriores
- **Modelo**: `gemini-2.5-flash` → `gemini-3.6-flash` (el primero da 404 a usuarios nuevos).
  Cambiado en `environment.ts`, `.example` y comentario del tipo. **Falta confirmarlo en
  `environment.development.ts`** (archivo local, lo edita el usuario).
- **NgZone en STT**: los eventos de la Web Speech API se disparan FUERA de la zona de
  Angular. Se envolvieron `onresult`/`onerror`/`onend` en `NgZone.run` para que los
  signals reaccionen y se dispare el envío a Gemini.
