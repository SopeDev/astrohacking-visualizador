'use client'

import { useActionState, useMemo, useState } from 'react'
import { ASSIGNMENT_ROWS } from '@/data/correspondences'
import { THERAPY_PACKAGE_MAP, THERAPY_PACKAGES } from '@/data/therapyPackages'
import { AdminProfileAppointmentsPanel } from '@/components/AdminProfileAppointmentsPanel/AdminProfileAppointmentsPanel'
import { AssignSignField, rowMeta } from '@/components/AssignmentScreen/AssignSignField'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { createProfileAction, updateProfileAction } from '@/app/admin/actions'

/** @param {{ mode: 'create' | 'edit', initial?: { id: string, label: string, notes: string | null, assignments: Record<string, string>, activeCycle?: { id: string, packageType: string, sessionQuota: number } | null, appointments?: Array<{ id: string, scheduledAt: string, status: string }> } | null }} props */
export function AdminProfileForm({ mode, initial = null }) {
  const initialAssignments = useMemo(() => {
    const m = {}
    for (const row of ASSIGNMENT_ROWS) {
      m[row.key] = initial?.assignments?.[row.key] ?? null
    }
    return m
  }, [initial])

  const [assignments, setAssignments] = useState(initialAssignments)
  const [packageType, setPackageType] = useState(
    initial?.activeCycle?.packageType ?? THERAPY_PACKAGES[0].value,
  )
  const action = mode === 'create' ? createProfileAction : updateProfileAction
  const [state, formAction] = useActionState(action, null)
  const activeAppointments = useMemo(
    () =>
      (initial?.appointments ?? []).filter(
        (appointment) => appointment.status === 'scheduled' || appointment.status === 'completed',
      ),
    [initial?.appointments],
  )
  const activeCycleForSchedule =
    initial?.activeCycle && initial.activeCycle.packageType === packageType
      ? initial.activeCycle
      : null

  const setSign = (rowKey, signId) => {
    setAssignments((prev) => ({ ...prev, [rowKey]: signId }))
  }

  return (
    <div className="space-y-8">
      <form action={formAction} className="space-y-8">
      {mode === 'edit' && initial?.id ? (
        <input type="hidden" name="profileId" value={initial.id} />
      ) : null}

      {state?.ok === false ? (
        <p className="text-destructive text-sm" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="space-y-3">
        <Label htmlFor="profile-label">Nombre del perfil</Label>
        <input
          id="profile-label"
          name="label"
          type="text"
          required
          defaultValue={initial?.label ?? ''}
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full max-w-md rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="profile-notes">Notas (opcional)</Label>
        <textarea
          id="profile-notes"
          name="notes"
          rows={3}
          defaultValue={initial?.notes ?? ''}
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full max-w-lg rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="profile-package">Paquete terapéutico</Label>
        <select
          id="profile-package"
          name="packageType"
          value={packageType}
          onChange={(event) => setPackageType(event.target.value)}
          className="border-input bg-background text-foreground h-10 w-full max-w-md rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {THERAPY_PACKAGES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label} ({item.sessionQuota} sesiones)
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Cupo del paquete seleccionado: {THERAPY_PACKAGE_MAP[packageType]?.sessionQuota ?? 0}{' '}
          sesiones.
        </p>
      </div>

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
              <input type="hidden" name={row.key} value={value ?? ''} />
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-3 justify-end">
        <Button type="submit" size="lg">
          {mode === 'create' ? 'Crear perfil' : 'Guardar cambios'}
        </Button>
      </div>
      </form>

      {mode === 'edit' && initial?.id && activeCycleForSchedule ? (
        <AdminProfileAppointmentsPanel
          profileId={initial.id}
          activeCycle={activeCycleForSchedule}
          appointments={activeAppointments.filter(
            (appointment) => appointment.cycleId === activeCycleForSchedule.id,
          )}
        />
      ) : null}
    </div>
  )
}
