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
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui//avatar'
import { getCookie} from 'cookies-next'

import { Tags } from '@/lib/enum'
  
type FormValues = {
    name: string
    address: string
    deskripsi: string
    jamOperasional : object
    sepatu : boolean
    baju : boolean
    seprai : boolean
    jaket : boolean
}


export default function EditProfil() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const { user, setUser, loading, setDate} = useAuthContext()
    const { toast } = useToast()
    const router = useRouter()

    const [imageUrl, setimageUrl] = React.useState<string>();
    const [name, setname] = React.useState<string>();
    const [address, setaddress] = React.useState<string>();
    const [deskripsi, setdeskripsi] = React.useState<string>();


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target.files? e.target.files[0] : null;

        if (file == undefined || file == null) {
            console.log(`not selected file`);
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        const url = `${process.env.NEXT_PUBLIC_API_URL}/user/upload`;
        setIsLoading(true)

        try {
            const res = await AuthenticatedFetch(url, {
            method: 'POST',
            body: formData,
            })
        
            const dt = await res.json()
        
            if (dt.statusCode >= 400) {
            toast({
                title: 'Error',
                description: dt.message,
            })
            } else {
                setimageUrl(dt.url)
                const token = getCookie('token')
                setDate(new Date())
            toast({
                title: 'Success',
                description: `${ 
                    'Your photo has been successfully uploaded.'
                }`,
            })
        
            router.push('/edit-profile')
            }
        } catch (error) {
            console.log(error)
            toast({
            title: 'Error',
            description: 'Something went wrong, please try again later.',
            })
        }
        setIsLoading(false)

    };


    async function onSubmit(data: FormValues) {
        setIsLoading(true)

        const url = `${process.env.NEXT_PUBLIC_API_URL}/user/update-profile`;
        
        let tags : string[] = [];

        if (data.sepatu == true){tags.push('SEPATU')}
        if (data.baju == true){tags.push('BAJU')}
        if (data.seprai == true){tags.push('SEPRAI')}
        if (data.jaket == true){tags.push('JAKET')}

        const newData = {
            name: data.name,
            address: data.address,
            deskripsi: data.deskripsi,
            tags: tags
        }

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
                
                const token = getCookie('token')

                setDate(new Date())
                toast({
                title: 'Success',
                description: `${ 
                    'You have successfully update your profile.'
                }`,
            })
        
            router.push('/edit-profile')
            }
        } catch (error) {
            
            toast({
            title: 'Error',
            description: 'Something went wrong, please try again later.',
            })
        }
        setIsLoading(false)
    }
  
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    }   = useForm<FormValues>({
        defaultValues: {
            name: user?.name,
            address: user?.address,
            deskripsi: user?.deskripsi,
            sepatu: user?.tags ? (user?.tags.includes(Tags.SEPATU)) : false
        }
    })

    useEffect(()=>{
        if (!user?.name) return
        if (!user?.address) return

        setValue('name', user?.name)
        setValue('address', user?.address)
        setValue('sepatu', user?.tags ? (user?.tags.includes(Tags.SEPATU)) : false)
        setValue('baju', user?.tags ? (user?.tags.includes(Tags.BAJU)) : false)
        setValue('seprai', user?.tags ? (user?.tags.includes(Tags.SEPRAI)) : false)
        setValue('jaket', user?.tags ? (user?.tags.includes(Tags.JAKET)) : false)

        setname(user?.name)
        setaddress(user?.address)
        setdeskripsi(user?.deskripsi)
    }, [user])



    return (
      <div className="flex-1 flex items-center mt-2">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[360px] p-8 border-4 border-gray-400 border-opacity-30 rounded-xl h-fit">
            <h1 className="text-2xl font-semibold tracking-tight text-center text-muted-foreground">
            Edit profile
            </h1>
            {!loading && (<div className="flex flex-col items-center justify-center mt-2">
                <Avatar className='w-24 h-24'>
                    {user?.image && (
                    <AvatarImage
                        src={imageUrl? imageUrl : user?.image}
                        alt={user.name}
                        className="rounded-full"
                    />
                    )}

                    {!user?.image && (
                    <AvatarImage src={'/assets/batman.png'} alt="@LaundryEase" />

                    )}
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className='text-sm text-blue-400 mt-4'>
                    <label htmlFor="file" className="">Ubah Foto Profile
                    </label>
                    <input 
                        type="file" 
                        id="file" 
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

            </div>
            )}
            <div className={'grid gap-6'}>
            
            {!loading && (
            <form onSubmit={handleSubmit(onSubmit)}>
            
                <div className="grid gap-2">
                    <div className="grid gap-1">
                    <Label
                        htmlFor="name"
                        className="text-sm font-bold text-muted-foreground"
                    >
                        Name
                    </Label>
                    <Input
                        id="name"
                        defaultValue={user?.name}
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

                    <div className="grid gap-1">
                    <Label
                        htmlFor="address"
                        className="text-sm font-bold text-muted-foreground"
                    >
                        Address
                    </Label>
                    <Input
                        id="address"
                        defaultValue={address ? address : user?.address}
                        type="text"
                        disabled={isLoading}
                        {...register('address', {
                            required: {
                                value: true,
                                message: 'Adress is required',
                            },
                            })}
                    />
                    {errors.address && (
                        <div className="text-sm text-destructive font-bold">
                        {errors.address.message}
                        </div>
                    )}
                    </div>

                    {user?.role === 'PENGELOLA_LAUNDRY' && (
                        <div className="grid gap-1">
                        <Label
                            htmlFor="deskripsi"
                            className="text-sm font-bold text-muted-foreground"
                        >
                            Description
                        </Label>
                        <Textarea
                            id="deskripsi"
                            defaultValue={deskripsi ? deskripsi : user?.deskripsi}
                            disabled={isLoading}
                            {...register('deskripsi')}
                        ></Textarea>
                        {errors.deskripsi && (
                            <div className="text-sm text-destructive font-bold">
                            {errors.deskripsi.message}
                            </div>
                        )}
                        </div>
                    )}

                    <div className='flex justify-between items-start'>
                    
                    {user?.role === 'PENGELOLA_LAUNDRY' && (
                    <div className='flex justify-between w-full'>
                    

                    <div className='flex flex-col gap-1'>
                        <h1 className="text-l font-bold text-muted-foreground"> Service </h1>

                        <div className="flex justify-start gap-2">
                            <Input
                                id="sepatu"
                                type="checkbox"
                                className='w-fit'
                                disabled={isLoading}
                                defaultChecked={user?.tags ? (user?.tags.includes(Tags.SEPATU)) : false}
                                {...register('sepatu')}
                            />
                            <Label
                                htmlFor="sepatu"
                                className="text-sm font-bold text-muted-foreground"
                            >
                                Sepatu
                            </Label>
                            {errors.sepatu && (
                                <div className="text-sm text-destructive font-bold">
                                {errors.sepatu.message}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-start gap-2">
                            <Input
                                id="baju"
                                type="checkbox"
                                className='w-fit'
                                disabled={isLoading}
                                defaultChecked = {user?.tags ? (user?.tags.includes(Tags.BAJU)) : false}
                                {...register('baju')}
                            />
                            <Label
                                htmlFor="baju"
                                className="text-sm font-bold text-muted-foreground"
                            >
                                Baju
                            </Label>
                            {errors.baju && (
                                <div className="text-sm text-destructive font-bold">
                                {errors.baju.message}
                                </div>
                            )}
                        </div>


                        <div className="flex justify-start gap-2">
                            <Input
                                id="seprai"
                                type="checkbox"
                                className='w-fit'
                                disabled={isLoading}
                                defaultChecked = {user?.tags ? (user?.tags.includes(Tags.SEPRAI)) : false}
                                {...register('seprai')}
                            />
                            <Label
                                htmlFor="seprai"
                                className="text-sm font-bold text-muted-foreground"
                            >
                                Seprai
                            </Label>
                            {errors.seprai && (
                                <div className="text-sm text-destructive font-bold">
                                {errors.seprai.message}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-start gap-2">
                            <Input
                                id="jaket"
                                type="checkbox"
                                className='w-fit'
                                disabled={isLoading}
                                defaultChecked = {user?.tags ? (user?.tags.includes(Tags.JAKET)) : false}
                                {...register('jaket')}
                            />
                            <Label
                                htmlFor="jaket"
                                className="text-sm font-bold text-muted-foreground"
                            >
                                Jaket
                            </Label>
                            {errors.jaket && (
                                <div className="text-sm text-destructive font-bold">
                                {errors.jaket.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <Button
                        type='button'
                        onClick={() => router.push('/edit-profile/jadwal')}
                        disabled={isLoading}
                        className="h-1/2" variant="outline">
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Jadwal <br/> Operasional
                    </Button>

                    </div>       
                    
                    )}

                
                    </div>

                    <div className="flex flex-col justify-end items-end">
                        <Button type='submit' disabled={isLoading} className="mt-2 w-full" variant="outline">
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save
                        </Button>
                    </div>

                </div>
            </form>
            )}


          </div>
        </div>
      </div>
    )

}
  
