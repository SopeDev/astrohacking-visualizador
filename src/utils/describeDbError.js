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
    }
  }

  const prismaCode =
    'code' in err && typeof err.code === 'string' ? err.code : null

  const summaryParts = [
    'No se pudo conectar a la base de datos.',
    prismaCode ? `Código Prisma: ${prismaCode}.` : null,
    showTechnicalDetail
      ? null
      : 'Revisa DATABASE_URL (pooler, sslmode y parámetros recomendados por Supabase/Prisma) y los registros del despliegue.',
  ].filter(Boolean)

  return {
    summary: summaryParts.join(' '),
    technicalDetail: showTechnicalDetail ? err.message : null,
    prismaCode,
  }
}
