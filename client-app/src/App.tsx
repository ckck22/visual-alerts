import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import FullScreenAlert from './screens/FullScreenAlert';
import { registerBackgroundFetchAsync } from './services/BackgroundService';

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
            } catch (err) {
                console.error('Failed to register background fetch:', err);
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
