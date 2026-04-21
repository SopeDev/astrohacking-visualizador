import { prisma } from '@/lib/prisma'

export async function listProfiles() {
  return prisma.profile.findMany({
    orderBy: { updatedAt: 'desc' },
  })
}

/** @param {string} id */
export async function getProfileById(id) {
  return prisma.profile.findUnique({
    where: { id },
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
