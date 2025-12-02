# 📁 Dateien für GitHub Repository

## ✅ Diese Dateien SOLLTEN hochgeladen werden:

### Konfigurationsdateien (wichtig!)
- ✅ `.gitignore` - Filtert automatisch unnötige Dateien
- ✅ `package.json` - Dependencies und Scripts
- ✅ `package-lock.json` - Exakte Versionen der Dependencies
- ✅ `vite.config.ts` - Vite Build-Konfiguration
- ✅ `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` - TypeScript Konfiguration
- ✅ `tailwind.config.js` - Tailwind CSS Konfiguration
- ✅ `postcss.config.mjs` - PostCSS Konfiguration
- ✅ `components.json` - UI Components Konfiguration

### Quellcode
- ✅ `index.html` - Haupt-HTML-Datei
- ✅ `src/` - Kompletter Source-Code Ordner
  - ✅ `src/components/` - Alle React Komponenten
  - ✅ `src/assets/` - Bilder, SVG, etc.
  - ✅ `src/lib/` - Utility-Funktionen
  - ✅ `src/App.tsx` - Haupt-App Komponente
  - ✅ `src/main.tsx` - Entry Point

### Styles
- ✅ `styles.css` - Globale Styles

### Public Assets
- ✅ `public/` - Statische Dateien (Bilder, etc.)

### Dokumentation
- ✅ `README.md` - Projektbeschreibung
- ✅ `DEPLOYMENT.md` - Deployment-Anleitung
- ✅ `.github/workflows/deploy.yml` - GitHub Actions Workflow

### Optional
- ✅ `script.js` - Falls verwendet
- ✅ `dummy.ipynb` - Falls gewünscht

---

## ❌ Diese Dateien werden AUTOMATISCH NICHT hochgeladen (durch .gitignore):

- ❌ `node_modules/` - Wird durch `npm install` erstellt
- ❌ `dist/` - Build-Output (wird automatisch durch GitHub Actions erstellt)
- ❌ `.vite/` - Vite Cache
- ❌ `.DS_Store` - macOS Systemdateien
- ❌ `*.log` - Log-Dateien
- ❌ `.env` - Environment Variables (falls vorhanden)

---

## 🚀 Einfacher Weg: Alles automatisch hochladen

Die `.gitignore` Datei filtert bereits alle unnötigen Dateien automatisch.

**Einfach alle Dateien hinzufügen:**
```bash
git add .
```

Git wird automatisch nur die relevanten Dateien hinzufügen und alles andere ignorieren!

---

## 📋 Was wird tatsächlich hochgeladen?

Wenn du `git add .` ausführst, werden folgende Dateien hinzugefügt:

### Haupt-Dateien
- `.gitignore`
- `package.json`
- `package-lock.json`
- `README.md`
- `DEPLOYMENT.md`
- `index.html`
- `vite.config.ts`
- `tailwind.config.js`
- `postcss.config.mjs`
- `components.json`
- `script.js`
- `styles.css`

### TypeScript Config
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`

### Source Code
- `src/` (kompletter Ordner mit allen Unterordnern)
  - Alle `.tsx`, `.ts` Dateien
  - Alle Assets (Bilder, SVG, etc.)

### Public Assets
- `public/` (kompletter Ordner)

### GitHub Actions
- `.github/workflows/deploy.yml`

### Optional
- `dummy.ipynb` (falls gewünscht)

**NICHT hochgeladen werden:**
- `node_modules/` (wird ignoriert)
- `dist/` (wird ignoriert - Build wird automatisch erstellt)
- `.DS_Store` (wird ignoriert)
- `.vite/` (wird ignoriert)

