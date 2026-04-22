/**
 * @param {{ sessionOrdinalInCycle?: number | null, cycle?: { sessionQuota?: number } } | null} appointment
 * @returns {string | null}
 */
export function formatSessionInPackageLabel(appointment) {
  if (!appointment) return null
  const n = appointment.sessionOrdinalInCycle
  const total = appointment.cycle?.sessionQuota
  if (n == null || total == null) return null
  return `Sesión ${n}/${total}`
}
