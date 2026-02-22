import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Filmography',
  description:
    'Filmography timeline with featured works and hover-based preview transitions by Becky Entertainment.',
  keywords: [
    'filmography',
    'becky entertainment movies',
    'project timeline',
    '#Filmography',
    '#BeckyEntertainment',
  ],
  alternates: {
    canonical: '/filmography',
  },
  openGraph: {
    title: 'Filmography | Becky Entertainment',
    description:
      'Filmography timeline with featured works and hover-based preview transitions by Becky Entertainment.',
    url: '/filmography',
    images: ['/assets/images/filmography_hero.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Filmography | Becky Entertainment',
    description:
      'Filmography timeline with featured works and hover-based preview transitions by Becky Entertainment.',
    images: ['/assets/images/filmography_hero.jpg'],
  },
};

export default function FilmographyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
