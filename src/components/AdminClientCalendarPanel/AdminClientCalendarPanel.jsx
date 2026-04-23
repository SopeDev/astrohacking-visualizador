'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { CalendarAppointmentDetailDialog } from '@/components/CalendarAppointmentDetailDialog/CalendarAppointmentDetailDialog'
import { THERAPY_PACKAGE_MAP } from '@/data/therapyPackages'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { formatSessionInPackageLabel } from '@/lib/sessionCycleLabel'
import { cn } from '@/lib/utils'

const WEEK_DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function startOfWeek(date) {
  const copy = new Date(date)
  const day = (copy.getDay() + 6) % 7
  copy.setDate(copy.getDate() - day)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function endOfWeek(date) {
  const copy = startOfWeek(date)
  copy.setDate(copy.getDate() + 6)
  copy.setHours(23, 59, 59, 999)
  return copy
}

function monthNameLong(date) {
  return date.toLocaleDateString('es-ES', { month: 'long' })
}

/** @param {Date} anchorDate */
function formatWeekRangeLabel(anchorDate) {
  const start = startOfWeek(anchorDate)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  const y0 = start.getFullYear()
  const y1 = end.getFullYear()
  const m0 = start.getMonth()
  const m1 = end.getMonth()
  const d0 = start.getDate()
  const d1 = end.getDate()
  if (y0 !== y1) {
    return `${d0} ${monthNameLong(start)} ${y0} – ${d1} ${monthNameLong(end)} ${y1}`
  }
  if (m0 !== m1) {
    return `${d0} ${monthNameLong(start)} – ${d1} ${monthNameLong(end)} ${y0}`
  }
  return `${d0}–${d1} ${monthNameLong(start)} ${y0}`
}

function monthRange(date) {
  return {
    start: new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0),
    end: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999),
  }
}

function toDayKey(dateLike) {
  const date = new Date(dateLike)
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function fmtTime(dateLike) {
  const date = new Date(dateLike)
  if (Number.isNaN(date.getTime())) return '--:--'
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function buildMonthCells(anchorDate) {
  const firstDay = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1)
  const firstVisible = startOfWeek(firstDay)
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstVisible)
    date.setDate(firstVisible.getDate() + index)
    return date
  })
}

