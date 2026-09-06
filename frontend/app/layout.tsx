import './globals.css';
import React from 'react';

export const metadata = {
  title: 'LeadLens — AI-Assisted Lead Qualification & Prioritization',
  description: 'Turn raw B2B lead lists into an explainable, decision-ready priority queue.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
