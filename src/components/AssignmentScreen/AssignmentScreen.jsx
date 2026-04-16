'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import {
  ASSIGNMENT_ROWS,
  ASSIGNMENTS_STORAGE_KEY,
} from '@/data/correspondences'
import { Button } from '@/components/ui/button'
import { AssignSignField, rowMeta } from './AssignSignField'

export function AssignmentScreen() {
  const router = useRouter()
  const initial = useMemo(() => {
    const m = {}
    for (const row of ASSIGNMENT_ROWS) {
      m[row.key] = null
    }
    return m
  }, [])

  const [assignments, setAssignments] = useState(initial)

  const allChosen = ASSIGNMENT_ROWS.every((row) => assignments[row.key] != null)

  const setSign = (rowKey, signId) => {
    setAssignments((prev) => ({ ...prev, [rowKey]: signId }))
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
    router.push('/arbol')
  }

  return (
    <div className="relative min-h-full overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_75%_45%_at_50%_-18%,oklch(0.28_0.07_285/0.35),transparent_55%)]"
      />
      <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <header className="mb-12 space-y-3 text-center sm:text-left">
          <p className="text-xs font-medium tracking-[0.2em] text-primary/80 uppercase">
            Astrohacking
          </p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Asignación de signos
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Elige el signo zodiacal que corresponde a cada cuerpo celeste, al
            ascendente y al nodo norte. Esto prepara el mapa hacia el Árbol de la
            vida.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ASSIGNMENT_ROWS.map((row) => {
              const { label, symbol } = rowMeta(row)
              const value = assignments[row.key]
              return (
                <div
                  key={row.key}
                  className="rounded-xl border border-border/70 bg-card/40 p-4 shadow-sm backdrop-blur-sm sm:p-5"
                >
                  <AssignSignField
                    rowKey={row.key}
                    label={label}
                    symbol={symbol}
                    value={value}
                    onValueChange={(signId) => setSign(row.key, signId)}
                  />
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
          </div>
        </form>
      </div>
    </div>
  )
}
