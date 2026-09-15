/**
 * Declaraciones mínimas de la Web Speech Recognition API.
 *
 * Estos tipos NO están incluidos en las librerías estándar de TypeScript,
 * así que declaramos solo lo que usamos para evitar `any` y mantener el
 * tipado estricto.
 */

/** Un resultado de reconocimiento individual (alternativa reconocida). */
export interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

/** Conjunto de alternativas para un segmento reconocido. */
export interface SpeechRecognitionResultItem {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  readonly [index: number]: SpeechRecognitionAlternative;
}

/** Lista de resultados de reconocimiento. */
export interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResultItem;
  readonly [index: number]: SpeechRecognitionResultItem;
}

/** Evento emitido cuando hay resultados de reconocimiento. */
export interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

/** Evento de error del reconocimiento. */
export interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

/** Instancia del reconocedor de voz. */
export interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

/** Constructor del reconocedor de voz. */
export interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

/**
 * Obtiene el constructor de SpeechRecognition disponible en el navegador
 * (`SpeechRecognition` estándar o el prefijado `webkitSpeechRecognition`).
 *
 * @returns El constructor, o `undefined` si la plataforma no lo soporta.
 */
export function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | undefined {
  const win = globalThis as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return win.SpeechRecognition ?? win.webkitSpeechRecognition;
}
