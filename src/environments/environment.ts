import type { AppEnvironment } from './environment.type';

/**
 * Configuración por defecto / producción.
 * NO contiene claves reales: en producción la API key debe inyectarse
 * mediante un mecanismo seguro. Este archivo SÍ se commitea.
 *
 * En desarrollo, este archivo es reemplazado por environment.development.ts
 * (ver fileReplacements en angular.json), que está ignorado por git.
 */
export const environment: AppEnvironment = {
  production: true,
  gemini: {
    apiKey: 'REPLACE_WITH_GEMINI_API_KEY',
    model: 'gemini-3.6-flash',
  },
};
