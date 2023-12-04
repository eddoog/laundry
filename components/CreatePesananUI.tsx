import React from 'react'
import { cn } from '@/lib/utils'
import { CalendarIcon } from '@radix-ui/react-icons'
import { addDays, format } from 'date-fns'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Label } from './ui/label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
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
import { AuthenticatedFetch } from '@/lib/request'
import { useToast } from './ui/use-toast'
import { Skeleton } from './ui/skeleton'

export function CreatePesananUI(
  props: React.PropsWithChildren<{
    laundryId: string
    isBreakpoint: boolean
    isLoading: boolean
  }>
) {
  const { laundryId, isBreakpoint, isLoading } = props
  const [date, setDate] = React.useState<Date>()
  const { toast } = useToast()

  async function onSubmit() {
    const body = {
      idPengelolaLaundry: laundryId,
      waktuPenyelesaian: date?.toISOString(),
    }

    try {
      const res = await AuthenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pelanggan/create-pesanan`,
        {
          body: JSON.stringify(body),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await res.json()

      if (data.statusCode != 200) {
        toast({
          title: 'Error',
          description: data.message,
        })
      }

      console.log(data)
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
        {!isLoading && (
          <Button variant="secondary" className="flex-wrap">
            Create Pesanan
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side={isBreakpoint ? 'bottom' : 'right'}>
        <SheetHeader>
          <SheetTitle>Create Pesanan</SheetTitle>
          <SheetDescription>
            Isi input-input berikut untuk membuat pesanan.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid md:grid-cols-1 items-center gap-4">
            <Label htmlFor="waktu" className="text-start">
              Waktu Penyelesaian
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[280px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                <Select
                  onValueChange={(value: string) =>
                    setDate(addDays(new Date(), parseInt(value)))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="0">Today</SelectItem>
                    <SelectItem value="1">Tomorrow</SelectItem>
                    <SelectItem value="3">In 3 days</SelectItem>
                    <SelectItem value="7">In a week</SelectItem>
                  </SelectContent>
                </Select>
                <div className="rounded-md border">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </div>
              </PopoverContent>
            </Popover>{' '}
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant={'secondary'} type="submit" onClick={onSubmit}>
              Create!
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
