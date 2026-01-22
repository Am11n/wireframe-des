import type { FasiliteterProps } from '../../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

const facilityIcons: Record<string, string> = {
  'WiFi': '📶',
  'Projektor': '📽️',
  'Whiteboard': '📋',
  'Kaffe/te': '☕',
  'Aircondition': '❄️',
  'Fotballer': '⚽',
  'Kjegler': '🔺',
  'Markeringer': '🎯',
  'Nett': '🏐'
}

export default function Fasiliteter({ facilities }: FasiliteterProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {facilities.map((facility, index) => (
        <div
          key={index}
          className="flex items-center gap-2 p-3 border border-stone-200 dark:border-stone-700 rounded-lg"
        >
          <span className="text-2xl">{facilityIcons[facility] || '✓'}</span>
          <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
            {facility}
          </span>
        </div>
      ))}
    </div>
  )
}
