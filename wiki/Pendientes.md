# Pendientes

## ⚠️ Chat por VOZ: verificar tras el arreglo de NgZone

- **Texto funciona.** Voz estaba "no hace nada".
- Causa probable ya corregida: callbacks de STT fuera de `NgZone` → envueltos en `zone.run`.
- **Pendiente: probar en el navegador** que hablar ahora dispara el flujo completo.

Al probar, comprobar en orden:
1. ¿El botón de micrófono se pone rojo/pulsa al pulsarlo?
2. ¿El navegador pidió permiso de micrófono? (aceptar)
3. ¿Aparece la burbuja verde clara (transcripción parcial) mientras se habla?
4. ¿Al terminar aparece el mensaje del usuario + respuesta de Gemini (y se escucha)?
5. Navegador: usar **Chrome o Edge** (Firefox no soporta `SpeechRecognition`).

Si sigue fallando, revisar la consola del navegador (F12) para ver el evento de error
del reconocimiento y en qué paso se corta.

## Backlog

- Confirmar `model: 'gemini-3.6-flash'` en `environment.development.ts` (local).
- Auto-scroll al último mensaje en el historial.
- Tests del componente `Conversation` (mockear tokens de voz).
- Manejo de permisos de micrófono denegados (mensaje al usuario).
- Preparar integración Capacitor (providers nativos para `SPEECH_INPUT`/`SPEECH_OUTPUT`).
