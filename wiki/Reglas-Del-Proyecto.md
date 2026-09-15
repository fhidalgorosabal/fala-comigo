# Reglas del proyecto

1. **Solo frontend.** Nada de backend/DB/auth. Gemini con `fetch` puro (sin SDK).
2. **pt-BR**: la IA es profesor/conversador brasileño; corrige solo errores importantes;
   system prompt centralizado en `prompt.config.ts`.
3. **Preparado para Capacitor/Android**: voz tras interfaces `SpeechInput`/`SpeechOutput`
   para sustituir Web Speech por plugins nativos sin tocar el resto.
4. **API key** solo en `environment.development.ts` (gitignored), nunca hardcodeada en componentes.
5. Verificar cada fase con `ng build`.
6. Windows: usar la ruta directa a `npm.cmd`. Un `exit code 1` de npm suele ser solo warnings.
7. Minimalista y limpio; sin dependencias innecesarias ni cambios de versión de Angular.
