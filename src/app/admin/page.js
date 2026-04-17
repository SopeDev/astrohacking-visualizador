import Link from 'next/link'
import { listProfiles } from '@/db/queries'
import { buttonVariants } from '@/components/ui/button-variants'
import { describeDbError } from '@/utils/describeDbError'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  let rows
  /** @type {ReturnType<typeof describeDbError> | null} */
  let dbError = null
  try {
    rows = await listProfiles()
  } catch (err) {
    rows = null
    dbError = describeDbError(err)
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

      {rows === null && dbError ? (
        <div
          className="border-destructive/30 bg-destructive/5 space-y-3 rounded-lg border p-4 text-sm"
          role="alert"
        >
          <p className="text-destructive font-medium">{dbError.summary}</p>
          {dbError.showPoolerHints ? (
            <p className="text-muted-foreground text-xs leading-relaxed">
              Variable de entorno:{' '}
              <code className="text-foreground">DATABASE_URL</code>. Con pooler de Supabase,
              Prisma suele requerir{' '}
              <code className="text-foreground">?pgbouncer=true</code> (y a menudo{' '}
              <code className="text-foreground">connection_limit=1</code> en serverless).{' '}
              <code className="text-foreground">sslmode=require</code> si el panel no lo incluye
              ya en la cadena.
            </p>
          ) : null}
          {dbError.technicalDetail ? (
            <pre className="border-border bg-muted/40 text-foreground max-h-48 overflow-auto rounded-md border p-3 font-mono text-xs whitespace-pre-wrap break-words">
              {dbError.technicalDetail}
            </pre>
          ) : null}
        </div>
      ) : rows === null ? (
        <p className="text-destructive text-sm">
          No se pudo cargar los perfiles. Vuelve a intentar o revisa los registros del servidor.
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
        <Link href="/admin" className="text-primary underline-offset-4 hover:underline">
          Ir al inicio de admin
        </Link>
      </p>
    </div>
  )
}
