import { headers } from 'next/headers'
import { listProfiles } from '@/db/queries'
import { AdminProfilesList } from '@/components/AdminProfilesList/AdminProfilesList'
import { describeDbError } from '@/utils/describeDbError'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'https'
  const absoluteShare = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? (host ? `${proto}://${host}` : '')

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
    <div className="bg-background text-foreground mx-auto max-w-3xl md:min-w-lg px-4 py-10 sm:px-6">
      <div className="mb-8">
        <div>
          <p className="text-primary/80 text-xs font-medium tracking-[0.2em] uppercase">
            Astrohacking
          </p>
          <h1 className="font-heading mt-2 text-2xl font-semibold tracking-tight">
            Perfiles de clientes
          </h1>
        </div>
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
      ) : (
        <AdminProfilesList rows={rows} absoluteShare={absoluteShare} createHref="/profiles/new" />
      )}
    </div>
  )
}
