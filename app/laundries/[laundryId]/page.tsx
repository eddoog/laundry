type Params = {
  params: {
    laundryId: string
  }
}

export default async function LaundryDetail({ ...props }: Params) {
  const { laundryId } = props.params

  return <p>Laundry: {laundryId}</p>
}
