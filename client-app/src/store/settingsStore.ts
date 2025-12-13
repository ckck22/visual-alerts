import { create } from 'zustand';

export enum ColorBlindMode {
    NONE = 'NONE',
    PROTANOPIA = 'PROTANOPIA', // Red-Blind
    DEUTERANOPIA = 'DEUTERANOPIA', // Green-Blind
    TRITANOPIA = 'TRITANOPIA', // Blue-Blind
}

interface SettingsState {
    colorBlindMode: ColorBlindMode;
    language: 'ko' | 'en';
    setMode: (mode: ColorBlindMode) => void;
    cycleMode: () => void;
    toggleLanguage: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    colorBlindMode: ColorBlindMode.NONE,
    language: 'ko', // Default to Korean
    setMode: (mode) => set({ colorBlindMode: mode }),
    cycleMode: () => set((state) => {
        const modes = Object.values(ColorBlindMode);
        const currentIndex = modes.indexOf(state.colorBlindMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        return { colorBlindMode: modes[nextIndex] };
    }),
    toggleLanguage: () => set((state) => ({
        language: state.language === 'ko' ? 'en' : 'ko'
    })),
}));
