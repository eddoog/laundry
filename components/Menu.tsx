'use client'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useAuthContext } from '@/lib/context'
import { Skeleton } from './ui/skeleton'
import Link from 'next/link'
import { deleteCookie } from 'cookies-next'
import { useToast } from './ui/use-toast'

export function Menu() {
  const { user, loading, setAccessToken } = useAuthContext()
  const { toast } = useToast()

  return (
    <div className="flex flex-row justify-between items-center w-full">
      {loading && (
        <>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Skeleton className="h-8 w-[125px]" />
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Skeleton className="h-12 w-12 rounded-full" />
            </DropdownMenuTrigger>
          </DropdownMenu>
        </>
      )}
      {!loading && (
        <>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>LaundryEase</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <div className="mb-2 mt-4 text-lg font-bold">
                            LaundryEase
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Your Favourite Laundry Management App!
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/login" title="Login to Access">
                      You need to login to access full feature of the website!
                    </ListItem>
                    <ListItem href="/register" title="Register Yourself">
                      Register yourself to get started!
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                {user?.image && (
                  <AvatarImage
                    src={user.image}
                    alt={user.name}
                    className="rounded-full"
                  />
                )}
                {!user?.image && (
                  <AvatarImage src={'/assets/batman.png'} alt="@LaundryEase" />
                )}
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="relative right-8">
              <DropdownMenuLabel className="text-ellipsis overflow-hidden">
                {user?.name === undefined
                  ? 'Anonymous'
                  : user?.name.slice(0, 1).toUpperCase() +
                    user?.name.slice(1, 12) +
                    (user?.name.length > 12 ? '...' : '')}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {!user && (
                <>
                  <Link href="/login">
                    <DropdownMenuItem onClick={() => {}}>
                      Login
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/register">
                    <DropdownMenuItem onClick={() => {}}>
                      Register
                    </DropdownMenuItem>
                  </Link>
                </>
              )}
              {user && (
                <>
                  <Link href="/edit-profile">
                    <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                  </Link>
                  <Link href="/edit-keamanan">
                    <DropdownMenuItem>Edit Keamanan</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    onClick={() => {
                      setAccessToken(undefined)
                      deleteCookie('token')
                      toast({
                        title: 'Success',
                        description: 'You have successfully logged out.',
                      })
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
