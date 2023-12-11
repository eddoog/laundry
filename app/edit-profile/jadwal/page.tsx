'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useAuthContext } from '@/lib/context'
import { AuthenticatedFetch } from '@/lib/request'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

import { Switch } from '@/components/ui/switch'
import { Days } from '@/lib/enum'
import { TimePicker } from 'antd'
import dayjs, { Dayjs } from 'dayjs'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function EditJadwal() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { user } = useAuthContext()
  const { toast } = useToast()
  const router = useRouter()

  const inisialJadwal = [
    {
      isFromUser: true,
      isOpen: false,
      jamBuka: '00:00',
      jamTutup: '00:00',
      hari: Days.SENIN,
    },
    {
      isFromUser: true,
      isOpen: false,
      jamBuka: '00:00',
      jamTutup: '00:00',
      hari: Days.SELASA,
    },
    {
      isFromUser: true,
      isOpen: false,
      jamBuka: '00:00',
      jamTutup: '00:00',
      hari: Days.RABU,
    },
    {
      isFromUser: true,
      isOpen: false,
      jamBuka: '00:00',
      jamTutup: '00:00',
      hari: Days.KAMIS,
    },
    {
      isFromUser: true,
      isOpen: false,
      jamBuka: '00:00',
      jamTutup: '00:00',
      hari: Days.JUMAT,
    },
    {
      isFromUser: true,
      isOpen: false,
      jamBuka: '00:00',
      jamTutup: '00:00',
      hari: Days.SABTU,
    },
    {
      isFromUser: true,
      isOpen: false,
      jamBuka: '00:00',
      jamTutup: '00:00',
      hari: Days.MINGGU,
    },
  ]

  const [jadwal, setJadwal] = React.useState(inisialJadwal)

  // Fungsi untuk menginisialisasi jadwal
  const initJadwal = () => {
    if (user?.jadwalOperasional) {
      const updatedJadwal = [...jadwal]

      for (let i = 0; i < jadwal.length; i++) {
        updatedJadwal[i].jamBuka =
          user?.jadwalOperasional?.find(
            (jadwal) => jadwal.hari == updatedJadwal[i].hari
          )?.jamBuka || updatedJadwal[i].jamBuka
        updatedJadwal[i].jamTutup =
          user?.jadwalOperasional?.find(
            (jadwal) => jadwal.hari == updatedJadwal[i].hari
          )?.jamTutup || updatedJadwal[i].jamTutup
        updatedJadwal[i].isOpen = user?.jadwalOperasional?.find(
          (jadwal) =>
            jadwal.hari === updatedJadwal[i].hari &&
            jadwal.jamBuka == jadwal.jamTutup
        )
          ? false
          : true
      }
      setJadwal(updatedJadwal)
    }
  }
  useEffect(() => {
    initJadwal()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const timeFormat = 'HH:mm'
  const onChange = (
    index: number,
    isJadwalBuka: boolean,
    time: Dayjs | null,
    timeString: string
  ) => {
    let newData = [...jadwal]

    if (isJadwalBuka) {
      newData[index].jamBuka = timeString
    } else {
      newData[index].jamTutup = timeString
    }

    setJadwal(newData)

    console.log(newData)
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const url = `${process.env.NEXT_PUBLIC_API_URL}/pengelola-laundry/edit-jadwal`
    let newJadwal = []

    let isValid: boolean = true

    for (let i = 0; i < jadwal.length; i++) {
      const jamBuka: number = parseInt(jadwal[i].jamBuka.split(':')[0])
      const jamTutup: number = parseInt(jadwal[i].jamTutup.split(':')[0])

      const menitBuka: number = parseInt(jadwal[i].jamBuka.split(':')[1])
      const menitTutup: number = parseInt(jadwal[i].jamTutup.split(':')[1])

      if (jamBuka > jamTutup) {
        isValid = false
        toast({
          title: 'Error',
          description: `${'Opening hours must not exceed closing hours'}`,
        })
        return
      } else if (jamBuka == jamTutup) {
        if (menitBuka > menitTutup) {
          isValid = false

          toast({
            title: 'Error',
            description: `${'Opening hours must not exceed closing hours'}`,
          })
          return
        }
      }

      let newData = {
        hari: jadwal[i].hari,
        jamBuka: jadwal[i].jamBuka,
        jamTutup: jadwal[i].jamTutup,
      }
      if (!jadwal[i].isOpen) {
        ;(newData.jamBuka = '00:00'), (newData.jamTutup = '00:00')
      }

      newJadwal.push(newData)
    }

    if (isValid) {
    } else {
      return false
    }

    const body = {
      jadwalOperasional: newJadwal,
    }

    setIsLoading(true)

    try {
      const res = await AuthenticatedFetch(url, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      })

      const dt = await res.json()

      if (dt.statusCode >= 400) {
        toast({
          title: 'Error',
          description: dt.message,
        })
      } else {
        toast({
          title: 'Success',
          description: `${'You have successfully update your operational schedule.'}`,
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong, please try again later.',
      })
    }
    setIsLoading(false)
  }

  const handleSwitchChange = async (index: number, checked: boolean) => {
    let newData = [...jadwal]

    newData[index].isOpen = checked
    newData[index].isFromUser = false

    setJadwal(newData)
  }

  return (
    <div className=" flex justify-center items-center mt-2 w-full">
      <div className=" flex w-full flex-col justify-center space-y-6 sm:w-[480px] p-8 border-4 border-gray-400 border-opacity-30 rounded-xl h-fit">
        <h1 className="text-2xl font-semibold tracking-tight text-center text-muted-foreground">
          Edit Jadwal Operasioanal
        </h1>

        <div className={'grid gap-6'}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Hari</TableHead>
                <TableHead>Jam Buka</TableHead>
                <TableHead>Jam Tutup</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jadwal.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.hari}</TableCell>
                  <TableCell>
                    <TimePicker
                      disabled={
                        item.isFromUser
                          ? user?.jadwalOperasional?.find(
                              (jadwal) =>
                                jadwal.hari === item.hari &&
                                jadwal.jamBuka == jadwal.jamTutup
                            )
                            ? true
                            : user?.jadwalOperasional?.find(
                                  (jadwal) => jadwal.hari === item.hari
                                )
                              ? false
                              : true
                          : !item.isOpen
                      }
                      key={
                        user?.jadwalOperasional?.find(
                          (jadwal) => jadwal.hari === item.hari
                        )
                          ? 'notLoadedYet'
                          : 'loaded'
                      }
                      defaultValue={dayjs(
                        user?.jadwalOperasional?.find(
                          (jadwal) => jadwal.hari === item.hari
                        )?.jamBuka || item.jamBuka,
                        timeFormat
                      )}
                      onChange={(time: Dayjs | null, timeString: string) =>
                        onChange(index, true, time, timeString)
                      }
                      format={timeFormat}
                    />
                  </TableCell>
                  <TableCell>
                    <TimePicker
                      className="change-color"
                      disabled={
                        item.isFromUser
                          ? user?.jadwalOperasional?.find(
                              (jadwal) =>
                                jadwal.hari === item.hari &&
                                jadwal.jamBuka == jadwal.jamTutup
                            )
                            ? true
                            : user?.jadwalOperasional?.find(
                                  (jadwal) => jadwal.hari === item.hari
                                )
                              ? false
                              : true
                          : !item.isOpen
                      }
                      key={
                        user?.jadwalOperasional?.find(
                          (jadwal) => jadwal.hari === item.hari
                        )
                          ? 'notLoadedYet'
                          : 'loaded'
                      }
                      defaultValue={dayjs(
                        user?.jadwalOperasional?.find(
                          (jadwal) => jadwal.hari === item.hari
                        )?.jamTutup || item.jamTutup,
                        timeFormat
                      )}
                      onChange={(time: Dayjs | null, timeString: string) =>
                        onChange(index, false, time, timeString)
                      }
                      format={timeFormat}
                    />
                  </TableCell>

                  <TableCell>
                    <Switch
                      key={
                        user?.jadwalOperasional?.find(
                          (jadwal) => jadwal.hari === item.hari
                        )
                          ? 'notLoadedYet'
                          : 'loaded'
                      }
                      defaultChecked={
                        user?.jadwalOperasional?.find(
                          (jadwal) =>
                            jadwal.hari === item.hari &&
                            jadwal.jamBuka == jadwal.jamTutup
                        )
                          ? false
                          : user?.jadwalOperasional?.find(
                                (jadwal) => jadwal.hari === item.hari
                              )
                            ? true
                            : item.isOpen
                      }
                      onCheckedChange={(checked: boolean) =>
                        handleSwitchChange(index, checked)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <form onSubmit={onSubmit}>
            <div className="grid gap-2">
              <div className="flex flex-col justify-end items-end">
                <Button
                  disabled={isLoading}
                  className="mt-2 w-full"
                  variant="outline"
                >
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save
                </Button>
              </div>
            </div>
          </form>

          <Button
            onClick={() => router.push('/edit-profile')}
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Back
          </Button>
        </div>
      </div>
    </div>
  )
}
