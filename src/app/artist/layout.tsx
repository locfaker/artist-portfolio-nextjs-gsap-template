import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artist | Becky Entertainment',
};

export default function ArtistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
