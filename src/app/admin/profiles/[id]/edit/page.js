import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function LegacyAdminEditProfilePage({ params, searchParams }) {
  const { id } = await params
  const search = await searchParams
  const qs = search?.created === '1' ? '?created=1' : search?.saved === '1' ? '?saved=1' : ''
  redirect(`/profiles/${id}/edit${qs}`)
}
