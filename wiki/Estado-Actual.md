# Estado actual

| Área | Estado |
|------|--------|
| Fundación (entornos, tipos, prompt, interfaces de voz) | ✅ Hecho |
| Servicio Gemini (`fetch` REST) | ✅ Hecho y funcionando |
| Voz Web (STT/TTS) | ✅ Implementado |
| UI de chat (signals + Tailwind) | ✅ Hecho |
| Tests | ✅ 10/10 passing |
| **Chat por TEXTO** | ✅ **Funciona** |
| **Chat por VOZ** | ⚠️ **En verificación** (ver [Pendientes](Pendientes)) |

## Comandos

Windows/PowerShell — usar la ruta directa a `npm.cmd`:

```powershell
& "C:\Program Files\nodejs\npm.cmd" start        # ng serve (desarrollo)
& "C:\Program Files\nodejs\npm.cmd" run build    # build producción
& "C:\Program Files\nodejs\npm.cmd" test         # tests (Vitest)
```

> Un `exit code 1` de npm suele ser solo warnings en stderr; verificar el resultado
> real en stdout / en la salida del build.
