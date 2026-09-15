# Fala Comigo — Wiki

App **Angular 22** (standalone components, signals, Tailwind 4), **SPA sin SSR**, para
practicar **portugués brasileño (pt-BR)** conversando con **Gemini**. Solo frontend:
la integración con Gemini se hace con `fetch` puro (sin SDK) a la API REST.

> Última actualización: 2026-09-15

## Índice

- **[Estado actual](Estado-Actual)** — resumen rápido, comandos y qué funciona hoy.
- **[Puesta en marcha](Puesta-En-Marcha)** — configurar la API key y el modelo para correr en local.
- **[Arquitectura](Arquitectura)** — estructura de carpetas y flujo de conversación.
- **[Fases](Fases)** — lo implementado en cada fase y correcciones posteriores.
- **[Notas técnicas](Notas-Tecnicas)** — decisiones de diseño y detalles.
- **[Pendientes](Pendientes)** — problema abierto (voz) y backlog para continuar.
- **[Reglas del proyecto](Reglas-Del-Proyecto)** — restricciones del MVP.

## En una frase

Chat por **texto ✅ funciona**. Chat por **voz ⚠️ en verificación** tras el arreglo de
`NgZone` (ver [Pendientes](Pendientes)).
