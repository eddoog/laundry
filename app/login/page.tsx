'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { useAuthContext } from '@/lib/context'
import { AuthRequest } from '@/lib/request'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'

type FormValues = {
  email: string
  password: string
}

export default function Login() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { setAccessToken } = useAuthContext()
  const { toast } = useToast()
  const router = useRouter()

  async function onSubmit(data: FormValues) {
    setIsLoading(true)

    await AuthRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      JSON.stringify(data),
      toast,
      router,
      setAccessToken,
      true
    )

    setIsLoading(false)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  return (
    <div className="flex-1 flex items-center mt-2">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] p-8 border-4 border-gray-400 border-opacity-30 rounded-xl h-fit">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Login to your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password below to login to your account
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
              <Button disabled={isLoading} className="mt-2" variant="outline">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In with Email
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
