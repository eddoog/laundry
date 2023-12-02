import { Introduction } from '@/components/Introduction'
import { useAuthContext } from '@/lib/context'
import { User } from '@/lib/types'
import { getCookie } from 'cookies-next'
import { GetServerSideProps } from 'next'
import { cookies } from 'next/headers'
import React from 'react'

export default function Home() {
  return (
    <div className="flex-1 flex flex-col justify-around items-center gap-8">
      <Introduction />
      <div className="h-[70px] md:hidden"></div>
    </div>
  )
}
