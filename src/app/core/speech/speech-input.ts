import type { Observable } from 'rxjs';

/**
 * Resultado parcial o final del reconocimiento de voz.
 */
export interface SpeechRecognitionResult {
  /** Texto transcrito hasta el momento. */
  readonly transcript: string;
  /** true cuando el reconocimiento considera la frase terminada. */
  readonly isFinal: boolean;
}

/**
 * Abstracción de la ENTRADA de voz (speech-to-text).
 *
 * Permite intercambiar la implementación (Web Speech API en el navegador,
 * o un plugin nativo de Capacitor en Android) sin tocar la lógica de la app.
 */
export interface SpeechInput {
  /** Indica si la plataforma actual soporta reconocimiento de voz. */
  isSupported(): boolean;

  /**
   * Comienza a escuchar y emite resultados (parciales y finales).
   * El stream se completa cuando termina la escucha o hay un error controlado.
   *
   * @param lang Código BCP-47 del idioma (ej. 'pt-BR').
   */
  listen(lang: string): Observable<SpeechRecognitionResult>;

  /** Detiene la escucha en curso, si la hay. */
  stop(): void;
}
