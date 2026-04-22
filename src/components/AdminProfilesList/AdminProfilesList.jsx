'use client'

import Link from 'next/link'
import { Eye, Pencil } from 'lucide-react'
import { useMemo, useState } from 'react'
import { buttonVariants } from '@/components/ui/button-variants'
import { CopyShareButton } from '@/components/CopyShareButton/CopyShareButton'
import { DeleteProfileButton } from '@/components/DeleteProfileButton/DeleteProfileButton'
import { THERAPY_PACKAGE_MAP } from '@/data/therapyPackages'

/**
 * @param {{
 *   rows: Array<{ id: string, label: string, packageSummary?: { packageType: string, remainingSessions: number } | null }>
 *   absoluteShare: string
 *   createHref?: string
 * }} props
 */
export function AdminProfilesList({ rows, absoluteShare, createHref = '/profiles/new' }) {
  const [query, setQuery] = useState('')

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return rows
    return rows.filter((row) => row.label.toLowerCase().includes(normalized))
  }, [rows, query])

  return (
    <div className="space-y-4">
      <div>
        <Link href={createHref} className={buttonVariants({ size: 'default' })}>
          Nuevo perfil
        </Link>
      </div>

      <div className="space-y-2">
        <label htmlFor="profile-search" className="text-muted-foreground text-xs font-medium">
          Buscar cliente
        </label>
        <input
          id="profile-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Escribe un nombre"
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        />
      </div>

      {filteredRows.length === 0 ? (
        <p className="text-muted-foreground text-sm">No hay resultados para esa búsqueda.</p>
      ) : (
        <ul className="divide-border border-border divide-y rounded-xl border">
          {filteredRows.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 first:rounded-t-xl last:rounded-b-xl"
            >
              <div className="min-w-0">
                <p className="text-foreground font-medium">{p.label}</p>
                {p.packageSummary ? (
                  <p className="text-xs text-muted-foreground">
                    {THERAPY_PACKAGE_MAP[p.packageSummary.packageType]?.label ??
                      p.packageSummary.packageType}{' '}
                    - restantes: {p.packageSummary.remainingSessions}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">Sin paquete asignado</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/p/${p.id}`}
                  className={buttonVariants({
                    variant: 'secondary',
                    size: 'sm',
                    className: 'hover:bg-secondary/90',
                  })}
                  aria-label={`Ver árbol de ${p.label}`}
                  title="Ver árbol"
                >
                  <Eye />
                  <span className="hidden sm:inline">Ver árbol</span>
                </Link>
                <Link
                  href={`/profiles/${p.id}/edit`}
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'sm',
                    className: 'hover:border-primary/35 hover:bg-muted/85',
                  })}
                  aria-label={`Editar perfil ${p.label}`}
                  title="Editar perfil"
                >
                  <Pencil />
                  <span className="hidden sm:inline">Editar</span>
                </Link>
                <div className="sm:hidden">
                  <CopyShareButton
                    url={absoluteShare ? `${absoluteShare}/p/${p.id}` : `/p/${p.id}`}
                    iconTrigger
                  />
                </div>
                <div className="hidden sm:block">
                  <CopyShareButton
                    url={absoluteShare ? `${absoluteShare}/p/${p.id}` : `/p/${p.id}`}
                    iconTrigger={false}
                    variant="outline"
                    size="sm"
                    className="hover:border-primary/35 hover:bg-muted/85"
                  />
                </div>
                <span className="bg-border h-6 w-px shrink-0" aria-hidden />
                <div className="sm:hidden">
                  <DeleteProfileButton
                    profileId={p.id}
                    profileLabel={p.label}
                    iconOnly
                    triggerVariant="outline"
                    triggerSize="icon-sm"
                    triggerClassName="border-destructive/40 text-destructive hover:border-destructive/60 hover:bg-destructive/10"
                  />
                </div>
                <div className="hidden sm:block">
                  <DeleteProfileButton
                    profileId={p.id}
                    profileLabel={p.label}
                    iconOnly={false}
                    triggerLabel="Eliminar"
                    triggerVariant="outline"
                    triggerSize="sm"
                    triggerClassName="border-destructive/40 text-destructive hover:border-destructive/60 hover:bg-destructive/10"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
