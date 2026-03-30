'use client'

import { useMemo, useState } from 'react'
import {
  ASSIGNMENT_ROWS,
  ASSIGNMENTS_STORAGE_KEY,
  NATURAL_PLANETS,
  ZODIAC_SIGNS,
  getSignById,
} from '@/data/correspondences'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function rowMeta(row) {
  if (row.planetKey) {
    const p = NATURAL_PLANETS[row.planetKey]
    return { label: p.label, symbol: p.glyph }
  }
  return { label: 'Ascendente', symbol: null }
}

export function AssignmentScreen() {
  const initial = useMemo(() => {
    const m = {}
    for (const row of ASSIGNMENT_ROWS) {
      m[row.key] = null
    }
    return m
  }, [])

  const [assignments, setAssignments] = useState(initial)
  const [saved, setSaved] = useState(false)

  const allChosen = ASSIGNMENT_ROWS.every((row) => assignments[row.key] != null)

  const setSign = (rowKey, signId) => {
    setAssignments((prev) => ({ ...prev, [rowKey]: signId }))
    setSaved(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!allChosen) return
    const payload = Object.fromEntries(
      ASSIGNMENT_ROWS.map((row) => [row.key, assignments[row.key]]),
    )
    try {
      sessionStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(payload))
    } catch {
      /* ignore quota / private mode */
    }
    setSaved(true)
  }

  return (
    <div className="relative min-h-full overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_75%_45%_at_50%_-18%,oklch(0.28_0.07_285/0.35),transparent_55%)]"
      />
      <div className="relative mx-auto max-w-xl px-4 py-14 sm:px-6 sm:py-20">
        <header className="mb-12 space-y-3 text-center sm:text-left">
          <p className="text-xs font-medium tracking-[0.2em] text-primary/80 uppercase">
            Astrohacking
          </p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Asignación de signos
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Elige el signo zodiacal que corresponde a cada cuerpo celeste y al
            ascendente. Esto prepara el mapa hacia el Árbol de la vida.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="divide-border/40 divide-y rounded-xl border border-border/70 bg-card/40 px-4 shadow-sm backdrop-blur-sm sm:px-5">
            {ASSIGNMENT_ROWS.map((row) => {
              const { label, symbol } = rowMeta(row)
              const value = assignments[row.key]
              return (
                <div
                  key={row.key}
                  className="grid gap-3 py-5 sm:grid-cols-[1fr_minmax(12rem,16rem)] sm:items-center sm:gap-6"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {symbol ? (
                      <span
                        className="font-astro text-xl leading-none text-primary tabular-nums"
                        aria-hidden
                      >
                        {symbol}
                      </span>
                    ) : (
                      <span className="font-mono text-muted-foreground text-xs tracking-wide">
                        Asc
                      </span>
                    )}
                    <Label
                      htmlFor={`sign-${row.key}`}
                      className="text-foreground cursor-default font-medium"
                    >
                      {label}
                    </Label>
                  </div>

                  <Select
                    value={value}
                    onValueChange={(signId) => setSign(row.key, signId)}
                  >
                    <SelectTrigger
                      id={`sign-${row.key}`}
                      size="default"
                      className="h-10 min-h-10 w-full max-w-none border-input/80 bg-background/50 sm:w-full dark:bg-input/25"
                    >
                      <SelectValue placeholder="Elige un signo">
                        {(v) => {
                          const s = getSignById(v)
                          if (!s) return null
                          return (
                            <span className="flex items-center gap-2">
                              <span className="font-astro text-base text-primary">
                                {s.glyph}
                              </span>
                              <span>{s.label}</span>
                            </span>
                          )
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent
                      align="start"
                      className="max-h-[min(320px,50vh)]"
                    >
                      {ZODIAC_SIGNS.map((sign) => (
                        <SelectItem key={sign.id} value={sign.id}>
                          <span className="flex items-center gap-2">
                            <span className="font-astro text-base text-primary">
                              {sign.glyph}
                            </span>
                            {sign.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="submit"
              size="lg"
              disabled={!allChosen}
              className="w-full sm:w-auto"
            >
              Continuar
            </Button>
            {saved && (
              <p className="text-muted-foreground text-center text-sm sm:text-left">
                Asignaciones guardadas en esta sesión. La vista del árbol llegará
                en el siguiente paso.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
