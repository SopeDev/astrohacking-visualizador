'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ASSIGNMENT_ROWS } from '@/data/correspondences'
import {
  SESSION_DURATION_MINUTES,
  THERAPY_PACKAGE_MAP,
  THERAPY_PACKAGE_VALUES,
} from '@/data/therapyPackages'
import { prisma } from '@/lib/prisma'
import { isAssignmentsComplete } from '@/lib/assignments'

/** @param {FormData} formData */
function assignmentsFromFormData(formData) {
  /** @type {Record<string, string>} */
  const o = {}
  for (const row of ASSIGNMENT_ROWS) {
    const v = formData.get(row.key)
    o[row.key] = typeof v === 'string' ? v : ''
  }
  return o
}

/**
 * @param {string} profileId
 * @param {string} packageType
 */
async function upsertActiveCycle(profileId, packageType) {
  const packageConfig = THERAPY_PACKAGE_MAP[packageType]
  if (!packageConfig) {
    throw new Error('INVALID_PACKAGE')
  }

  const activeCycle = await prisma.profilePackageCycle.findFirst({
    where: { profileId, status: 'active' },
    orderBy: { createdAt: 'desc' },
  })

  if (activeCycle?.packageType === packageType) {
    return activeCycle
  }

  return prisma.$transaction(async (tx) => {
    if (activeCycle) {
      await tx.profilePackageCycle.update({
        where: { id: activeCycle.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
        },
      })
    }

    return tx.profilePackageCycle.create({
      data: {
        profileId,
        packageType,
        sessionQuota: packageConfig.sessionQuota,
        purchasedAt: new Date(),
        startedAt: new Date(),
      },
    })
  })
}

/**
 * @param {string} cycleId
 */
async function assertCycleHasCapacity(cycleId) {
  const [cycle, usedCount] = await Promise.all([
    prisma.profilePackageCycle.findUnique({
      where: { id: cycleId },
      select: { id: true, sessionQuota: true, status: true },
    }),
    prisma.profileAppointment.count({
      where: {
        cycleId,
        status: { in: ['scheduled', 'completed'] },
      },
    }),
  ])

  if (!cycle || cycle.status !== 'active') {
    throw new Error('CYCLE_NOT_ACTIVE')
  }
  if (usedCount >= cycle.sessionQuota) {
    throw new Error('CYCLE_LIMIT_REACHED')
  }
}

const SESSION_DURATION_MS = SESSION_DURATION_MINUTES * 60 * 1000

/**
 * Sessions are fixed-length (SESSION_DURATION_MINUTES). Only scheduled/completed occupy the calendar.
 *
 * @param {Date} scheduledAt
 * @param {{ excludeAppointmentId?: string }} [options]
 */
async function assertNoSessionOverlap(scheduledAt, options = {}) {
  const { excludeAppointmentId } = options
  const newStart = scheduledAt.getTime()
  const newEnd = newStart + SESSION_DURATION_MS

  const candidates = await prisma.profileAppointment.findMany({
    where: {
      status: { in: ['scheduled', 'completed'] },
      scheduledAt: {
        gte: new Date(newStart - SESSION_DURATION_MS),
        lt: new Date(newEnd),
      },
      ...(excludeAppointmentId ? { id: { not: excludeAppointmentId } } : {}),
    },
    select: { id: true, scheduledAt: true, durationMin: true },
  })

  for (const row of candidates) {
    const durationMin = row.durationMin ?? SESSION_DURATION_MINUTES
    const existingStart = new Date(row.scheduledAt).getTime()
    const existingEnd = existingStart + durationMin * 60 * 1000
    if (newStart < existingEnd && existingStart < newEnd) {
      throw new Error('SCHEDULE_OVERLAP')
    }
  }
}

export async function createProfileAction(prevState, formData) {
  const label = String(formData.get('label') ?? '').trim()
  const notesRaw = String(formData.get('notes') ?? '').trim()
  const notes = notesRaw.length ? notesRaw : null
  const packageType = String(formData.get('packageType') ?? '').trim()
  const assignments = assignmentsFromFormData(formData)

  if (!label) {
    return { ok: false, error: 'El nombre del perfil es obligatorio.' }
  }
  if (!isAssignmentsComplete(assignments)) {
    return {
      ok: false,
      error: 'Completa todos los signos antes de guardar.',
    }
  }
  if (!THERAPY_PACKAGE_VALUES.includes(packageType)) {
    return { ok: false, error: 'Selecciona un paquete terapéutico válido.' }
  }

  let created
  try {
    created = await prisma.profile.create({
      data: {
        label,
        notes,
        assignments,
      },
      select: { id: true },
    })
    await upsertActiveCycle(created.id, packageType)
  } catch {
    return { ok: false, error: 'No se pudo crear el perfil. ¿DATABASE_URL correcto?' }
  }

  revalidatePath('/')
  redirect(`/profiles/${created.id}/edit?created=1`)
}

