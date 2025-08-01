interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognition extends EventTarget {
  grammars: SpeechGrammarList;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  error: SpeechRecognitionErrorCallback;
  onaudioend: ((ev: Event) => void) | null;
  onaudiostart: ((ev: Event) => void) | null;
  onend: ((ev: Event) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEvent) => void) | null;
  onnomatch: ((ev: SpeechRecognitionEvent) => void) | null;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onsoundend: ((ev: Event) => void) | null;
  onsoundstart: ((ev: Event) => void) | null;
  onspeechend: ((ev: Event) => void) | null;
  onspeechstart: ((ev: Event) => void) | null;
  onstart: ((ev: Event) => void) | null;
  abort(): void;
  start(): void;
  stop(): void;
}

declare let webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

declare let SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

interface Window {
  SpeechRecognition: {
    new (): SpeechRecognition;
  };
  webkitSpeechRecognition: {
    new (): SpeechRecognition;
  };
}