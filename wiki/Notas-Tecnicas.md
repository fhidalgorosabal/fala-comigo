# Notas técnicas

- **Binding del input de texto**: se usa `[ngModel]` + `(ngModelChange)` sobre el signal
  `draft`, no `[(ngModel)]` de dos vías (el two-way no opera directo sobre un signal sin `model()`).
- **Config de test**: separada de `development` para no exigir la clave local en los tests.
  El target de test apunta a `fala-comigo:build:test`, que no aplica `fileReplacements`.
- **Interactions API**: Google la recomienda, pero `generateContent` sigue siendo válido.
  Migrar sería un trabajo aparte; no es necesario ahora.
- **Web Speech**: requiere `https` o `localhost` y navegador compatible (Chrome/Edge).
  Firefox no soporta `SpeechRecognition` (el botón de micrófono no aparece).
- **NgZone**: la Web Speech Recognition API dispara eventos fuera de la zona de Angular;
  por eso las emisiones del Observable se envuelven en `NgZone.run` para que los signals
  y la detección de cambios reaccionen.