export async function updateProfileAction(prevState, formData) {
  const id = String(formData.get('profileId') ?? '').trim()
  if (!id) {
    return { ok: false, error: 'Falta el identificador del perfil.' }
  }

  const label = String(formData.get('label') ?? '').trim()
  const notesRaw = String(formData.get('notes') ?? '').trim()
  const notes = notesRaw.length ? notesRaw : null
  const packageType = String(formData.get('packageType') ?? '').trim()
  const assignments = assignmentsFromFormData(formData)

  if (!label) {
    return { ok: false, error: 'El nombre del perfil es obligatorio.' }
  }
  if (!isAssignmentsComplete(assignments)) {
    return {
      ok: false,
      error: 'Completa todos los signos antes de guardar.',
    }
  }
  if (!THERAPY_PACKAGE_VALUES.includes(packageType)) {
    return { ok: false, error: 'Selecciona un paquete terapéutico válido.' }
  }

  try {
    await prisma.profile.update({
      where: { id },
      data: {
        label,
        notes,
        assignments,
      },
    })
    await upsertActiveCycle(id, packageType)
  } catch {
    return { ok: false, error: 'No se pudo actualizar el perfil.' }
  }

  revalidatePath('/')
  revalidatePath(`/p/${id}`)
  redirect(`/profiles/${id}/edit?saved=1`)
}

