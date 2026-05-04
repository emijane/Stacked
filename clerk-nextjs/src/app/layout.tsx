import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import './globals.css'

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://overclock.lol'),
  title: {
    default: 'overclock.lol | Find Better Overwatch Teammates',
    template: '%s | overclock.lol',
  },
  description:
    'No more randoms. No more wasted games. Find Overwatch players who match your skill, role, and mindset.',
  applicationName: 'overclock.lol',
  keywords: [
    'Overwatch',
    'Overwatch 2',
    'teammates',
    'LFG',
    'duo finder',
    'ranked teammates',
    'gaming community',
    'overclock.lol',
  ],
  authors: [{ name: 'emi', url: 'https://x.com/pcexplodes' }],
  creator: 'emi',
  publisher: 'overclock.lol',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://overclock.lol',
    siteName: 'overclock.lol',
    title: 'overclock.lol | Find Better Overwatch Teammates',
    description:
      'No more randoms. No more wasted games. Find Overwatch players who match your skill, role, and mindset.',
    images: [
      {
        url: '/kitty-red-cross-white-border.png',
        width: 512,
        height: 512,
        alt: 'overclock.lol logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'overclock.lol | Find Better Overwatch Teammates',
    description:
      'No more randoms. No more wasted games. Find Overwatch players who match your skill, role, and mindset.',
    creator: '@pcexplodes',
    images: ['/kitty-red-cross-white-border.png'],
  },
  icons: {
    icon: [
      { url: '/kitty-red-cross-white-border.png', type: 'image/png' },
    ],
    shortcut: ['/kitty-red-cross-white-border.png'],
    apple: [{ url: '/kitty-red-cross-white-border.png' }],
  },
  category: 'gaming',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
