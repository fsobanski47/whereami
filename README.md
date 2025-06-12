# whereami

A simple Android app that shows the user's location on Google Maps, tracks and saves their path and step count throughout the day.

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Run app on your connected Android device or emulator

```bash
npx react-native run-android
```

---

## 📦 Build APK

Navigate to the `android` directory first:

```bash
cd android
```

### Debug build

```bash
./gradlew assembleDebug
```

### Release build

```bash
./gradlew assembleRelease
```

---

## 📱 Install APK on your device

For debug build APK:

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

For release build APK:

```bash
adb install -r app/build/outputs/apk/release/app-release.apk
```


