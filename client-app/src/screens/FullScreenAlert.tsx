import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAlertStore } from '../store/alertStore';
import { getTheme, BaseThemes } from '../cognitive-engine/ThemeRegistry';
import { useSettingsStore, ColorBlindMode } from '../store/settingsStore';

import { translations } from '../constants/translations';

const FullScreenAlert = () => {
    const { activeAlert, setAlert, clearAlert, fetchLatestAlert } = useAlertStore();
    const { colorBlindMode, language, cycleMode, toggleLanguage } = useSettingsStore();

    // ... (Animation logic remains the same) ...
    const fadeAnim = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        let blinkAnimation: Animated.CompositeAnimation | null = null;
        if (activeAlert && activeAlert.severity === 'RED') {
            blinkAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(fadeAnim, { toValue: 0.2, duration: 500, useNativeDriver: true }),
                    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                ])
            );
            blinkAnimation.start();
        } else {
            fadeAnim.setValue(1);
        }
        return () => { if (blinkAnimation) blinkAnimation.stop(); };
    }, [activeAlert]);

    const t = translations[language];

    const handleTestFire = () => {
        setAlert({
            severity: 'RED',
            message: t.fireMsg,
            timestamp: new Date().toISOString(),
            icon: 'fire-alert',
        });
    };

    const handleTestRain = () => {
        setAlert({
            severity: 'YELLOW',
            message: t.rainMsg,
            timestamp: new Date().toISOString(),
            icon: 'weather-pouring',
        });
    };

    const handleTestMissile = () => {
        setAlert({
            severity: 'RED',
            message: t.missileMsg,
            timestamp: new Date().toISOString(),
            icon: 'rocket-launch', // Missile Icon
        });
    };

    const handleTestMissing = () => {
        setAlert({
            severity: 'BLUE',
            message: t.missingMsg,
            timestamp: new Date().toISOString(),
        });
    };

    if (!activeAlert) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{t.noActiveAlerts}</Text>

                <View style={styles.settingsRow}>
                    {/* Accessibility Toggle */}
                    <TouchableOpacity style={styles.accessibilityButton} onPress={cycleMode}>
                        <MaterialCommunityIcons name="eye" size={24} color="#333" />
                        <Text style={styles.accessibilityText}>
                            {t.colorMode}: {colorBlindMode}
                        </Text>
                    </TouchableOpacity>

                    {/* Language Toggle */}
                    <TouchableOpacity style={[styles.accessibilityButton, { marginLeft: 10 }]} onPress={toggleLanguage}>
                        <MaterialCommunityIcons name="translate" size={24} color="#333" />
                        <Text style={styles.accessibilityText}>
                            {language === 'ko' ? '한국어' : 'English'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.testButton, { backgroundColor: '#D32F2F' }]} onPress={handleTestFire}>
                        <Text style={styles.buttonText}>{t.fireAlert}</Text>
                    </TouchableOpacity>
                    <View style={{ height: 10 }} />
                    <TouchableOpacity style={[styles.testButton, { backgroundColor: '#FBC02D' }]} onPress={handleTestRain}>
                        <Text style={[styles.buttonText, { color: 'black' }]}>{t.heavyRain}</Text>
                    </TouchableOpacity>
                    <View style={{ height: 10 }} />
                    <TouchableOpacity style={[styles.testButton, { backgroundColor: '#2E7D32' }]} onPress={handleTestMissile}>
                        <Text style={styles.buttonText}>{t.missileAlert}</Text>
                    </TouchableOpacity>
                    <View style={{ height: 10 }} />
                    <TouchableOpacity style={[styles.testButton, { backgroundColor: '#1976D2' }]} onPress={handleTestMissing}>
                        <Text style={styles.buttonText}>{t.missingPerson}</Text>
                    </TouchableOpacity>

                    <View style={{ height: 20 }} />
                    <TouchableOpacity style={styles.refreshButton} onPress={fetchLatestAlert}>
                        <Text style={styles.buttonText}>{t.refresh}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Determine icon name: Explicit override > Theme default
    const displayIconName = activeAlert.icon || BaseThemes[activeAlert.severity].iconName;

    // Dynamic Theme based on Settings AND Icon
    const theme = getTheme(activeAlert.severity, colorBlindMode, displayIconName);

    // Helper to get translated defaults based on severity
    // Helper to get translated defaults based on severity
    const getDefaultText = (severity: 'RED' | 'YELLOW' | 'BLUE', icon?: string) => {
        // Missile Override
        if ((icon === 'rocket-launch' || icon === 'rocket-launch-outline') && severity === 'RED') {
            return { title: t.missileTitle, sub: t.missileMsg, btn: t.redButton };
        }

        switch (severity) {
            case 'RED': return { title: t.redTitle, sub: t.redSubtitle, btn: t.redButton };
            case 'YELLOW': return { title: t.yellowTitle, sub: t.yellowSubtitle, btn: t.yellowButton };
            case 'BLUE': return { title: t.blueTitle, sub: t.blueSubtitle, btn: t.blueButton };
        }
    };

    const defaults = getDefaultText(activeAlert.severity, displayIconName);
    const displaySubtitle = activeAlert.message || defaults.sub;

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
                    {defaults.title}
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
                        {defaults.btn}
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
    settingsRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    accessibilityButton: {
        flexDirection: 'row',
        alignItems: 'center',
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
