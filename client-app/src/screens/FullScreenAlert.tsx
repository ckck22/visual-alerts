import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAlertStore } from '../store/alertStore';
import { ThemeRegistry } from '../cognitive-engine/ThemeRegistry';

const FullScreenAlert = () => {
    const { activeAlert, setAlert, clearAlert, fetchLatestAlert } = useAlertStore();

    const handleTestAlert = () => {
        setAlert({
            severity: 'RED',
            message: '화재 발생\n밖으로 나가세요', // This will override defaultSubtitle if present
            timestamp: new Date().toISOString(),
        });
    };

    if (!activeAlert) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>No Active Alerts</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.testButton} onPress={handleTestAlert}>
                        <Text style={styles.buttonText}>Test Alert (Red)</Text>
                    </TouchableOpacity>
                    <View style={{ height: 10 }} />
                    <TouchableOpacity style={styles.refreshButton} onPress={fetchLatestAlert}>
                        <Text style={styles.buttonText}>Refresh from Server</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const theme = ThemeRegistry[activeAlert.severity];
    // Use the message from the alert if available, otherwise fallback to theme default
    const displaySubtitle = activeAlert.message || theme.defaultSubtitle;

    return (
        <SafeAreaView style={[styles.alertContainer, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.contentContainer}>
                <MaterialCommunityIcons
                    name={theme.iconName as any}
                    size={120}
                    color={theme.textColor}
                    style={styles.icon}
                />

                <Text style={[styles.alertTitle, { color: theme.textColor }]}>
                    {theme.defaultTitle}
                </Text>

                <Text style={[styles.alertSubtitle, { color: theme.textColor }]}>
                    {displaySubtitle}
                </Text>
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: 'rgba(0,0,0,0.2)' }]}
                    onPress={clearAlert}
                >
                    <Text style={[styles.actionButtonText, { color: theme.textColor }]}>
                        {theme.buttonText}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    alertContainer: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    bottomContainer: {
        paddingBottom: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    icon: {
        marginBottom: 30,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    alertTitle: {
        fontSize: 40,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 10,
        lineHeight: 50,
    },
    alertSubtitle: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        opacity: 0.9,
        lineHeight: 26,
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: 50,
    },
    testButton: {
        backgroundColor: '#D32F2F',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    refreshButton: {
        backgroundColor: '#1976D2',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionButton: {
        width: '100%',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default FullScreenAlert;
