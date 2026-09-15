import { InjectionToken } from '@angular/core';

import type { SpeechInput } from './speech-input';
import type { SpeechOutput } from './speech-output';
import { WebSpeechInput } from './web/web-speech-input';
import { WebSpeechOutput } from './web/web-speech-output';

/**
 * Tokens de inyección para las abstracciones de voz.
 *
 * Los componentes dependen de estos tokens (la abstracción), no de las
 * implementaciones concretas. En Capacitor/Android basta con sobrescribir
 * el provider para usar plugins nativos, sin tocar los componentes.
 */
export const SPEECH_INPUT = new InjectionToken<SpeechInput>('SPEECH_INPUT', {
  providedIn: 'root',
  factory: () => new WebSpeechInput(),
});

export const SPEECH_OUTPUT = new InjectionToken<SpeechOutput>('SPEECH_OUTPUT', {
  providedIn: 'root',
  factory: () => new WebSpeechOutput(),
});
