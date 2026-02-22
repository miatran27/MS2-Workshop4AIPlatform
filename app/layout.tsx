import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PantryAI – Recipe suggestions from your pantry',
  description: 'Upload a photo of your ingredients and get AI-generated recipe suggestions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
