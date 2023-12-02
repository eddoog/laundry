'use client'

import { LaundryCard } from '@/components/LaundryCard'
import { cn } from '@/lib/utils'

export default function Laundries() {
  return (
    <Container>
      <LaundryCard />
      <LaundryCard />
      <LaundryCard />
      <LaundryCard />
      <LaundryCard />
    </Container>
  )
}

function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'grid lg:grid-cols-2 xl:grid-cols-3 grid-cols-1 items-center justify-around flex-wrap gap-8 sm:px-4 md:px-8 lg:px-12 py-6',
        className
      )}
      {...props}
    />
  )
}
