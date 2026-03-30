'use client'

import { useCallback } from 'react'
import {
  LUNAR_NORTH_NODE_GLYPH,
  LUNAR_SOUTH_NODE_GLYPH,
  NATURAL_PLANETS,
  SEPHIROT,
  SEPHIROT_BY_ID,
  TREE_EDGES,
  getOppositeSignId,
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
          <text
            x={node.x}
            y={yMid}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground select-none"
            style={heStyleSign}
          >
            {sh}
          </text>
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
    const planetIntel = planet?.intelligence ?? '—'
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
          {node.ascendantNode ? (
            <span
              className="text-muted-foreground line-clamp-6 text-[8px] leading-[1.08]"
              title={signIntel}
            >
              {signIntel}
            </span>
          ) : (
            <>
              <span
                className="text-muted-foreground line-clamp-3 text-[8px] leading-[1.08]"
                title={signIntel}
              >
                {signIntel}
              </span>
              <span className="text-primary line-clamp-3 text-[8px] leading-[1.08]" title={planetIntel}>
                {planetIntel}
              </span>
            </>
          )}
        </div>
      </foreignObject>
    )
  }

  return null
}

/** Nodos lunares entre Jesod y Malkuth, a cada lado del sendero central (x = 200). */
function LunarNodesBridge({ assignments, viewMode }) {
  const northId = assignments?.northNode
  const northSign = getSignById(northId)
  const southId = northId ? getOppositeSignId(northId) : null
  const southSign = southId ? getSignById(southId) : null
  if (!northSign || !southSign) return null

  const yesod = SEPHIROT_BY_ID.yesod
  const malkuth = SEPHIROT_BY_ID.malkuth
  const cx = yesod.x
  const yMid = (yesod.y + malkuth.y) / 2 + GLYPH_Y_OFFSET

  const LX_NODE = cx - 80
  const LX_SIGN = cx - 52
  const RX_SIGN = cx + 52
  const RX_NODE = cx + 80

  const symSm = { fontFamily: 'var(--font-symbols)', fontSize: '15px' }
  const symMd = { fontFamily: 'var(--font-symbols)', fontSize: '16px' }
  const heSm = { fontFamily: 'var(--font-hebrew)', fontSize: '17px' }

  if (viewMode === TREE_VIEW_GLYPHS) {
    return (
      <g aria-hidden className="pointer-events-none">
        <text
          x={LX_NODE}
          y={yMid}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground font-astro select-none"
          style={symSm}
        >
          {astroGlyphForDisplay(LUNAR_SOUTH_NODE_GLYPH)}
        </text>
        <text
          x={LX_SIGN}
          y={yMid}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground font-astro select-none"
          style={symMd}
        >
          {astroGlyphForDisplay(southSign.glyph)}
        </text>
        <text
          x={RX_SIGN}
          y={yMid}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-primary font-astro select-none"
          style={symMd}
        >
          {astroGlyphForDisplay(northSign.glyph)}
        </text>
        <text
          x={RX_NODE}
          y={yMid}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-primary font-astro select-none"
          style={symSm}
        >
          {astroGlyphForDisplay(LUNAR_NORTH_NODE_GLYPH)}
        </text>
      </g>
    )
  }

  if (viewMode === TREE_VIEW_HEBREW) {
    return (
      <g aria-hidden className="pointer-events-none">
        <text
          x={LX_SIGN}
          y={yMid}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground select-none"
          style={heSm}
        >
          {southSign.hebrewChar}
        </text>
        <text
          x={RX_SIGN}
          y={yMid}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-primary select-none"
          style={heSm}
        >
          {northSign.hebrewChar}
        </text>
      </g>
    )
  }

  if (viewMode === TREE_VIEW_INTELLIGENCE) {
    const foW = 88
    const foH = 54
    const yTop = yMid - foH / 2
    return (
      <g aria-hidden className="pointer-events-none">
        <foreignObject
          x={cx - 110 - foW / 2}
          y={yTop}
          width={foW}
          height={foH}
          style={{ pointerEvents: 'none' }}
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            className="text-muted-foreground flex h-full flex-col justify-center text-right"
          >
            <span className="line-clamp-4 text-[8px] leading-tight" title={southSign.intelligence}>
              {southSign.intelligence}
            </span>
          </div>
        </foreignObject>
        <foreignObject
          x={cx + 110 - foW / 2}
          y={yTop}
          width={foW}
          height={foH}
          style={{ pointerEvents: 'none' }}
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            className="text-primary flex h-full flex-col justify-center text-left"
          >
            <span className="line-clamp-4 text-[8px] leading-tight" title={northSign.intelligence}>
              {northSign.intelligence}
            </span>
          </div>
        </foreignObject>
      </g>
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

      <LunarNodesBridge assignments={assignments} viewMode={mode} />

      {SEPHIROT.map((node) => {
        const selected = selectedId === node.id
        const planet = node.planetKey ? NATURAL_PLANETS[node.planetKey] : null
        const planetGlyph = planet?.glyph
        const sign = getSignById(assignments?.[node.assignmentKey])
        const signGlyph = sign?.glyph

        const fillCls = selected
          ? 'fill-card stroke-primary'
          : 'fill-card stroke-border/80'
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
