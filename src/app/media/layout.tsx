import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Media',
  description:
    'Press and media showcase with 3D globe covers, dynamic transitions, and interactive browsing.',
  keywords: [
    'press media',
    '3d globe portfolio',
    'becky entertainment media',
    '#PressMedia',
    '#BeckyEntertainment',
  ],
  alternates: {
    canonical: '/media',
  },
  openGraph: {
    title: 'Media | Becky Entertainment',
    description:
      'Press and media showcase with 3D globe covers, dynamic transitions, and interactive browsing.',
    url: '/media',
    images: ['/assets/images/becky_hero.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Media | Becky Entertainment',
    description:
      'Press and media showcase with 3D globe covers, dynamic transitions, and interactive browsing.',
    images: ['/assets/images/becky_hero.webp'],
  },
};

export default function MediaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
