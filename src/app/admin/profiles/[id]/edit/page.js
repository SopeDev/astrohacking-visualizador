import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getProfileById } from '@/db/queries'
import { AdminProfileForm } from '@/components/AdminProfileForm/AdminProfileForm'
import { deleteProfileAction } from '@/app/admin/actions'
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

  return (
    <div className="bg-background text-foreground mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            ← Perfiles
          </Link>
          <h1 className="font-heading mt-4 text-2xl font-semibold tracking-tight">
            Editar perfil
          </h1>
        </div>
        <form action={deleteProfileAction}>
          <input type="hidden" name="profileId" value={profile.id} />
          <button
            type="submit"
            className={buttonVariants({ variant: 'destructive', size: 'sm' })}
          >
            Eliminar
          </button>
        </form>
      </div>

      {search?.created === '1' ? (
        <p className="text-primary mb-4 text-sm">Perfil creado.</p>
      ) : null}
      {search?.saved === '1' ? (
        <p className="text-primary mb-4 text-sm">Cambios guardados.</p>
      ) : null}

      <div className="border-border bg-muted/30 mb-8 rounded-lg border px-4 py-3 text-sm">
        <p className="text-muted-foreground font-medium">Enlace para el cliente</p>
        <p className="text-foreground mt-1 break-all font-mono text-xs">{sharePath}</p>
        <p className="text-muted-foreground mt-2 text-xs">
          Si no ves el dominio completo, define{' '}
          <code className="text-foreground">NEXT_PUBLIC_SITE_ORIGIN</code> en Vercel.
        </p>
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
        }}
      />
    </div>
  )
}
