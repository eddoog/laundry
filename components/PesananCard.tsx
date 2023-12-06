'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { StatusPesanan } from '@/lib/enum'
import {
  BackpackIcon,
  ChevronDownIcon,
  CrumpledPaperIcon,
  MixIcon,
  RocketIcon,
} from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { Progress } from './ui/progress'
import { Skeleton } from './ui/skeleton'

export function PesananCard({ ...props }) {
  const router = useRouter()

  const { idPesanan, name, berat, harga, status, waktuPesanan, isLoading } =
    props as {
      idPesanan: string
      name: string
      berat?: number
      harga?: number
      status: StatusPesanan
      waktuPesanan: Date
      isLoading: boolean
    }

  function decideValue(status: StatusPesanan) {
    switch (status) {
      case StatusPesanan.PENDING:
        return 25
      case StatusPesanan.DIPROSES:
        return 50
      case StatusPesanan.DIKIRIM:
        return 75
      case StatusPesanan.SELESAI:
        return 100
      default:
        return 0
    }
  }

  return (
    <Card
      className="cursor-pointer hover:scale-105 transition-transform ease-in-out duration-300"
      onClick={() => {
        if (isLoading && idPesanan) return
        router.push('/pesanan/' + idPesanan)
      }}
    >
      <CardHeader className="grid sm:grid-cols-[1fr_120px] items-start gap-4 space-y-0">
        <div className="space-y-1 flex flex-col flex-wrap">
          {isLoading && (
            <>
              <Skeleton className="w-24 h-4 rounded-md" />
              <Skeleton className="w-40 h-4 rounded-md" />
            </>
          )}
          {!isLoading && (
            <>
              <CardTitle>{name}</CardTitle>
              <CardDescription>
                {new Date(waktuPesanan).toDateString()}
              </CardDescription>
            </>
          )}
        </div>
        {isLoading && <Skeleton className="md:h-8 sm:h-6 h-4 w-full" />}

        {!isLoading && (
          <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground justify-between sm:justify-start">
            <Button variant="secondary" className="px-3 shadow-none">
              <MixIcon className="mr-2 h-4 w-4" />
              Action
            </Button>
            <Separator orientation="vertical" className="h-[20px]" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="px-2 shadow-none">
                  <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                alignOffset={-5}
                className="w-[200px]"
                forceMount
              >
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  onClick={() => {
                    if (isLoading && idPesanan) return
                    router.push('/pesanan/' + idPesanan)
                  }}
                >
                  See Details
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-4 text-sm text-muted-foreground">
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
                <BackpackIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
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
                <CrumpledPaperIcon className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{harga ? `Rp.${harga}` : 'To Be Announced'}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isLoading && (
            <>
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="w-full h-3 rounded-full" />
            </>
          )}
          {!isLoading && (
            <>
              <RocketIcon className="h-4 w-4 text-primary" />
              <Progress value={decideValue(status)} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
