'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { AdminProfilesList } from '@/components/AdminProfilesList/AdminProfilesList'
import { InterpretationEditorPanel } from '@/components/InterpretationEditorPanel/InterpretationEditorPanel'

export function AdminContentPanel({ profiles, absoluteShare, interpretationEntries }) {
  return (
    <Tabs
      defaultValue="profiles"
      orientation="vertical"
      className="min-h-dvh gap-0 lg:flex-row"
    >
      <aside className="border-border bg-muted/20 w-full shrink-0 border-b p-4 lg:min-h-dvh lg:w-96 lg:border-r lg:border-b-0 lg:p-6">
        <TabsList className="bg-muted/40 grid w-full gap-1 p-1">
          <TabsTrigger value="profiles" className="h-10 justify-start px-3">
            Perfiles clientes
          </TabsTrigger>
          <TabsTrigger value="interpretations" className="h-10 justify-start px-3">
            Combinaciones planetas signos
          </TabsTrigger>
        </TabsList>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <TabsContent value="profiles" className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Crea, busca y edita perfiles existentes.
          </p>
          <AdminProfilesList rows={profiles} absoluteShare={absoluteShare} />
        </TabsContent>

        <TabsContent value="interpretations" className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Edita el contenido para cada combinación de sefirá + planeta natural + signo.
          </p>
          <InterpretationEditorPanel entries={interpretationEntries} />
        </TabsContent>
      </main>
    </Tabs>
  )
}
