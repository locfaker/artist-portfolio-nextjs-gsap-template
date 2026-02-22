import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Filmography | Becky Entertainment',
};

export default function FilmographyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
