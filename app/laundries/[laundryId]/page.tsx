import { LaundryDetailCard } from '@/components/LaundryDetailCard'

type Params = {
  params: {
    laundryId: string
  }
}

export default function LaundryDetail({ ...props }: Params) {
  const { laundryId } = props.params

  return (
    <div className="sm:flex w-full justify-start">
      <LaundryDetailCard id={laundryId} />
    </div>
  )
}