export async function createAppointmentAction(prevState, formData) {
  const profileId = String(formData.get('profileId') ?? '').trim()
  const cycleId = String(formData.get('cycleId') ?? '').trim()
  const scheduledAtRaw = String(formData.get('scheduledAt') ?? '').trim()
  const notesRaw = String(formData.get('notes') ?? '').trim()

  if (!profileId || !cycleId || !scheduledAtRaw) {
    return { ok: false, error: 'Completa fecha/hora para agendar la sesión.' }
  }

  const scheduledAt = new Date(scheduledAtRaw)
  if (Number.isNaN(scheduledAt.getTime())) {
    return { ok: false, error: 'La fecha seleccionada no es válida.' }
  }

  try {
    await assertCycleHasCapacity(cycleId)
    await assertNoSessionOverlap(scheduledAt)
    await prisma.profileAppointment.create({
      data: {
        profileId,
        cycleId,
        scheduledAt,
        durationMin: SESSION_DURATION_MINUTES,
        notes: notesRaw || null,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'CYCLE_LIMIT_REACHED') {
      return { ok: false, error: 'Ese paquete ya alcanzó el límite de sesiones.' }
    }
    if (error instanceof Error && error.message === 'SCHEDULE_OVERLAP') {
      return {
        ok: false,
        error:
          'Ese horario se solapa con otra sesión de 90 minutos. Elige otra fecha u hora.',
      }
    }
    return { ok: false, error: 'No se pudo crear la cita.' }
  }

  revalidatePath('/')
  revalidatePath(`/profiles/${profileId}/edit`)
  return { ok: true }
}

export async function rescheduleAppointmentAction(prevState, formData) {
  const profileId = String(formData.get('profileId') ?? '').trim()
  const appointmentId = String(formData.get('appointmentId') ?? '').trim()
  const scheduledAtRaw = String(formData.get('scheduledAt') ?? '').trim()

  if (!profileId || !appointmentId || !scheduledAtRaw) {
    return { ok: false, error: 'Faltan datos para reagendar la sesión.' }
  }
  const scheduledAt = new Date(scheduledAtRaw)
  if (Number.isNaN(scheduledAt.getTime())) {
    return { ok: false, error: 'La fecha seleccionada no es válida.' }
  }

  try {
    await assertNoSessionOverlap(scheduledAt, { excludeAppointmentId: appointmentId })
    await prisma.profileAppointment.update({
      where: { id: appointmentId },
      data: { scheduledAt },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'SCHEDULE_OVERLAP') {
      return {
        ok: false,
        error:
          'Ese horario se solapa con otra sesión de 90 minutos. Elige otra fecha u hora.',
      }
    }
    return { ok: false, error: 'No se pudo reagendar la cita.' }
  }

  revalidatePath('/')
  revalidatePath(`/profiles/${profileId}/edit`)
  return { ok: true }
}

export async function cancelAppointmentAction(prevState, formData) {
  const profileId = String(formData.get('profileId') ?? '').trim()
  const appointmentId = String(formData.get('appointmentId') ?? '').trim()
  const mode = String(formData.get('mode') ?? 'cancel').trim()
  if (!profileId || !appointmentId) {
    return { ok: false, error: 'Faltan datos para actualizar la cita.' }
  }

  try {
    if (mode === 'delete') {
      await prisma.profileAppointment.delete({ where: { id: appointmentId } })
    } else {
      await prisma.profileAppointment.update({
        where: { id: appointmentId },
        data: { status: 'cancelled' },
      })
    }
  } catch {
    return { ok: false, error: 'No se pudo actualizar la cita.' }
  }

  revalidatePath('/')
  revalidatePath(`/profiles/${profileId}/edit`)
  return { ok: true }
}

export async function completeAppointmentAction(prevState, formData) {
  const profileId = String(formData.get('profileId') ?? '').trim()
  const appointmentId = String(formData.get('appointmentId') ?? '').trim()
  if (!profileId || !appointmentId) {
    return { ok: false, error: 'Faltan datos para completar la sesión.' }
  }

  try {
    await prisma.profileAppointment.update({
      where: { id: appointmentId },
      data: { status: 'completed' },
    })
  } catch {
    return { ok: false, error: 'No se pudo marcar la sesión como completada.' }
  }

  revalidatePath('/')
  revalidatePath(`/profiles/${profileId}/edit`)
  return { ok: true }
}

export async function reopenAppointmentAction(prevState, formData) {
  const profileId = String(formData.get('profileId') ?? '').trim()
  const appointmentId = String(formData.get('appointmentId') ?? '').trim()
  if (!profileId || !appointmentId) {
    return { ok: false, error: 'Faltan datos para actualizar la sesión.' }
  }

  try {
    await prisma.profileAppointment.update({
      where: { id: appointmentId },
      data: { status: 'scheduled' },
    })
  } catch {
    return { ok: false, error: 'No se pudo volver a marcar como programada.' }
  }

  revalidatePath('/')
  revalidatePath(`/profiles/${profileId}/edit`)
  return { ok: true }
}

export async function deleteProfileAction(formData) {
  const id = String(formData.get('profileId') ?? '').trim()
  if (!id) return
  try {
    await prisma.profile.delete({ where: { id } })
  } catch {
    redirect('/')
  }
  revalidatePath('/')
  redirect('/')
}

function linesFromText(raw) {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function textFromRichHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h1|h2|h3|h4|h5|h6)>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

const INTERPRETATION_SECTION_FIELDS = [
  { key: 'secretToReveal', label: 'Secreto a revelar' },
  { key: 'mainReading', label: 'Lectura principal' },
  { key: 'dailyManifestation', label: 'Cómo se manifiesta en la vida cotidiana' },
  { key: 'shadowWork', label: 'Cómo se detecta y trabaja la sombra o desalineación' },
  { key: 'evolutionaryLearning', label: 'Aprendizaje evolutivo' },
  { key: 'integrationPractice', label: 'Práctica de integración' },
  { key: 'alignedManifestation', label: 'Cómo se manifiesta en su versión alineada' },
]

export async function upsertInterpretationAction(prevState, formData) {
  const sephirotId = String(formData.get('sephirotId') ?? '').trim()
  const planetKey = String(formData.get('planetKey') ?? '').trim()
  const signId = String(formData.get('signId') ?? '').trim()

  if (!sephirotId || !planetKey || !signId) {
    return { ok: false, error: 'Faltan datos de la combinación a editar.' }
  }

  const sections = Object.fromEntries(
    INTERPRETATION_SECTION_FIELDS.map(({ key }) => [key, String(formData.get(key) ?? '').trim()]),
  )

  for (const section of INTERPRETATION_SECTION_FIELDS) {
    if (!textFromRichHtml(sections[section.key])) {
      return { ok: false, error: `Completa la sección: ${section.label}.` }
    }
  }

  try {
    await prisma.sephirotInterpretation.upsert({
      where: {
        sephirotId_planetKey_signId: {
          sephirotId,
          planetKey,
          signId,
        },
      },
      create: {
        sephirotId,
        planetKey,
        signId,
        paragraphs: linesFromText(textFromRichHtml(sections.mainReading)),
        evolution: linesFromText(textFromRichHtml(sections.evolutionaryLearning)),
        sections,
      },
      update: {
        paragraphs: linesFromText(textFromRichHtml(sections.mainReading)),
        evolution: linesFromText(textFromRichHtml(sections.evolutionaryLearning)),
        sections,
      },
    })
  } catch {
    return { ok: false, error: 'No se pudo guardar esta interpretación.' }
  }

  revalidatePath('/admin')
  revalidatePath('/p/[id]', 'page')
  return { ok: true }
}
