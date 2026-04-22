'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  cancelAppointmentAction,
  completeAppointmentAction,
  reopenAppointmentAction,
  rescheduleAppointmentAction,
} from '@/app/admin/actions'
import { buttonVariants } from '@/components/ui/button-variants'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { SESSION_DURATION_MINUTES, THERAPY_PACKAGE_MAP } from '@/data/therapyPackages'
import { formatSessionInPackageLabel } from '@/lib/sessionCycleLabel'

function toDateTimeLocalValue(dateLike) {
  const date = new Date(dateLike)
  if (Number.isNaN(date.getTime())) return ''
  const offsetMs = date.getTimezoneOffset() * 60 * 1000
  const localDate = new Date(date.getTime() - offsetMs)
  return localDate.toISOString().slice(0, 16)
}

function fmtDateTimeLong(dateLike) {
  const date = new Date(dateLike)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function statusLabel(status) {
  if (status === 'scheduled') return 'Programada'
  if (status === 'completed') return 'Completada'
  if (status === 'cancelled') return 'Cancelada'
  return status
}

export function CalendarAppointmentDetailDialog({
  appointment,
  onClose,
  onUpdated,
}) {
  const [localError, setLocalError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setLocalError('')
  }, [appointment?.id])

  if (!appointment) return null

  const profileId = appointment.profile.id
  const pkgLabel =
    THERAPY_PACKAGE_MAP[appointment.cycle.packageType]?.label ??
    appointment.cycle.packageType
  const sessionInPackageLabel = formatSessionInPackageLabel(appointment)

  const runAction = async (actionFn, formData) => {
    setLocalError('')
    setBusy(true)
    try {
      const result = await actionFn(null, formData)
      if (result?.ok === false) {
        setLocalError(result.error ?? 'No se pudo completar la acción.')
        return
      }
      await onUpdated?.()
      onClose()
    } finally {
      setBusy(false)
    }
  }

  const handleBackdropKeyDown = (event) => {
    if (event.key === 'Escape') onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      onKeyDown={handleBackdropKeyDown}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <Card className="relative z-10 max-h-[min(90dvh,720px)] w-full max-w-md overflow-y-auto shadow-xl">
        <CardHeader className="border-border border-b pb-4">
          <CardTitle className="text-lg">Sesión</CardTitle>
          <p className="text-muted-foreground text-sm font-normal">{appointment.profile.label}</p>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Fecha y hora
            </p>
            <p className="capitalize">{fmtDateTimeLong(appointment.scheduledAt)}</p>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Paquete
            </p>
            <p>{pkgLabel}</p>
            {sessionInPackageLabel ? (
              <p className="text-muted-foreground text-xs">{sessionInPackageLabel}</p>
            ) : null}
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Duración
            </p>
            <p>{SESSION_DURATION_MINUTES} minutos</p>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Estado
            </p>
            <p>{statusLabel(appointment.status)}</p>
          </div>
          {appointment.notes ? (
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Notas
              </p>
              <p className="whitespace-pre-wrap">{appointment.notes}</p>
            </div>
          ) : null}

          {localError ? (
            <p className="text-destructive text-sm" role="alert">
              {localError}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              href={`/p/${profileId}`}
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              Ver árbol
            </Link>
            <Link
              href={`/profiles/${profileId}/edit`}
              className={buttonVariants({ variant: 'secondary', size: 'sm' })}
            >
              Editar perfil/citas
            </Link>
          </div>

          {appointment.status === 'scheduled' ? (
            <div className="border-border space-y-3 border-t pt-4">
              <form
                className="flex flex-wrap gap-2"
                onSubmit={async (event) => {
                  event.preventDefault()
                  await runAction(completeAppointmentAction, new FormData(event.currentTarget))
                }}
              >
                <input type="hidden" name="profileId" value={profileId} />
                <input type="hidden" name="appointmentId" value={appointment.id} />
                <Button type="submit" disabled={busy}>
                  Marcar como completada
                </Button>
              </form>

              <form
                className="flex flex-wrap items-end gap-2"
                onSubmit={async (event) => {
                  event.preventDefault()
                  await runAction(rescheduleAppointmentAction, new FormData(event.currentTarget))
                }}
              >
                <input type="hidden" name="profileId" value={profileId} />
                <input type="hidden" name="appointmentId" value={appointment.id} />
                <div className="flex min-w-[200px] flex-1 flex-col gap-1">
                  <Label htmlFor={`reschedule-${appointment.id}`}>Reagendar</Label>
                  <input
                    id={`reschedule-${appointment.id}`}
                    name="scheduledAt"
                    type="datetime-local"
                    required
                    defaultValue={toDateTimeLocalValue(appointment.scheduledAt)}
                    className="border-input bg-background text-foreground h-10 rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <Button type="submit" variant="outline" disabled={busy}>
                  Guardar nueva fecha
                </Button>
              </form>

              <div className="flex flex-wrap gap-2">
                <form
                  onSubmit={async (event) => {
                    event.preventDefault()
                    const fd = new FormData(event.currentTarget)
                    fd.set('mode', 'cancel')
                    await runAction(cancelAppointmentAction, fd)
                  }}
                >
                  <input type="hidden" name="profileId" value={profileId} />
                  <input type="hidden" name="appointmentId" value={appointment.id} />
                  <Button type="submit" variant="outline" disabled={busy}>
                    Cancelar cita
                  </Button>
                </form>
                <form
                  onSubmit={async (event) => {
                    event.preventDefault()
                    const fd = new FormData(event.currentTarget)
                    fd.set('mode', 'delete')
                    await runAction(cancelAppointmentAction, fd)
                  }}
                >
                  <input type="hidden" name="profileId" value={profileId} />
                  <input type="hidden" name="appointmentId" value={appointment.id} />
                  <Button type="submit" variant="outline" disabled={busy}>
                    Eliminar
                  </Button>
                </form>
              </div>
            </div>
          ) : null}

          {appointment.status === 'completed' ? (
            <div className="border-border space-y-3 border-t pt-4">
              <form
                onSubmit={async (event) => {
                  event.preventDefault()
                  await runAction(reopenAppointmentAction, new FormData(event.currentTarget))
                }}
              >
                <input type="hidden" name="profileId" value={profileId} />
                <input type="hidden" name="appointmentId" value={appointment.id} />
                <Button type="submit" variant="outline" disabled={busy}>
                  Volver a marcar como programada
                </Button>
              </form>
              <form
                onSubmit={async (event) => {
                  event.preventDefault()
                  const fd = new FormData(event.currentTarget)
                  fd.set('mode', 'delete')
                  await runAction(cancelAppointmentAction, fd)
                }}
              >
                <input type="hidden" name="profileId" value={profileId} />
                <input type="hidden" name="appointmentId" value={appointment.id} />
                <Button type="submit" variant="outline" disabled={busy}>
                  Eliminar registro
                </Button>
              </form>
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="border-border flex justify-end border-t">
          <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>
            Cerrar
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
