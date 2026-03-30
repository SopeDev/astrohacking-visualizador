'use client'

import { NATURAL_PLANETS, getSignById } from '@/data/correspondences'
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

export function BreakdownPanel({ sephirot, assignments }) {
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

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
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
