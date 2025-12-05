# V-Alert (Research-Driven Visual Emergency Alert System)

## Overview
V-Alert is a cognitive-science-based emergency alert system designed to solve the "alert fatigue" and cognitive overload problems found in traditional text-based alert systems. By utilizing color-coded, high-contrast visual signals and haptic feedback, V-Alert reduces user reaction time and ensures intuitive understanding of emergency severity (Red, Yellow, Blue).

## System Architecture
The application follows a standard **Client-Server Architecture**:

- **Client (Frontend)**: A React Native mobile application (Expo) that handles user interaction, visual rendering of alerts, and device-specific features (haptics, notifications). It communicates with the backend via REST APIs.
- **Server (Backend)**: A Spring Boot application that manages alert data, processes real-time disaster feeds (from external APIs like the Korean Ministry of Interior and Safety), and sends push notifications to clients via Firebase Cloud Messaging (FCM).
- **Database**: An H2 in-memory database (configurable to persistent SQL) for storing alert history and user preferences.

## Key Technical Features
- **Cognitive Visual Signals**: Full-screen alert overlays using specific color wavelengths (Red #FF0000, Yellow #FFD700, Blue #0000FF) and blinking patterns (4Hz, 2Hz, 1Hz) optimized for human attention.
- **Haptic Feedback**: Custom vibration patterns mapped to alert severity levels using the device's Taptic Engine.
- **Real-Time Integration**: Polls external government disaster APIs to fetch and standardize alert data.
- **Background Processing**: Handles background fetch tasks to ensure alerts are received even when the app is not in the foreground.
- **State Management**: Uses Zustand for efficient global state management on the client.

## Technology Stack

### Frontend (Mobile App)
- **Framework**: React Native 0.81 (via Expo SDK 54)
- **Language**: TypeScript 5.x
- **State Management**: Zustand
- **Notifications**: Expo Notifications, Firebase Messaging
- **UI/UX**: Lottie Animations, Expo Haptics, Expo System UI

### Backend (API Server)
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: H2 Database (In-Memory)
- **Build Tool**: Gradle
- **Integration**: Firebase Admin SDK (for FCM), Jackson Dataformat XML

## Getting Started

### Prerequisites
- **Node.js**: v18 or LTS
- **JDK**: Java Development Kit 17
- **Mobile Development Env**: Android Studio (for Android) or Xcode (for iOS)
- **Expo Go**: Installed on your physical device (optional, for testing)

### Installation

#### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourusername/v-alert.git
cd v-alert
\`\`\`

#### 2. Backend Setup
Navigate to the server directory and run the Spring Boot application.
\`\`\`bash
cd server-api
./gradlew bootRun
\`\`\`
The server will start at \`http://localhost:8080\`.

#### 3. Frontend Setup
Navigate to the client directory and install dependencies.
\`\`\`bash
cd client-app
npm install
\`\`\`
Start the development server.
\`\`\`bash
npx expo start
\`\`\`
- Press \`a\` to open in Android Emulator.
- Press \`i\` to open in iOS Simulator.
- Scan the QR code to run on a physical device.

## Future Improvements
- **Push Notification Integration**: Complete full integration with FCM for push-based (non-polling) alerts.
- **Geolocation Targeting**: Filter alerts based on the user's precise real-time location.
- **User Preferences**: Allow users to customize vibration intensity and color blindness modes.
- **Wearable Support**: Extension for Apple Watch and Galaxy Watch for wrist-based haptics.
- **Offline Mode**: Cache recent alerts for viewing without internet connection.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
