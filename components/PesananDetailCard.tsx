'use client'
import { useAuthContext } from '@/lib/context'
import { Role, StatusPesanan } from '@/lib/enum'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { AuthenticatedFetch } from '@/lib/request'
import { Pesanan } from '@/lib/types'
import {
  AvatarIcon,
  BackpackIcon,
  CalendarIcon,
  CrumpledPaperIcon,
  RocketIcon,
} from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { PropsWithChildren, useEffect, useState } from 'react'
import { EditStatusPesananUI } from './EditStatusPesananUI'
import { CreatePenilaianUI } from './CreatePenilaianUI'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Skeleton } from './ui/skeleton'
import { useToast } from './ui/use-toast'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Terminal } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog'

type PesananWithNames = Pesanan & {
  pengelolaLaundryName: string
  pelangganName: string
}

export function PesananDetailCard(
  props: PropsWithChildren<{
    pesananId: string
  }>
) {
  const { user } = useAuthContext()
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { pesananId } = props
  const router = useRouter()

  const [
    {
      id,
      berat,
      harga,
      pelangganName,
      pengelolaLaundryName,
      status,
      waktuPenyelesaian,
      waktuPesanan,
      pengelolaLaundryId,
    },
    setPesanan,
  ] = useState<Partial<PesananWithNames>>({})

  useEffect(() => {
    setIsLoading(true)
    async function fetchPesananById() {
      try {
        const response = await AuthenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/detail-pesanan/${pesananId}`
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
          const pesanan = data.data

          setPesanan(pesanan)
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

    fetchPesananById()
    setIsLoading(false)
  }, [pesananId, router, toast])

  function changeStatusPesananIntoString(status: StatusPesanan) {
    switch (status) {
      case StatusPesanan.MENUNGGU_KONFIRMASI:
        return 'Menunggu Konfirmasi'
      case StatusPesanan.PENDING:
        return 'Pending'
      case StatusPesanan.DIPROSES:
        return 'Diproses'
      case StatusPesanan.DIKIRIM:
        return 'Dikirim'
      case StatusPesanan.SELESAI:
        return 'Selesai'
    }
  }

  function setPesananAfterFetch(
    berat: number,
    harga: number,
    status: StatusPesanan
  ) {
    setPesanan((prev) => {
      return {
        ...prev,
        berat: berat,
        harga: harga,
        status: status,
      }
    })
  }

  async function cancelPesanan() {
    try {
      const res = await AuthenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pelanggan/cancel-pesanan`,
        {
          method: 'DELETE',
          body: JSON.stringify({
            idPesanan: pesananId,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await res.json()

      if (data.statusCode >= 400) {
        toast({
          title: 'Error',
          description: 'Gagal membatalkan pesanan',
        })
      } else {
        router.push('/pesanan')
        toast({
          title: 'Success',
          description: 'Berhasil membatalkan pesanan',
        })
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

  const isBreakpoint = useMediaQuery(768)

  return (
    <div className="flex flex-col md:w-4/5 w-full mt-4 rounded-xl gap-4 sm:gap-6">
      {isLoading && <Skeleton className="w-full h-16 rounded-md" />}
      {!isLoading && (
        <>
          {user?.role == Role.PELANGGAN &&
            status == StatusPesanan.MENUNGGU_KONFIRMASI && (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Tips!</AlertTitle>
                <AlertDescription>
                  Karena pesanan anda masih dalam tahap menunggu konfirmasi,
                  anda dapat membatalkan pesanan anda.
                </AlertDescription>
              </Alert>
            )}
        </>
      )}
      <Card>
        <CardHeader className="grid sm:grid-cols-[1fr_120px] items-start gap-4 space-y-0">
          <div className="space-y-1 flex flex-col flex-wrap">
            {isLoading && (
              <div className="flex flex-row gap-4 items-center">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-30 h-10 rounded-md" />
                  <Skeleton className="w-40 h-4 rounded-md" />
                </div>
              </div>
            )}
            {!isLoading && (
              <>
                <div className="flex flex-col gap-2">
                  <CardTitle>
                    {user?.role == Role.PELANGGAN
                      ? `${pengelolaLaundryName} Laundry`
                      : `${pelangganName}'s Order`}
                  </CardTitle>
                  <CardDescription className="flex flex-row gap-2 items-center">
                    <RocketIcon className="w-5 h-5" />
                    {changeStatusPesananIntoString(status!)}
                  </CardDescription>
                </div>
              </>
            )}
          </div>
          {isLoading && <Skeleton className="w-30 h-8 rounded-md" />}
          {!isLoading && (
            <>
              {user?.role == Role.PELANGGAN ? (
                <>
                  {status === StatusPesanan.SELESAI && (
                    <CreatePenilaianUI
                      laundryId={pengelolaLaundryId!}
                      isBreakpoint={isBreakpoint}
                      isLoading={isLoading}
                    />
                  )}
                  {status && status == StatusPesanan.MENUNGGU_KONFIRMASI && (
                    <AlertDialog>
                      <AlertDialogTrigger className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg">
                        Cancel Pesanan
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Apakah anda yakin?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Aksi ini tidak dapat diurungkan. Pesanan anda akan
                            secara permanen dihapus dari server kami.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              cancelPesanan()
                            }}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </>
              ) : (
                <EditStatusPesananUI
                  pesananId={id!}
                  harga={harga!}
                  berat={berat!}
                  status={status!}
                  isBreakpoint={isBreakpoint}
                  isLoading={isLoading}
                  setPesanan={setPesananAfterFetch}
                />
              )}
            </>
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
                <CardTitle>Waktu Pesanan</CardTitle>
                <CardDescription>
                  <span className="flex flex-row gap-2 items-center">
                    <CalendarIcon className="w-5 h-5" />
                    <span>
                      {!waktuPesanan && 'No Waktu Penyelesaian'}
                      {waktuPesanan && new Date(waktuPesanan).toUTCString()}
                    </span>
                  </span>
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
                <CardTitle>Waktu Penyelesaian</CardTitle>
                <CardDescription>
                  <span className="flex flex-row gap-2 items-center">
                    <CalendarIcon className="w-5 h-5" />
                    <span>
                      {!waktuPenyelesaian && 'No Waktu Penyelesaian'}
                      {waktuPenyelesaian &&
                        new Date(waktuPenyelesaian).toUTCString()}
                    </span>
                  </span>
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
                <CardTitle>Pelanggan</CardTitle>
                <CardDescription>
                  <span className="flex flex-row gap-2 items-center">
                    <AvatarIcon className="w-5 h-5" />
                    <span>
                      {!pelangganName && 'Pelanggan name is not known'}
                      {pelangganName &&
                        pelangganName.slice(0, 1).toUpperCase() +
                          pelangganName.slice(1)}
                    </span>
                  </span>
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
                <CardTitle>Pengelola Laundry</CardTitle>
                <CardDescription>
                  <span className="flex flex-row gap-2 items-center">
                    <AvatarIcon className="w-5 h-5" />
                    <span>
                      {!pengelolaLaundryName &&
                        'Pengelola Laundry name is not known'}
                      {pengelolaLaundryName &&
                        pengelolaLaundryName.slice(0, 1).toUpperCase() +
                          pengelolaLaundryName.slice(1)}
                    </span>
                  </span>
                </CardDescription>
              </>
            )}
          </div>
          <div className="flex space-x-4 text-sm text-muted-foreground mt-8">
            <div className="flex items-center space-x-1">
              {isLoading && (
                <>
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="w-3 h-3 rounded-full" />
                </>
              )}
              {!isLoading && (
                <>
                  <BackpackIcon className="mr-1 h-5 w-5 fill-sky-400 text-sky-400" />
                  <span>{berat ? `${berat} kg` : 'To Be Announced'}</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-1">
              {isLoading && (
                <>
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="w-3 h-3 rounded-full" />
                </>
              )}
              {!isLoading && (
                <>
                  <CrumpledPaperIcon className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span>{harga ? `Rp.${harga}` : 'To Be Announced'}</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
