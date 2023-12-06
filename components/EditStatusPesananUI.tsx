import { StatusPesanan } from '@/lib/enum'
import { AuthenticatedFetch } from '@/lib/request'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { useToast } from './ui/use-toast'

type FormValues = {
  harga: number
  berat: number
  status: StatusPesanan
}

export function EditStatusPesananUI(
  props: React.PropsWithChildren<{
    pesananId: string
    berat: number
    harga: number
    status: StatusPesanan
    isBreakpoint: boolean
    isLoading: boolean
    setPesanan: (berat: number, harga: number, status: StatusPesanan) => void
  }>
) {
  const {
    pesananId,
    berat,
    harga,
    status,
    isBreakpoint,
    isLoading,
    setPesanan,
  } = props
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      berat: berat,
      harga: harga,
      status: status,
    },
  })

  useEffect(() => {
    if (status == null) return

    setValue('berat', berat)
    setValue('harga', harga)
    setValue('status', status)
  }, [berat, harga, status, setValue])

  async function onSubmit(data: FormValues) {
    if (!data.berat) {
      setError('berat', {
        message: 'Berat tidak boleh kosong!',
      })
    }

    if (!data.harga) {
      setError('harga', {
        message: 'Harga tidak boleh kosong!',
      })
    }

    if (!data.status) {
      setError('status', {
        message: 'Status tidak boleh kosong!',
      })
    }

    if (data.berat < 0) {
      setError('berat', {
        message: 'Berat tidak boleh negatif!',
      })
    }

    if (data.harga < 0) {
      setError('harga', {
        message: 'Harga tidak boleh negatif!',
      })
    }

    if (Object.keys(errors).length > 0 || (!data.berat && !data.harga)) {
      toast({
        title: 'Error',
        description: 'Terdapat error pada form! Coba lengkapi!',
      })
      return
    }

    if (berat == data.berat && harga == data.harga && status == data.status) {
      toast({
        title: 'Error',
        description: 'Tidak ada perubahan!',
      })
      return
    }

    let res
    if (berat != data.berat || harga != data.harga) {
      res = await updatePesanan(data.berat, data.harga)
    } else if (status != data.status) {
      res = await updateStatusPesanan(data.status)
    }

    if (res) {
      const data = await res.json()

      if (data.statusCode >= 400) {
        toast({
          title: 'Error',
          description: data.message,
        })
      } else {
        console.log(data)
        updateStatePesanan(data.data.berat, data.data.harga, data.data.status)

        toast({
          title: 'Success',
          description: data.message,
        })
      }
    }
  }

  async function updateStatusPesanan(statusPesanan: StatusPesanan) {
    const body = {
      idPesanan: pesananId,
      status: statusPesanan,
    }

    return await AuthenticatedFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pengelola-laundry/edit-status-pesanan`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  async function updatePesanan(berat: number, harga: number) {
    const body = {
      idPesanan: pesananId,
      berat: berat,
      harga: harga,
    }

    return await AuthenticatedFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pengelola-laundry/edit-pesanan`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  async function updateStatePesanan(
    berat: number,
    harga: number,
    status: StatusPesanan
  ) {
    setPesanan(berat, harga, status)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {!isLoading && (
          <Button variant="secondary" className="flex-wrap">
            Edit Pesanan
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side={isBreakpoint ? 'bottom' : 'right'}
        onSubmit={handleSubmit(onSubmit)}
      >
        <SheetHeader>
          <SheetTitle>Edit Pesanan</SheetTitle>
          <SheetDescription>
            Isi input-input berikut untuk mengedit pesanan.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid md:grid-cols-1 items-center gap-4">
            <Label htmlFor="berat" className="text-start">
              Berat
            </Label>
            <Input
              id="berat"
              type="number"
              placeholder="Berat (kg)"
              {...register('berat', {
                valueAsNumber: true,
                validate: (berat) => {
                  if (berat < 0) {
                    return 'Berat tidak boleh negatif!'
                  }
                  return true
                },
                required: {
                  value: true,
                  message: 'Berat tidak boleh kosong!',
                },
              })}
              onChange={() => {
                clearErrors('berat')
              }}
            />{' '}
            {errors.berat && (
              <span className="md:text-base text-sm text-destructive">
                {errors.berat.message}
              </span>
            )}
            <Label htmlFor="harga" className="text-start">
              Harga
            </Label>
            <Input
              id="harga"
              type="number"
              placeholder="Harga (Rp)"
              {...register('harga', {
                valueAsNumber: true,
                validate: (harga) => {
                  if (harga < 0) {
                    return 'Harga tidak boleh negatif!'
                  }
                  return true
                },
                required: {
                  value: true,
                  message: 'Harga tidak boleh kosong!',
                },
              })}
              onChange={() => {
                clearErrors('harga')
              }}
            />{' '}
            {errors.harga && (
              <span className="md:text-base text-sm text-destructive">
                {errors.harga.message}
              </span>
            )}
            <Label htmlFor="status" className="text-start">
              Status
            </Label>
            <Select
              value={watch('status')}
              onValueChange={(status) => {
                const statusPesanan: StatusPesanan =
                  StatusPesanan[status as keyof typeof StatusPesanan]
                setValue('status', statusPesanan)
              }}
            >
              <SelectTrigger className="w-full" id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MENUNGGU_KONFIRMASI">
                  Menunggu Konfirmasi
                </SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="DIPROSES">Diproses</SelectItem>
                <SelectItem value="DIKIRIM">Dikirim</SelectItem>
                <SelectItem value="SELESAI">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              variant={'secondary'}
              type="button"
              onClick={() => {
                onSubmit(watch())
              }}
            >
              Edit!
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
