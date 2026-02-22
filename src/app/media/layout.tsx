import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Media | Becky Entertainment',
};

export default function MediaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
