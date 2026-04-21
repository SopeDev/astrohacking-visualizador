'use client'

import { NATURAL_PLANETS, getSignById } from '@/data/correspondences'
import { getSephirotInterpretation } from '@/data/sephirotInterpretations'
import { astroGlyphForDisplay } from '@/lib/astroSymbols'
import { Separator } from '@/components/ui/separator'

function HebrewBlock({ title, hebrewChar, letterName, intelligence }) {
  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {title}
      </p>
      <div className="flex flex-wrap items-baseline gap-3">
        <span
          className="text-foreground text-4xl leading-none [font-family:var(--font-hebrew)]"
          dir="rtl"
        >
          {hebrewChar}
        </span>
        <div className="min-w-0 space-y-1">
          <p className="text-foreground font-medium">{letterName}</p>
          <p className="text-muted-foreground text-sm">{intelligence}</p>
        </div>
      </div>
    </div>
  )
}

function renderStructuredText(text) {
  const lines = text.split('\n')
  const blocks = []
  let paragraphLines = []
  let list = null

  const flushParagraph = () => {
    if (!paragraphLines.length) return
    blocks.push({ type: 'paragraph', text: paragraphLines.join('\n').trim() })
    paragraphLines = []
  }

  const flushList = () => {
    if (!list || !list.items.length) return
    blocks.push(list)
    list = null
  }

  for (const line of lines) {
    const raw = line.trimEnd()
    const trimmed = raw.trim()
    if (!trimmed) {
      flushParagraph()
      flushList()
      continue
    }

    const unorderedMatch = trimmed.match(/^[-•]\s+(.*)$/)
    if (unorderedMatch) {
      flushParagraph()
      if (!list || list.type !== 'ul') {
        flushList()
        list = { type: 'ul', items: [] }
      }
      list.items.push(unorderedMatch[1])
      continue
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/)
    if (orderedMatch) {
      flushParagraph()
      if (!list || list.type !== 'ol') {
        flushList()
        list = { type: 'ol', items: [] }
      }
      list.items.push(orderedMatch[1])
      continue
    }

    flushList()
    paragraphLines.push(trimmed)
  }

  flushParagraph()
  flushList()

  return blocks.map((block, index) => {
    if (block.type === 'ul') {
      return (
        <ul key={`ul-${index}`} className="list-disc space-y-1 pl-5">
          {block.items.map((item, itemIdx) => (
            <li key={itemIdx}>{item}</li>
          ))}
        </ul>
      )
    }
    if (block.type === 'ol') {
      return (
        <ol key={`ol-${index}`} className="list-decimal space-y-1 pl-5">
          {block.items.map((item, itemIdx) => (
            <li key={itemIdx}>{item}</li>
          ))}
        </ol>
      )
    }
    return (
      <p key={`p-${index}`} className="whitespace-pre-line">
        {block.text}
      </p>
    )
  })
}

function hasHtmlMarkup(text) {
  return /<\/?[a-z][\s\S]*>/i.test(text)
}

