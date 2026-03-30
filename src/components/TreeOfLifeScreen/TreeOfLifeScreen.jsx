'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SEPHIROT_BY_ID } from '@/data/correspondences'
import {
  isAssignmentsComplete,
  readAssignmentsFromSession,
} from '@/lib/assignments'
import { buttonVariants } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TREE_VIEW_GLYPHS,
  TREE_VIEW_HEBREW,
  TREE_VIEW_INTELLIGENCE,
  TREE_VIEW_DEFAULT,
} from '@/lib/treeViewModes'
import { BreakdownPanel } from './BreakdownPanel'
import { TreeOfLifeSvg } from './TreeOfLifeSvg'

export function TreeOfLifeScreen() {
  const router = useRouter()
  const [assignments, setAssignments] = useState(null)
  const [ready, setReady] = useState(false)
  const [selectedId, setSelectedId] = useState('tiphareth')
  const [treeViewMode, setTreeViewMode] = useState(TREE_VIEW_DEFAULT)

  useEffect(() => {
    const data = readAssignmentsFromSession()
    if (!isAssignmentsComplete(data)) {
      router.replace('/')
      return
    }
    queueMicrotask(() => {
      setAssignments(data)
      setReady(true)
    })
  }, [router])

  if (!ready || !assignments) {
    return (
      <div className="bg-background flex min-h-dvh items-center justify-center px-4">
        <p className="text-muted-foreground text-sm">Cargando árbol…</p>
      </div>
    )
  }

  const selected = selectedId ? SEPHIROT_BY_ID[selectedId] : null

  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col lg:min-h-dvh lg:flex-row">
      {/* Árbol — columna principal */}
      <div className="border-border relative flex min-h-[min(52vh,520px)] flex-1 flex-col border-b lg:min-h-dvh lg:min-h-0 lg:border-r lg:border-b-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_75%_at_45%_45%,oklch(0.28_0.07_285/0.28),transparent_75%)]"
        />
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8">
            <header className="mb-4 flex shrink-0 flex-col gap-4 sm:mb-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <p className="text-primary/80 text-xs font-medium tracking-[0.2em] uppercase">
                  Astrohacking
                </p>
                <h1 className="font-heading text-2xl font-semibold tracking-tight">
                  Árbol de la vida
                </h1>
              </div>
              <Link
                href="/"
                className={buttonVariants({
                  variant: 'outline',
                  size: 'default',
                  className: 'shrink-0',
                })}
              >
                Volver a asignación
              </Link>
            </header>

            <div className="flex min-h-[min(280px,38vh)] flex-1 items-center justify-center lg:min-h-0 lg:items-center lg:justify-center lg:pt-2">
              <div className="w-full max-w-[520px] lg:max-w-[560px]">
                <TreeOfLifeSvg
                  assignments={assignments}
                  selectedId={selectedId}
                  viewMode={treeViewMode}
                  onSelect={setSelectedId}
                />
              </div>
            </div>
          </div>

          {/* Cinta tipo Excel: pegada al borde inferior del panel, pestañas planas */}
          <div className="border-border bg-muted/50 mt-auto flex w-full shrink-0 flex-col overflow-hidden border-t">
            <p className="text-primary/70 px-4 pt-2 pb-1 text-[10px] font-medium tracking-[0.18em] uppercase sm:px-6">
              Vista del árbol
            </p>
            <Tabs
              value={treeViewMode}
              onValueChange={setTreeViewMode}
              className="w-full gap-0"
            >
              <TabsList
                variant="line"
                className="grid h-11 min-h-11 w-full grid-cols-3 gap-0 rounded-none border-0 border-x border-primary/35 border-t border-border/80 bg-muted/55 p-0 shadow-none !h-11 overflow-hidden"
              >
                <TabsTrigger
                  value={TREE_VIEW_GLYPHS}
                  className="excel-tab-trigger"
                >
                  Signo / planeta
                </TabsTrigger>
                <TabsTrigger
                  value={TREE_VIEW_HEBREW}
                  className="excel-tab-trigger"
                >
                  Letras hebreas
                </TabsTrigger>
                <TabsTrigger
                  value={TREE_VIEW_INTELLIGENCE}
                  className="excel-tab-trigger"
                >
                  Inteligencias
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Sidebar — panel de datos */}
      <aside
        className="bg-muted/35 border-border flex w-full shrink-0 flex-col border-t lg:w-[min(420px,42vw)] xl:w-[440px] lg:min-h-dvh lg:border-t-0 lg:border-l"
        aria-label="Panel de correspondencias"
      >
        <BreakdownPanel sephirot={selected} assignments={assignments} />
      </aside>
    </div>
  )
}
