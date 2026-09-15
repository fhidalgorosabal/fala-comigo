# Puesta en marcha

La API key de Gemini vive en `src/environments/environment.development.ts`
(ignorado por git, **nunca se commitea**). Si no existe, la app arranca pero
Gemini responde: *"API key de Gemini no configurada"*.

## Pasos

1. Crear una cuenta y una API key en Google AI Studio: https://aistudio.google.com/apikey
2. Copiar la plantilla:
   ```powershell
   Copy-Item src\environments\environment.development.ts.example src\environments\environment.development.ts
   ```
3. Editar `environment.development.ts` y pegar la clave real en `apiKey` (mantener las comillas).
4. Reiniciar `ng serve` (el reemplazo de entorno solo se aplica al arrancar).

## Modelo

Usar `gemini-3.6-flash`. `gemini-2.5-flash` ya **no** está disponible para usuarios
nuevos (devuelve **404**). El nombre del modelo está en el campo `model:` de
`environment.development.ts`; cambiarlo ahí si hiciera falta.

## Requisitos de la voz (Web Speech)

- Requiere `https` o `localhost`.
- Navegador compatible: **Chrome / Edge**. Firefox **no** soporta `SpeechRecognition`
  (en ese caso el botón de micrófono ni aparece).
