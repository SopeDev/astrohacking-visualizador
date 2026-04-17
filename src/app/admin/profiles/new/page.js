import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function LegacyAdminNewProfilePage() {
  redirect('/profiles/new')
}
