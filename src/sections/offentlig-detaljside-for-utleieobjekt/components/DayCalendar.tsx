import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CalendarData, KalenderSlot, KalenderSlotStatus } from '../../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

const statusColors: Record<KalenderSlotStatus, string> = {
  ledig: 'bg-green-500 hover:bg-green-600',
  reservert: 'bg-green-200 dark:bg-green-800 hover:bg-green-300 dark:hover:bg-green-700',
  booket: 'bg-red-500 hover:bg-red-600',
  blokkert: 'bg-red-800 dark:bg-red-900 hover:bg-red-900 dark:hover:bg-red-950',
  utilgjengelig: 'bg-stone-300 dark:bg-stone-600',
  stengt: 'bg-black dark:bg-stone-900'
}

const statusLabels: Record<KalenderSlotStatus, string> = {
  ledig: 'Ledig',
  reservert: 'Reservert',
  booket: 'Booket',
  blokkert: 'Blokkert',
  utilgjengelig: 'Utilgjengelig',
  stengt: 'Stengt'
}

interface DayCalendarProps {
  calendarData: CalendarData
  selectedSlots: KalenderSlot[]
  onSlotSelect: (slot: KalenderSlot) => void
  onSlotDeselect: (slot: KalenderSlot) => void
}

export default function DayCalendar({
  calendarData,
  selectedSlots,
  onSlotSelect,
  onSlotDeselect
}: DayCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date(calendarData.weekStart))

  const getWeekDates = () => {
    const dates: Date[] = []
    const start = new Date(currentWeekStart)
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const getSlotStatus = (date: Date): KalenderSlotStatus => {
    const dateStr = date.toISOString().split('T')[0]
    const slot = calendarData.slots.find(
      s => s.date === dateStr && !s.time
    )
    return slot?.status || 'utilgjengelig'
  }

  const isSlotSelected = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0]
    return selectedSlots.some(
      s => s.date === dateStr && !s.time
    )
  }

  const handleSlotClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const slot: KalenderSlot = { date: dateStr, status: getSlotStatus(date) }

    if (slot.status !== 'ledig' && slot.status !== 'reservert') {
      return
    }

    if (isSlotSelected(date)) {
      onSlotDeselect(slot)
    } else {
      onSlotSelect(slot)
    }
  }

  const weekDates = getWeekDates()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentWeekStart(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentWeekStart(newDate)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })
  }

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString('no-NO', { weekday: 'short' }).toUpperCase()
  }

  const isToday = (date: Date) => {
    return date.toISOString().split('T')[0] === today.toISOString().split('T')[0]
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          {currentWeekStart.toLocaleDateString('no-NO', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, index) => {
          const status = getSlotStatus(date)
          const selected = isSlotSelected(date)
          const isPast = date < today

          return (
            <button
              key={index}
              onClick={() => !isPast && handleSlotClick(date)}
              disabled={isPast || status === 'booket' || status === 'blokkert' || status === 'stengt'}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                selected
                  ? 'border-stone-900 dark:border-stone-100 ring-2 ring-stone-400 dark:ring-stone-600'
                  : 'border-stone-200 dark:border-stone-700'
              } ${
                isPast
                  ? 'opacity-50 cursor-not-allowed'
                  : status === 'ledig' || status === 'reservert'
                  ? 'hover:border-stone-400 dark:hover:border-stone-500 cursor-pointer'
                  : 'cursor-not-allowed'
              }`}
            >
              <div className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                {formatDayName(date)}
              </div>
              <div
                className={`text-lg font-semibold mb-2 ${
                  isToday(date) ? 'text-stone-900 dark:text-stone-100' : ''
                }`}
              >
                {date.getDate()}
              </div>
              <div
                className={`w-full h-2 rounded ${statusColors[status]} ${
                  selected ? 'ring-2 ring-stone-900 dark:ring-stone-100' : ''
                }`}
                title={statusLabels[status]}
              />
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Forklaring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {Object.entries(statusLabels).map(([status, label]) => (
              <div key={status} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${statusColors[status as KalenderSlotStatus]}`} />
                <span className="text-stone-600 dark:text-stone-400">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected slots summary */}
      {selectedSlots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Valgte dager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedSlots.map((slot, index) => (
                <div key={index} className="text-sm text-stone-700 dark:text-stone-300">
                  {new Date(slot.date).toLocaleDateString('no-NO', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
