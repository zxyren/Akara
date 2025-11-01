# Frontend Code Structure

## 📁 Directory Layout

```
client/
├── pages/                 # Page components (routes)
│   ├── Index.tsx         # Main app page (refactored)
│   └── NotFound.tsx      # 404 page
├── components/           # Reusable components
│   ├── AppHeader.tsx     # App header with language switcher
│   ├── FontCard.tsx      # Individual font preview card
│   ├── FontList.tsx      # Font list with empty/filter states
│   ├── FontPagination.tsx # Pagination controls
│   ├── FontSearch.tsx    # Search and filter section
│   ├── PreviewTextSection.tsx # Preview text input
│   ├── UploadSection.tsx # File upload area
│   └── ui/               # Base UI components
│       ├── sonner.tsx    # Sonner toast notifications
│       ├── toast.tsx     # Toast component (core)
│       ├── toaster.tsx   # Toast container
│       └── tooltip.tsx   # Tooltip provider
├── hooks/                # Custom React hooks
│   ├── use-mobile.tsx    # Mobile detection hook
│   ├── use-i18n.ts       # i18n translation hook
│   └── use-toast.ts      # Toast notification hook
├── locales/              # Translation files
│   ├── en.json          # English translations
│   └── kh.json          # Khmer translations
├── types/                # TypeScript type definitions
│   └── font.ts          # Font interface definitions
├── lib/
│   └── utils.ts          # Utility functions (cn(), etc.)
├── App.tsx               # Root app component with routing
├── global.css            # Global styles and TailwindCSS
└── vite-env.d.ts        # Vite environment types

shared/                   # Shared types between client & server
└── api.ts               # API type definitions
```

## 🎨 Components Overview

### Page Components
- **Index.tsx** (229 lines)
  - Main font preview application logic
  - State management (fonts, language, pagination, etc.)
  - Event handlers for upload, search, etc.
  - Layout composition with component imports

### Component Architecture
- **AppHeader.tsx** (48 lines)
  - Application title and subtitle
  - Language switcher button
  - Sticky header with blur effect

- **UploadSection.tsx** (85 lines)
  - File upload dropzone
  - Folder upload dropzone
  - Font count display

- **FontSearch.tsx** (53 lines)
  - Search input field
  - Clear all button
  - Font count indicator

- **PreviewTextSection.tsx** (28 lines)
  - Textarea for custom preview text
  - Placeholder based on language

- **FontList.tsx** (125 lines)
  - Renders paginated fonts
  - Empty state handling
  - No results state handling
  - Integrates FontCard and FontPagination

- **FontCard.tsx** (126 lines)
  - Individual font preview card
  - Dynamic @font-face injection
  - Multiple size previews
  - Copy font name button
  - File size display

- **FontPagination.tsx** (114 lines)
  - Prev/Next buttons
  - Page number buttons
  - Smart pagination UI
  - Handles 1-10+ pages

### UI Components (Kept)
- **toast.tsx** - Toast component primitives
- **toaster.tsx** - Toast container/renderer
- **sonner.tsx** - Toast notification wrapper
- **tooltip.tsx** - Tooltip provider

## 🎯 How It Works

### Font Upload Flow
1. User uploads font file(s) or folder
2. FileReader converts to Base64 Data URL
3. Font stored in state with metadata
4. Try/catch blocks handle corrupted files
5. Console logs errors for debugging

### Font Rendering
1. @font-face CSS dynamically injected in each FontCard
2. Font format auto-detected from extension
3. Support for TTF, OTF, WOFF, WOFF2
4. Preview rendered in 3 sizes

### Internationalization (i18n)
1. `useI18n` hook retrieves translations
2. Translations stored in `client/locales/`
3. JSON structure allows nested keys: `app.title`
4. Fallback to English if translation missing
5. Language change triggers re-render

### Search & Pagination
1. Search filters fonts by filename
2. Results paginated at 15 fonts per page
3. Page 1 on search/language change
4. Smart pagination: all pages if ≤10, abbreviated if more

## 🌍 Translations

### File Structure
```
client/locales/
├── en.json  # English (44 lines)
└── kh.json  # Khmer (44 lines)
```

### Key Organization
```json
{
  "app": { "title", "subtitle" },
  "language": { "english", "khmer" },
  "upload": { "title", "selectFiles", "supportedFormats", ... },
  "search": { "title", "placeholder", "clearAll", "found" },
  "preview": { "title", "placeholder", "defaultText" },
  "font": { "copyName", "copied", "showing", "of", ... },
  "footer": { "text" }
}
```

### Adding New Translations
1. Add key to both `en.json` and `kh.json`
2. Use in components: `t("section.key")`
3. Fallback to English if key missing

## 📦 Type Definitions

### LoadedFont
```typescript
interface LoadedFont {
  name: string;              // Filename (e.g., "Arial.ttf")
  file: File;               // File object
  fontData: string;         // Base64 Data URL
  fontFamily: string;       // CSS font-family name
}
```

### Language
```typescript
type Language = "en" | "km";
```

## 🚀 Development Tips

### Adding a New Language
1. Create `client/locales/[lang].json` with all keys
2. Add language code to Language type
3. Add new language to useI18n hook imports
4. Add button to AppHeader

### Creating a New Component
1. Keep components small and focused
2. Accept props for state management
3. Use translations via `useI18n` hook
4. Export from component file

### Debugging Font Loading
1. Check browser console for errors
2. FontCard has try/catch for file loading
3. Console logs indicate read/load failures
4. Inspect Network tab for Data URL size

## ⚙️ Technologies

### Core
- React 18.3
- React Router 6.30
- TypeScript 5.9
- Vite 7.1

### UI & Animation
- Framer Motion 12.23 - Animations
- Tabler icon 3.35 - Icons
- TailwindCSS 3.4 - Styling
- Sonner 1.7 - Notifications

### Utilities
- React Hook Form 7.62
- Zod 3.25
- TanStack React Query 5.84

## 📊 Code Statistics

- **Index.tsx**: 229 lines (was 586, reduced 61%)
- **Components**: 7 new components (~580 lines total)
- **Locales**: 2 JSON files (88 lines total)
- **Types**: 1 file (7 lines)
- **Hooks**: 1 new hook (41 lines)

## 🔧 Troubleshooting

### Font Not Rendering
- Check file format is supported (TTF, OTF, WOFF, WOFF2)
- Verify file isn't corrupted
- Check browser console for errors
- Try uploading different font

### Search Not Working
- Ensure font name matches search query
- Search is case-insensitive
- Clear filters and try again

### Translations Not Showing
- Verify key exists in JSON files
- Check spelling and hierarchy
- Ensure language is correctly set

---

Last updated: 2024
