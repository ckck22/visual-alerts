export type AlertSeverity = 'RED' | 'YELLOW' | 'BLUE';

export interface AlertTheme {
    backgroundColor: string;
    textColor: string;
    iconName: string; // MaterialCommunityIcons name
    buttonText: string;
    defaultTitle: string;
    defaultSubtitle: string;
}

import { ColorBlindMode } from '../store/settingsStore';

export const getTheme = (severity: AlertSeverity, mode: ColorBlindMode = ColorBlindMode.NONE, iconName?: string): AlertTheme => {
    let theme = { ...BaseThemes[severity] };

    // 1. Icon-based Overrides (Stylistic, Lower Priority)
    // Missile/Air Raid (Rocket) -> Green Theme
    if (iconName === 'rocket-launch' || iconName === 'rocket-launch-outline') {
        theme.backgroundColor = '#2E7D32'; // Military/Dark Green
        theme.textColor = '#FFFFFF';
    }

    // 2. Accessibility Overrides (High Priority)
    if (mode === ColorBlindMode.PROTANOPIA || mode === ColorBlindMode.DEUTERANOPIA) {
        // Red-Green weakness: Avoid Red/Green confusion. Use Magenta/Blue-Yellow.
        // This overrides the "Green" missile alert to Magenta if it's considered RED severity (which it is)
        if (severity === 'RED') {
            theme.backgroundColor = '#D500F9'; // Magenta/Purple for Danger
        }
        if (severity === 'YELLOW') {
            theme.backgroundColor = '#FFD600'; // High Viz Yellow
        }
    } else if (mode === ColorBlindMode.TRITANOPIA) {
        // Blue-Yellow weakness: Avoid Blue/Purple confusion. Use Cyan/Teal.
        if (severity === 'BLUE') {
            theme.backgroundColor = '#00BFA5'; // Teal/Cyan
        }
        if (severity === 'RED') {
            theme.backgroundColor = '#FF5252'; // Salmon Red (distinct from black)
        }
    }

    return theme;
};

export const BaseThemes: Record<AlertSeverity, AlertTheme> = {
    RED: {
        backgroundColor: '#D32F2F', // Deep Red
        textColor: '#FFFFFF',
        iconName: 'fire',
        buttonText: '긴급 신고',
        defaultTitle: '지금 당장\n대피하세요!',
        defaultSubtitle: '화재 발생\n밖으로 나가세요',
    },
    YELLOW: {
        backgroundColor: '#FBC02D', // Warning Yellow
        textColor: '#000000',
        iconName: 'weather-pouring',
        buttonText: '확인',
        defaultTitle: '침수 위험!',
        defaultSubtitle: '지금 당장 높은 곳으로 이동\n지하 출입 금지',
    },
    BLUE: {
        backgroundColor: '#1976D2', // Info Blue
        textColor: '#FFFFFF',
        iconName: 'account',
        buttonText: '봤어요! (신고)',
        defaultTitle: '이 아이를\n찾습니다',
        defaultSubtitle: '특징:\n노란색 셔츠, 강남역 인근',
    },
};

// Backwards compatibility layer if needed, or remove if fully refactored
export const ThemeRegistry = BaseThemes;
