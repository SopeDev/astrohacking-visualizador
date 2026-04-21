'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { AdminProfilesList } from '@/components/AdminProfilesList/AdminProfilesList'
import { InterpretationEditorPanel } from '@/components/InterpretationEditorPanel/InterpretationEditorPanel'

export function AdminContentPanel({ profiles, absoluteShare, interpretationEntries }) {
  return (
    <Tabs
      defaultValue="profiles"
      orientation="vertical"
      className="flex-col gap-0 lg:flex-row"
    >
      <aside className="border-border bg-muted/20 w-full shrink-0 border-b p-3 sm:p-4 lg:w-72 lg:border-r lg:border-b-0 lg:p-6">
        <TabsList
          variant="line"
          className="bg-transparent !flex-row w-full flex-nowrap gap-0 overflow-x-auto rounded-none p-0 lg:!flex-col lg:overflow-visible"
        >
          <TabsTrigger
            value="profiles"
            className="h-11 !w-auto !flex-none justify-center border-b border-border/70 px-3 font-medium text-muted-foreground whitespace-nowrap rounded-none transition-colors after:hidden hover:bg-primary/5 hover:text-foreground [transform:none] data-[active]:[transform:none] data-[active]:rounded-none data-[active]:border-primary/50 data-[active]:!bg-primary/20 data-[active]:text-primary lg:!w-full lg:!flex-1 lg:justify-start lg:border-l-2 lg:border-b lg:border-l-transparent lg:data-[active]:border-l-primary"
          >
            Perfiles clientes
          </TabsTrigger>
          <TabsTrigger
            value="interpretations"
            className="h-11 !w-auto !flex-none justify-center border-b border-border/70 px-3 font-medium text-muted-foreground whitespace-nowrap rounded-none transition-colors after:hidden hover:bg-primary/5 hover:text-foreground [transform:none] data-[active]:[transform:none] data-[active]:rounded-none data-[active]:border-primary/50 data-[active]:!bg-primary/20 data-[active]:text-primary lg:!w-full lg:!flex-1 lg:justify-start lg:border-l-2 lg:border-b lg:border-l-transparent lg:data-[active]:border-l-primary"
          >
            Combinaciones planetas signos
          </TabsTrigger>
        </TabsList>
      </aside>

      <main className="min-w-0 flex-1 p-3 sm:p-6 lg:p-8">
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
