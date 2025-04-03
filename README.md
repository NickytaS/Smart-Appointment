# Schedule Appointment System (SAS)

A mobile application built with React Native and Expo for managing medical appointments.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/downloads)

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/sas.git
cd sas
```

2. Install dependencies
```bash
npx expo install
```

## Required Dependencies

This project uses the following main dependencies:
```json
{
  "expo": "~50.0.0",
  "expo-router": "~3.4.0",
  "expo-sqlite": "~13.2.0",
  "expo-status-bar": "~1.11.1",
  "expo-image-picker": "~14.7.1",
  "expo-linear-gradient": "~12.7.1",
  "react": "18.2.0",
  "react-native": "0.73.2",
  "@react-native-async-storage/async-storage": "1.21.0"
}
```

## Running the App

1. Start the development server:
```bash
npx expo start
```

2. Run on different platforms:
- Press `a` - to run on Android emulator
- Press `i` - to run on iOS simulator
- Press `w` - to run on web browser
- Scan QR code with Expo Go app on your physical device

## Project Structure

```
sas/
├── app/
│   ├── (auth)/
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── (tabs)/
│   │   ├── home.tsx
│   │   ├── appointments.tsx
│   │   └── profile.tsx
│   └── _layout.tsx
├── context/
│   └── AuthContext.tsx
├── lib/
│   ├── database.ts
│   └── types.ts
└── assets/
```

## Features

- User authentication (signup/login)
- Appointment scheduling
- Appointment management (reschedule/cancel)
- Doctor profiles
- User profiles
- SQLite database integration
- Image upload support

## Development

To start developing:
1. Make sure you have the Expo Go app installed on your device
2. Connect to the same wireless network as your computer
3. Use the QR code or development options to run the app

## Troubleshooting

If you encounter any issues:
1. Clear the npm cache:
```bash
npm cache clean --force
```

2. Delete node_modules and reinstall:
```bash
rm -rf node_modules
npx expo install
```

3. Clear Expo cache:
```bash
expo start -c
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
