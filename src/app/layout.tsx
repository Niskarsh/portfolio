import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Ubuntu } from 'next/font/google'
import ThemeProvider from '@/components/Theme/ThemeProvider'

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300','400','500','700'],
  variable: '--font-ubuntu',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Niskarsh • Portfolio OS',
  description: 'Ubuntu-style portfolio desktop'
}

export default function RootLayout({ children }:{ children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ubuntu.variable} font-ubuntu`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
