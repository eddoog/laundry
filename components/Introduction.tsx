'use client'

import { useAuthContext } from '@/lib/context'
import Link from 'next/link'
import { TypeAnimation } from 'react-type-animation'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

export function Introduction() {
  const { user, loading } = useAuthContext()

  return (
    <div className="flex flex-col gap-4 md:gap-6 justify-center items-center text-center px-12 sm:px-16 md:px-20 lg:px-24 py-6">
      {loading && (
        <>
          <Skeleton className="h-8 sm:h-16 w-[210px] sm:w-[280px] md:w-[320px]" />
          <Skeleton className="h-10 sm:h-12 w-[240px] sm:w-[320px] md:w-[360px]" />
          <Skeleton className="h-5 sm:h-8 sm:w-[210px] md:w-[260px]" />
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <Skeleton className="h-8 sm:h-12 w-[180px] sm:w-[240px] md:w-[280px]" />
            <Skeleton className="h-8 sm:h-12 w-[180px] sm:w-[240px] md:w-[280px]" />
          </div>
        </>
      )}
      {!loading && (
        <>
          <h1 className="lg:text-5xl md:text-4xl sm:text-3xl text-2xl font-bold">
            LaundryEase
          </h1>
          <h3 className="lg:text-3xl md:text-2xl sm:text-xl text-lg font-bold">
            Your Favourite Laundry Management App!
          </h3>
          <TypeAnimation
            sequence={[
              'We will laundry your clothes!',
              1000,
              'We will laundry your shoes!',
              1000,
              'We will laundry your socks!',
              1000,
              'We will laundry your underwear!',
              1000,
              'We will laundry your bedsheets!',
              1000,
              'We will laundry your curtains!',
              1000,
              'We will laundry your bags!',
              1000,
              'We will manage your laundry!',
            ]}
            wrapper="span"
            cursor={false}
            repeat={Infinity}
            style={{
              fontSize: '1em',
              fontWeight: 700,
              display: 'inline-block',
            }}
          />
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            {!user && (
              <>
                <Link href="/login">
                  <Button
                    className="font-bold px-8 py-6 rounded-lg hover:scale-110 transition-transform ease-in-out duration-300"
                    variant={'outline'}
                  >
                    Login to your account!
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    className="font-bold px-8 py-6 rounded-lg hover:scale-110 transition-transform ease-in-out duration-300"
                    variant={'outline'}
                  >
                    Register to get started!
                  </Button>
                </Link>
              </>
            )}
            {user && (
              <Link href="/pesanan">
                <Button
                  className="font-bold px-8 py-6 rounded-lg hover:scale-110 transition-transform ease-in-out duration-300"
                  variant={'outline'}
                >
                  Pesanan Saya
                </Button>
              </Link>
            )}

            {user?.role === 'PELANGGAN' && (
              <>
                <Link href="/laundries">
                  <Button
                    className="font-bold px-8 py-6 rounded-lg hover:scale-110 transition-transform ease-in-out duration-300"
                    variant={'outline'}
                  >
                    Lihat Daftar Laundry
                  </Button>
                </Link>
              </>
            )}

            {user?.role === 'PENGELOLA_LAUNDRY' && (
              <>
                <Link href="/incomes">
                  <Button
                    className="font-bold px-8 py-6 rounded-lg hover:scale-110 transition-transform ease-in-out duration-300"
                    variant={'outline'}
                  >
                    Lihat Pemasukan
                  </Button>
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
