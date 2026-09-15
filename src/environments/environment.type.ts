/**
 * Contrato de configuración de entorno.
 * Ambos environment.ts y environment.development.ts deben cumplir este tipo.
 */
export interface AppEnvironment {
  /** true en builds de producción. */
  readonly production: boolean;
  /** Configuración de la integración con Gemini. */
  readonly gemini: {
    /**
     * API key de Gemini. NUNCA se debe commitear una clave real.
     * En desarrollo vive en environment.development.ts (ignorado por git).
     */
    readonly apiKey: string;
    /** Modelo de Gemini a usar (ej. 'gemini-3.6-flash'). */
    readonly model: string;
  };
}
