/**
 * Prisma often prefixes readable text with a huge "Invalid `prisma...` invocation" block in dev.
 * @param {string} message
 */
function prismaMessageForUi(message) {
  if (typeof message !== 'string') return String(message)
  const table = message.match(
    /The table `[^`]+` does not exist in the current database\./,
  )
  if (table) return table[0]
  const last = message.trim().split('\n').filter(Boolean).pop()
  return last && last.length < 400 ? last : message.slice(0, 320) + '…'
}

/**
 * Copy for Prisma / DB failures shown in the UI.
 * Technical detail is hidden on production deploys; shown in dev and on Vercel Preview.
 * @param {unknown} err
 */
export function describeDbError(err) {
  const showTechnicalDetail =
    process.env.NODE_ENV !== 'production' ||
    process.env.VERCEL_ENV === 'preview'

  if (!(err instanceof Error)) {
    return {
      summary:
        'No se pudo conectar a la base de datos. Comprueba DATABASE_URL (Supabase) en el entorno.',
      technicalDetail: showTechnicalDetail ? String(err) : null,
      prismaCode: null,
      showPoolerHints: true,
    }
  }

  const prismaCode =
    'code' in err && typeof err.code === 'string' ? err.code : null

  const isMissingSchema = prismaCode === 'P2021'

  const summaryParts = [
    isMissingSchema
      ? 'La base de datos responde, pero faltan tablas o el esquema no está aplicado.'
      : 'No se pudo conectar a la base de datos.',
    prismaCode ? `Código Prisma: ${prismaCode}.` : null,
    isMissingSchema
      ? 'Ejecuta `npm run db:deploy` contra la misma base que usa la app. Con Supabase, define `DIRECT_URL` (conexión “Direct”, puerto 5432) además del pooler en `DATABASE_URL`; sin eso las migraciones suelen colgarse o no crear tablas en la instancia correcta. Luego reinicia `npm run dev`.'
      : showTechnicalDetail
        ? null
        : 'Revisa DATABASE_URL (pooler, sslmode y parámetros recomendados por Supabase/Prisma) y los registros del despliegue.',
  ].filter(Boolean)

  return {
    summary: summaryParts.join(' '),
    technicalDetail: showTechnicalDetail
      ? prismaMessageForUi(err.message)
      : null,
    prismaCode,
    /** When false, hide pooler/ssl copy (misleading for missing tables). */
    showPoolerHints: !isMissingSchema,
  }
}
