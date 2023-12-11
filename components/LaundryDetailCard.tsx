'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Role, Tags } from '@/lib/enum'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { AuthenticatedFetch } from '@/lib/request'
import {
  AvatarIcon,
  CalendarIcon,
  CircleIcon,
  StarFilledIcon,
} from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { PropsWithChildren, useEffect, useState } from 'react'
import { CreatePesananUI } from './CreatePesananUI'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useToast } from './ui/use-toast'
import { useAuthContext } from '@/lib/context'
import { JadwalOperasional } from '@/lib/types'

type Laundry = {
  userId: string
  name: string
  address: string
  deskripsi: string
  image: string
  rating: number
  ulasan: string[]
  tags: Tags[]
  jadwalOperasional: JadwalOperasional[]
}

export function LaundryDetailCard(
  props: PropsWithChildren<{
    id: string
  }>
) {
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { id } = props
  const router = useRouter()
  const { user } = useAuthContext()

  const [
    {
      userId: _,
      name,
      address,
      deskripsi,
      image,
      rating,
      ulasan,
      tags,
      jadwalOperasional,
    },
    setLaundry,
  ] = useState<Partial<Laundry>>({})

  useEffect(() => {
    setIsLoading(true)
    async function fetchLaundry() {
      try {
        const response = await AuthenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/database-pengelola-laundry/${id}`
        )
        const data = await response.json()

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
          const laundry = data.data

          setLaundry(laundry)
        }
      } catch (e) {
        if (typeof e === 'string') {
          e.toUpperCase()
          toast({
            title: 'Error',
            description: e,
          })
        } else if (e instanceof Error) {
          toast({
            title: 'Error',
            description: e.message,
          })
        }
      }
    }

    fetchLaundry()
    setIsLoading(false)
  }, [id, router, toast])

  const isBreakpoint = useMediaQuery(768)

  return (
    <div className="flex flex-col md:w-4/5 w-full mt-4 rounded-xl">
      <Card>
        <CardHeader className="grid sm:grid-cols-[1fr_120px] items-start gap-4 space-y-0">
          <div className="space-y-1 flex flex-col flex-wrap">
            {isLoading && (
              <div className="flex flex-row gap-4 items-center">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="w-full h-10 rounded-md" />
                  <Skeleton className="w-full h-4 rounded-md" />
                </div>
              </div>
            )}
            {!isLoading && (
              <>
                <div className="flex flex-row gap-4 items-center">
                  <Avatar className="sm:w-20 sm:h-20 h-16 w-16">
                    {image && (
                      <AvatarImage
                        src={image}
                        alt={name}
                        className="rounded-full"
                      />
                    )}
                    {image && (
                      <AvatarImage
                        src={'/assets/batman.png'}
                        alt="@LaundryEase"
                      />
                    )}
                    <AvatarFallback>
                      {name && name.slice(0, 2).toUpperCase()} +
                      {name && name.length > 3 && '..'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <CardTitle>{name}</CardTitle>
                    <CardDescription>
                      {address === null && 'No address'}
                      {address !== null && address}
                    </CardDescription>
                  </div>
                </div>
              </>
            )}
          </div>
          {isLoading && <Skeleton className="w-30 h-8 rounded-md" />}
          {user && user.role === Role.PELANGGAN && !isLoading && (
            <CreatePesananUI
              laundryId={id}
              isBreakpoint={isBreakpoint}
              isLoading={isLoading}
            />
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 justify-start">
            {isLoading && (
              <>
                <Skeleton className="w-20 h-10 rounded-md" />
                <Skeleton className="w-30 h-8 rounded-md" />
              </>
            )}

            {!isLoading && (
              <>
                <CardTitle>Description</CardTitle>
                <CardDescription>
                  {!deskripsi && 'No Description'}
                  {deskripsi && deskripsi}
                </CardDescription>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2 justify-start mt-6">
            {isLoading && (
              <>
                <Skeleton className="w-20 h-10 rounded-md" />
                <Skeleton className="w-30 h-8 rounded-md" />
              </>
            )}
            {!isLoading && (
              <>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>
                  {isLoading ? (
                    <Skeleton className="w-20 h-10 rounded-md" />
                  ) : ulasan && ulasan.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {ulasan.map((review, index) => (
                        <div
                          className="flex flex-row items-center gap-2 break-words"
                          key={`review_${index}`}
                        >
                          <AvatarIcon className="w-8 h-8" />
                          <p className="flex-1 overflow-wrap min-w-0">
                            {review}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    'No Reviews'
                  )}
                </CardDescription>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2 justify-start mt-6">
            {isLoading && (
              <>
                <Skeleton className="w-20 h-10 rounded-md" />
                <Skeleton className="w-30 h-30 rounded-md" />
              </>
            )}
            {!isLoading && (
              <>
                <CardTitle>Jadwal Operasional</CardTitle>
                <CardDescription>
                  {isLoading ? (
                    <Skeleton className="w-20 h-10 rounded-md" />
                  ) : jadwalOperasional && jadwalOperasional.length > 0 ? (
                    <span className="flex flex-col gap-2">
                      {jadwalOperasional.map((jadwal, index) => (
                        <span
                          className="flex flex-row items-center gap-2 break-words"
                          key={`jadwal_${index}`}
                        >
                          <CalendarIcon className="w-6 h-6" />
                          <span className="flex-1 overflow-wrap min-w-0">
                            {jadwal.hari} {jadwal.jamBuka} - {jadwal.jamTutup}
                          </span>
                        </span>
                      ))}
                    </span>
                  ) : (
                    'No Reviews'
                  )}
                </CardDescription>
              </>
            )}
          </div>
          <div className="flex space-x-4 text-sm text-muted-foreground mt-6">
            <div className="flex items-center gap-1">
              {isLoading && (
                <>
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="w-3 h-3 rounded-full" />
                </>
              )}
              {!isLoading && (
                <>
                  <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
                  {tags && tags.length == 0 && 'No tags'}
                  {tags &&
                    length > 0 &&
                    tags.map((tag, index) => (
                      <span key={tag}>
                        {tag.slice(0, 1) + tag.slice(1).toLowerCase()}
                        {index !== tags.length - 1 && ', '}
                      </span>
                    ))}
                </>
              )}
            </div>
            <div className="flex items-center text-yellow-500 gap-1">
              {isLoading && (
                <>
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="w-3 h-3 rounded-full" />
                </>
              )}
              {!isLoading && (
                <>
                  <StarFilledIcon className="mr-1 h-3 w-3" />
                  <span className="text-muted-foreground">
                    {rating?.toFixed(2)}
                  </span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
