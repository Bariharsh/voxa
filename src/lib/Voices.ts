import { create } from "zustand";

export const useVoiceStore = create((set) => ({
  selectedVoice: null,
  voices: [],
  setVoices: (voices: SpeechSynthesisVoice[]) => set({ voices }),
  setSelectedVoice: (voice: SpeechSynthesisVoice) => set({ selectedVoice: voice }),
}));