import Link from 'next/link'
import { AdminProfileForm } from '@/components/AdminProfileForm/AdminProfileForm'
import { buttonVariants } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default function NewProfilePage() {
  return (
    <div className="bg-background text-foreground mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <Link href="/admin" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
          ← Perfiles
        </Link>
        <h1 className="font-heading mt-4 text-2xl font-semibold tracking-tight">
          Nuevo perfil
        </h1>
      </div>
      <AdminProfileForm mode="create" />
    </div>
  )
}
