# 🚀 GitHub Deployment Guide

## Schritt 1: Repository auf GitHub erstellen

1. Gehe zu [GitHub](https://github.com) und erstelle ein neues Repository
2. Wähle einen Namen (z.B. `wcde-portfolio` oder `portfolio-website`)
3. Wähle **Public** oder **Private** (je nach Präferenz)
4. **NICHT** "Initialize with README" auswählen (wir haben bereits eine README)
5. Klicke auf "Create repository"

## Schritt 2: Projekt zu GitHub hochladen

### Option A: Über die Kommandozeile (Terminal)

```bash
# Navigiere in den Projektordner
cd "/Users/elias/Desktop/WCD(E)"

# Git initialisieren (falls noch nicht geschehen)
git init

# Alle Dateien hinzufügen
git add .

# Ersten Commit erstellen
git commit -m "Initial commit: WCD(E) Portfolio Website"

# GitHub Repository als Remote hinzufügen (ersetze USERNAME und REPO-NAME)
git remote add origin https://github.com/USERNAME/REPO-NAME.git

# Branch umbenennen zu main (falls nötig)
git branch -M main

# Code hochladen
git push -u origin main
```

### Option B: Über GitHub Desktop

1. Lade [GitHub Desktop](https://desktop.github.com/) herunter
2. Öffne GitHub Desktop → File → Add Local Repository
3. Wähle den Ordner `/Users/elias/Desktop/WCD(E)`
4. Klicke auf "Publish repository"
5. Wähle das Repository aus, das du in Schritt 1 erstellt hast

## Schritt 3: GitHub Pages aktivieren

1. Gehe zu deinem GitHub Repository
2. Klicke auf **Settings** (oben rechts)
3. Scroll nach unten zu **Pages** (im linken Menü)
4. Unter **Source** wähle:
   - **Source**: "GitHub Actions"
   - (Die automatische Deployment-Pipeline wurde bereits eingerichtet)
5. Die Seite wird automatisch deployed wenn du Code pushst

## Schritt 4: Website-URL finden

Nach dem ersten Deployment (kann 1-2 Minuten dauern):
- Gehe zu **Settings** → **Pages**
- Die URL findest du unter "Your site is live at:"
- Format: `https://USERNAME.github.io/REPO-NAME/`

## ⚡ Automatisches Deployment

Die Website wird **automatisch** neu deployed, wenn du:
- Code zum `main` Branch pushst
- Ein Pull Request merged wird

## 🔧 Manuelles Deployment (falls nötig)

Falls das automatische Deployment nicht funktioniert:

```bash
# Build lokal erstellen
npm run build

# Dist-Ordner zu GitHub pushen (alternative Methode)
# ... oder über GitHub Actions UI: Actions Tab → "Run workflow"
```

## 📝 Wichtige Hinweise

- Die Website ist **öffentlich** wenn das Repository public ist
- Bei privaten Repositories benötigen Besucher einen GitHub Account
- Die URL ändert sich nicht, auch bei Updates
- Build-Zeit: ~2-3 Minuten pro Deployment

## 🐛 Probleme lösen

**Website lädt nicht:**
- Warte 2-3 Minuten nach dem Push
- Prüfe den Actions Tab auf Fehler
- Stelle sicher, dass GitHub Pages aktiviert ist

**Fehler beim Build:**
- Prüfe die Logs im Actions Tab
- Stelle sicher, dass alle Dependencies in `package.json` sind
- Führe `npm run build` lokal aus, um Fehler zu finden

