'use client'

import { useCallback } from 'react'
import {
  NATURAL_PLANETS,
  SEPHIROT,
  SEPHIROT_BY_ID,
  TREE_EDGES,
  getSignById,
} from '@/data/correspondences'
import { astroGlyphForDisplay } from '@/lib/astroSymbols'
import {
  TREE_VIEW_GLYPHS,
  TREE_VIEW_HEBREW,
  TREE_VIEW_INTELLIGENCE,
} from '@/lib/treeViewModes'

const VB_W = 400
const VB_H = 540
/** Radius sefirá — larger so paired glyphs read clearly */
const R = 36
/** Horizontal half-gap between sign (left) and planet (right) glyph centers */
const GLYPH_HALF_GAP = 17
/** Vertical offset from node center (viewBox units). Tuned so glyphs read centered in the circle (~45 vs ~50 visual). */
const GLYPH_Y_OFFSET = 3
const SIGN_PX = '17px'
const PLANET_PX = '19px'
const ASC_MONO_PX = '11px'
const HEBREW_SIGN_PX = '18px'
const HEBREW_PLANET_PX = '19px'

function edgeParallelSegments(x1, y1, x2, y2, spread = 3) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const ox = (-dy / len) * spread
  const oy = (dx / len) * spread
  return [
    { x1: x1 + ox, y1: y1 + oy, x2: x2 + ox, y2: y2 + oy },
    { x1: x1 - ox, y1: y1 - oy, x2: x2 - ox, y2: y2 - oy },
  ]
}

function SephiraLabels({
  viewMode,
  node,
  sign,
  planet,
  planetGlyph,
  signGlyph,
  yMid,
  hasSign,
  hasPlanet,
}) {
  const symStyleSign = { fontFamily: 'var(--font-symbols)', fontSize: SIGN_PX }
  const symStylePlanet = { fontFamily: 'var(--font-symbols)', fontSize: PLANET_PX }
  const heStyleSign = { fontFamily: 'var(--font-hebrew)', fontSize: HEBREW_SIGN_PX }
  const heStylePlanet = { fontFamily: 'var(--font-hebrew)', fontSize: HEBREW_PLANET_PX }

  if (viewMode === TREE_VIEW_GLYPHS) {
    return (
      <>
        {hasSign && hasPlanet && (
          <>
            <text
              x={node.x - GLYPH_HALF_GAP}
              y={yMid}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground font-astro select-none"
              style={symStyleSign}
            >
              {astroGlyphForDisplay(signGlyph)}
            </text>
            <text
              x={node.x + GLYPH_HALF_GAP}
              y={yMid}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-primary font-astro select-none"
              style={symStylePlanet}
            >
              {astroGlyphForDisplay(planetGlyph)}
            </text>
          </>
        )}
        {hasSign && !hasPlanet && (
          <>
            <text
              x={node.x - GLYPH_HALF_GAP}
              y={yMid}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground font-astro select-none"
              style={symStyleSign}
            >
              {astroGlyphForDisplay(signGlyph)}
            </text>
            <text
              x={node.x + GLYPH_HALF_GAP}
              y={yMid}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground font-mono tracking-wider select-none"
              style={{ fontSize: ASC_MONO_PX }}
            >
              Asc
            </text>
          </>
        )}
        {!hasSign && hasPlanet && (
          <text
            x={node.x}
            y={yMid}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-primary font-astro select-none"
            style={symStylePlanet}
          >
            {astroGlyphForDisplay(planetGlyph)}
          </text>
        )}
      </>
    )
  }

  if (viewMode === TREE_VIEW_HEBREW) {
    const sh = sign?.hebrewChar
    const ph = planet?.hebrewChar
    const hasHeSign = Boolean(sh)
    const hasHePlanet = Boolean(ph)

    return (
      <>
        {hasHeSign && hasHePlanet && (
          <>
            <text
              x={node.x - GLYPH_HALF_GAP}
              y={yMid}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground select-none"
              style={heStyleSign}
            >
              {sh}
            </text>
            <text
              x={node.x + GLYPH_HALF_GAP}
              y={yMid}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-primary select-none"
              style={heStylePlanet}
            >
              {ph}
            </text>
          </>
        )}
        {hasHeSign && !hasHePlanet && (
          <>
            <text
              x={node.x - GLYPH_HALF_GAP}
              y={yMid}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground select-none"
              style={heStyleSign}
            >
              {sh}
            </text>
            <text
              x={node.x + GLYPH_HALF_GAP}
              y={yMid}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground font-mono tracking-wider select-none"
              style={{ fontSize: ASC_MONO_PX }}
            >
              Asc
            </text>
          </>
        )}
        {!hasHeSign && hasHePlanet && (
          <text
            x={node.x}
            y={yMid}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-primary select-none"
            style={heStylePlanet}
          >
            {ph}
          </text>
        )}
      </>
    )
  }

  if (viewMode === TREE_VIEW_INTELLIGENCE) {
    const signIntel = sign?.intelligence ?? '—'
    const planetIntel = planet?.intelligence ?? (node.ascendantNode ? 'Ascendente' : '—')
    const foW = R * 2
    const foH = R * 2
    return (
      <foreignObject
        x={node.x - R}
        y={node.y - R}
        width={foW}
        height={foH}
        className="pointer-events-none"
        style={{ pointerEvents: 'none' }}
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          className="text-foreground box-border flex h-full flex-col items-stretch justify-center gap-0.5 px-0.5 text-center"
        >
          <span
            className="text-muted-foreground line-clamp-3 text-[7px] leading-[1.08]"
            title={signIntel}
          >
            {signIntel}
          </span>
          <span className="text-primary line-clamp-3 text-[7px] leading-[1.08]" title={planetIntel}>
            {planetIntel}
          </span>
        </div>
      </foreignObject>
    )
  }

  return null
}

