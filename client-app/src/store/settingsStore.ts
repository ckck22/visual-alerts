import { create } from 'zustand';

export enum ColorBlindMode {
    NONE = 'NONE',
    PROTANOPIA = 'PROTANOPIA', // Red-Blind
    DEUTERANOPIA = 'DEUTERANOPIA', // Green-Blind
    TRITANOPIA = 'TRITANOPIA', // Blue-Blind
}

interface SettingsState {
    colorBlindMode: ColorBlindMode;
    setMode: (mode: ColorBlindMode) => void;
    cycleMode: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    colorBlindMode: ColorBlindMode.NONE,
    setMode: (mode) => set({ colorBlindMode: mode }),
    cycleMode: () => set((state) => {
        const modes = Object.values(ColorBlindMode);
        const currentIndex = modes.indexOf(state.colorBlindMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        return { colorBlindMode: modes[nextIndex] };
    }),
}));
