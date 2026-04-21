'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import { SEPHIROT, NATURAL_PLANETS, ZODIAC_SIGNS } from '@/data/correspondences'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RichTextEditorField } from '@/components/RichTextEditorField/RichTextEditorField'
import { upsertInterpretationAction } from '@/app/admin/actions'

const ASCENDANT_PLANET_KEY = 'ascendant'
const ASCENDANT_LABEL = 'Ascendente'

const EDITABLE_SEPHIROT = SEPHIROT.filter(
  (node) => Boolean(node.planetKey) || node.assignmentKey === ASCENDANT_PLANET_KEY,
)

function comboKey(sephirotId, signId) {
  return `${sephirotId}::${signId}`
}

const SECTION_FIELDS = [
  { key: 'secretToReveal', label: 'Secreto a revelar' },
  { key: 'mainReading', label: 'Lectura principal' },
  {
    key: 'dailyManifestation',
    label: 'Cómo se manifiesta en la vida cotidiana',
  },
  {
    key: 'shadowWork',
    label: 'Cómo se detecta y trabaja la sombra o desalineación',
  },
  { key: 'evolutionaryLearning', label: 'Aprendizaje evolutivo' },
  { key: 'integrationPractice', label: 'Práctica de integración' },
  {
    key: 'alignedManifestation',
    label: 'Cómo se manifiesta en su versión alineada',
  },
]

const EMPTY_SECTIONS = Object.fromEntries(SECTION_FIELDS.map((section) => [section.key, '']))

function sectionsFromEntry(entry) {
  if (!entry) return { ...EMPTY_SECTIONS }
  const fromDbSections =
    typeof entry.sections === 'object' && entry.sections !== null ? entry.sections : {}
  return { ...EMPTY_SECTIONS, ...fromDbSections }
}

export function InterpretationEditorPanel({ entries }) {
  const [sephirotId, setSephirotId] = useState(EDITABLE_SEPHIROT[0]?.id ?? '')
  const [signId, setSignId] = useState(ZODIAC_SIGNS[0]?.id ?? '')
  const [state, formAction, pending] = useActionState(upsertInterpretationAction, null)

  const entryByKey = useMemo(() => {
    const map = {}
    for (const entry of entries) {
      map[comboKey(entry.sephirotId, entry.signId)] = entry
    }
    return map
  }, [entries])

  const selectedSephirot = EDITABLE_SEPHIROT.find((node) => node.id === sephirotId) ?? null
  const selectedEntry = entryByKey[comboKey(sephirotId, signId)] ?? null
  const selectedPlanetKey =
    selectedSephirot?.planetKey ?? (selectedSephirot?.assignmentKey === ASCENDANT_PLANET_KEY
      ? ASCENDANT_PLANET_KEY
      : '')
  const [sections, setSections] = useState(() => sectionsFromEntry(selectedEntry))

  useEffect(() => {
    setSections(sectionsFromEntry(selectedEntry))
  }, [sephirotId, signId, selectedEntry?.updatedAt])

  return (
    <form action={formAction} className="space-y-6 rounded-xl border border-border p-5">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-2 w-fit">
          <Label htmlFor="editor-sephirot">Sefirá</Label>
          <select
            id="editor-sephirot"
            value={sephirotId}
            onChange={(event) => setSephirotId(event.target.value)}
            className="border-input bg-background text-foreground focus-visible:ring-ring h-10 w-auto max-w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            {EDITABLE_SEPHIROT.map((node) => (
              <option key={node.id} value={node.id}>
                {`${node.label} / ${
                  node.planetKey ? NATURAL_PLANETS[node.planetKey]?.label : ASCENDANT_LABEL
                }`}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 w-fit">
          <Label htmlFor="editor-sign">Signo</Label>
          <select
            id="editor-sign"
            value={signId}
            onChange={(event) => setSignId(event.target.value)}
            className="border-input bg-background text-foreground focus-visible:ring-ring h-10 w-auto max-w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            {ZODIAC_SIGNS.map((sign) => (
              <option key={sign.id} value={sign.id}>
                {sign.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <input type="hidden" name="sephirotId" value={sephirotId} />
      <input type="hidden" name="planetKey" value={selectedPlanetKey} />
      <input type="hidden" name="signId" value={signId} />

      {state?.ok === false ? (
        <p className="text-destructive text-sm" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? <p className="text-primary text-sm">Interpretación guardada.</p> : null}

      {SECTION_FIELDS.map((section) => (
        <div className="space-y-2" key={section.key}>
          <Label htmlFor={`editor-${section.key}`}>{section.label}</Label>
          <RichTextEditorField
            value={sections[section.key] ?? ''}
            onChange={(nextValue) =>
              setSections((prev) => ({
                ...prev,
                [section.key]: nextValue,
              }))
            }
          />
          <input type="hidden" name={section.key} value={sections[section.key] ?? ''} />
        </div>
      ))}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? 'Guardando...' : 'Guardar combinación'}
        </Button>
      </div>
    </form>
  )
}
