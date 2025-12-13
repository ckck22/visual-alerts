import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import FullScreenAlert from './screens/FullScreenAlert';
import { Asset } from 'expo-asset';
import { registerBackgroundFetchAsync } from './services/BackgroundService';
import { useAlertStore } from './store/alertStore';
import { HapticPatterns } from './cognitive-engine/HapticPatterns';

// Configure notification handler to show alerts when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export default function App() {
    // Access store
    const { fetchLatestAlert, activeAlert } = useAlertStore();

    // 1. Polling Effect
    useEffect(() => {
        // Initial fetch
        fetchLatestAlert();

        // Check every 30 seconds
        const intervalId = setInterval(() => {
            console.log('Polling for alerts...');
            fetchLatestAlert();
        }, 30000);

        return () => clearInterval(intervalId);
    }, [fetchLatestAlert]);

    // 2. Alert Reaction Effect
    useEffect(() => {
        const scheduleAlert = async () => {
            if (activeAlert) {
                // Trigger feedback based on severity
                if (activeAlert.severity === 'RED') {
                    HapticPatterns.heavyPulse();

                    // Resolve asset for attachment
                    const asset = Asset.fromModule(require('../assets/alert_red.png'));
                    await asset.downloadAsync(); // Ensure it's available

                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: 'Emergency Alert',
                            body: activeAlert.message,
                            sound: true,
                            priority: Notifications.AndroidNotificationPriority.HIGH,
                            attachments: [
                                {
                                    identifier: 'alert_red',
                                    url: asset.localUri || asset.uri,
                                    type: 'image',
                                }
                            ]
                        },
                        trigger: null,
                    });
                } else if (activeAlert.severity === 'YELLOW') {
                    HapticPatterns.mediumPulse();

                    const asset = Asset.fromModule(require('../assets/alert_yellow.png'));
                    await asset.downloadAsync();

                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: 'Safety Alert',
                            body: activeAlert.message,
                            sound: true,
                            attachments: [
                                {
                                    identifier: 'alert_yellow',
                                    url: asset.localUri || asset.uri,
                                    type: 'image',
                                }
                            ]
                        },
                        trigger: null,
                    });
                } else {
                    HapticPatterns.steady();
                }
            }
        };

        scheduleAlert();
    }, [activeAlert]);

    useEffect(() => {
        async function configureBackgroundFetch() {
            try {
                // 1. Request permissions
                const { status } = await Notifications.requestPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission needed', 'Notifications are required for background alerts');
                    return;
                }

                // 2. Register background task
                await registerBackgroundFetchAsync();
                console.log('Background fetch registered');
            } catch (err: any) {
                // Ignore background fetch error in Expo Go if caused by missing configuration
                if (err.message && err.message.includes('Background Fetch has not been configured')) {
                    console.log('Background Fetch not fully supported in Expo Go. Skipping registration.');
                } else {
                    console.error('Failed to register background fetch:', err);
                }
            }
        }

        configureBackgroundFetch();
    }, []);

    return (
        <View style={styles.container}>
            <FullScreenAlert />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
