'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ASSIGNMENT_ROWS } from '@/data/correspondences'
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

export async function createProfileAction(prevState, formData) {
  const label = String(formData.get('label') ?? '').trim()
  const notesRaw = String(formData.get('notes') ?? '').trim()
  const notes = notesRaw.length ? notesRaw : null
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
  } catch {
    return { ok: false, error: 'No se pudo crear el perfil. ¿DATABASE_URL correcto?' }
  }

  revalidatePath('/admin')
  redirect(`/admin/profiles/${created.id}/edit?created=1`)
}

export async function updateProfileAction(prevState, formData) {
  const id = String(formData.get('profileId') ?? '').trim()
  if (!id) {
    return { ok: false, error: 'Falta el identificador del perfil.' }
  }

  const label = String(formData.get('label') ?? '').trim()
  const notesRaw = String(formData.get('notes') ?? '').trim()
  const notes = notesRaw.length ? notesRaw : null
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

  try {
    await prisma.profile.update({
      where: { id },
      data: {
        label,
        notes,
        assignments,
      },
    })
  } catch {
    return { ok: false, error: 'No se pudo actualizar el perfil.' }
  }

  revalidatePath('/admin')
  revalidatePath(`/p/${id}`)
  redirect(`/admin/profiles/${id}/edit?saved=1`)
}

export async function deleteProfileAction(formData) {
  const id = String(formData.get('profileId') ?? '').trim()
  if (!id) return
  try {
    await prisma.profile.delete({ where: { id } })
  } catch {
    redirect('/admin')
  }
  revalidatePath('/admin')
  redirect('/admin')
}
