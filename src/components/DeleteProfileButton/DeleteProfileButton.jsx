'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteProfileAction } from '@/app/admin/actions'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

/**
 * @param {{
 *   profileId: string
 *   profileLabel: string
 *   triggerLabel?: string
 *   iconOnly?: boolean
 *   triggerVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'
 *   triggerSize?: 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'
 *   triggerClassName?: string
 * }} props
 */
export function DeleteProfileButton({
  profileId,
  profileLabel,
  triggerLabel = 'Eliminar',
  iconOnly = false,
  triggerVariant = 'destructive',
  triggerSize = 'sm',
  triggerClassName = '',
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          buttonVariants({ variant: triggerVariant, size: triggerSize }),
          triggerClassName,
        )}
        aria-label={iconOnly ? `Eliminar perfil ${profileLabel}` : undefined}
        title={`Eliminar perfil ${profileLabel}`}
      >
        {iconOnly ? (
          <Trash2 />
        ) : (
          <>
            <Trash2 />
            <span>{triggerLabel}</span>
          </>
        )}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Confirmar eliminación de perfil"
            className="bg-background border-border w-full max-w-sm space-y-4 rounded-xl border p-4 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="space-y-2">
              <p className="text-foreground text-sm font-semibold">Eliminar perfil</p>
              <p className="text-muted-foreground text-sm">
                Esta acción no se puede deshacer. ¿Quieres eliminar el perfil{' '}
                <strong className="text-foreground">{profileLabel}</strong>?
              </p>
            </div>

            <div className="space-y-2">
              <form action={deleteProfileAction}>
                <input type="hidden" name="profileId" value={profileId} />
                <button
                  type="submit"
                  className={cn(buttonVariants({ variant: 'destructive', size: 'sm' }), 'w-full py-4')}
                >
                  Sí, eliminar
                </button>
              </form>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'w-full py-4')}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : null}

    </>
  )
}
