# V-Alert

## Overview

V-Alert is a cognitive-science-based emergency alert system designed to address alert fatigue and cognitive overload inherent in traditional text-based alert systems. By leveraging color-coded, high-contrast visual signals and haptic feedback, V-Alert reduces user reaction time and ensures intuitive comprehension of emergency severity levels (Red, Yellow, Blue).

## System Architecture

The application implements a standard client-server architecture:

- **Client (Frontend)**: A React Native mobile application built with Expo that manages user interaction, visual alert rendering, and device-specific features (haptics, notifications). The client communicates with the backend through RESTful APIs.

- **Server (Backend)**: A Spring Boot application responsible for alert data management, real-time disaster feed processing (from external APIs such as the Korean Ministry of Interior and Safety), and push notification delivery via Firebase Cloud Messaging (FCM).

- **Database**: An H2 in-memory database (configurable for persistent SQL storage) used for alert history and user preference storage.

### Key Technical Features
- **Adaptive Cognitive-Load Engine**:
    - **Color-Blind Accessibility**: Dynamic visual adjustments for Protanopia (Red-Blind), Deuteranopia (Green-Blind), and Tritanopia (Blue-Blind).
    - **Safety-First Logic**: Accessibility overrides take precedence over stylistic themes (e.g., Missile Green -> Magenta in Protanopia).
    - **Context-Aware Visuals**: High-contrast modes and specific palettes for different vision deficiencies.
- **Official Government Integration**:
    - **Real-Time Data**: Directly integrated with the **Ministry of Interior and Safety (DSSP-IF-00247)** API.
    - **Standardized Mapping**: Accurately maps `MSG_CN`, `EMRG_STEP_NM`, and `DST_SE_NM` to app alerts.
- **Multisensory Integration**:
    - **Blinking Animations**: 4Hz visual flashing for "RED" alerts to seize immediate attention.
    - **Haptic Feedback**: Custom vibration patterns synchronized with alert severity.
    - **Rich Notifications**: System notifications with attached images.
- **Expanded Alert Types**:
    - **Missile Warning**: Specialized "National Emergency Alert" with dedicated "Military Green" theme and "Rocket" iconography.
    - **Heavy Rain**: Dedicated flood/rain iconography.
    - **Fire**: Critical thermal alert visuals.
    - **Missing Person**: Blue-coded information alerts.
- **Language Support**:
    - **Bilingual Interface**: Full support for **Korean** and **English** with real-time toggling.
    - **Dynamic Content**: Auto-translates alert titles (e.g., "EVACUATE IMMEDIATELY") and buttons.
- **Background Processing**: Handles background fetch tasks to ensure alerts are received even when the app is not in the foreground.
- **State Management**: Uses Zustand for efficient global state management (Alerts + Settings).

## Technology Stack

### Frontend (Mobile App)
- **Framework**: React Native 0.81 (via Expo SDK 54)
- **Language**: TypeScript 5.x
- **State Management**: Zustand
- **Notifications**: Expo Notifications, Firebase Messaging
- **UI/UX**: Vector Icons (MaterialCommunityIcons), Expo Haptics, Expo System UI

### Backend (API Server)
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: H2 Database (in-memory)
- **Build Tool**: Gradle
- **Integration**: Firebase Admin SDK (for FCM), Jackson Dataformat XML

## Getting Started

### Prerequisites
- **Node.js**: v18 or LTS
- **JDK**: Java Development Kit 17
- **Mobile Development Environment**: Android Studio (for Android) or Xcode (for iOS)
- **Expo Go**: Installed on your physical device (optional, for testing)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/v-alert.git
cd v-alert
```

#### 2. Backend Setup
Navigate to the server directory and run the Spring Boot application:
```bash
cd server-api
./gradlew bootRun
```
The server will start at `http://localhost:8080`.

#### 3. Frontend Setup
Navigate to the client directory and install dependencies:
```bash
cd client-app
npm install
```

Start the development server:
```bash
npx expo start
```

- Press `a` to open in Android Emulator
- Press `i` to open in iOS Simulator
- Scan the QR code to run on a physical device

## Future Improvements

- **Enhanced Push Notifications**: Complete full integration with FCM for push-based (non-polling) alert delivery
- **Geolocation Targeting**: Filter alerts based on users' precise real-time location
- **User Customization**: Enable users to customize vibration intensity and color blindness modes
- **Wearable Support**: Extend functionality to Apple Watch and Galaxy Watch for wrist-based haptic alerts
- **Offline Mode**: Cache recent alerts for offline viewing

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
