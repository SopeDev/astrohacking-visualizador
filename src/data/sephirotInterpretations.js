/** @typedef {{ [comboKey: string]: { sections?: Record<string, string> } }} InterpretationMap */

export function getInterpretationComboKey(sephirotId, planetKey, signId) {
  return `${sephirotId}::${planetKey}::${signId}`
}

/**
 * @param {string | undefined} sephirotId
 * @param {string | null | undefined} planetKey
 * @param {string | undefined} signId
 * @param {InterpretationMap | null | undefined} map
 * @returns {{ sections?: Record<string, string> } | null}
 */
export function getSephirotInterpretation(sephirotId, planetKey, signId, map = null) {
  if (!sephirotId || !planetKey || !signId) return null
  if (!map) return null
  const key = getInterpretationComboKey(sephirotId, planetKey, signId)
  return map[key] ?? null
}
