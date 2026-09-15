/**
 * Opciones para la síntesis de voz.
 */
export interface SpeechSpeakOptions {
  /** Código BCP-47 del idioma/voz (ej. 'pt-BR'). */
  readonly lang: string;
  /** Velocidad de habla (1 = normal). */
  readonly rate?: number;
  /** Tono de voz (1 = normal). */
  readonly pitch?: number;
}

/**
 * Abstracción de la SALIDA de voz (text-to-speech).
 *
 * Permite intercambiar la implementación (Web Speech API en el navegador,
 * o un plugin nativo de Capacitor en Android) sin tocar la lógica de la app.
 */
export interface SpeechOutput {
  /** Indica si la plataforma actual soporta síntesis de voz. */
  isSupported(): boolean;

  /**
   * Reproduce el texto como voz. Resuelve cuando termina de hablar.
   * Cancela cualquier locución en curso antes de empezar.
   */
  speak(text: string, options: SpeechSpeakOptions): Promise<void>;

  /** Cancela la locución en curso, si la hay. */
  cancel(): void;
}
