import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

const BACKGROUND_FETCH_TASK = 'background-fetch-alert';

// 1. Define the task in global scope
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    try {
        const now = new Date().toISOString();
        console.log(`[${now}] Background fetch task running...`);

        // Fetch latest alert from backend
        // Use your machine's IP address
        const response = await fetch('http://192.168.86.20:8080/api/alerts/latest');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const alertData = await response.json();
        console.log('Background fetch received:', alertData);

        // Simple logic: If we got data, show a notification.
        // In a real app, you'd compare IDs to avoid duplicate notifications.
        if (alertData && alertData.message) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Emergency Alert',
                    body: alertData.message,
                    data: { data: alertData },
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                },
                trigger: null, // Show immediately
            });
        }

        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
        console.error('Background fetch failed:', error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

// 2. Register the task
export async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 15, // 15 minutes (minimum allowed by iOS)
        stopOnTerminate: false, // Continue even if app is killed (Android only mostly)
        startOnBoot: true, // Start on device boot (Android only)
    });
}

// 3. Unregister task (optional)
export async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}
