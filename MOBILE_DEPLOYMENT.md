# Guida al Deployment Mobile - Naskh App

Questa guida ti aiuterà a pubblicare l'applicazione Naskh su Google Play Store e Apple App Store.

## Indice
- [Prerequisiti](#prerequisiti)
- [Script Disponibili](#script-disponibili)
- [Build e Preparazione](#build-e-preparazione)
- [Deploy su Android (Google Play Store)](#deploy-su-android-google-play-store)
- [Deploy su iOS (Apple App Store)](#deploy-su-ios-apple-app-store)
- [Aggiornamenti Futuri](#aggiornamenti-futuri)
- [Troubleshooting](#troubleshooting)

## Prerequisiti

### Per Android
- **Android Studio** installato (scarica da https://developer.android.com/studio)
- **Account Google Play Developer** (costo una tantum di $25)
  - Registrati su https://play.google.com/console
- **Java JDK 17** o superiore installato
- Un dispositivo Android fisico o emulatore per testare

### Per iOS
- **macOS** (obbligatorio per build iOS)
- **Xcode** installato (scarica dal Mac App Store)
- **Account Apple Developer** (costo annuale di $99)
  - Registrati su https://developer.apple.com/programs/
- **CocoaPods** installato (`sudo gem install cocoapods`)
- Un dispositivo iOS fisico o simulatore per testare

## Script Disponibili

Il progetto include diversi script npm per facilitare lo sviluppo:

```bash
# Sincronizza il web build con le app native (Android e iOS)
npm run cap:sync

# Sincronizza solo Android
npm run cap:sync:android

# Sincronizza solo iOS
npm run cap:sync:ios

# Apri il progetto Android in Android Studio
npm run cap:open:android

# Apri il progetto iOS in Xcode
npm run cap:open:ios

# Build completo per Android
npm run cap:build:android

# Build completo per iOS
npm run cap:build:ios

# Rigenera icone e splash screens
npm run cap:assets
```

## Build e Preparazione

### 1. Build del Progetto Web

Prima di ogni deploy, assicurati di buildare il progetto:

```bash
npm run build
```

Questo crea la versione ottimizzata dell'app in `dist/public`.

### 2. Sincronizzazione con le App Native

Dopo ogni build, sincronizza i file con le piattaforme native:

```bash
npm run cap:sync
```

Oppure sincronizza solo la piattaforma specifica:

```bash
npm run cap:sync:android  # Solo Android
npm run cap:sync:ios      # Solo iOS
```

## Deploy su Android (Google Play Store)

### Passo 1: Configurazione del Progetto

1. Apri Android Studio:
   ```bash
   npm run cap:open:android
   ```

2. Configura il progetto:
   - Apri `android/app/build.gradle`
   - Aggiorna `versionCode` (numero intero, incrementa ad ogni release)
   - Aggiorna `versionName` (stringa, es. "1.0.0")
   
   ```gradle
   android {
       defaultConfig {
           applicationId "com.naskh.app"
           minSdkVersion 22
           targetSdkVersion 34
           versionCode 1        // Incrementa ad ogni release
           versionName "1.0.0"  // Versione leggibile
       }
   }
   ```

3. Personalizza il package name se necessario in `capacitor.config.ts`:
   ```typescript
   appId: 'com.naskh.app',  // Modificalo se vuoi un diverso package name
   ```

### Passo 2: Generare la Keystore per il Signing

Le app Android devono essere firmate digitalmente. Crea una keystore:

```bash
cd android/app
keytool -genkey -v -keystore naskh-release-key.keystore -alias naskh-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**IMPORTANTE**: 
- Conserva la password in un luogo sicuro
- Non committare la keystore su Git
- Fai un backup della keystore (se la perdi, non potrai più aggiornare l'app)

### Passo 3: Configurare il Signing

1. Crea il file `android/key.properties`:
   ```properties
   storePassword=TUA_STORE_PASSWORD
   keyPassword=TUA_KEY_PASSWORD
   keyAlias=naskh-key-alias
   storeFile=naskh-release-key.keystore
   ```

2. Modifica `android/app/build.gradle` per usare il signing config:
   ```gradle
   def keystoreProperties = new Properties()
   def keystorePropertiesFile = rootProject.file('key.properties')
   if (keystorePropertiesFile.exists()) {
       keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
   }

   android {
       signingConfigs {
           release {
               keyAlias keystoreProperties['keyAlias']
               keyPassword keystoreProperties['keyPassword']
               storeFile file(keystoreProperties['storeFile'])
               storePassword keystoreProperties['storePassword']
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
               minifyEnabled false
               proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

### Passo 4: Build della Release APK/AAB

In Android Studio:

1. Menu: **Build > Generate Signed Bundle / APK**
2. Seleziona **Android App Bundle (AAB)** (richiesto da Google Play)
3. Seleziona la tua keystore e inserisci le password
4. Scegli **release** come build variant
5. Click **Finish**

Il file AAB sarà in `android/app/release/app-release.aab`

**Oppure da linea di comando:**

```bash
cd android
./gradlew bundleRelease
```

### Passo 5: Upload su Google Play Console

1. Vai su https://play.google.com/console
2. Crea una nuova applicazione
3. Compila tutte le informazioni richieste:
   - Titolo dell'app
   - Breve descrizione
   - Descrizione completa
   - Screenshot (almeno 2)
   - Icona dell'app (512x512 px)
   - Grafica per il feature graphic (1024x500 px)
   - Categoria dell'app
   - Privacy policy URL (obbligatorio)

4. Vai su **Release > Production**
5. Click **Create new release**
6. Upload il file AAB
7. Compila le note di rilascio
8. Click **Review release** e poi **Start rollout to production**

### Passo 6: Revisione e Pubblicazione

Google revisionerà la tua app (solitamente 1-3 giorni). Riceverai una email quando l'app sarà pubblicata.

## Deploy su iOS (Apple App Store)

### Passo 1: Configurazione Certificati e Provisioning

1. Apri Xcode:
   ```bash
   npm run cap:open:ios
   ```

2. In Xcode, seleziona il progetto "App" nella sidebar
3. Vai alla tab **Signing & Capabilities**
4. Seleziona il tuo **Team** (account Apple Developer)
5. Xcode gestirà automaticamente certificati e provisioning profiles

### Passo 2: Configurazione del Progetto

1. In Xcode, seleziona il target "App"
2. Nella tab **General**:
   - Verifica il **Bundle Identifier** (deve corrispondere a `com.naskh.app`)
   - Aggiorna **Version** (es. "1.0.0")
   - Aggiorna **Build** (numero intero, incrementa ad ogni upload)

3. Nella tab **Signing & Capabilities**:
   - Assicurati che "Automatically manage signing" sia selezionato
   - Verifica che il Team sia corretto

### Passo 3: Installa le Dipendenze iOS

```bash
cd ios/App
pod install
cd ../..
```

### Passo 4: Build per App Store

In Xcode:

1. Seleziona **Any iOS Device (arm64)** come destination
2. Menu: **Product > Archive**
3. Attendi il completamento dell'archivio
4. Si aprirà l'Organizer con il tuo archivio

### Passo 5: Upload su App Store Connect

1. Nell'Organizer, seleziona il tuo archivio
2. Click **Distribute App**
3. Seleziona **App Store Connect**
4. Seleziona **Upload**
5. Segui il wizard, mantenendo le opzioni di default
6. Click **Upload**

Xcode caricherà l'app su App Store Connect (può richiedere diversi minuti).

### Passo 6: Configurazione su App Store Connect

1. Vai su https://appstoreconnect.apple.com
2. Click sulla tua app (o creane una nuova)
3. Compila tutte le informazioni richieste:
   - Nome dell'app
   - Sottotitolo
   - Categoria primaria e secondaria
   - Descrizione
   - Parole chiave
   - Screenshot per tutti i device richiesti:
     - iPhone 6.7" display (es. iPhone 15 Pro Max)
     - iPhone 6.5" display (es. iPhone 14 Plus)
     - iPad Pro 12.9" display
   - Privacy policy URL (obbligatorio)

4. Nella sezione **Build**, seleziona il build che hai caricato
5. Compila le informazioni sulla privacy dell'app
6. Nella sezione **Pricing and Availability**, imposta il prezzo (gratis) e i paesi

### Passo 7: Invio per la Revisione

1. Click **Submit for Review**
2. Rispondi alle domande sulla conformità export
3. Click **Submit**

Apple revisionerà la tua app (solitamente 1-3 giorni). Riceverai notifiche via email sullo stato.

## Aggiornamenti Futuri

### Per Android

1. Aggiorna il codice web
2. Incrementa `versionCode` e `versionName` in `android/app/build.gradle`
3. Build e sincronizza:
   ```bash
   npm run cap:build:android
   ```
4. Genera nuovo AAB firmato
5. Upload su Google Play Console nella sezione **Release > Production**

### Per iOS

1. Aggiorna il codice web
2. Incrementa **Build** (e **Version** se ci sono nuove features) in Xcode
3. Build e sincronizza:
   ```bash
   npm run cap:build:ios
   ```
4. Crea nuovo Archive in Xcode
5. Upload su App Store Connect
6. Seleziona il nuovo build e invia per la revisione

## Troubleshooting

### Android

**Problema: "Failed to find Build Tools"**
- Soluzione: Apri Android Studio > SDK Manager > SDK Tools e installa le Build Tools più recenti

**Problema: "Execution failed for task ':app:processReleaseResources'"**
- Soluzione: Pulisci il progetto: `cd android && ./gradlew clean`

**Problema: "Keystore file not found"**
- Soluzione: Verifica che il percorso in `key.properties` sia corretto e relativo a `android/app/`

### iOS

**Problema: "No signing certificate"**
- Soluzione: Verifica di aver effettuato il login con il tuo Apple ID in Xcode > Preferences > Accounts

**Problema: "Unable to install CocoaPods dependencies"**
- Soluzione: 
  ```bash
  cd ios/App
  pod repo update
  pod install
  ```

**Problema: "Build failed with Swift errors"**
- Soluzione: Pulisci il build: In Xcode, Product > Clean Build Folder (Shift+Cmd+K)

### Generale

**Problema: Le modifiche al web non si vedono nell'app**
- Soluzione: Assicurati di fare build e sync:
  ```bash
  npm run build
  npm run cap:sync
  ```

**Problema: L'app si chiude immediatamente all'avvio**
- Soluzione: Controlla i log:
  - Android: In Android Studio, apri Logcat
  - iOS: In Xcode, apri la console quando l'app è in esecuzione

## Risorse Utili

### Android
- [Documentazione Google Play Console](https://support.google.com/googleplay/android-developer)
- [Guida al Signing delle App](https://developer.android.com/studio/publish/app-signing)
- [Checklist di Lancio](https://developer.android.com/distribute/best-practices/launch/launch-checklist)

### iOS
- [Documentazione App Store Connect](https://developer.apple.com/app-store-connect/)
- [Linee Guida per la Revisione](https://developer.apple.com/app-store/review/guidelines/)
- [Guida alle Screenshot](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/)

### Capacitor
- [Documentazione Capacitor](https://capacitorjs.com/docs)
- [Guida Android](https://capacitorjs.com/docs/android)
- [Guida iOS](https://capacitorjs.com/docs/ios)

## Note Importanti

1. **Privacy Policy**: Sia Google che Apple richiedono una privacy policy per tutte le app. Assicurati di averne una pubblicata online.

2. **Permessi**: Se l'app usa permessi speciali (fotocamera, posizione, ecc.), dovrai giustificarli durante la revisione.

3. **Test**: Testa accuratamente l'app su diversi dispositivi prima di pubblicare.

4. **Backup**: Mantieni backup sicuri delle tue keystore (Android) e certificati (iOS).

5. **Versioning**: Usa il [Semantic Versioning](https://semver.org/) per le versioni (es. 1.0.0, 1.1.0, 2.0.0).

6. **Tempi di Revisione**: 
   - Google Play: solitamente 1-3 giorni
   - App Store: solitamente 1-3 giorni, ma può arrivare fino a 1 settimana

7. **Aggiornamenti Automatici**: Una volta pubblicata, gli utenti riceveranno automaticamente gli aggiornamenti quando li pubblichi.

## Supporto

Per problemi specifici di Capacitor, consulta:
- [Forum Capacitor](https://forum.ionicframework.com/c/capacitor/)
- [GitHub Issues](https://github.com/ionic-team/capacitor/issues)
