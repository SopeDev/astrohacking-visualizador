'use client'

import { useActionState } from 'react'
import {
  cancelAppointmentAction,
  createAppointmentAction,
  rescheduleAppointmentAction,
} from '@/app/admin/actions'
import { Button } from '@/components/ui/button'

function toDateTimeLocalValue(dateLike) {
  const date = new Date(dateLike)
  if (Number.isNaN(date.getTime())) return ''
  const offsetMs = date.getTimezoneOffset() * 60 * 1000
  const localDate = new Date(date.getTime() - offsetMs)
  return localDate.toISOString().slice(0, 16)
}

function fmtDateTime(dateLike) {
  const date = new Date(dateLike)
  if (Number.isNaN(date.getTime())) return 'Fecha inválida'
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function AppointmentRow({ profileId, appointment }) {
  const [rescheduleState, rescheduleFormAction] = useActionState(rescheduleAppointmentAction, null)
  const [cancelState, cancelFormAction] = useActionState(cancelAppointmentAction, null)

  return (
    <li className="space-y-3 rounded-md border border-border/70 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">{fmtDateTime(appointment.scheduledAt)}</p>
          <p className="text-xs text-muted-foreground">
            Estado:{' '}
            {appointment.status === 'scheduled'
              ? 'Programada'
              : appointment.status === 'completed'
                ? 'Completada'
                : 'Cancelada'}
          </p>
        </div>
      </div>

      {appointment.status === 'scheduled' ? (
        <div className="space-y-2">
          <form action={rescheduleFormAction} className="flex flex-wrap items-end gap-2">
            <input type="hidden" name="profileId" value={profileId} />
            <input type="hidden" name="appointmentId" value={appointment.id} />
            <label className="space-y-1 text-xs text-muted-foreground">
              Reagendar
              <input
                name="scheduledAt"
                type="datetime-local"
                required
                defaultValue={toDateTimeLocalValue(appointment.scheduledAt)}
                className="border-input bg-background text-foreground h-9 rounded-md border px-2 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            <Button type="submit" variant="secondary" size="sm">
              Guardar nueva fecha
            </Button>
          </form>
          <form action={cancelFormAction} className="flex flex-wrap gap-2">
            <input type="hidden" name="profileId" value={profileId} />
            <input type="hidden" name="appointmentId" value={appointment.id} />
            <Button type="submit" variant="outline" size="sm" name="mode" value="cancel">
              Cancelar cita
            </Button>
            <Button type="submit" variant="outline" size="sm" name="mode" value="delete">
              Eliminar
            </Button>
          </form>
          {rescheduleState?.ok === false ? (
            <p className="w-full text-xs text-destructive">{rescheduleState.error}</p>
          ) : null}
          {cancelState?.ok === false ? (
            <p className="w-full text-xs text-destructive">{cancelState.error}</p>
          ) : null}
        </div>
      ) : null}
    </li>
  )
}

export function AdminProfileAppointmentsPanel({ profileId, activeCycle, appointments }) {
  const [createState, createFormAction] = useActionState(createAppointmentAction, null)
  const usedSessions = appointments.filter((appointment) => appointment.status === 'completed').length
  const scheduledSessions = appointments.filter((appointment) => appointment.status === 'scheduled').length
  const remainingSessions = Math.max(activeCycle.sessionQuota - usedSessions - scheduledSessions, 0)

  return (
    <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4 sm:p-5">
      <div className="space-y-1">
        <h2 className="text-base font-semibold">Agenda de sesiones</h2>
        <p className="text-sm text-muted-foreground">
          Cupo del paquete activo: {activeCycle.sessionQuota} sesiones. Programadas o completadas:{' '}
          {usedSessions + scheduledSessions}. Disponibles: {remainingSessions}.
        </p>
      </div>

      <form action={createFormAction} className="grid gap-3 rounded-md border border-border/60 p-3 md:grid-cols-3">
        <input type="hidden" name="profileId" value={profileId} />
        <input type="hidden" name="cycleId" value={activeCycle.id} />
        <label className="space-y-1 text-xs text-muted-foreground md:col-span-2">
          Fecha y hora
          <input
            name="scheduledAt"
            type="datetime-local"
            required
            className="border-input bg-background text-foreground h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <div className="flex items-end">
          <Button type="submit" className="w-full">
            Agendar sesión
          </Button>
        </div>
        <label className="space-y-1 text-xs text-muted-foreground md:col-span-3">
          Notas (opcional)
          <textarea
            name="notes"
            rows={2}
            className="border-input bg-background text-foreground min-h-[70px] w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
      </form>

      {createState?.ok === false ? (
        <p className="text-sm text-destructive" role="alert">
          {createState.error}
        </p>
      ) : null}

      <div className="space-y-2">
        <p className="text-sm font-medium">Sesiones registradas</p>
        {appointments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no hay sesiones agendadas.</p>
        ) : (
          <ul className="space-y-2">
            {appointments.map((appointment) => (
              <AppointmentRow key={appointment.id} profileId={profileId} appointment={appointment} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
