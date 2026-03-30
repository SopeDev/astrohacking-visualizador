/** sessionStorage key for assignments (screen two will read this) */
export const ASSIGNMENTS_STORAGE_KEY = 'astrohacking-assignments-v1'

/** Zodiac: Hebrew letter + intelligence (Spanish) per sign */

export const ZODIAC_SIGNS = [
  {
    id: 'aries',
    label: 'Aries',
    glyph: '\u2648',
    hebrewChar: '\u05D4',
    letterName: 'Hei',
    intelligence: 'Constituyente',
  },
  {
    id: 'taurus',
    label: 'Tauro',
    glyph: '\u2649',
    hebrewChar: '\u05D5',
    letterName: 'Vav',
    intelligence: 'Triunfante y Eterna',
  },
  {
    id: 'gemini',
    label: 'Géminis',
    glyph: '\u264A',
    hebrewChar: '\u05D6',
    letterName: 'Zain',
    intelligence: 'Discriminadora',
  },
  {
    id: 'cancer',
    label: 'Cáncer',
    glyph: '\u264B',
    hebrewChar: '\u05D7',
    letterName: 'Heth',
    intelligence: 'Receptiva',
  },
  {
    id: 'leo',
    label: 'Leo',
    glyph: '\u264C',
    hebrewChar: '\u05D8',
    letterName: 'Teth',
    intelligence: 'Secreta',
  },
  {
    id: 'virgo',
    label: 'Virgo',
    glyph: '\u264D',
    hebrewChar: '\u05D9',
    letterName: 'Yod',
    intelligence: 'Voluntad',
  },
  {
    id: 'libra',
    label: 'Libra',
    glyph: '\u264E',
    hebrewChar: '\u05DC',
    letterName: 'Lamed',
    intelligence: 'Fiel',
  },
  {
    id: 'scorpio',
    label: 'Escorpio',
    glyph: '\u264F',
    hebrewChar: '\u05E0',
    letterName: 'Nun',
    intelligence: 'Imaginativa',
  },
  {
    id: 'sagittarius',
    label: 'Sagitario',
    glyph: '\u2650',
    hebrewChar: '\u05E1',
    letterName: 'Samech',
    intelligence: 'De prueba',
  },
  {
    id: 'capricorn',
    label: 'Capricornio',
    glyph: '\u2651',
    hebrewChar: '\u05E2',
    letterName: 'Ayin',
    intelligence: 'Renovadora',
  },
  {
    id: 'aquarius',
    label: 'Acuario',
    glyph: '\u2652',
    hebrewChar: '\u05E6',
    letterName: 'Tzaddi',
    intelligence: 'Natural',
  },
  {
    id: 'pisces',
    label: 'Piscis',
    glyph: '\u2653',
    hebrewChar: '\u05E7',
    letterName: 'Qoph',
    intelligence: 'Corporal',
  },
]

/** Natural planets: Hebrew + intelligence (Spanish) */

export const NATURAL_PLANETS = {
  mars: {
    id: 'mars',
    label: 'Marte',
    glyph: '\u2642',
    hebrewChar: '\u05D3',
    letterName: 'Dalet',
    intelligence: 'Luminosa',
  },
  venus: {
    id: 'venus',
    label: 'Venus',
    glyph: '\u2640',
    hebrewChar: '\u05E3',
    letterName: 'Pei',
    intelligence: 'Excitante',
  },
  mercury: {
    id: 'mercury',
    label: 'Mercurio',
    glyph: '\u263F',
    hebrewChar: '\u05E8',
    letterName: 'Resh',
    intelligence: 'Recolectora',
  },
  moon: {
    id: 'moon',
    label: 'Luna',
    glyph: '\u263D',
    hebrewChar: '\u05EA',
    letterName: 'Tav',
    intelligence: 'Administradora',
  },
  sun: {
    id: 'sun',
    label: 'Sol',
    glyph: '\u2609',
    hebrewChar: '\u05DB',
    letterName: 'Caph',
    intelligence: 'Recompensadora',
  },
  pluto: {
    id: 'pluto',
    label: 'Plutón',
    glyph: '\u2647',
    hebrewChar: '\u05E9',
    letterName: 'Shin',
    intelligence: 'Perpetua',
  },
  jupiter: {
    id: 'jupiter',
    label: 'Júpiter',
    glyph: '\u2643',
    hebrewChar: '\u05D2',
    letterName: 'Guimel',
    intelligence: 'Unificadora',
  },
  saturn: {
    id: 'saturn',
    label: 'Saturno',
    glyph: '\u2644',
    hebrewChar: '\u05D1',
    letterName: 'Beth',
    intelligence: 'Transparente',
  },
  uranus: {
    id: 'uranus',
    label: 'Urano',
    glyph: '\u2645',
    hebrewChar: '\u05D0',
    letterName: 'Aleph',
    intelligence: 'Ígnea',
  },
  neptune: {
    id: 'neptune',
    label: 'Neptuno',
    glyph: '\u2646',
    hebrewChar: '\u05DE',
    letterName: 'Mem',
    intelligence: 'Estable',
  },
}

