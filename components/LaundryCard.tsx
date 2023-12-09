'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Tags } from '@/lib/enum'
import {
  ChevronDownIcon,
  CircleIcon,
  LockClosedIcon,
  MixIcon,
  StarFilledIcon,
} from '@radix-ui/react-icons'
import { Skeleton } from './ui/skeleton'
import { useRouter } from 'next/navigation'

export function LaundryCard({ ...props }) {
  const router = useRouter()

  const { userId, name, address, rating, tags, isLoading } = props as {
    userId: string
    name: string
    address: string
    rating: number
    tags: Tags[]
    isLoading: boolean
  }

  return (
    <Card
      className="cursor-pointer hover:scale-105 transition-transform ease-in-out duration-300"
      onClick={() => {
        if (isLoading && userId) return
        router.push('/laundries/' + userId)
      }}
    >
      <CardHeader className="grid sm:grid-cols-[1fr_120px] items-start gap-4 space-y-0">
        <div className="space-y-1 flex flex-col flex-wrap">
          {isLoading && (
            <>
              <Skeleton className="w-24 h-4 rounded-md" />
              <Skeleton className="w-40 h-4 rounded-md" />
            </>
          )}
          {!isLoading && (
            <>
              <CardTitle>{name}</CardTitle>
              <CardDescription>
                {address === null && 'No address'}
                {address !== null && address}
              </CardDescription>
            </>
          )}
        </div>
        {isLoading && <Skeleton className="md:h-8 sm:h-6 h-4 w-full" />}
        {!isLoading && (
          <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground justify-between sm:justify-start">
            <Button variant="secondary" className="px-3 shadow-none">
              <MixIcon className="mr-2 h-4 w-4" />
              Action
            </Button>
            <Separator orientation="vertical" className="h-[20px]" />

            <TooltipProvider>
              <Tooltip>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="px-2 shadow-none">
                      <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    alignOffset={-5}
                    className="w-[200px]"
                    forceMount
                  >
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <TooltipTrigger>
                      <DropdownMenuCheckboxItem
                        disabled={true}
                        className="flex gap-2 items-center"
                      >
                        <LockClosedIcon />
                        Wishlist
                      </DropdownMenuCheckboxItem>
                    </TooltipTrigger>
                    <TooltipTrigger>
                      <DropdownMenuCheckboxItem
                        disabled={true}
                        className="flex gap-2 items-center justify-start"
                      >
                        <LockClosedIcon />
                        Like
                      </DropdownMenuCheckboxItem>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Feature under development</p>
                    </TooltipContent>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            {isLoading && (
              <>
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="w-3 h-3 rounded-full" />
              </>
            )}
            {!isLoading && (
              <>
                <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
                {tags.length == 0 && 'No tags'}
                {tags.length > 0 &&
                  tags.map((tag, index) => (
                    <span key={tag}>
                      {tag.slice(0, 1) + tag.slice(1).toLowerCase()}
                      {index !== tags.length - 1 && ', '}
                    </span>
                  ))}
              </>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {isLoading && (
              <>
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="w-3 h-3 rounded-full" />
              </>
            )}
            {!isLoading && (
              <>
                <StarFilledIcon className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-muted-foreground">
                  {rating?.toFixed(2)}
                </span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
