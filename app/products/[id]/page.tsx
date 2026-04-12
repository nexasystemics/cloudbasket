import { permanentRedirect } from 'next/navigation'

export default async function ProductsIdRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  permanentRedirect(`/product/${id}`)
}

