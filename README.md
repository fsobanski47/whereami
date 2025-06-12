whereami: a simple android app that shows user's location on Google Maps, and saves their path and step count throught the day.

To launch on your phone:
npm install
npx react-native run-android

To install on your phone:
cd android
./gradlew assembleDebug # FOR DEBUG BUILD
./gradlew assembleRelease # FOR RELASE BUILD
..
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
