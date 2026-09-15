/**
 * Tipos base del dominio de conversación.
 */

/** Rol de un mensaje dentro de la conversación. */
export type ChatRole = 'user' | 'model';

/** Un mensaje individual de la conversación. */
export interface ChatMessage {
  /** Quién emitió el mensaje. */
  readonly role: ChatRole;
  /** Texto del mensaje. */
  readonly text: string;
  /** Marca de tiempo de creación (epoch ms). */
  readonly timestamp: number;
}
