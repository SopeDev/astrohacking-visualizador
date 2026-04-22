import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getProfileById } from '@/db/queries'
import { AdminProfileForm } from '@/components/AdminProfileForm/AdminProfileForm'
import { CopyShareLink } from '@/components/CopyShareLink/CopyShareLink'
import { DeleteProfileButton } from '@/components/DeleteProfileButton/DeleteProfileButton'
import { buttonVariants } from '@/components/ui/button-variants'

export const dynamic = 'force-dynamic'

export default async function EditProfilePage({ params, searchParams }) {
  const { id } = await params
  const search = await searchParams
  let profile
  try {
    profile = await getProfileById(id)
  } catch {
    profile = null
  }
  if (!profile) notFound()

  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'https'
  const absoluteShare =
    process.env.NEXT_PUBLIC_SITE_ORIGIN ??
    (host ? `${proto}://${host}` : '')
  const sharePath = absoluteShare ? `${absoluteShare}/p/${profile.id}` : `/p/${profile.id}`
  const activeCycle = profile.packageCycles.find((cycle) => cycle.status === 'active') ?? null

  return (
    <div className="bg-background text-foreground mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            ← Perfiles
          </Link>
          <h1 className="font-heading mt-4 text-2xl font-semibold tracking-tight">
            Editar perfil
          </h1>
        </div>
        <DeleteProfileButton profileId={profile.id} profileLabel={profile.label} />
      </div>

      {search?.created === '1' ? (
        <p className="text-primary mb-4 text-sm">Perfil creado.</p>
      ) : null}
      {search?.saved === '1' ? (
        <p className="text-primary mb-4 text-sm">Cambios guardados.</p>
      ) : null}

      <div className="border-border bg-muted/30 mb-8 rounded-lg border px-4 py-3 text-sm md:flex justify-between items-center">
        <p className="text-muted-foreground font-medium">Enlace para el cliente</p>
        <CopyShareLink url={sharePath} />
      </div>

      <AdminProfileForm
        mode="edit"
        initial={{
          id: profile.id,
          label: profile.label,
          notes: profile.notes,
          assignments:
            typeof profile.assignments === 'object' && profile.assignments !== null
              ? /** @type {Record<string, string>} */ (profile.assignments)
              : {},
          packageCycles: profile.packageCycles,
          activeCycle,
          appointments: profile.appointments,
        }}
      />
    </div>
  )
}
