'use client'

import { useState } from 'react'
import { Link2, Mail, MessageCircle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

/**
 * @param {{
 *   url: string
 *   variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'
 *   size?: 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'
 *   className?: string
 * }} props
 */
export function CopyShareButton({
  url,
  variant = 'secondary',
  size = 'sm',
  className = '',
}) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(url)}`
  const emailHref = `mailto:?subject=${encodeURIComponent('Enlace del arbol')}&body=${encodeURIComponent(url)}`

  const handleCopy = async () => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(buttonVariants({ variant, size }), className)}
        title="Opciones para compartir"
      >
        Compartir
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
            aria-label="Opciones para compartir"
            className="bg-background border-border w-full max-w-xs space-y-3 rounded-xl border p-4 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-foreground text-sm font-medium">Compartir enlace</p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full gap-1.5 py-4')}
              >
                <MessageCircle />
                WhatsApp
              </a>
              <a
                href={emailHref}
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full gap-1.5 py-4')}
              >
                <Mail />
                Email
              </a>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'sm' }),
                'w-full gap-1.5 py-4',
              )}
            >
              <Link2 />
              {copied ? 'Copiado' : 'Copiar enlace'}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'w-full py-4')}
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
