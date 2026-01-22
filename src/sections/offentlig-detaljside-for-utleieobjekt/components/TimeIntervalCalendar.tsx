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

interface TimeIntervalCalendarProps {
  calendarData: CalendarData
  selectedSlots: KalenderSlot[]
  onSlotSelect: (slot: KalenderSlot) => void
  onSlotDeselect: (slot: KalenderSlot) => void
  interval?: string // Interval in minutes (e.g., '30', '60')
}

export default function TimeIntervalCalendar({
  calendarData,
  selectedSlots,
  onSlotSelect,
  onSlotDeselect,
  interval = '60'
}: TimeIntervalCalendarProps) {
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

  const generateTimeSlots = () => {
    const intervalMinutes = parseInt(interval) || 60
    const slots: string[] = []
    const startHour = 8
    const endHour = 22
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(timeStr)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  const getSlotStatus = (date: Date, time: string): KalenderSlotStatus => {
    const dateStr = date.toISOString().split('T')[0]
    const slot = calendarData.slots.find(
      s => s.date === dateStr && s.time === time
    )
    return slot?.status || 'utilgjengelig'
  }

  const isSlotSelected = (date: Date, time: string): boolean => {
    const dateStr = date.toISOString().split('T')[0]
    return selectedSlots.some(
      s => s.date === dateStr && s.time === time
    )
  }

  const handleSlotClick = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0]
    const slot: KalenderSlot = { date: dateStr, time, status: getSlotStatus(date, time) }

    if (slot.status !== 'ledig' && slot.status !== 'reservert') {
      return
    }

    if (isSlotSelected(date, time)) {
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
          {weekDates[0].toLocaleDateString('no-NO', { day: 'numeric' })} - {weekDates[6].toLocaleDateString('no-NO', { day: 'numeric', month: 'short', year: 'numeric' })}
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

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-8 gap-1">
            {/* Time column header */}
            <div className="sticky left-0 bg-stone-50 dark:bg-stone-900 z-10 p-2"></div>
            
            {/* Day headers */}
            {weekDates.map((date, index) => (
              <div
                key={index}
                className={`text-center p-2 font-medium text-sm ${
                  isToday(date)
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                <div>{formatDayName(date)}</div>
                <div className="text-xs mt-1">{formatDate(date)}</div>
                {isToday(date) && (
                  <div className="text-xs mt-1 text-stone-500 dark:text-stone-400">i dag</div>
                )}
              </div>
            ))}

            {/* Time slots */}
            {timeSlots.map((time, timeIndex) => (
              <>
                <div
                  key={`time-${timeIndex}`}
                  className="sticky left-0 bg-stone-50 dark:bg-stone-900 z-10 p-2 text-sm text-stone-600 dark:text-stone-400 border-r border-stone-200 dark:border-stone-700"
                >
                  {time}
                </div>
                {weekDates.map((date, dateIndex) => {
                  const status = getSlotStatus(date, time)
                  const selected = isSlotSelected(date, time)
                  const isPast = date < today || (isToday(date) && new Date().getHours() >= parseInt(time.split(':')[0]))

                  return (
                    <button
                      key={`${dateIndex}-${timeIndex}`}
                      onClick={() => !isPast && handleSlotClick(date, time)}
                      disabled={isPast || status === 'booket' || status === 'blokkert' || status === 'stengt'}
                      className={`p-2 rounded transition-all ${
                        selected
                          ? 'ring-2 ring-stone-900 dark:ring-stone-100'
                          : ''
                      } ${
                        isPast
                          ? 'opacity-50 cursor-not-allowed'
                          : status === 'ledig' || status === 'reservert'
                          ? 'hover:opacity-80 cursor-pointer'
                          : 'cursor-not-allowed'
                      } ${statusColors[status]}`}
                      title={`${time} - ${statusLabels[status]}`}
                    >
                      {selected && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white dark:bg-stone-900 rounded-full"></div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </>
            ))}
          </div>
        </div>
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
            <CardTitle className="text-sm">Valgte tidspunkter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedSlots.map((slot, index) => (
                <div key={index} className="text-sm text-stone-700 dark:text-stone-300">
                  {new Date(slot.date).toLocaleDateString('no-NO', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                  {slot.time && ` kl. ${slot.time}`}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
