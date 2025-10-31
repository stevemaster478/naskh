# Naskh - Arabic Transliteration Tool

## Overview

Naskh is a web application designed for Muslim Salafi students, translators, and researchers in Italy (with plans to expand to English and Arabic-speaking audiences). The application provides Arabic-to-Latin transliteration services following the DIN 31635 standard. Users can convert text between Latin characters, Arabic script, and standardized DIN 31635 transliteration.

The application employs a hybrid approach: first checking a static dictionary of common Islamic terms, then falling back to Google Gemini AI for unknown terms. All AI-generated conversions are logged for future dictionary integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript via Vite build system

**UI Component Library**: shadcn/ui (Radix UI primitives with Tailwind CSS)
- Rationale: Provides accessible, customizable components that align with Material Design principles while supporting the cultural aesthetic requirements
- Component structure follows atomic design with reusable UI elements in `client/src/components/ui/`

**Styling System**: Tailwind CSS with custom design tokens
- Custom color system supporting light/dark themes
- Typography optimized for bilingual text (Arabic RTL, Latin LTR)
- Cairo font for Arabic text, Inter for Latin text
- Custom spacing and elevation utilities for consistent visual hierarchy

**State Management**: 
- TanStack Query (React Query) for server state
- Local component state via React hooks
- Theme state managed through Context API (ThemeProvider)

**Routing**: Wouter (lightweight client-side routing)
- Simple single-page application structure
- Main route serves the conversion interface

**Key Design Decisions**:
- Single-page application to maintain conversion flow focus
- Automatic RTL/LTR text direction detection based on input
- Responsive design with mobile-first approach
- Character count tracking for user awareness

### Backend Architecture

**Framework**: Express.js with TypeScript

**API Structure**: RESTful endpoint design
- `POST /api/convert` - Main conversion endpoint accepting text and conversion mode
- Request validation using Zod schemas
- Structured error handling with appropriate HTTP status codes

**Conversion Strategy** (Hybrid Dictionary + AI):
1. Input validation against schema
2. Dictionary lookup for known Islamic terms
3. AI fallback using Google Gemini for unknown terms
4. Response includes source indicator (dictionary vs AI)
5. AI conversions logged for future dictionary expansion

**Conversion Modes**:
- `latin-to-din`: Latin text → DIN 31635 transliteration
- `arabic-to-din`: Arabic script → DIN 31635 transliteration  
- `latin-to-arabic`: Latin text → Arabic script

**Static Dictionary**: 
- JSON-based Islamic terminology database (`server/dictionary.ts`)
- Categories: Islamic sciences, worship, divine names, sacred texts
- Multiple Latin spelling variations mapped to canonical DIN 31635

**Logging System**:
- File-based JSON logging (`data/conversion-logs.json`)
- Tracks AI-generated conversions for quality review
- Includes timestamp, input/output, mode, and source metadata

**Key Design Decisions**:
- Stateless application design (no user sessions required)
- AI as intelligent fallback, not primary conversion method
- Comprehensive logging for continuous dictionary improvement
- Specialized prompts per conversion mode for optimal AI accuracy

### Data Storage

**Database**: PostgreSQL via Neon serverless
- Drizzle ORM for type-safe database operations
- Schema defined in `shared/schema.ts`
- Currently minimal schema (application is largely stateless)

**File-based Storage**:
- Conversion logs stored in JSON format
- Ensures data directory exists before writes
- Simple append-based logging for audit trail

**Key Design Decisions**:
- Database provisioned but minimally used (prepared for future features)
- File-based logging chosen for simplicity and easy inspection
- No user authentication or session management needed

### External Dependencies

**AI Service**: Google Gemini API (@google/genai)
- Purpose: Intelligent transliteration for terms not in static dictionary
- Mode-specific prompts ensure DIN 31635 compliance
- API key required via environment variable (GEMINI_API_KEY)

**Database**: Neon PostgreSQL (@neondatabase/serverless)
- Purpose: Serverless PostgreSQL database
- Connection via DATABASE_URL environment variable
- Managed through Drizzle ORM with migration support

**Third-party Libraries**:
- Radix UI primitives: Accessible component foundations
- TanStack Query: Server state synchronization
- Zod: Runtime schema validation
- date-fns: Date manipulation utilities
- Wouter: Lightweight routing
- lucide-react: Icon library

**Typography**: Google Fonts
- Cairo: Modern Arabic sans-serif
- Amiri: Classical Arabic serif (alternative)
- Inter: Technical/UI Latin text

**Development Tools**:
- Vite: Fast development server and build tool
- Replit-specific plugins for runtime error handling and dev banners
- TypeScript for type safety across full stack

**Key Integration Decisions**:
- Gemini AI chosen for superior multilingual capability
- Neon for serverless scaling potential
- shadcn/ui for rapid, accessible UI development
- Environment variables for sensitive configuration
- Font loading from Google Fonts CDN for performance