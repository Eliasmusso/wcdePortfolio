# WCD(E) - Creative Agency Portfolio

Modern, responsive portfolio website for WCD(E) Creative Agency built with React, TypeScript, and Vite.

## 🚀 Features

- **Modern Design**: Clean, minimalist design with dark theme
- **Interactive Elements**: Scroll-based animations using Framer Motion
- **3D Integration**: Spline 3D scenes for team members
- **Responsive**: Fully responsive design for all devices
- **Portfolio Gallery**: Interactive project showcase with modals
- **Contact Form**: Mini-briefing form with service selection

## 🛠️ Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Spline** - 3D scenes
- **React Three Fiber** - 3D graphics

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### GitHub Pages

1. Build the project:
   ```bash
   npm run build
   ```

2. The build output will be in the `dist` folder

3. Deploy to GitHub Pages:
   - Push the code to a GitHub repository
   - Go to Settings → Pages
   - Select source: Deploy from a branch
   - Select branch: `main` (or `master`)
   - Select folder: `/dist`
   - Save

### Alternative: Netlify / Vercel

You can also deploy directly to Netlify or Vercel by connecting your GitHub repository. Both platforms will automatically detect Vite and build the project.

## 📁 Project Structure

```
├── public/          # Static assets
├── src/
│   ├── components/  # React components
│   ├── assets/      # Images and other assets
│   └── lib/         # Utilities
├── styles.css       # Global styles
└── vite.config.ts   # Vite configuration
```

## 🎨 Sections

- **Home**: Hero section with animated text reveal
- **Services**: Scroll-based service categories
- **Portfolio**: Interactive project carousel with modals
- **About**: Team section with 3D profiles
- **Contact**: Contact form with service selection

## 📝 License

Private project - All rights reserved

## 👥 Team

- Elias Musso - Graphic Designer
- Justin Jambrec - Software Engineer

