export const THERAPY_PACKAGES = [
  { value: 'single_session', label: 'Sesión Única', sessionQuota: 1 },
  { value: 'initiation', label: 'Iniciación', sessionQuota: 3 },
  { value: 'deep_transformation', label: 'Transformación Profunda', sessionQuota: 7 },
  { value: 'mastery_360', label: 'Maestría 360', sessionQuota: 13 },
]

export const THERAPY_PACKAGE_MAP = Object.fromEntries(
  THERAPY_PACKAGES.map((item) => [item.value, item]),
)

export const THERAPY_PACKAGE_VALUES = THERAPY_PACKAGES.map((item) => item.value)

export const SESSION_DURATION_MINUTES = 90
