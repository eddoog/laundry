import React, { useState } from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from './ui/sheet'
import { Textarea } from './ui/textarea'
import { useToast } from './ui/use-toast'
import { useRouter, usePathname } from 'next/navigation'
import { AuthenticatedFetch } from '@/lib/request'
import Box from '@mui/material/Box'
import Rating from './ui/rating'

interface PenilaianState {
  rating: number
  ulasan: string
}

export function CreatePenilaianUI(
  props: React.PropsWithChildren<{
    laundryId: string
    isBreakpoint: boolean
    isLoading: boolean
  }>
) {
  const { laundryId, isBreakpoint, isLoading } = props
  const [penilaian, setPenilaian] = useState<PenilaianState>({
    rating: 0,
    ulasan: '',
  })
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()

  async function onSubmit() {
    if (penilaian.rating === 0) {
      toast({
        title: 'Error',
        description: 'Rating tidak boleh kosong',
      })
      return
    }

    if (penilaian.ulasan.length > 255) {
      toast({
        title: 'Error',
        description: 'Ulasan terlalu panjang (max 255 karakter)',
      })
      return
    }

    const body = {
      ...penilaian,
      idPengelolaLaundry: laundryId,
    }

    try {
      const res = await AuthenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pengelola-laundry/create-penilaian`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )

      const data = await res.json()

      if (data.statusCode != 201) {
        toast({
          title: 'Error',
          description: data.message,
        })
      } else {
        toast({
          title: 'Success',
          description: 'Penilaian berhasil dibuat',
        })
        router.push(pathname)
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        {!isLoading && <Button variant="secondary">Berikan Penilaian</Button>}
      </SheetTrigger>
      <SheetContent side={isBreakpoint ? 'bottom' : 'right'}>
        <SheetHeader>
          <SheetTitle>Berikan Penilaian</SheetTitle>
          <SheetDescription>
            Isi formulir berikut untuk membuat penilaian
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 p-4">
          <div>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Label style={{ marginRight: 'auto' }}>Rating</Label>
              <Rating
                rating={penilaian.rating}
                setRating={(newRating: number | null) => {
                  setPenilaian((prevPenilaian) => ({
                    ...prevPenilaian,
                    rating: newRating ?? 0,
                  }))
                }}
              />
            </Box>
          </div>
          <div>
            <Label htmlFor="ulasan">Ulasan</Label>
            <Textarea
              id="ulasan"
              maxLength={255}
              value={penilaian.ulasan}
              onChange={(e) =>
                setPenilaian({ ...penilaian, ulasan: e.target.value })
              }
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            {!isLoading && (
              <Button variant="secondary" onClick={onSubmit}>
                Submit
              </Button>
            )}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
