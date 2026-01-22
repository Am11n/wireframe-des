import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AktivitetskalenderTabProps } from '../../../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

export default function AktivitetskalenderTab({
  calendarData,
  category
}: AktivitetskalenderTabProps) {
  if (!calendarData) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-stone-500 dark:text-stone-400">
          Ingen aktivitetskalender tilgjengelig
        </CardContent>
      </Card>
    )
  }

  // Group slots by date
  const slotsByDate = calendarData.slots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = []
    }
    acc[slot.date].push(slot)
    return acc
  }, {} as Record<string, typeof calendarData.slots>)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Aktivitetskalender</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(slotsByDate).map(([date, slots]) => (
              <div key={date} className="border-b border-stone-200 dark:border-stone-700 pb-4 last:border-0">
                <div className="font-medium text-stone-900 dark:text-stone-100 mb-2">
                  {new Date(date).toLocaleDateString('no-NO', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {slots.map((slot, index) => (
                    <div
                      key={index}
                      className={`text-sm p-2 rounded ${
                        slot.status === 'booket'
                          ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                          : slot.status === 'reservert'
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                          : slot.status === 'blokkert'
                          ? 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
                          : 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                      }`}
                    >
                      {slot.time || 'Hele dagen'}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
