import Link from 'next/link'
import { listProfiles } from '@/db/queries'
import { buttonVariants } from '@/components/ui/button-variants'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  let rows
  try {
    rows = await listProfiles()
  } catch {
    rows = null
  }

  return (
    <div className="bg-background text-foreground mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-primary/80 text-xs font-medium tracking-[0.2em] uppercase">
            Astrohacking
          </p>
          <h1 className="font-heading mt-2 text-2xl font-semibold tracking-tight">
            Perfiles de clientes
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Crea un perfil, guarda la carta y comparte el enlace de solo lectura.
          </p>
        </div>
        <Link href="/admin/profiles/new" className={buttonVariants({ size: 'default' })}>
          Nuevo perfil
        </Link>
      </div>

      {rows === null ? (
        <p className="text-destructive text-sm">
          No se pudo conectar a la base de datos. Comprueba{' '}
          <code className="text-foreground">DATABASE_URL</code> (Supabase) en el entorno.
        </p>
      ) : rows.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aún no hay perfiles.</p>
      ) : (
        <ul className="divide-border border-border divide-y rounded-xl border">
          {rows.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 first:rounded-t-xl last:rounded-b-xl"
            >
              <div className="min-w-0">
                <p className="text-foreground font-medium">{p.label}</p>
                <p className="text-muted-foreground font-mono text-xs">{p.id}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/profiles/${p.id}/edit`}
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  Editar
                </Link>
                <Link
                  href={`/p/${p.id}`}
                  className={buttonVariants({ variant: 'secondary', size: 'sm' })}
                >
                  Ver árbol
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-muted-foreground mt-10 text-xs">
        <Link href="/" className="text-primary underline-offset-4 hover:underline">
          Volver a la asignación pública
        </Link>
      </p>
    </div>
  )
}
