import { notFound } from 'next/navigation'
import { getProfileById } from '@/db/queries'
import { isAssignmentsComplete } from '@/lib/assignments'
import { TreeOfLifeScreen } from '@/components/TreeOfLifeScreen/TreeOfLifeScreen'

export const dynamic = 'force-dynamic'

export default async function PublicProfileTreePage({ params }) {
  const { id } = await params
  let profile
  try {
    profile = await getProfileById(id)
  } catch {
    profile = null
  }
  if (!profile) notFound()

  const assignments =
    typeof profile.assignments === 'object' && profile.assignments !== null
      ? /** @type {Record<string, string>} */ (profile.assignments)
      : null

  if (!isAssignmentsComplete(assignments)) {
    notFound()
  }

  return (
    <TreeOfLifeScreen
      initialAssignments={assignments}
      backHref="/"
      backLabel="Inicio"
      subtitle={profile.label}
    />
  )
}
