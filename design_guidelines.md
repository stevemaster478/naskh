# Design Guidelines: Naṣkh - Arabic Transliteration Tool

## Design Approach

**System-Based with Cultural Adaptation**: Material Design foundation adapted for Islamic modern aesthetic. Prioritizes clarity, functionality, and bilingual text handling while maintaining the elegant, minimalist character specified.

**Core Principles**:
- Functional clarity over decoration
- Respectful treatment of Arabic script
- Seamless bidirectional text flow (RTL/LTR)
- Calm, focused work environment

---

## Typography System

### Arabic Text (RTL)
- **Primary**: Cairo (Google Fonts) - clean, modern Arabic sans-serif
- **Alternative**: Amiri for more classical/formal contexts
- **Sizes**: text-2xl (display), text-lg (input), text-base (body), text-sm (labels)
- **Weight**: font-normal (400) for body, font-semibold (600) for headings
- **Line height**: leading-relaxed (1.625) for optimal Arabic readability

### Latin Text (LTR)
- **Primary**: Inter (Google Fonts) - excellent for technical/UI text
- **Sizes**: text-xl (headings), text-base (input/output), text-sm (descriptions)
- **Weight**: font-medium (500) for headings, font-normal (400) for body
- **Special characters**: Ensure proper display of DIN 31635 diacritics (ḥ, ṣ, ṯ, ʿ, etc.)

---

## Layout System

### Spacing Primitives (Tailwind Units)
- **Micro spacing**: 2, 4 (gaps, padding within components)
- **Component spacing**: 6, 8 (between form elements)
- **Section spacing**: 12, 16 (between major sections)
- **Page margins**: 8 on mobile, 16 on tablet, 24 on desktop

### Container Structure
```
max-w-4xl mx-auto px-8 md:px-16 py-12
```
- Center-aligned single-column layout
- Generous horizontal padding for breathing room
- No multi-column layouts (focus on sequential conversion flow)

### Viewport Management
- Single-page application with vertical scroll
- Main conversion area: Natural height based on content
- Fixed header with navigation and mode selector
- Sticky footer with author credits

---

## Color Palette

### Light Mode (Default)
- **Background**: Beige sabbia (#F5F1E8) - warm, paper-like
- **Surface**: White (#FFFFFF) with subtle shadow
- **Primary**: Verde oliva (#6B7F5A) - accent for CTAs, active states
- **Secondary**: Oro tenue (#C4A962) - highlights, icons
- **Text Primary**: Grigio scuro (#2D2D2D)
- **Text Secondary**: Grigio medio (#6B6B6B)
- **Borders**: Grigio chiaro (#E0DCD0)

### Dark Mode
- **Background**: Grigio antracite (#1A1A1A)
- **Surface**: Grigio scuro (#2D2D2D)
- **Primary**: Verde oliva chiaro (#8FA87A) - adjusted for dark bg
- **Secondary**: Oro tenue (#D4B972)
- **Text Primary**: Beige chiaro (#F5F1E8)
- **Text Secondary**: Grigio chiaro (#B0B0B0)
- **Borders**: Grigio medio (#3D3D3D)

---

## Component Library

### Header
- Fixed top position with backdrop blur
- Container: Logo (left) + Mode selector tabs (center) + Dark mode toggle (right)
- Height: h-16 on mobile, h-20 on desktop
- Border bottom with subtle shadow

### Conversion Mode Tabs
- Three tabs: "Latino → DIN" | "Arabo → DIN" | "Latino → Arabo"
- Inline horizontal layout on desktop, stacked on mobile
- Active state: Verde oliva background, white text
- Inactive state: Transparent background, grigio medio text
- Rounded corners: rounded-lg
- Smooth transition on state change

### Input Text Area
- Large text area with RTL/LTR auto-detection
- Border: 2px solid in grigio chiaro, verde oliva on focus
- Rounded: rounded-xl
- Padding: p-6
- Min height: min-h-[200px]
- Placeholder text showing example (e.g., "Inserisci testo arabo o latino...")
- Character count indicator (bottom right, text-sm)

### Output Display
- Read-only text area with same styling as input
- Background: Slightly darker/lighter than page background for distinction
- Copy to clipboard button (top right corner)
- Visual indication when AI-powered vs dictionary-based conversion

### Conversion Button
- Central position between input/output
- Size: Large (py-4 px-12)
- Background: Verde oliva with subtle gradient
- Text: "Converti" in white, font-semibold
- Rounded: rounded-full
- Icon: Arrow down or conversion symbol (Lucide Icons)
- Hover: Slightly darker verde oliva
- Loading state: Animated spinner replaces icon

### AI/Dictionary Indicator
- Small badge below output
- Two states:
  - "✨ Conversione AI" (oro tenue accent)
  - "📖 Dizionario" (grigio medio)
- Subtle background, small text (text-xs)

### Footer
- Bottom of page, not sticky
- Two-column layout: Left (description/copyright) | Right (author links)
- Author links with icons:
  - Telegram (@niuffars) - icon + username as clickable link
  - GitHub (@stevemaster478) - icon + username as clickable link
- Icons: Lucide Icons (MessageCircle for Telegram, Github for GitHub)
- Icons size: w-5 h-5 with oro tenue accent on hover
- Padding: py-8, border-top with grigio chiaro

### Dark Mode Toggle
- Icon-only button in header (Sun/Moon icon from Lucide)
- Rounded: rounded-full
- Background: Surface color with border
- Smooth color transition (300ms) across all elements

---

## Interaction Patterns

### Text Direction Handling
- Automatic detection: If input contains Arabic characters, apply `dir="rtl"`
- Manual override option (small toggle icon in input corner)
- Preserve text direction in output based on conversion result

### Real-time Feedback
- Character count updates as user types
- Visual loading state during AI conversion (spinner in button)
- Success/error states with subtle color changes

### Keyboard Shortcuts (Optional Enhancement)
- Ctrl/Cmd + Enter: Trigger conversion
- Ctrl/Cmd + K: Clear input
- Ctrl/Cmd + D: Toggle dark mode

---

## Accessibility

### Bilingual Support
- `lang` attribute switches between `ar` for Arabic sections, `it` for Italian UI
- Proper `dir` attributes for RTL/LTR content
- Unicode normalization for Arabic diacritics

### Keyboard Navigation
- Logical tab order: Mode selector → Input → Convert button → Output → Copy button
- Focus visible states with 2px verde oliva outline

### Screen Reader Support
- ARIA labels for mode tabs, conversion button, and output
- Live regions announce conversion completion
- Alt text for all icons

---

## Animations

Use sparingly:
- Mode tab transition: 200ms ease
- Dark mode color transition: 300ms ease
- Button hover scale: subtle (scale-105), 150ms
- Loading spinner: smooth rotation
- No scroll-triggered or decorative animations

---

## Images

**No hero image** - This is a utility tool prioritizing immediate functionality.

**Icon Usage**:
- Conversion arrows/symbols from Lucide Icons
- Social media icons (Telegram, GitHub) in footer
- All icons: Consistent stroke-width, 24px standard size

---

## Responsive Breakpoints

- **Mobile** (base): Single column, stacked mode tabs, full-width inputs
- **Tablet** (md: 768px): Slightly wider container, inline mode tabs
- **Desktop** (lg: 1024px): Max container width, optimal line lengths for bilingual text