function renderSectionContent(content) {
  if (hasHtmlMarkup(content)) {
    return (
      <div
        className="space-y-2 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:list-outside [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:space-y-1 [&_ol]:pl-5 [&_li]:list-item [&_li]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }
  return <div className="space-y-2">{renderStructuredText(content)}</div>
}

const INTERPRETATION_SECTIONS = [
  { key: 'secretToReveal', label: 'Secreto a revelar' },
  { key: 'mainReading', label: 'Lectura principal' },
  { key: 'dailyManifestation', label: 'Cómo se manifiesta en la vida cotidiana' },
  { key: 'shadowWork', label: 'Cómo se detecta y trabaja la sombra o desalineación' },
  { key: 'evolutionaryLearning', label: 'Aprendizaje evolutivo' },
  { key: 'integrationPractice', label: 'Práctica de integración' },
  { key: 'alignedManifestation', label: 'Cómo se manifiesta en su versión alineada' },
]

export function BreakdownPanel({ sephirot, assignments, interpretationsMap = {} }) {
  if (!sephirot) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="border-border shrink-0 border-b px-6 py-5 sm:px-8">
          <h2 className="font-heading text-foreground text-lg font-semibold tracking-tight">
            Desglose
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Elige una sefirá en el árbol para ver el signo asignado, la letra
            hebrea y la inteligencia correspondientes.
          </p>
        </div>
      </div>
    )
  }

  const signId = assignments?.[sephirot.assignmentKey]
  const sign = getSignById(signId)
  const planet = sephirot.planetKey ? NATURAL_PLANETS[sephirot.planetKey] : null
  const interpretation =
    signId && !sephirot.ascendantNode
      ? getSephirotInterpretation(
          sephirot.id,
          sephirot.planetKey ?? null,
          signId,
          interpretationsMap,
        )
      : null

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-border shrink-0 border-b px-6 py-5 sm:px-8">
        <p className="text-primary/80 text-xs font-medium tracking-[0.15em] uppercase">
          Desglose
        </p>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <h2 className="font-heading text-foreground text-xl font-semibold tracking-tight">
            {sephirot.label}
          </h2>
          {/* {planet && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="font-astro text-primary text-xl">
                {astroGlyphForDisplay(planet.glyph)}
              </span>
              <span className="text-muted-foreground text-sm">{planet.label}</span>
            </>
          )} */}
          {sephirot.ascendantNode && (
            <span className="text-muted-foreground text-sm">Ascendente</span>
          )}
        </div>
      </div>

      <div className="breakdown-panel-scroll min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
        <div className="space-y-8 pb-8">
          {planet && (
            <section className="space-y-4">
              <h3 className="text-foreground text-sm font-semibold">
                Planeta natural
              </h3>
              <div className="flex items-center gap-3">
                <span className="font-astro text-primary text-2xl">
                  {astroGlyphForDisplay(planet.glyph)}
                </span>
                <span className="text-foreground font-medium">{planet.label}</span>
              </div>
              <HebrewBlock
                title="Letra sagrada e Inteligencia"
                hebrewChar={planet.hebrewChar}
                letterName={planet.letterName}
                intelligence={planet.intelligence}
              />
            </section>
          )}

          {planet && <Separator className="bg-border/80" />}

          <section className="space-y-4">
            <h3 className="text-foreground text-sm font-semibold">
              Signo en esta posición
            </h3>
            {sign ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="font-astro text-primary text-2xl">
                    {astroGlyphForDisplay(sign.glyph)}
                  </span>
                  <span className="text-foreground font-medium">{sign.label}</span>
                </div>
                <HebrewBlock
                  title="Letra sagrada e Inteligencia"
                  hebrewChar={sign.hebrewChar}
                  letterName={sign.letterName}
                  intelligence={sign.intelligence}
                />
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                No hay signo asignado para esta posición.
              </p>
            )}
          </section>

          {interpretation && (
            <>
              <Separator className="bg-border/80" />
              <section className="space-y-4">
                <h3 className="text-foreground text-sm font-semibold">
                  Interpretación
                </h3>
                <div className="text-muted-foreground space-y-4 text-sm leading-relaxed">
                  {INTERPRETATION_SECTIONS.map((section) => {
                    const content = interpretation.sections?.[section.key]?.trim() ?? ''
                    if (!content) return null
                    return (
                      <section key={section.key} className="space-y-2 border-border/50 border-l-2">
                        <h4 className="text-foreground text-xs font-semibold tracking-wide uppercase">
                          {section.label}
                        </h4>
                        {renderSectionContent(content)}
                      </section>
                    )
                  })}
                </div>
              </section>
            </>
          )}

          {sephirot.ascendantNode && (
            <>
              <Separator className="bg-border/80" />
              <p className="text-muted-foreground text-sm leading-relaxed">
                Malkuth enlaza con el{' '}
                <strong className="text-foreground font-medium">ascendente</strong>
                : aquí solo aplica la correspondencia del{' '}
                <strong className="text-foreground font-medium">signo</strong>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
