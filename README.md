# Artist Portfolio Next.js GSAP Template

Premium multi-page artist portfolio focused on cinematic motion, immersive media presentation, and brand-first storytelling.

## Project Overview

This project is a modern portfolio web experience built with Next.js App Router, combining smooth transitions, scroll-driven interactions, and 3D media presentation. The layout and interaction model is designed for entertainment profiles, public figures, and creative brand showcases.

## Demo Video

<p align="center">
  <video
    src="https://raw.githubusercontent.com/locfaker/artist-portfolio-nextjs-gsap-template/main/public/demo/fshare_facbook.mp4"
    controls
    width="960"
  >
    Your browser does not support the video tag.
  </video>
</p>

<p align="center">
  <a href="https://github.com/locfaker/artist-portfolio-nextjs-gsap-template/blob/main/public/demo/fshare_facbook.mp4">
    Open demo video in GitHub
  </a>
</p>

## Core Experience

- Multi-page storytelling flow: `Artist`, `Filmography`, and `Media`
- Motion-heavy UI powered by GSAP and scroll synchronization
- Filmography interaction where hover changes active preview media
- Immersive media scene using Three.js for visual depth
- Fixed top navigation and global transition system across routes
- Responsive behavior for desktop and mobile viewports

## Technology Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- GSAP + ScrollTrigger
- Three.js
- Lenis (smooth scrolling)

## Information Architecture

- `src/app/artist` - profile narrative and awards-focused content
- `src/app/filmography` - timeline and hover-driven preview experience
- `src/app/media` - interactive press/media visualization
- `src/components` - shared navigation, transitions, and page-level behavior
- `src/app/globals.css` - visual system and cross-page styling rules
- `public/assets` - brand images, fonts, and visual resources

## Interaction Design Notes

- Filmography preview state is data-driven from page-level content objects.
- Media page content is designed around dynamic cover datasets.
- Global transitions are managed through a dedicated transition layer component.
- Visual pacing relies on layered motion rather than static section switching.

## Data Source Notes

- Media/press content currently consumes a public Sanity query endpoint in `src/app/media/page.tsx`.
- Fallback content is included to keep the media experience functional when remote data is unavailable.

## Branding and Commercial Use

- The template is built for rebranding: content, color system, typography, assets, and copy can be replaced.
- For commercial use, replace all identity-specific media assets and brand text before publishing.
