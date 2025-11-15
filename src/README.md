# NUCLi OS Landing Page

A modern, responsive landing page for NUCLi OS built with React, TypeScript, Vite, and Tailwind CSS.

## 🚀 Quick Deploy to Netlify

### Option 1: Drag and Drop (Easiest)
1. Run `npm run build` locally
2. Drag the `dist` folder to [Netlify's deploy page](https://app.netlify.com/drop)
3. Your site will be live instantly!

### Option 2: Git Integration (Recommended)
1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com) and sign up/login
3. Click "New site from Git"
4. Connect your GitHub repository
5. Netlify will auto-detect the settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

### Option 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development
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

## 📁 Project Structure
```
├── src/
│   └── main.tsx          # Application entry point
├── components/
│   └── ui/               # Reusable UI components
├── styles/
│   └── globals.css       # Global styles and Tailwind config
├── public/               # Static assets
├── netlify.toml          # Netlify configuration
└── App.tsx               # Main application component
```

## 🎨 Features
- ⚡ Vite for fast development and building
- ⚛️ React 18 with TypeScript
- 🎨 Tailwind CSS v4 for styling
- 📱 Fully responsive design
- 🌙 Dark theme optimized
- 🔔 Toast notifications with Sonner
- 📦 Component library with shadcn/ui
- 🚀 Optimized for Netlify deployment

## 🔧 Configuration Files

### netlify.toml
Configures Netlify build settings, redirects, and headers for optimal performance.

### vite.config.ts
Vite configuration optimized for production builds with proper chunking.

## 🌐 Environment Variables
No environment variables required for basic deployment.

## 📝 Customization
- Update brand colors in `styles/globals.css`
- Modify content in `App.tsx`
- Add new components in `components/`
- Update metadata in `index.html`

## 🚀 Performance
- Automatic code splitting
- Optimized asset caching
- Fast loading with Vite
- SEO-friendly structure

## 📄 License
MIT License - feel free to use for your projects!