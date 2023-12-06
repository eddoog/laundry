'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { useAuthContext } from '@/lib/context'
import { AuthRequest, AuthenticatedFetch, setCookies } from '@/lib/request'
import { useRouter } from 'next/navigation'
import React, { use, useEffect } from 'react'
import { set, useForm } from 'react-hook-form'


import { Tags } from '@/lib/enum'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"


  
type FormValues = {
    email : string
    password : string
    confirmPassword : string
    validationPassword : string
}



export default function EditKeamanan() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const { user,loading, setDate} = useAuthContext()
    const { toast } = useToast()
    const router = useRouter()
    const [isValidate, setIsValidate] = React.useState<boolean>(false)


    async function onSubmitEmail(data: FormValues){        
        setIsLoading(true)

        const url = `${process.env.NEXT_PUBLIC_API_URL}/user/update-email`;
        const newData = {
            email : data.email,
        }

        console.log(newData)

        try {
            const res = await AuthenticatedFetch(url, {
            method: 'PATCH',
            body: JSON.stringify(newData),
            headers: {'Content-Type': 'application/json' }
            })
        
            const dt = await res.json()
        
            if (dt.statusCode >= 400) {
                toast({
                title: 'Error',
                description: dt.message,
                })
            } else {
                setDate(new Date())

                toast({
                title: 'Success',
                description: `${ 
                    'You have successfully update your email, please log in again'
                }`,
            })
            router.push('/login')
            }
        } catch (error) {
            
            toast({
            title: 'Error',
            description: 'Something went wrong, please try again later.',
            })
        }
        setIsLoading(false)
        };
    

    async function onSubmitPassword(data: FormValues){        
        setIsLoading(true)

        console.log(data)

        const url = `${process.env.NEXT_PUBLIC_API_URL}/user/update-password`;
        const newData = {
            password : data.password,
            confirmPassword : data.confirmPassword
        }

        console.log(newData)

        try {
            const res = await AuthenticatedFetch(url, {
            method: 'PATCH',
            body: JSON.stringify(newData),
            headers: {'Content-Type': 'application/json' }
            })
        
            const dt = await res.json()
        
            if (dt.statusCode >= 400) {
                toast({
                title: 'Error',
                description: dt.message,
                })
            } else {
                setDate(new Date())

                toast({
                title: 'Success',
                description: `${ 
                    'You have successfully update your password, please log in again'
                }`,

            }
            )
            router.push('/login')
            }
        } catch (error) {
            
            toast({
            title: 'Error',
            description: 'Something went wrong, please try again later.',
            })
        }
        setIsLoading(false)
        };
    
    async function onSubmitValidation(data: FormValues){        
        setIsLoading(true)

        const url = `${process.env.NEXT_PUBLIC_API_URL}/user/validate-password`;
        const newData = {
            password : data.validationPassword,
        }


        try {
            const res = await AuthenticatedFetch(url, {
            method: 'POST',
            body: JSON.stringify(newData),
            headers: {'Content-Type': 'application/json' }
            })
        
            const dt = await res.json()
        
            if (dt.statusCode >= 400) {
                toast({
                title: 'Error',
                description: dt.message,
                })
            } else {
                console.log(dt)
                setIsValidate(true)
            }

        } catch (error) {
            
            toast({
            title: 'Error',
            description: 'Something went wrong, please try again later.',
            })
        }
        setIsLoading(false)
        };
    
    const {
        register : registerForm1,
        handleSubmit : handleSubmitForm1,
        formState: { errors : errorsForm1  },
    }   = useForm<FormValues>()

    const {
        register: registerForm2,
        handleSubmit: handleSubmitForm2,
        formState: { errors : errorsForm2 },
    }   = useForm<FormValues>()

    const {
        register: registerValidation,
        handleSubmit: handleSubmitValidation,
        formState: { errors : errorsValidation },
    }   = useForm<FormValues>()

    return (
    
      <div className="flex-1 flex items-center mt-2">
        {user && user.name != undefined && (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[360px] p-8 border-4 border-gray-400 border-opacity-30 rounded-xl h-fit">
            <h1 className="text-2xl font-semibold tracking-tight text-center text-muted-foreground">
            Keamanan Akun
            </h1>
        
            <div className={'grid gap-6'}>
            
            {!loading && (
                <div className='flex flex-col gap-2'>
                <Dialog open={! isValidate}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Account Verification</DialogTitle>
                        <DialogDescription>
                            Please insert your current password to continue
                        </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">

                        <form onSubmit={handleSubmitValidation(onSubmitValidation)}>
                            <div className="flex flex-col items- gap-4 mb-4">
                                <Label
                                    htmlFor="validation"
                                    className="text-sm font-bold text-muted-foreground"
                                >
                                    Current Password
                                </Label>
                                <Input
                                    id="validation"
                                    type="password"
                                    disabled={isLoading}
                                    className='w-full col-span-3'
                                    {...registerValidation('validationPassword', {
                                        required: {
                                            value: true,
                                            message: 'field cannot be empty',
                                        },
                                        })}
                                />
                                {errorsValidation.validationPassword && (
                                    <div className="text-sm text-destructive font-bold">
                                    {errorsValidation.validationPassword.message}
                                    </div>
                                )}
                            </div>

                                <div  className='flex justify-between mt-4'>
                                    <Button type='button' onClick={() => router.push('/')} disabled={isLoading}>back</Button>
                                    <Button type='submit' disabled={isLoading}>Submit</Button>
                                </div>

                        </form>
 
                        </div>

                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">Edit Email</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Edit Email</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">

                        <form onSubmit={handleSubmitForm1(onSubmitEmail)}>
                            <div className="flex flex-col items- gap-4 mb-4">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-bold text-muted-foreground"
                                >
                                    New Email
                                </Label>
                                <Input
                                    id="email"
                                    type="text"
                                    disabled={isLoading}
                                    className='w-full col-span-3'
                                    {...registerForm1('email', {
                                        required: {
                                            value: true,
                                            message: 'field cannot be empty',
                                        },
                                        })}
                                />
                                {errorsForm1.email && (
                                    <div className="text-sm text-destructive font-bold">
                                    {errorsForm1.email.message}
                                    </div>
                                )}
                            </div>

                            <DialogFooter>
                                <Button type='submit' disabled={isLoading}>Save</Button>
                            </DialogFooter>
                        </form>
 
                        </div>

                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">Edit Password</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Edit Password</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">

                        <form onSubmit={handleSubmitForm2(onSubmitPassword)}>
                            <div className="flex flex-col items- gap-4 mb-4">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-bold text-muted-foreground"
                                >
                                    New Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    disabled={isLoading}
                                    className='w-full col-span-3'
                                    {...registerForm2('password', {
                                        required: {
                                            value: true,
                                            message: 'field cannot be empty',
                                        },
                                        })}
                                />
                                {errorsForm2.password && (
                                    <div className="text-sm text-destructive font-bold">
                                    {errorsForm2.password.message}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items- gap-4 mb-4">
                                <Label
                                    htmlFor="confirmPassword"
                                    className="text-sm font-bold text-muted-foreground"
                                >
                                    Confirmm Password
                                </Label>
                                <Input
                                    id="address"
                                    type="password"
                                    disabled={isLoading}
                                    className='w-full col-span-3'
                                    {...registerForm2('confirmPassword', {
                                        required: {
                                            value: true,
                                            message: 'field cannot be empty',
                                        },
                                        })}
                                />
                                {errorsForm2.confirmPassword && (
                                    <div className="text-sm text-destructive font-bold">
                                    {errorsForm2.confirmPassword.message}
                                    </div>
                                )}
                            </div>

                            <DialogFooter>
                                <Button type='submit' disabled={isLoading}>Save</Button>
                            </DialogFooter>
                        </form>
 
                        </div>

                    </DialogContent>
                </Dialog>


                
                </div>
            )}


          </div>
        </div>
        )}
      </div>


    )

}
  
