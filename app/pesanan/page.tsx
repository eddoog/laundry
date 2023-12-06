'use client'

import { PesananCard } from '@/components/PesananCard'
import { useToast } from '@/components/ui/use-toast'
import { useAuthContext } from '@/lib/context'
import { Role } from '@/lib/enum'
import { AuthenticatedFetch } from '@/lib/request'
import { Response } from '@/lib/response'
import { Pesanan } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'

type PesananWithName = Pesanan & {
  name: string
}

export default function MyPesanan() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [listPesanan, setListPesanan] = useState<PesananWithName[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    setLoading(true)
    async function fetchLaundries() {
      const res = await AuthenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/daftar-pesanan`
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
        const listPesanan = data.data

        setListPesanan(listPesanan)
      }
    }

    fetchLaundries()
    setLoading(false)
  }, [router, toast])

  return (
    <Container>
      {loading && (
        <>
          <PesananCard isLoading={loading} />
          <PesananCard isLoading={loading} />
          <PesananCard isLoading={loading} />
        </>
      )}
      {!loading && listPesanan.length === 0 && (
        <h2 className="text-center text-gray-500 lg:text-4xl md:text-3xl sm:text-2xl text-xl">
          Tidak ada pesanan
        </h2>
      )}
      {!loading &&
        listPesanan.length > 0 &&
        listPesanan.map((pesanan) => {
          return (
            <Fragment key={pesanan.id}>
              <PesananCard
                idPesanan={pesanan.id}
                name={
                  user && user.role == Role.PELANGGAN
                    ? pesanan.name + ' Laundry'
                    : pesanan.name + "'s Order"
                }
                berat={pesanan.berat}
                harga={pesanan.harga}
                status={pesanan.status}
                waktuPesanan={pesanan.waktuPesanan}
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
