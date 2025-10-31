# Naskh - Arabic Transliteration Tool

## Overview

Naskh is a full-stack TypeScript application for converting and transliterating text between Arabic script, Latin script, and DIN 31635 standard transliteration. The application serves Islamic studies students, translators, and researchers who need accurate Arabic-Latin text conversion.

**Core Purpose**: Provide AI-powered and dictionary-based transliteration following the DIN 31635 standard for Arabic transliteration.

**Technology Stack**:
- Frontend: React + Vite + TailwindCSS
- Backend: Express.js (Node.js)
- Database: PostgreSQL (via Neon) with Drizzle ORM
- AI Integration: Google Gemini API
- Mobile: Capacitor (iOS/Android)
- UI Components: Radix UI + shadcn/ui

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**31 Ottobre 2025 - Ottimizzazione Prestazioni con Streaming AI**:
- Implementato streaming per risposte Gemini AI quasi immediate
- Aggiunto cache in-memory per conversioni ripetute (60 minuti TTL)
- Nuovo endpoint `/api/convert/stream` con Server-Sent Events
- Frontend aggiornato per gestire streaming progressivo del testo
- Migliorata user experience con visualizzazione incrementale

**31 Ottobre 2025 - Integrazione Capacitor per App Native**:
- Configurato Capacitor per creare app native Android e iOS
- Aggiunti progetti nativi nelle cartelle `android/` e `ios/`
- Generati icone e splash screens per tutte le piattaforme
- Creata documentazione completa in `MOBILE_DEPLOYMENT.md` per pubblicazione su App Store e Play Store
- Aggiunti script npm per build e sync delle app native
- Configurato deployment production per Replit (autoscale)

## System Architecture

### Application Structure

**Monorepo Layout**:
- `client/`: React frontend application
- `server/`: Express.js backend API
- `shared/`: Shared TypeScript schemas and types (Zod validation)
- `dist/`: Production build output

**Development vs Production**:
- Development: Vite dev server integrated with Express via middleware
- Production: Static files served from `dist/public` by Express

### Frontend Architecture

**Component Design System**:
- Based on Material Design principles adapted for Islamic aesthetics
- Uses shadcn/ui component library (Radix UI primitives)
- Supports bidirectional text (RTL/LTR) for Arabic and Latin scripts
- Theme system with light/dark modes via React Context

**Typography Approach**:
- Arabic text: Cairo/Amiri fonts (Google Fonts)
- Latin text: Inter font
- Special handling for DIN 31635 diacritics (ḥ, ṣ, ṯ, ʿ, etc.)

**State Management**:
- TanStack Query (React Query) for server state
- Local React state for UI interactions
- No complex global state management needed (stateless conversion tool)

**Key UI Features**:
- Single-page application with vertical scroll
- Three conversion modes: Latin→DIN, Arabic→DIN, Latin→Arabic
- Auto-detection of text direction (RTL/LTR)
- Real-time character counting
- Copy-to-clipboard functionality

### Backend Architecture

**API Design**:
- RESTful endpoint: `POST /api/convert`
- Stateless request-response model
- JSON-based communication with Zod validation

**Conversion Strategy (Multi-Layer Approach)**:
1. **In-Memory Cache**: Conversioni recenti cached per 60 minuti (instant)
2. **Dictionary Lookup**: Static dictionary of common Islamic terms (`server/dictionary.ts`)
3. **AI Streaming**: Google Gemini API con streaming per risposte progressive
4. **Logging**: AI conversions logged to `data/conversion-logs.json` for future dictionary expansion

**Performance Optimizations**:
- **Cache in-memory** (`server/cache.ts`): LRU cache con 1000 entry max, TTL 60 minuti
- **Streaming AI** (`/api/convert/stream`): Server-Sent Events per risposte progressive
- **Response time**: Cache/Dictionary ~5-50ms, AI streaming ~100-500ms first chunk, progressivo dopo
- Frontend mostra testo incrementalmente invece di aspettare risposta completa

**Why This Approach?**:
- Cache elimina latenza per conversioni ripetute
- Dictionary provides instant, consistent results for common terms
- Streaming AI riduce perceived latency (user vede testo apparire immediatamente)
- Logging builds knowledge base for improving dictionary over time

**Error Handling**:
- Zod schema validation on all API requests
- Graceful fallback if AI service unavailable
- User-friendly error messages via toast notifications
- Stream error handling con chiusura pulita della connessione

### Data Layer

