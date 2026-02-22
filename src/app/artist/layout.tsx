import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artist',
  description:
    'Artist profile with biography, achievements, and brand collaborations from Becky Entertainment.',
  keywords: [
    'artist profile',
    'becky entertainment artist',
    'becky armstrong biography',
    '#Artist',
    '#BeckyEntertainment',
  ],
  alternates: {
    canonical: '/artist',
  },
  openGraph: {
    title: 'Artist | Becky Entertainment',
    description:
      'Artist profile with biography, achievements, and brand collaborations from Becky Entertainment.',
    url: '/artist',
    images: ['/assets/images/artist_hero.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artist | Becky Entertainment',
    description:
      'Artist profile with biography, achievements, and brand collaborations from Becky Entertainment.',
    images: ['/assets/images/artist_hero.jpg'],
  },
};

export default function ArtistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
