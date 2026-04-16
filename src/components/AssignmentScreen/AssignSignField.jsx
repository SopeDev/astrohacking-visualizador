'use client'

import {
  NATURAL_PLANETS,
  ZODIAC_SIGNS,
  getSignById,
} from '@/data/correspondences'
import { astroGlyphForDisplay } from '@/lib/astroSymbols'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function rowMeta(row) {
  if (row.planetKey) {
    const p = NATURAL_PLANETS[row.planetKey]
    return { label: p.label, symbol: p.glyph }
  }
  if (row.key === 'northNode') {
    return { label: 'Nodo Norte', symbol: '\u260A' }
  }
  return { label: 'Ascendente', symbol: null }
}

/** Etiqueta + select de signo (una tarjeta por fila de asignación) */
export function AssignSignField({ rowKey, label, symbol, value, onValueChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_minmax(11rem,1fr)] sm:items-center sm:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        {symbol ? (
          <span
            className="font-astro text-xl leading-none text-primary tabular-nums"
            aria-hidden
          >
            {astroGlyphForDisplay(symbol)}
          </span>
        ) : (
          <span className="font-mono text-muted-foreground text-xs tracking-wide">
            Asc
          </span>
        )}
        <Label
          htmlFor={`sign-${rowKey}`}
          className="text-foreground cursor-default font-medium"
        >
          {label}
        </Label>
      </div>

      <Select
        value={value == null || value === '' ? undefined : value}
        onValueChange={onValueChange}
      >
        <SelectTrigger
          id={`sign-${rowKey}`}
          size="default"
          className="h-10 min-h-10 w-full max-w-none border-input/80 bg-background/50 dark:bg-input/25"
        >
          <SelectValue placeholder="Elige un signo">
            {(v) => {
              const s = getSignById(v)
              if (!s) return null
              return (
                <span className="flex items-center gap-2">
                  <span className="font-astro text-base text-primary">
                    {astroGlyphForDisplay(s.glyph)}
                  </span>
                  <span>{s.label}</span>
                </span>
              )
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="start" className="max-h-[min(320px,50vh)]">
          {ZODIAC_SIGNS.map((sign) => (
            <SelectItem key={sign.id} value={sign.id}>
              <span className="flex items-center gap-2">
                <span className="font-astro text-base text-primary">
                  {astroGlyphForDisplay(sign.glyph)}
                </span>
                {sign.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
