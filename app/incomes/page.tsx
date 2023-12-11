'use client'

import { toast } from '@/components/ui/use-toast'
import { AuthenticatedFetch } from '@/lib/request'
import { Response } from '@/lib/response'
import { Pemasukan } from '@/lib/types'
import { useRouter } from 'next/navigation'
import React, { Fragment, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Legend,
  Bar,
} from 'recharts'
import { DayPicker } from 'react-day-picker'
import { formLabelClasses } from '@mui/material'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { setMonth } from 'date-fns'

type DataGraf = {
  name: string
  tanggal: number
}

type FormDate = {
  bulan: number
  tahun: number
}

export default function Income() {
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const router = useRouter()
  const [dataGraf, setDataGraf] = useState<DataGraf[]>([])
  const [totalNominal, setTotalNominal] = React.useState<number>()

  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1999 }, (_, i) =>
    String(i + 2000)
  )

  const aggregatePemasukanByDate = (data: Pemasukan[]): DataGraf[] => {
    const aggregatedData: Record<string, number> = {}

    // Get the current date
    const currentDate = new Date()

    // Use reduce to aggregate data by date
    data.forEach((entry) => {
      const entryDate = new Date(entry.Date)

      // Check if the entry date is in the current month
      if (
        entryDate.getMonth() === currentDate.getMonth() &&
        entryDate.getFullYear() === currentDate.getFullYear()
      ) {
        const day = entryDate.getDate().toString()

        if (aggregatedData[day] === undefined) {
          aggregatedData[day] = 0
        }
        aggregatedData[day] += entry.nominal
      }
    })

    // Get all dates in the current month
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate()

    const allDatesInMonth = Array.from({ length: daysInMonth }, (_, index) =>
      (index + 1).toString()
    )

    // Fill in missing dates with zero
    allDatesInMonth.forEach((date) => {
      if (aggregatedData[date] === undefined) {
        aggregatedData[date] = 0
      }
    })

    // Convert the aggregated data to an array of objects
    const result: DataGraf[] = Object.entries(aggregatedData).map(
      ([name, tanggal]) => ({
        name,
        tanggal,
      })
    )

    return result
  }

  useEffect(() => {
    setLoading(true)
    async function fetchPemasukan() {
      const formDate: FormDate = {
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
      }

      // Construct the URL with query parameters
      const url = `${process.env.NEXT_PUBLIC_API_URL}/pengelola-laundry/get-total-pemasukan`

      console.log('Constructed URL:', url)

      // Make the GET request
      const res = await AuthenticatedFetch(url, {
        method: 'POST',
        body: JSON.stringify(formDate),
        headers: { 'Content-Type': 'application/json' },
      })

      const data: Response = await res.json()
      console.log(data.data)

      if (data.statusCode === 401 || data.statusCode === 403) {
        router.push('/login')
        toast({
          title: 'Error',
          description: 'Silahkan login terlebih dahulu',
          duration: 3000,
        })
      } else if (data.statusCode >= 400) {
        toast({ title: 'Error', description: data.message, duration: 3000 })
      } else {
        const pemasukanNew = data.data.pemasukanList
        const aggregated = await aggregatePemasukanByDate(pemasukanNew)
        const totalNominal = data.data.totalPemasukan

        setDataGraf(aggregated)
        setTotalNominal(totalNominal)
        setMonth(new Date().getMonth() + 1)
        setYear(new Date().getFullYear())
      }
    }

    fetchPemasukan()
    setLoading(false)
  }, [router])

  const handleSubmit = (event: any, month: number, year: number) => {
    event.preventDefault()
    getPemasukan(month, year)
  }

  async function getPemasukan(month: number, year: number) {
    if (!!!month) {
      month = new Date().getMonth() + 1
    }

    if (!!!year) {
      year = new Date().getFullYear()
    }

    const formDate: FormDate = {
      bulan: month,
      tahun: year,
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/pengelola-laundry/get-total-pemasukan`

    console.log('Constructed URL:', url)

    // Make the GET request
    const res = await AuthenticatedFetch(url, {
      method: 'POST',
      body: JSON.stringify(formDate),
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
      const aggregated = await aggregatePemasukanByDate(data.data.pemasukanList)
      const totalNominal = data.data.totalPemasukan
      setDataGraf(aggregated)
      setTotalNominal(totalNominal)
      setMonth(month)
      setYear(year)
    }
  }

  return (
    <div className="flex-auto flex-col flex justify-center mt-2">
      <div className="flex-row flex h-10 py-2 items-center place-content-between ">
        <div>
          <div>
            <Label htmlFor="totalNominal" className="text-start">
              Total Nominal: {totalNominal}
            </Label>
          </div>
        </div>
      </div>
      <div>
        <BarChart width={1000} height={250} data={dataGraf}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="tanggal" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </div>
    </div>
  )
}
