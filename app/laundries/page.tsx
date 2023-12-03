'use client'

import { LaundryCard } from '@/components/LaundryCard'
import { useToast } from '@/components/ui/use-toast'
import { Tags } from '@/lib/enum'
import { AuthenticatedFetch } from '@/lib/request'
import { Response } from '@/lib/response'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'

type Laundry = {
  userId: string
  name: string
  address: string
  rating: number
  tags: Tags[]
}

export default function Laundries() {
  const router = useRouter()
  const [laundries, setLaundries] = useState<Laundry[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    setLoading(true)
    async function fetchLaundries() {
      const res = await AuthenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/database-pengelola-laundry`
      )
      const data: Response = await res.json()

      if (data.statusCode === 401 || data.statusCode === 403) {
        router.push('/login')
        toast({
          title: 'Error',
          description: 'Silahkan login terlebih dahulu',
          duration: 3000,
        })
      } else if (data.statusCode >= 400) {
        toast({
          title: 'Error',
          description: data.message,
          duration: 3000,
        })
      } else {
        const laundries = data.data

        setLaundries(laundries)
      }
    }

    fetchLaundries()
    setLoading(false)
  }, [router, toast])

  return (
    <Container>
      {loading && (
        <>
          <LaundryCard isLoading={loading} />
          <LaundryCard isLoading={loading} />
          <LaundryCard isLoading={loading} />
        </>
      )}
      {!loading && laundries.length === 0 && (
        <h2 className="text-center text-gray-500 lg:text-4xl md:text-3xl sm:text-2xl text-xl">
          Tidak ada laundry
        </h2>
      )}
      {!loading &&
        laundries.length > 0 &&
        laundries.map((laundry) => {
          return (
            <Fragment key={laundry.userId}>
              <LaundryCard
                userId={laundry.userId}
                name={laundry.name}
                address={laundry.address}
                rating={laundry.rating}
                tags={laundry.tags}
                isLoading={loading}
              />
            </Fragment>
          )
        })}
    </Container>
  )
}

function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'grid lg:grid-cols-2 xl:grid-cols-3 grid-cols-1 items-center justify-around flex-wrap gap-8 sm:px-4 md:px-8 lg:px-12 py-6',
        className
      )}
      {...props}
    />
  )
}