export function TreeOfLifeSvg({ assignments, selectedId, onSelect, viewMode }) {
  const mode = viewMode ?? TREE_VIEW_GLYPHS

  const handleKey = useCallback(
    (e, id) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onSelect(id)
      }
    },
    [onSelect],
  )

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-auto w-full max-w-lg touch-manipulation sm:max-w-xl"
      role="img"
      aria-label="Árbol de la vida — pulsa una sefirá para ver el desglose"
    >
      <defs>
        <filter id="tree-soft-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className="text-border/55 dark:text-border/50">
        {TREE_EDGES.map(([a, b], i) => {
          const A = SEPHIROT_BY_ID[a]
          const B = SEPHIROT_BY_ID[b]
          if (!A || !B) return null
          const segs = edgeParallelSegments(A.x, A.y, B.x, B.y, 3.2)
          return (
            <g key={`${a}-${b}-${i}`}>
              {segs.map((s, j) => (
                <line
                  key={j}
                  x1={s.x1}
                  y1={s.y1}
                  x2={s.x2}
                  y2={s.y2}
                  stroke="currentColor"
                  strokeWidth={1.35}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          )
        })}
      </g>

      {SEPHIROT.map((node) => {
        const selected = selectedId === node.id
        const planet = node.planetKey ? NATURAL_PLANETS[node.planetKey] : null
        const planetGlyph = planet?.glyph
        const sign = getSignById(assignments?.[node.assignmentKey])
        const signGlyph = sign?.glyph

        const fillCls = selected
          ? 'fill-primary/15 stroke-primary'
          : 'fill-card/90 stroke-border/80 dark:fill-card/80'
        const strokeW = selected ? 2.6 : 1.4
        const dash = node.daat ? '6 5' : undefined

        const planetName = planet?.label ?? 'Ascendente'
        const signName = sign?.label ?? 'signo'
        const ariaLabel = `${node.label}. Signo: ${signName}. ${node.ascendantNode ? 'Ascendente' : `Planeta: ${planetName}`}`

        const yMid = node.y + GLYPH_Y_OFFSET
        const hasSign = Boolean(signGlyph)
        const hasPlanet = Boolean(planetGlyph)

        return (
          <g
            key={node.id}
            role="button"
            tabIndex={0}
            className="cursor-pointer outline-none"
            onClick={() => onSelect(node.id)}
            onKeyDown={(e) => handleKey(e, node.id)}
            aria-pressed={selected}
            aria-label={ariaLabel}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={R}
              className={`transition-[stroke-width,fill] duration-150 ${fillCls}`}
              strokeWidth={strokeW}
              strokeDasharray={dash}
              vectorEffect="non-scaling-stroke"
              filter={selected ? 'url(#tree-soft-glow)' : undefined}
            />
            <SephiraLabels
              viewMode={mode}
              node={node}
              sign={sign}
              planet={planet}
              planetGlyph={planetGlyph}
              signGlyph={signGlyph}
              yMid={yMid}
              hasSign={hasSign}
              hasPlanet={hasPlanet}
            />
          </g>
        )
      })}
    </svg>
  )
}
