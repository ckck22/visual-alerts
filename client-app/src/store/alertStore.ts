import { create } from 'zustand';
import { AlertSeverity } from '../cognitive-engine/ThemeRegistry';

interface Alert {
    severity: AlertSeverity;
    message: string;
    timestamp: string;
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
            set({
                activeAlert: {
                    severity: data.severity as AlertSeverity,
                    message: data.message,
                    timestamp: data.timestamp,
                }
            });
        } catch (error) {
            console.error('Error fetching alert:', error);
            // Optional: Set an error state or show a toast
        }
    },
}));
