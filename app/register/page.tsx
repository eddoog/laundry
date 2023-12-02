'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/components/ui/use-toast'
import { useAuthContext } from '@/lib/context'
import { Role } from '@/lib/enum'
import { AuthRequest, AuthenticatedFetch, setCookies } from '@/lib/request'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'

type FormValues = {
  email: string
  password: string
  name: string
  role: Role
}

export default function Register() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { setAccessToken } = useAuthContext()
  const { toast } = useToast()
  const router = useRouter()

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    const formData = new FormData()

    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('name', data.name)
    formData.append('role', data.role)

    await AuthRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      formData,
      toast,
      router,
      setAccessToken,
      false
    )

    setIsLoading(false)
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>()

  return (
    <div className="flex-1 flex items-center mt-2">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[360px] p-8 border-4 border-gray-400 border-opacity-30 rounded-xl h-fit">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Register to get started!
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email, password, and name below to register yourself
          </p>
        </div>
        <div className={'grid gap-6'}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label
                  htmlFor="email"
                  className="text-sm font-bold text-muted-foreground"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="ujang@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...register('email', {
                    required: {
                      value: true,
                      message: 'Email is required',
                    },
                    validate: {
                      isEmail: (value) =>
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                          ? 'Invalid email address'
                          : true,
                    },
                  })}
                />
                {errors.email && (
                  <div className="text-sm text-destructive font-bold">
                    {errors.email.message}
                  </div>
                )}
              </div>
              <div className="grid gap-1">
                <Label
                  htmlFor="password"
                  className="text-sm font-bold text-muted-foreground"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  placeholder="*******"
                  type="password"
                  disabled={isLoading}
                  {...register('password', {
                    required: {
                      value: true,
                      message: 'Password is required',
                    },
                  })}
                />
                {errors.password && (
                  <div className="text-sm text-destructive font-bold">
                    {errors.password.message}
                  </div>
                )}
              </div>
              <div className="grid gap-1">
                <Label
                  htmlFor="name"
                  className="text-sm font-bold text-muted-foreground"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Ujang Suparman"
                  type="text"
                  disabled={isLoading}
                  {...register('name', {
                    required: {
                      value: true,
                      message: 'Name is required',
                    },
                  })}
                />
                {errors.name && (
                  <div className="text-sm text-destructive font-bold">
                    {errors.name.message}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="role"
                  className="text-sm font-bold text-muted-foreground"
                >
                  Role
                </Label>
                <RadioGroup className="flex flex-col sm:flex-row sm:justify-between sm:items-center justify-center items-stretch">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="PELANGGAN"
                      id="PELANGGAN"
                      onClick={(e) => setValue('role', Role.PELANGGAN)}
                    />
                    <Label htmlFor="PELANGGAN">Pelanggan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="PENGELOLA_LAUNDRY"
                      id="PENGELOLA_LAUNDRY"
                      onClick={(e) => setValue('role', Role.PENGELOLA_LAUNDRY)}
                    />
                    <Label htmlFor="PENGELOLA_LAUNDRY">Pengelola Laundry</Label>
                  </div>
                </RadioGroup>
                {watch('role') === undefined && (
                  <div className="text-sm text-destructive font-bold">
                    Role is required
                  </div>
                )}
              </div>
              <Button disabled={isLoading} className="mt-2" variant="outline">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign Up
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
