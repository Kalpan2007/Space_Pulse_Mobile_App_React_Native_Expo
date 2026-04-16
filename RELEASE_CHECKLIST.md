# Space Pulse Release Checklist (Expo + EAS)

Use this checklist before publishing to Google Play so first submission passes quickly.

## 1) One-time setup

- Install tools:
  - `npm install`
  - `npm install -g eas-cli`
- Login to Expo:
  - `npx eas login`
- Verify project is linked to EAS:
  - `npx eas project:info`

## 2) App config sanity checks

- App identity:
  - Android package: `com.spacepulse.app`
  - iOS bundle identifier: `com.spacepulse.app`
- Versioning:
  - `expo.version` set in `app.json` (user-facing version)
  - `android.versionCode` and `ios.buildNumber` exist
  - `eas.json` production profile has `autoIncrement: true`
- Splash and icons:
  - `assets/icon.png` exists
  - `assets/adaptive-icon.png` exists
  - `assets/splashscreen_logo.png` exists
  - `expo.splash.image` points to `./assets/splashscreen_logo.png`

## 3) Build for fast internal testing (APK)

- Run:
  - `npx eas build --platform android --profile preview --clear-cache`
- Share APK link from EAS dashboard with testers.

## 4) Build for Play Store submission (AAB)

- Run:
  - `npx eas build --platform android --profile production --clear-cache`
- This should produce an `.aab` artifact.

## 5) Google Play Console preparation

Create app and prepare required sections:

- App details:
  - App name
  - Short description
  - Full description
  - App category
- Contact details:
  - Email
  - Privacy policy URL
- Store assets:
  - App icon (512x512)
  - Feature graphic (1024x500)
  - Phone screenshots (minimum 2)
- Compliance forms:
  - Data safety
  - Content rating questionnaire
  - Target audience
  - Ads declaration

## 6) Signing and service account (for auto submit)

- Let EAS manage keystore (recommended):
  - `npx eas credentials`
- For `eas submit`, set a valid service account key path in `eas.json`:
  - `submit.production.android.serviceAccountKeyPath`

## 7) Submit to Play Console

Option A: Upload manually
- Download `.aab` from EAS build page and upload to Play Console.

Option B: Submit from EAS
- `npx eas submit --platform android --profile production`

## 8) Pre-release quality gate

Run before every production build:

- `npm run lint`
- `npx expo-doctor`
- `npx expo config --type public`
- Open app on physical Android device and verify:
  - Home feed loads
  - Search works
  - Save/bookmark works after restart
  - Article detail opens external links correctly
  - No crash on cold start

## 9) Release strategy (recommended)

- First deploy to Internal testing track
- Then Closed testing track
- Then Production rollout (start at small percentage)

## 10) Troubleshooting quick notes

- If build fails with missing splash drawable:
  - Confirm `app.json` has `expo.splash.image`
  - Confirm `assets/splashscreen_logo.png` exists
  - Rebuild with `--clear-cache`
- If submit fails:
  - Check service account JSON path and Play Console API access permissions
