import { Menu } from '@/components/Menu'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LaundryEase',
  description: 'Your Favourite Laundry Management Web Application!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={
          inter.className + ' relative min-h-screen w-full bg-[#181818]'
        }
      >
        <div className="flex flex-col items-center relative min-h-screen py-3 px-8">
          <Menu />
          {children}
        </div>
        <Image
          className="fixed z-[-1] top-0 left-0 w-full h-full opacity-50"
          src={'/assets/bg-purple.svg'}
          priority={false}
          alt="bg"
          fill
        />
        <Toaster />
      </body>
    </html>
  )
}
