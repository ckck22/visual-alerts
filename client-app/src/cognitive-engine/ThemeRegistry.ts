export type AlertSeverity = 'RED' | 'YELLOW' | 'BLUE';

export interface AlertTheme {
    backgroundColor: string;
    textColor: string;
    iconName: string; // MaterialCommunityIcons name
    buttonText: string;
    defaultTitle: string;
    defaultSubtitle: string;
}

export const ThemeRegistry: Record<AlertSeverity, AlertTheme> = {
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
