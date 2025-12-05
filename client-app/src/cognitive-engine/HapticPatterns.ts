import * as Haptics from 'expo-haptics';

export const HapticPatterns = {
    heavyPulse: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
    mediumPulse: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    },
    steady: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
};