export function AdminClientCalendarPanel({ initialAppointments = [] }) {
  const [view, setView] = useState('month')
  const [anchorDate, setAnchorDate] = useState(new Date())
  const [appointments, setAppointments] = useState(initialAppointments)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [error, setError] = useState('')
  const [calendarLoading, setCalendarLoading] = useState(() => initialAppointments.length === 0)
  const todayKey = toDayKey(new Date())
  const fetchSeqRef = useRef(0)
  const firstFetchEffectRef = useRef(true)
  const initialHadAppointmentsRef = useRef(initialAppointments.length > 0)

  const range = useMemo(() => {
    if (view === 'week') {
      return { start: startOfWeek(anchorDate), end: endOfWeek(anchorDate) }
    }
    return monthRange(anchorDate)
  }, [anchorDate, view])

  const refetchAppointments = useCallback(async (signal, options = {}) => {
    const { showLoading = true } = options
    const seq = ++fetchSeqRef.current
    if (showLoading) setCalendarLoading(true)
    setError('')
    const params = new URLSearchParams({
      start: range.start.toISOString(),
      end: range.end.toISOString(),
    })
    try {
      const response = await fetch(`/api/admin/appointments?${params.toString()}`, {
        ...(signal ? { signal } : {}),
      })
      if (seq !== fetchSeqRef.current) return
      if (!response.ok) {
        setError('No se pudo cargar el calendario')
        return
      }
      const payload = await response.json()
      setAppointments(payload.appointments ?? [])
    } catch (err) {
      if (err?.name === 'AbortError') return
      if (seq !== fetchSeqRef.current) return
      setError('No se pudo cargar el calendario')
    } finally {
      if (seq === fetchSeqRef.current) {
        setCalendarLoading(false)
      }
    }
  }, [range.end, range.start])

  const rangeKey = useMemo(
    () => `${view}|${range.start.getTime()}|${range.end.getTime()}`,
    [view, range.end, range.start],
  )

  const rangeKeyRef = useRef(null)
  useLayoutEffect(() => {
    if (rangeKeyRef.current === null) {
      rangeKeyRef.current = rangeKey
      return
    }
    if (rangeKeyRef.current !== rangeKey) {
      rangeKeyRef.current = rangeKey
      setAppointments([])
      setCalendarLoading(true)
    }
  }, [rangeKey])

  useEffect(() => {
    const controller = new AbortController()
    const silentFirst =
      firstFetchEffectRef.current && initialHadAppointmentsRef.current
    if (firstFetchEffectRef.current) {
      firstFetchEffectRef.current = false
    }
    refetchAppointments(controller.signal, { showLoading: !silentFirst })
    return () => controller.abort()
  }, [range.end, range.start, refetchAppointments, view])

  useEffect(() => {
    setSelectedAppointment(null)
  }, [rangeKey])

  const appointmentsByDay = useMemo(() => {
    return appointments.reduce((acc, appointment) => {
      const key = toDayKey(appointment.scheduledAt)
      if (!acc[key]) acc[key] = []
      acc[key].push(appointment)
      return acc
    }, {})
  }, [appointments])

  const monthCells = useMemo(() => buildMonthCells(anchorDate), [anchorDate])
  const weekDays = useMemo(() => {
    const first = startOfWeek(anchorDate)
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(first)
      date.setDate(first.getDate() + index)
      return date
    })
  }, [anchorDate])

  const movePeriod = (delta) => {
    setAnchorDate((prev) => {
      const next = new Date(prev)
      if (view === 'week') {
        next.setDate(next.getDate() + delta * 7)
      } else {
        next.setMonth(next.getMonth() + delta)
      }
      return next
    })
  }

  const handleAppointmentUpdated = useCallback(async () => {
    await refetchAppointments()
  }, [refetchAppointments])

  const periodLabel = useMemo(() => {
    if (view === 'week') {
      return formatWeekRangeLabel(anchorDate)
    }
    const rawMonth = anchorDate.toLocaleDateString('es-ES', { month: 'long' })
    const monthTitle =
      rawMonth.charAt(0).toLocaleUpperCase('es-ES') + rawMonth.slice(1)
    return `${monthTitle} ${anchorDate.getFullYear()}`
  }, [anchorDate, view])

  const prevNavLabel = view === 'week' ? 'Semana anterior' : 'Mes anterior'
  const nextNavLabel = view === 'week' ? 'Semana siguiente' : 'Mes siguiente'

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex shrink-0 items-center gap-2">
          <Button variant={view === 'month' ? 'default' : 'outline'} size="sm" onClick={() => setView('month')}>
            Mes
          </Button>
          <Button variant={view === 'week' ? 'default' : 'outline'} size="sm" onClick={() => setView('week')}>
            Semana
          </Button>
        </div>
        <div className="flex min-w-0 flex-1 flex-nowrap items-center justify-end gap-2">
          <Button variant="outline" size="sm" className="shrink-0" onClick={() => movePeriod(-1)}>
            {prevNavLabel}
          </Button>
          <p className="text-foreground shrink truncate px-1 text-center text-sm font-medium capitalize">
            {periodLabel}
          </p>
          <Button variant="outline" size="sm" className="shrink-0" onClick={() => movePeriod(1)}>
            {nextNavLabel}
          </Button>
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="relative min-h-[min(420px,70dvh)]">
        {calendarLoading ? (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-background/75 backdrop-blur-[2px]"
            aria-busy="true"
            aria-live="polite"
          >
            <Loader2 className="text-primary size-9 animate-spin" aria-hidden />
            <p className="text-muted-foreground text-sm font-medium">Cargando citas…</p>
          </div>
        ) : null}

        <div className={cn(calendarLoading && 'pointer-events-none opacity-45')}>
      {view === 'month' ? (
        <div className="space-y-2">
          <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground">
            {WEEK_DAY_LABELS.map((label) => (
              <div key={label} className="rounded-md border border-border/50 bg-muted/30 p-2 text-center">
                {label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-7">
            {monthCells.map((date) => {
              const dayKey = toDayKey(date)
              const dayAppointments = appointmentsByDay[dayKey] ?? []
              const isCurrentMonth = date.getMonth() === anchorDate.getMonth()
              const isToday = dayKey === todayKey
              return (
                <div
                  key={dayKey}
                  className={cn(
                    'min-h-28 space-y-1 rounded-md border p-2',
                    isToday
                      ? 'border-primary/55 bg-primary/12 ring-2 ring-primary/30'
                      : 'border-border/60 bg-card/20',
                  )}
                >
                  <div className="flex flex-wrap items-baseline gap-1">
                    <p
                      className={`text-xs font-medium ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      {date.getDate()}
                    </p>
                    {isToday ? (
                      <span className="bg-primary/25 text-primary rounded px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                        Hoy
                      </span>
                    ) : null}
                  </div>
                  {dayAppointments.slice(0, 3).map((appointment) => {
                    const sessionLabel = formatSessionInPackageLabel(appointment)
                    return (
                      <button
                        key={appointment.id}
                        type="button"
                        onClick={() => setSelectedAppointment(appointment)}
                        className={cn(
                          'hover:bg-primary/22 flex w-full min-w-0 cursor-pointer flex-col items-stretch gap-0.5 rounded px-1.5 py-0.5 text-left text-[11px] transition-colors',
                          appointment.status === 'completed'
                            ? 'bg-muted/90 text-muted-foreground'
                            : 'bg-primary/10 text-foreground',
                        )}
                      >
                        <span className="min-w-0 truncate">
                          {fmtTime(appointment.scheduledAt)} · {appointment.profile.label}
                        </span>
                        {sessionLabel ? (
                          <span className="text-muted-foreground min-w-0 truncate text-[9px] leading-tight">
                            {sessionLabel}
                          </span>
                        ) : null}
                      </button>
                    )
                  })}
                  {dayAppointments.length > 3 ? (
                    <p className="text-[11px] text-muted-foreground">+{dayAppointments.length - 3} más</p>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {weekDays.map((day) => {
            const dayKey = toDayKey(day)
            const dayAppointments = appointmentsByDay[dayKey] ?? []
            const isToday = dayKey === todayKey
            return (
              <div
                key={dayKey}
                className={cn(
                  'rounded-md border p-3',
                  isToday
                    ? 'border-primary/55 bg-primary/12 ring-2 ring-primary/30'
                    : 'border-border/70 bg-card/20',
                )}
              >
                <p className="mb-2 flex flex-wrap items-center gap-2 text-sm font-semibold">
                  <span>
                    {day.toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long' })}
                  </span>
                  {isToday ? (
                    <span className="bg-primary/25 text-primary rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                      Hoy
                    </span>
                  ) : null}
                </p>
                {dayAppointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sin citas</p>
                ) : (
                  <ul className="space-y-2">
                    {dayAppointments.map((appointment) => {
                      const sessionLabel = formatSessionInPackageLabel(appointment)
                      return (
                        <li key={appointment.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedAppointment(appointment)}
                            className={cn(
                              'hover:bg-muted/65 cursor-pointer w-full rounded border border-border/50 p-2 text-left text-sm transition-colors',
                              appointment.status === 'completed' ? 'opacity-85' : '',
                            )}
                          >
                            <p className="font-medium">
                              {fmtTime(appointment.scheduledAt)} · {appointment.profile.label}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {THERAPY_PACKAGE_MAP[appointment.cycle.packageType]?.label ??
                                appointment.cycle.packageType}
                            </p>
                            {sessionLabel ? (
                              <p className="text-muted-foreground mt-0.5 text-[11px]">{sessionLabel}</p>
                            ) : null}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      )}
        </div>
      </div>

      <CalendarAppointmentDetailDialog
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onUpdated={handleAppointmentUpdated}
      />
    </section>
  )
}
