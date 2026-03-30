/** Variation Selector-15: fuerza presentación “texto” frente a emoji de color (U+FE0F). */
const TEXT_PRESENTATION = '\uFE0E'

/**
 * Devuelve el mismo carácter(s) con VS15 tras cada escalar Unicode, para que el motor use
 * el glifo de la fuente (p. ej. Noto Sans Symbols 2) y no la pictografía emoji del SO.
 */
export function astroGlyphForDisplay(glyph) {
  if (glyph == null || glyph === '') return glyph
  return [...glyph].map((c) => c + TEXT_PRESENTATION).join('')
}
