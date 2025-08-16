import './globals.css'
import type { Metadata } from 'next'
import { Ubuntu } from 'next/font/google'
const ubuntu = Ubuntu({ subsets:['latin'], weight:['300','400','500','700'], variable:'--font-ubuntu', display:'swap' })
export const metadata: Metadata = { title:'Niskarsh • Portfolio OS', description:'Ubuntu-themed portfolio desktop in your browser.' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className={`${ubuntu.variable} font-ubuntu bg-ubuntu-aubergine text-white`}>{children}</body></html>)
}
