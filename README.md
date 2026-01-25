# Portfolio Website

A modern, futuristic portfolio website with a developer console aesthetic, built with React, TypeScript, and Tailwind CSS. Automatically syncs with GitHub to showcase your projects and skills.

## ✨ Features

### 🎨 Design & UI
- **Futuristic Terminal Theme** - Developer console-inspired design with terminal windows, status bars, and code aesthetics
- **Splash Screen** - Animated loading screen with typing effects
- **Interactive Background** - Particle system with mouse interaction and animated dot grid
- **Smooth Animations** - Scroll-triggered fade-ins, typing animations, and glitch effects
- **Responsive Design** - Fully responsive across all device sizes

### 🚀 Core Features
- **Hero Section** - Dynamic typing animations, rotating headings and descriptions, floating code snippets
- **About Section** - Terminal-style JSON profile display with integrated tech stack
- **Projects Section** - Horizontal auto-scrolling project cards with terminal styling, status indicators, and version numbers
- **Tech Stack** - Network nodes layout with circuit lines and glowing hover effects
- **Command Palette** - Quick navigation with `⌘K` / `Ctrl+K` shortcut
- **Sidebar Navigation** - Fixed IDE-style sidebar with active section highlighting
- **Header** - Status bar with GitHub avatar, command palette trigger, and quick action menus

### 🔒 Security & Performance
- **Spam Protection** - Rate limiting and cooldown on contact button
- **URL Sanitization** - Prevents SSRF and XSS attacks
- **Input Validation** - Secure handling of all user inputs
- **Error Boundaries** - Graceful error handling
- **Optimized Animations** - CSS-based animations for better performance

### 🛠️ Developer Experience
- **Custom Hooks** - Reusable hooks for typing animations, email contact, scroll animations
- **Type Safety** - Full TypeScript coverage
- **Code Organization** - Clean, maintainable, and well-documented code
- **Constants Management** - Centralized configuration

## 🛠️ Tech Stack

- **React 18** + **TypeScript** - Modern React with full type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **SWR** - Data fetching with caching and revalidation
- **Custom Hooks** - Reusable animation and interaction hooks

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure GitHub

Create a `.env` file in the root directory:

```env
VITE_GITHUB_USERNAME=your-github-username
```

**Optional** (for higher rate limits):

```env
VITE_GITHUB_TOKEN=your-github-token
```

**Optional** (filter repos by topics):

```env
VITE_REPO_TOPICS=portfolio,featured,showcase
```

**Optional** (custom deployment URLs):

```env
VITE_REPO_URLS=project1:https://project1.com,project2:https://project2.com
```

**Optional** (special repo for tech stack):

```env
VITE_SPECIAL_TECH_REPO=your-special-repo-name
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 4. Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
Portfolio/
├── src/
│   ├── components/          # React components
│   │   ├── About.tsx        # About section with terminal window
│   │   ├── CommandPalette.tsx  # Command palette for quick navigation
│   │   ├── Header.tsx       # Top status bar
│   │   ├── Hero.tsx         # Hero section with typing animations
│   │   ├── InteractiveBackground.tsx  # Particle background
│   │   ├── Projects.tsx     # Projects section with auto-scroll
│   │   ├── QuickMenu.tsx    # Dropdown menus
│   │   ├── Sidebar.tsx      # IDE-style sidebar navigation
│   │   ├── SplashScreen.tsx # Loading screen
│   │   └── TerminalWindow.tsx  # Reusable terminal component
│   ├── hooks/               # Custom React hooks
│   │   ├── useEmailContact.ts  # Email contact with spam protection
│   │   ├── useGitHub.ts     # GitHub data fetching
│   │   ├── useScrollAnimation.ts  # Scroll-triggered animations
│   │   ├── useSequentialTyping.ts  # Sequential typing animation
│   │   └── useTypingAnimation.ts  # Single text typing animation
│   ├── services/            # API services
│   │   └── github.ts        # GitHub API integration
│   ├── utils/               # Utility functions
│   │   ├── animations.ts    # Animation utilities
│   │   ├── constants.ts     # App constants
│   │   ├── githubHelpers.ts  # GitHub data processing
│   │   ├── scroll.ts        # Scroll utilities
│   │   ├── security.ts      # Security utilities
│   │   └── techHelpers.ts   # Tech stack helpers
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── .env                    # Environment variables
```

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GITHUB_USERNAME` | ✅ Yes | Your GitHub username |
| `VITE_GITHUB_TOKEN` | ❌ No | GitHub token for higher rate limits |
| `VITE_REPO_TOPICS` | ❌ No | Comma-separated topics to filter repos (e.g., `portfolio,featured`) |
| `VITE_REPO_URLS` | ❌ No | Custom deployment URLs (format: `repo1:url1,repo2:url2`) |
| `VITE_SPECIAL_TECH_REPO` | ❌ No | Special repo name for tech stack extraction |
| `VITE_AUTO_DETECT_DEPLOYMENT` | ❌ No | Auto-detect Vercel deployments (default: `true`) |

## 🎯 Key Features Explained

### Typing Animations
- Status badge types out "SYSTEM READY // V.2.0.4"
- Description rotates through multiple variants with typing effect
- Headings change with matching descriptions
- Glitch effects on heading changes

### Spam Protection
- Rate limiting: Max 3 clicks per minute
- Cooldown: 2 seconds between clicks
- Visual feedback for rate limits
- Session-based tracking

### Auto-Scrolling Projects
- Horizontal auto-scroll with pause on hover
- Terminal-style cards with status indicators
- Expandable view (shows 3 initially)
- Smooth animations

### Command Palette
- Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux)
- Quick navigation to sections
- External links (GitHub profile)
- Keyboard navigation support

## 🐛 Troubleshooting

### Projects not showing?
- Verify `VITE_GITHUB_USERNAME` is set correctly
- Check that you have public repositories
- Ensure repos have the topics specified in `VITE_REPO_TOPICS` (if set)
- Restart dev server after changing `.env`

### Rate limit errors?
- Add `VITE_GITHUB_TOKEN` to `.env`
- Wait a few minutes and refresh
- Token can be created at: https://github.com/settings/tokens

### Animations not working?
- Check browser console for errors
- Ensure JavaScript is enabled
- Try clearing browser cache

### Build errors?
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors: `npm run build`
- Verify all environment variables are set correctly

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔐 Security Features

- **URL Sanitization** - All URLs are validated and sanitized
- **XSS Prevention** - Content sanitization for README parsing
- **Path Traversal Protection** - Repository names are URL-encoded
- **Rate Limiting** - Client-side spam protection
- **Input Validation** - All inputs are validated and sanitized

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
- `primary` - Main accent color
- `secondary` - Secondary accent color
- `background-dark` - Background color
- `surface-dark` - Surface color
- `border-dark` - Border color

### Content
- Edit `src/utils/constants.ts` to customize:
  - Content variants (headings and descriptions)
  - Code snippets
  - Animation delays
  - Display limits

### Animations
- Animation timings in `src/utils/constants.ts`
- CSS animations in `src/index.css`
- Custom animation utilities in `src/utils/animations.ts`

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by developer console aesthetics
- GitHub API for project data

---

**Version:** 2.0.4  
**Last Updated:** 2024
