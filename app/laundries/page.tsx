'use client'

import { LaundryCard } from '@/components/LaundryCard'
import { FilterLaundry } from '@/components/FilterLaundry'
import { useToast } from '@/components/ui/use-toast'
import { Tags } from '@/lib/enum'
import { AuthenticatedFetch, AuthRequest } from '@/lib/request'
import { Response } from '@/lib/response'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthContext } from '@/lib/context/AuthProvider'

type Laundry = {
  userId: string
  name: string
  address: string
  rating: number
  tags: Tags[]
}

type FormValues = {
  keyword: string
  filters: string
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

  const handleSubmit = (event: any, keyword: string, selectedTags: string) => {
    event.preventDefault()
    filterLaundry(keyword, selectedTags)
  }

  async function filterLaundry(keyword: string, selectedTags: string) {
    if (!!!keyword) {
      keyword = ' '
    }

    if (!!!selectedTags) {
      selectedTags = ' '
    }

    const formValues: FormValues = {
      keyword: keyword,
      filters: selectedTags,
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/database-pengelola-laundry/filter`
    const res = await AuthenticatedFetch(url, {
      method: 'POST',
      body: JSON.stringify(formValues),
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await res.json()

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

  return (
    <>
      {loading && <Skeleton className="md:w-60 sm:w-50 w-40 h-8" />}
      {!loading && <FilterLaundry onSubmit={handleSubmit} />}
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
    </>
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