/** Rows for screen one: assign a zodiac sign to each celestial body */

export const ASSIGNMENT_ROWS = [
  { key: 'sun', planetKey: 'sun' },
  { key: 'moon', planetKey: 'moon' },
  { key: 'mercury', planetKey: 'mercury' },
  { key: 'venus', planetKey: 'venus' },
  { key: 'mars', planetKey: 'mars' },
  { key: 'jupiter', planetKey: 'jupiter' },
  { key: 'saturn', planetKey: 'saturn' },
  { key: 'uranus', planetKey: 'uranus' },
  { key: 'neptune', planetKey: 'neptune' },
  { key: 'pluto', planetKey: 'pluto' },
  { key: 'ascendant', planetKey: null },
]

const signById = Object.fromEntries(ZODIAC_SIGNS.map((s) => [s.id, s]))

export function getSignById(id) {
  return signById[id] ?? null
}

/**
 * Sephirot on the Tree: layout in viewBox 0 0 400 540 (px-like units).
 * assignmentKey matches keys saved from screen one (sun, moon, … ascendant).
 */
export const SEPHIROT = [
  {
    id: 'kether',
    label: 'Kéter',
    x: 200,
    y: 42,
    planetKey: 'uranus',
    assignmentKey: 'uranus',
  },
  {
    id: 'chokmah',
    label: 'Jojmá',
    x: 312,
    y: 118,
    planetKey: 'neptune',
    assignmentKey: 'neptune',
  },
  {
    id: 'binah',
    label: 'Biná',
    x: 88,
    y: 118,
    planetKey: 'saturn',
    assignmentKey: 'saturn',
  },
  {
    id: 'daat',
    label: 'Daat',
    x: 200,
    y: 138,
    planetKey: 'pluto',
    assignmentKey: 'pluto',
    daat: true,
  },
  {
    id: 'chesed',
    label: 'Jésed',
    x: 312,
    y: 228,
    planetKey: 'jupiter',
    assignmentKey: 'jupiter',
  },
  {
    id: 'geburah',
    label: 'Geburá',
    x: 88,
    y: 228,
    planetKey: 'mars',
    assignmentKey: 'mars',
  },
  {
    id: 'tiphareth',
    label: 'Tiferet',
    x: 200,
    y: 268,
    planetKey: 'sun',
    assignmentKey: 'sun',
  },
  {
    id: 'netzach',
    label: 'Netsaj',
    x: 312,
    y: 358,
    planetKey: 'venus',
    assignmentKey: 'venus',
  },
  {
    id: 'hod',
    label: 'Hod',
    x: 88,
    y: 358,
    planetKey: 'mercury',
    assignmentKey: 'mercury',
  },
  {
    id: 'yesod',
    label: 'Jesod',
    x: 200,
    y: 398,
    planetKey: 'moon',
    assignmentKey: 'moon',
  },
  {
    id: 'malkuth',
    label: 'Malkuth',
    x: 200,
    y: 498,
    planetKey: null,
    assignmentKey: 'ascendant',
    ascendantNode: true,
  },
]

export const SEPHIROT_BY_ID = Object.fromEntries(
  SEPHIROT.map((s) => [s.id, s]),
)

/** Undirected paths (each pair drawn once) */
export const TREE_EDGES = [
  ['kether', 'chokmah'],
  ['kether', 'binah'],
  ['kether', 'daat'],
  ['chokmah', 'binah'],
  ['chokmah', 'chesed'],
  ['binah', 'geburah'],
  ['chesed', 'geburah'],
  ['daat', 'tiphareth'],
  ['chesed', 'tiphareth'],
  ['geburah', 'tiphareth'],
  ['chesed', 'netzach'],
  ['geburah', 'hod'],
  ['tiphareth', 'netzach'],
  ['tiphareth', 'hod'],
  ['netzach', 'hod'],
  ['tiphareth', 'yesod'],
  ['netzach', 'yesod'],
  ['hod', 'yesod'],
  ['yesod', 'malkuth'],
]