**Database Setup**:
- PostgreSQL via Neon (serverless)
- Drizzle ORM for type-safe database access
- Schema defined in `shared/schema.ts`

**Current Usage**:
- Application is primarily stateless (no user accounts)
- Database infrastructure provisioned but minimal usage
- File-based logging for conversion history (`data/conversion-logs.json`)

**Future Expansion Potential**:
- Could add user accounts and saved conversions
- Dictionary entries could migrate from static file to database
- Analytics on conversion patterns

### Mobile Architecture (Capacitor)

**Cross-Platform Strategy**:
- Single codebase for web, iOS, and Android
- Capacitor wraps web build into native containers
- Native splash screens and app icons configured

**Build Process**:
- Web build (`npm run build`) generates `dist/public`
- Capacitor syncs web assets to native projects
- Native builds done via Android Studio / Xcode

**Platform-Specific Features**:
- Custom splash screens for iOS (multiple device sizes)
- Theme color: `#111827` (dark gray)
- App ID: `com.naskh.app`

### PWA Features

**Progressive Web App**:
- Service worker for offline capability
- Manifest with app metadata
- Installable on mobile/desktop browsers
- Custom app icons and splash screens

## External Dependencies

### AI Service Integration

**Google Gemini API**:
- **Purpose**: AI-powered text conversion when dictionary lookup fails
- **Configuration**: Requires `GEMINI_API_KEY` environment variable
- **Usage Pattern**: Specialized prompts for each conversion mode
- **Cost Consideration**: API calls only made when dictionary doesn't have entry

**Prompts Strategy**:
- Separate prompts for Latin→DIN, Arabic→DIN, Latin→Arabic
- Prompts emphasize DIN 31635 standard compliance
- Instructions to preserve non-Arabic text unchanged

### Database Service

**Neon PostgreSQL**:
- **Purpose**: Serverless PostgreSQL database
- **Configuration**: Requires `DATABASE_URL` environment variable
- **Connection**: Via `@neondatabase/serverless` package
- **Current State**: Provisioned but minimal usage (stateless app)

### UI Component Libraries

**Radix UI**:
- Unstyled, accessible component primitives
- Used for dialogs, dropdowns, tooltips, etc.
- Provides keyboard navigation and ARIA attributes

**shadcn/ui**:
- Pre-built component library wrapping Radix UI
- Customized with TailwindCSS
- Configuration in `components.json`

### Font Services

**Google Fonts**:
- Cairo: Modern Arabic sans-serif
- Amiri: Classical Arabic serif
- Inter: Latin text for UI
- Loaded via CDN in `client/index.html`

### Build Tools

**Vite**:
- Frontend build tool and dev server
- Fast HMR (Hot Module Replacement)
- Plugin: VitePWA for service worker generation

**esbuild**:
- Backend bundler for production builds
- Bundles Express server code to `dist/index.js`

**Capacitor**:
- Native app wrapper for iOS/Android
- Asset generation for icons and splash screens
- Platform-specific build scripts in `package.json`
- **Setup**: Progetti nativi già configurati in `android/` e `ios/`
- **Scripts disponibili**:
  - `npm run cap:sync`: Sincronizza web build con app native
  - `npm run cap:build:android/ios`: Build completo per piattaforma specifica
  - `npm run cap:open:android/ios`: Apri progetto in IDE nativo
  - `npm run cap:assets`: Rigenera icone e splash screens
- **Deployment**: Vedi `MOBILE_DEPLOYMENT.md` per guida completa pubblicazione store

### Third-Party npm Packages

**Key Dependencies**:
- `express`: Web server framework
- `react` + `react-dom`: UI library
- `drizzle-orm`: Type-safe database ORM
- `zod`: Schema validation
- `tailwindcss`: Utility-first CSS framework
- `wouter`: Lightweight routing
- `@tanstack/react-query`: Server state management
- `class-variance-authority`: Component variant styling
- `date-fns`: Date formatting utilities
- `@capacitor/core`: Runtime per app native (in dependencies, necessario a runtime)

**Dev Dependencies**:
- `@capacitor/cli`: CLI per gestione progetti Capacitor
- `@capacitor/android`: Piattaforma Android
- `@capacitor/ios`: Piattaforma iOS
- `@capacitor/assets`: Generatore automatico di icone e splash screens

### Environment Variables Required

```
GEMINI_API_KEY=<your-google-gemini-api-key>
DATABASE_URL=<neon-postgres-connection-string>
PORT=5001  # Optional, defaults to 5000
NODE_ENV=development|production
```