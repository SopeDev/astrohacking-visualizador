import { prisma } from '@/lib/prisma'

export async function listProfiles() {
  const rows = await prisma.profile.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      packageCycles: {
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      appointments: {
        where: { status: { in: ['scheduled', 'completed'] } },
      },
    },
  })

  return rows.map((row) => {
    const activeCycle = row.packageCycles[0] ?? null
    const usedSessions = activeCycle
      ? row.appointments.filter(
          (appointment) =>
            appointment.cycleId === activeCycle.id && appointment.status === 'completed',
        ).length
      : 0
    const scheduledSessions = activeCycle
      ? row.appointments.filter(
          (appointment) =>
            appointment.cycleId === activeCycle.id && appointment.status === 'scheduled',
        ).length
      : 0

    return {
      ...row,
      activeCycle,
      packageSummary: activeCycle
        ? {
            packageType: activeCycle.packageType,
            sessionQuota: activeCycle.sessionQuota,
            usedSessions,
            scheduledSessions,
            remainingSessions: Math.max(activeCycle.sessionQuota - usedSessions, 0),
          }
        : null,
    }
  })
}

/** @param {string} id */
export async function getProfileById(id) {
  return prisma.profile.findUnique({
    where: { id },
    include: {
      packageCycles: {
        orderBy: { createdAt: 'desc' },
      },
      appointments: {
        orderBy: { scheduledAt: 'asc' },
      },
    },
  })
}

export async function listSephirotInterpretations() {
  return prisma.sephirotInterpretation.findMany({
    orderBy: [
      { sephirotId: 'asc' },
      { planetKey: 'asc' },
      { signId: 'asc' },
    ],
  })
}

/**
 * @param {Date} start
 * @param {Date} end
 */
export async function listAppointmentsInRange(start, end) {
  const rows = await prisma.profileAppointment.findMany({
    where: {
      status: { in: ['scheduled', 'completed'] },
      scheduledAt: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { scheduledAt: 'asc' },
    include: {
      profile: {
        select: {
          id: true,
          label: true,
        },
      },
      cycle: {
        select: {
          id: true,
          packageType: true,
          sessionQuota: true,
        },
      },
    },
  })

  const cycleIds = [...new Set(rows.map((row) => row.cycleId))]
  /** @type {Map<string, number>} */
  const ordinalByAppointmentId = new Map()

  if (cycleIds.length > 0) {
    const cycleAppointments = await prisma.profileAppointment.findMany({
      where: {
        cycleId: { in: cycleIds },
        status: { in: ['scheduled', 'completed'] },
      },
      select: {
        id: true,
        cycleId: true,
        scheduledAt: true,
      },
    })

    for (const cid of cycleIds) {
      const slots = cycleAppointments
        .filter((row) => row.cycleId === cid)
        .sort(
          (a, b) =>
            new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
        )
      slots.forEach((slot, index) => {
        ordinalByAppointmentId.set(slot.id, index + 1)
      })
    }
  }

  return rows.map((row) => ({
    ...row,
    sessionOrdinalInCycle: ordinalByAppointmentId.get(row.id) ?? null,
  }))
}
