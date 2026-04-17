'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { SEPHIROT_BY_ID } from '@/data/correspondences'
import {
  isAssignmentsComplete,
  readAssignmentsFromSession,
} from '@/lib/assignments'
import { buttonVariants } from '@/components/ui/button-variants'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TREE_VIEW_GLYPHS,
  TREE_VIEW_HEBREW,
  TREE_VIEW_INTELLIGENCE,
  TREE_VIEW_DEFAULT,
} from '@/lib/treeViewModes'
import { CopyShareButton } from '@/components/CopyShareButton/CopyShareButton'
import { BreakdownPanel } from './BreakdownPanel'
import { TreeOfLifeSvg } from './TreeOfLifeSvg'

/**
 * @param {object} [props]
 * @param {Record<string, string> | null} [props.initialAssignments] — desde servidor (/p/[id]); si existe, no usa sessionStorage
 * @param {string} [props.backHref]
 * @param {string} [props.backLabel]
 * @param {boolean} [props.showBackButton]
 * @param {string | null} [props.subtitle] — ej. nombre del perfil
 */
export function TreeOfLifeScreen({
  initialAssignments = null,
  backHref = '/',
  backLabel = 'Volver a asignación',
  showBackButton = true,
  subtitle = null,
}) {
  const router = useRouter()
  const [assignments, setAssignments] = useState(null)
  const [ready, setReady] = useState(false)
  const [selectedId, setSelectedId] = useState('tiphareth')
  const [treeViewMode, setTreeViewMode] = useState(TREE_VIEW_DEFAULT)
  const [shareUrl, setShareUrl] = useState('')
  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  useEffect(() => {
    if (initialAssignments != null) {
      if (!isAssignmentsComplete(initialAssignments)) {
        router.replace('/')
        return
      }
      queueMicrotask(() => {
        setAssignments(initialAssignments)
        setReady(true)
      })
      return
    }

    const data = readAssignmentsFromSession()
    if (!isAssignmentsComplete(data)) {
      router.replace('/')
      return
    }
    queueMicrotask(() => {
      setAssignments(data)
      setReady(true)
    })
  }, [router, initialAssignments])

  useEffect(() => {
    setShareUrl(window.location.href)
  }, [])

  if (!ready || !assignments) {
    return (
      <div className="bg-background flex min-h-dvh items-center justify-center px-4">
        <p className="text-muted-foreground text-sm">Cargando árbol…</p>
      </div>
    )
  }

  const selected = selectedId ? SEPHIROT_BY_ID[selectedId] : null
  const treePages = [
    {
      id: TREE_VIEW_GLYPHS,
      title: 'Signo / planeta',
    },
    {
      id: TREE_VIEW_HEBREW,
      title: 'Letras hebreas',
    },
    {
      id: TREE_VIEW_INTELLIGENCE,
      title: 'Inteligencias',
    },
  ]

  return (
    <>
      <div className="tree-screen-shell bg-background text-foreground flex min-h-dvh flex-col lg:h-dvh lg:max-h-dvh lg:min-h-0 lg:flex-row lg:overflow-hidden">
      {/* Árbol — columna principal */}
      <div className="border-border relative flex min-h-[min(52vh,520px)] flex-1 flex-col border-b lg:min-h-0 lg:overflow-hidden lg:border-r lg:border-b-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_75%_at_45%_45%,oklch(0.28_0.07_285/0.28),transparent_75%)]"
        />
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="tree-panel-scroll flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain px-4 py-6 sm:px-8 sm:py-8">
            <header className="mb-4 flex shrink-0 flex-row items-start justify-between gap-4 sm:mb-0">
              <div className="space-y-1">
                {showBackButton ? (
                  <Link
                    href={backHref}
                    className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'mb-3' })}
                  >
                    ← {backLabel}
                  </Link>
                ) : null}
                <p className="text-primary/80 text-xs font-medium tracking-[0.2em] uppercase">
                  Astrohacking
                </p>
                <h1 className="font-heading text-2xl font-semibold tracking-tight">
                  Árbol de la vida
                </h1>
                {subtitle ? (
                  <p className="text-muted-foreground text-sm">{subtitle}</p>
                ) : null}
              </div>
              <div className="flex w-30 shrink-0 flex-col gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'default',
                    className: 'w-full justify-center',
                  })}
                >
                  Imprimir
                </button>
                <CopyShareButton
                  url={shareUrl}
                  variant="outline"
                  size="default"
                  className="w-full justify-center"
                />
              </div>
            </header>

            <div className="min-h-[min(240px,36vh)] flex-1 lg:min-h-0">
              <div className="flex min-h-full items-center justify-center pt-2 pb-2 lg:pt-0 lg:pb-6">
                <div className="w-full max-w-[520px] shrink-0 lg:max-w-[560px]">
                  <TreeOfLifeSvg
                    assignments={assignments}
                    selectedId={selectedId}
                    viewMode={treeViewMode}
                    onSelect={setSelectedId}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-border bg-muted/50 mt-auto flex w-full shrink-0 flex-col overflow-hidden border-t">
            <p className="text-primary/70 px-4 pt-2 pb-2 text-[10px] font-medium tracking-[0.18em] uppercase sm:px-6">
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

      <aside
        className="bg-muted/35 border-border flex w-full min-h-0 shrink-0 flex-col overflow-hidden border-t lg:h-full lg:w-[min(420px,42vw)] xl:w-[440px] lg:flex-none lg:border-t-0 lg:border-l"
        aria-label="Panel de correspondencias"
      >
        <BreakdownPanel sephirot={selected} assignments={assignments} />
      </aside>
      </div>

      <div className="tree-print-document">
        {treePages.map((page) => (
          <section key={page.id} className="tree-print-page">
            <header className="tree-print-header">
              <p className="tree-print-kicker">Astrohacking</p>
              <h1 className="tree-print-title">Arbol de la vida</h1>
              {subtitle ? <p className="tree-print-subtitle">{subtitle}</p> : null}
              <p className="tree-print-view">{page.title}</p>
            </header>
            <div className="tree-print-canvas">
              <TreeOfLifeSvg
                assignments={assignments}
                selectedId={selectedId}
                viewMode={page.id}
                onSelect={() => {}}
              />
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
