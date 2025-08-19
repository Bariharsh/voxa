export {};

declare global {
  interface Window {
    voiceAPI: {
      startListening: () => void;
      stopListening: () => void;
      onResult: (callback: (text: string) => void) => void;
      startWakeWord: () => void;
      stopWakeWord: () => void;
      onWakeWord: (callback: () => void) => void;
    };
  }
}
