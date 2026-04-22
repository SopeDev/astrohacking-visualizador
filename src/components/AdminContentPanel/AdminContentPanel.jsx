'use client'

import { FileUser, Sparkles } from 'lucide-react'
import { CalendarDays } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { AdminProfilesList } from '@/components/AdminProfilesList/AdminProfilesList'
import { InterpretationEditorPanel } from '@/components/InterpretationEditorPanel/InterpretationEditorPanel'
import { AdminClientCalendarPanel } from '@/components/AdminClientCalendarPanel/AdminClientCalendarPanel'

export function AdminContentPanel({
  profiles,
  absoluteShare,
  interpretationEntries,
  calendarAppointments,
}) {
  return (
    <Tabs
      defaultValue="profiles"
      orientation="vertical"
      className="min-h-[calc(100dvh-var(--admin-header-h,7rem))] flex-col gap-0 lg:flex-row"
    >
      <aside className="border-border bg-muted/20 w-full shrink-0 border-b p-0 lg:w-72 lg:border-r lg:border-b-0">
        <TabsList
          variant="line"
          className="bg-transparent !flex-row w-full flex-nowrap gap-0 overflow-x-auto rounded-none p-0 lg:!flex-col lg:overflow-visible"
        >
          <TabsTrigger
            value="profiles"
            className="group/tab h-auto !w-auto !flex-none justify-start gap-2 border-x-0 border-t-0 border-b border-border/60 px-4 py-4 font-medium text-muted-foreground whitespace-nowrap rounded-none transition-colors after:hidden hover:bg-primary/8 hover:text-foreground data-[active]:border-primary/35 data-[active]:!bg-primary/16 data-[active]:text-foreground lg:!w-full lg:!flex-1"
          >
            <span className="bg-muted/55 text-muted-foreground flex size-6 items-center justify-center rounded-full transition-colors group-data-[active]/tab:bg-primary/28 group-data-[active]/tab:text-primary">
              <FileUser className="size-3.5" />
            </span>
            <span>Perfiles clientes</span>
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            className="group/tab h-auto !w-auto !flex-none justify-start gap-2 border-x-0 border-t-0 border-b border-border/60 px-4 py-4 font-medium text-muted-foreground whitespace-nowrap rounded-none transition-colors after:hidden hover:bg-primary/8 hover:text-foreground data-[active]:border-primary/35 data-[active]:!bg-primary/16 data-[active]:text-foreground lg:!w-full lg:!flex-1"
          >
            <span className="bg-muted/55 text-muted-foreground flex size-6 items-center justify-center rounded-full transition-colors group-data-[active]/tab:bg-primary/28 group-data-[active]/tab:text-primary">
              <CalendarDays className="size-3.5" />
            </span>
            <span>Calendario citas</span>
          </TabsTrigger>
          <TabsTrigger
            value="interpretations"
            className="group/tab h-auto !w-auto !flex-none justify-start gap-2 border-x-0 border-t-0 border-b border-border/60 px-4 py-4 font-medium text-muted-foreground whitespace-nowrap rounded-none transition-colors after:hidden hover:bg-primary/8 hover:text-foreground data-[active]:border-primary/35 data-[active]:!bg-primary/16 data-[active]:text-foreground lg:!w-full lg:!flex-1"
          >
            <span className="bg-muted/55 text-muted-foreground flex size-6 items-center justify-center rounded-full transition-colors group-data-[active]/tab:bg-primary/28 group-data-[active]/tab:text-primary">
              <Sparkles className="size-3.5" />
            </span>
            <span>Interpretaciones</span>
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

        <TabsContent value="calendar" className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Visualiza sesiones por cliente en formato mensual o semanal.
          </p>
          <AdminClientCalendarPanel initialAppointments={calendarAppointments} />
        </TabsContent>
      </main>
    </Tabs>
  )
}
