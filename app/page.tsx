import { Introduction } from '@/components/Introduction'

export default function Home() {
  return (
    <div className="flex-1 flex flex-col justify-around items-center gap-8">
      <Introduction />
      <div className="h-[70px] md:hidden"></div>
    </div>
  )
}
