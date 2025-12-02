# Portfolio Website

A modern, responsive portfolio website built with React and Tailwind CSS, automatically synced with GitHub.

## Features

- **Hero Section** - Introduction with profile picture
- **About Me Section** - Professional background
- **Tech Stack Section** - Technologies and skills
- **Projects Section** - GitHub repositories with descriptions
- **Contact Form** - Secure contact form
- **Bottom Navigation** - Smooth scroll navigation

## Tech Stack

- React + TypeScript
- Tailwind CSS
- Vite
- SWR (Data fetching)
- Framer Motion (Animations)
- React Hook Form + Zod (Form validation)

## Quick Start

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

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
Portfolio/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript types
├── public/             # Static assets
└── .env                # Environment variables
```

## Configuration

### Environment Variables

- `VITE_GITHUB_USERNAME` - Your GitHub username (required)
- `VITE_GITHUB_TOKEN` - GitHub token for higher rate limits (optional)
- `VITE_REPO_TOPICS` - Filter repos by topics (optional)
- `VITE_REPO_URLS` - Custom deployment URLs (optional)
- `VITE_SPECIAL_TECH_REPO` - Special repo for tech stack (optional)

See `.env.example` or documentation for more details.

## Troubleshooting

### Projects not showing?

- Verify `VITE_GITHUB_USERNAME` is set correctly
- Check that you have public repositories
- Restart dev server after changing `.env`

### Rate limit errors?

- Add `VITE_GITHUB_TOKEN` to `.env`
- Wait a few minutes and refresh

## License

[Add your license here]
