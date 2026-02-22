# Artist Portfolio Next.js GSAP Template

A multi-page artist portfolio website built with Next.js App Router, GSAP animations, and Three.js media interactions.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- GSAP + ScrollTrigger
- Three.js

## Project Structure

- `src/app/artist` - artist page
- `src/app/filmography` - filmography page with hover preview logic
- `src/app/media` - media page with interactive visuals
- `src/components` - shared layout and UI components
- `public/assets` - fonts and static assets

## Prerequisites

- Node.js 18+ (recommend 20+)
- npm 9+

## Local Setup

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000`
- `http://localhost:3000/artist`
- `http://localhost:3000/filmography`
- `http://localhost:3000/media`

## Production Build

```bash
npm run lint
npm run build
npm run start
```

## Deployment (Vercel)

### Option 1: Deploy from GitHub

1. Push this repo to GitHub.
2. Import the repository at https://vercel.com/new.
3. Framework preset: Next.js (auto-detected).
4. Build command: `npm run build` (default).
5. Output directory: `.next` (default).
6. Click Deploy.

### Option 2: Deploy with Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

## Notes

- Media data currently fetches from a public Sanity endpoint in `src/app/media/page.tsx`.
- Replace assets, text, and branding before commercial use.
