'use client'

import { useState } from 'react'

/**
 * @param {{ url: string }} props
 */
export function CopyShareLink({ url }) {
  const [copied, setCopied] = useState(false)

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
    <button
      type="button"
      onClick={handleCopy}
      className="cursor-pointer text-foreground break-all text-left font-mono text-xs underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      title="Haz clic para copiar"
    >
      {url}
      <span className="text-primary ml-2 font-sans">{copied ? 'Copiado' : 'Copiar'}</span>
    </button>
  )
}
