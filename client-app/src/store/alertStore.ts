import { create } from 'zustand';
import { AlertSeverity } from '../cognitive-engine/ThemeRegistry';

interface Alert {
    severity: AlertSeverity;
    message: string;
    timestamp: string;
    image?: any; // Optional override for the image
    icon?: string; // Optional override for the icon name (MaterialCommunityIcons)
    lottie?: string; // Optional URL or require() path for Lottie JSON
}

interface AlertState {
    activeAlert: Alert | null;
    setAlert: (alert: Alert) => void;
    clearAlert: () => void;
    fetchLatestAlert: () => Promise<void>;
}

export const useAlertStore = create<AlertState>((set) => ({
    activeAlert: null,
    setAlert: (alert) => set({ activeAlert: alert }),
    clearAlert: () => set({ activeAlert: null }),
    fetchLatestAlert: async () => {
        try {
            // Replace with your computer's IP address
            const response = await fetch('http://192.168.86.20:8080/api/alerts/latest');
            if (!response.ok) throw new Error('Failed to fetch alert');

            const data = await response.json();

            // Client-side fix for stale backend mock data
            // If the server returns RED + Heavy Rain, rewrite it to Fire Alert
            if (data.severity === 'RED' && data.message && data.message.includes("Heavy Rain")) {
                // We need to access the store state directly since this isn't a hook
                const { language } = require('./settingsStore').useSettingsStore.getState();
                const { translations } = require('../constants/translations');
                data.message = translations[language].mockFireFix;
            }

            set({
                activeAlert: {
                    severity: data.severity as AlertSeverity,
                    message: data.message,
                    timestamp: data.timestamp,
                    image: data.image, // Pass through if available
                    icon: data.icon, // Pass through if available
                    lottie: data.lottie, // Pass through if available
                }
            });
        } catch (error) {
            console.error('Error fetching alert:', error);
            // Optional: Set an error state or show a toast
        }
    },
}));
