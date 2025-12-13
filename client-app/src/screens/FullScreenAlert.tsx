import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAlertStore } from '../store/alertStore';
import { getTheme } from '../cognitive-engine/ThemeRegistry';
import { useSettingsStore, ColorBlindMode } from '../store/settingsStore';

const FullScreenAlert = () => {
    const { activeAlert, setAlert, clearAlert, fetchLatestAlert } = useAlertStore();
    const { colorBlindMode, cycleMode } = useSettingsStore();

    // Animation value for blinking effect
    const fadeAnim = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        let blinkAnimation: Animated.CompositeAnimation | null = null;

        if (activeAlert && activeAlert.severity === 'RED') {
            // Multisensory 2: Blinking Animation for Critical Alerts
            blinkAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(fadeAnim, {
                        toValue: 0.2, // Dim to 20%
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(fadeAnim, {
                        toValue: 1, // Back to 100%
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            );
            blinkAnimation.start();
        } else {
            // Reset if not RED
            fadeAnim.setValue(1);
        }

        return () => {
            if (blinkAnimation) blinkAnimation.stop();
        };
    }, [activeAlert]);

    const handleTestFire = () => {
        setAlert({
            severity: 'RED',
            message: '화재 발생\n밖으로 나가세요',
            timestamp: new Date().toISOString(),
            icon: 'fire-alert', // Explicit fire icon
        });
    };

    const handleTestRain = () => {
        setAlert({
            severity: 'YELLOW',
            message: '집중 호우\n하천 범람 주의',
            timestamp: new Date().toISOString(),
            icon: 'weather-pouring', // Explicit heavy rain icon
        });
    };

    const handleTestEarthquake = () => {
        setAlert({
            severity: 'RED',
            message: '지진 발생\n책상 아래로 대피하세요',
            timestamp: new Date().toISOString(),
            icon: 'pulse', // Seismograph-style icon
        });
    };

    const handleTestMissing = () => {
        setAlert({
            severity: 'BLUE',
            message: '실종 아동 발생\n도움을 주세요',
            timestamp: new Date().toISOString(),
        });
    };

    if (!activeAlert) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>No Active Alerts</Text>

                {/* Accessibility Toggle */}
                <TouchableOpacity style={styles.accessibilityButton} onPress={cycleMode}>
                    <MaterialCommunityIcons name="eye" size={24} color="#333" />
                    <Text style={styles.accessibilityText}>
                        Color Mode: {colorBlindMode}
                    </Text>
                </TouchableOpacity>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.testButton, { backgroundColor: '#D32F2F' }]} onPress={handleTestFire}>
                        <Text style={styles.buttonText}>🔥 Fire Alert</Text>
                    </TouchableOpacity>
                    <View style={{ height: 10 }} />
                    <TouchableOpacity style={[styles.testButton, { backgroundColor: '#FBC02D' }]} onPress={handleTestRain}>
                        <Text style={[styles.buttonText, { color: 'black' }]}>🌧️ Heavy Rain</Text>
                    </TouchableOpacity>
                    <View style={{ height: 10 }} />
                    <TouchableOpacity style={[styles.testButton, { backgroundColor: '#5D4037' }]} onPress={handleTestEarthquake}>
                        <Text style={styles.buttonText}>🌋 Earthquake</Text>
                    </TouchableOpacity>
                    <View style={{ height: 10 }} />
                    <TouchableOpacity style={[styles.testButton, { backgroundColor: '#1976D2' }]} onPress={handleTestMissing}>
                        <Text style={styles.buttonText}>🏃 Missing Person</Text>
                    </TouchableOpacity>

                    <View style={{ height: 20 }} />
                    <TouchableOpacity style={styles.refreshButton} onPress={fetchLatestAlert}>
                        <Text style={styles.buttonText}>Refresh from Server</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Dynamic Theme based on Settings
    const theme = getTheme(activeAlert.severity, colorBlindMode);

    // Use the message from the alert if available, otherwise fallback to theme default
    const displaySubtitle = activeAlert.message || theme.defaultSubtitle;

    // Determine icon name: Explicit override > Theme default
    const displayIconName = activeAlert.icon || theme.iconName;

    return (
        <SafeAreaView style={[styles.alertContainer, { backgroundColor: theme.backgroundColor }]}>
            {/* Blinking Overlay for RED alerts */}
            {activeAlert.severity === 'RED' && (
                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: 'white',
                            opacity: fadeAnim.interpolate({
                                inputRange: [0.2, 1],
                                outputRange: [0.5, 0] // Flash white
                            })
                        }
                    ]}
                    pointerEvents="none"
                />
            )}

            <View style={styles.contentContainer}>
                {activeAlert.image ? (
                    <Image
                        source={activeAlert.image}
                        style={styles.image}
                        resizeMode="contain"
                    />
                ) : (
                    <MaterialCommunityIcons
                        name={displayIconName as any}
                        size={120}
                        color={theme.textColor}
                        style={styles.icon}
                    />
                )}

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
    image: {
        width: 150,
        height: 150,
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
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    accessibilityButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
    },
    accessibilityText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    refreshButton: {
        backgroundColor: '#9E9E9E',
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
