# Google Play Store Deployment & Android Build Guide

This document provides complete step-by-step instructions on how to build, package, and publish the **Advanced To-Do App with Calendar & Reminders** to the **Google Play Store**.

---

## Prerequisites

1. **Node.js** (v18+) and **npm** installed.
2. **Android Studio** (latest version with Android SDK 34+ and Java 17).
3. **Google Play Console Developer Account** ($25 one-time registration fee at [play.google.com/console](https://play.google.com/console)).

---

## Step 1: Build the React Web Application

Navigate to the `frontend` directory and compile the optimized production bundle:

```bash
cd f:\todo-app\frontend
npm run build
```

This creates the static web assets inside `frontend/dist/`.

---

## Step 2: Initialize Capacitor Android Platform

If Android platform is not yet added to Capacitor, run:

```bash
npx cap add android
```

Sync the latest built `dist` web folder with the native Android wrapper:

```bash
npx cap sync
```

---

## Step 3: Open Project in Android Studio

Launch Android Studio with the project configuration:

```bash
npx cap open android
```

Android Studio will open the native project located in `frontend/android/`.

---

## Step 4: Configure App Details & Permissions

1. Open `frontend/android/app/src/main/AndroidManifest.xml` to verify permissions:
   - `<uses-permission android:name="android.permission.INTERNET" />`
   - `<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />`
   - `<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />`

2. Set your App Version and Build Number in `android/app/build.gradle`:
   ```groovy
   defaultConfig {
       applicationId "com.todoapp.advanced"
       minSdkVersion 22
       targetSdkVersion 34
       versionCode 1
       versionName "1.0.0"
   }
   ```

---

## Step 5: Generate Signed Android App Bundle (.aab)

Google Play Store requires an **Android App Bundle (.aab)** signed with a release keystore:

1. In Android Studio, go to top menu: **Build > Generate Signed Bundle / APK...**
2. Choose **Android App Bundle** and click **Next**.
3. Click **Create new...** to create a Keystore file:
   - Keystore path: e.g., `my-release-key.jks`
   - Password: Choose a secure password (keep this safe!).
   - Alias: `todo-app-key`
   - Certificate Details: Enter First/Last Name and Organization.
4. Select **release** build variant and click **Create**.
5. Your signed `.aab` file will be generated in `android/app/release/app-release.aab`.

---

## Step 6: Submit to Google Play Console

1. Log into your [Google Play Console](https://play.google.com/console).
2. Click **Create App**:
   - App name: **TaskManager Pro - To-Do & Calendar**
   - Default language: English
   - App or Game: App
   - Free or Paid: Free
3. Fill out **Main Store Listing**:
   - Short Description (80 chars max): Manage tasks, interactive calendar deadlines, and automated reminder alerts.
   - Full Description: High-performance task management app with JWT security, role-based access control, priority tracking, recurring task schedules, and data backup exports.
   - App Icon (512x512 PNG).
   - Feature Graphic (1024x500 PNG).
   - Screenshots (Upload at least 2 phone screenshots).
4. Navigate to **Production > Releases**:
   - Click **Create new release**.
   - Upload your `app-release.aab` file.
   - Add Release Notes (e.g., "Initial 1.0 release with calendar and reminders").
   - Click **Save** and **Review Release**.
5. Complete **App Content Checklist** (Privacy Policy, Data Safety questionnaire, Target audience).
6. Click **Start Rollout to Production**.

Your application will be submitted for Google Play review!
