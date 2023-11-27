'use client'
import { TypeAnimation } from 'react-type-animation'
import { AspectRatio } from './ui/aspect-ratio'
import { Button } from './ui/button'
import Link from 'next/link'

export function Introduction() {
  return (
    <div className="flex flex-col gap-6 justify-center items-center text-center lg:py-48 md:py-40 sm:py-32 py-8 px-12 sm:px-16 md:px-20 lg:px-24">
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
        omitDeletionAnimation={true}
        style={{
          fontSize: '1em',
          fontWeight: 700,
          display: 'inline-block',
        }}
      />
      <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
        <Link href="/login">
          <Button
            className="font-bold px-8 py-6 rounded-lg"
            variant={'outline'}
          >
            Login to your account!
          </Button>
        </Link>
        <Link href="/register">
          <Button
            className="font-bold px-8 py-6 rounded-lg"
            variant={'outline'}
          >
            Register to get started!
          </Button>
        </Link>
      </div>
    </div>
  )
}
