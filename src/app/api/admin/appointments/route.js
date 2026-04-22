import { NextResponse } from 'next/server'
import { listAppointmentsInRange } from '@/db/queries'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const url = new URL(request.url)
  const startRaw = url.searchParams.get('start')
  const endRaw = url.searchParams.get('end')
  if (!startRaw || !endRaw) {
    return NextResponse.json({ error: 'Missing start/end params' }, { status: 400 })
  }

  const start = new Date(startRaw)
  const end = new Date(endRaw)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return NextResponse.json({ error: 'Invalid start/end params' }, { status: 400 })
  }

  try {
    const appointments = await listAppointmentsInRange(start, end)
    return NextResponse.json({ appointments })
  } catch {
    return NextResponse.json({ error: 'Could not fetch appointments' }, { status: 500 })
  }
}
