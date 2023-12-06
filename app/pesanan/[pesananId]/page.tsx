import { PesananDetailCard } from '@/components/PesananDetailCard'

type Params = {
  params: {
    pesananId: string
  }
}

export default async function PesananID({ ...props }: Params) {
  const { pesananId } = props.params

  return <PesananDetailCard pesananId={pesananId} />
}
