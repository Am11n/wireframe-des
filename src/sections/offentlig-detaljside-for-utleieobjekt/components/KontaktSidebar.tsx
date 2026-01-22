import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react'
import type { KontaktSidebarProps } from '../../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

export default function KontaktSidebar({
  contacts,
  map,
  address,
  postalCode,
  postalArea,
  openingHours,
  eventDates,
  category
}: KontaktSidebarProps) {
  const fullAddress = `${address}, ${postalCode} ${postalArea}`

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">KONTAKTINFORMASJON</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contacts.map((contact, index) => (
            <div key={index} className="space-y-2">
              {contact.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-stone-700 dark:text-stone-300 hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-stone-700 dark:text-stone-300 hover:underline"
                  >
                    {contact.phone}
                  </a>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lokasjon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Map Placeholder */}
          <div className="w-full h-48 bg-stone-200 dark:bg-stone-700 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-stone-400 dark:text-stone-500" />
            </div>
            {/* Map pin marker */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ transform: 'translate(-50%, -100%)' }}
            >
              <MapPin className="w-6 h-6 text-red-600 dark:text-red-400 fill-current" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-stone-500 dark:text-stone-400 mt-0.5" />
              <span className="text-stone-700 dark:text-stone-300">{fullAddress}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
                window.open(url, '_blank')
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Åpne i kart
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Opening Hours or Event Dates */}
      {(openingHours || eventDates) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {category === 'opplevelser' ? 'Arrangementstider' : 'ÅPNINGSTIDER'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {openingHours && (
              <div className="space-y-2 text-sm">
                {openingHours.map((hour, index) => (
                  <div
                    key={index}
                    className={`flex justify-between ${
                      hour.active
                        ? 'text-stone-900 dark:text-stone-100'
                        : 'text-stone-400 dark:text-stone-600'
                    }`}
                  >
                    <span>{hour.day}</span>
                    {hour.active ? (
                      <span>
                        {hour.from} - {hour.to}
                      </span>
                    ) : (
                      <span>Stengt</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {eventDates && (
              <div className="space-y-3">
                {eventDates.map((event, index) => (
                  <div key={index} className="border-b border-stone-200 dark:border-stone-700 pb-3 last:border-0">
                    <div className="font-medium text-stone-900 dark:text-stone-100 mb-1">
                      {new Date(event.date).toLocaleDateString('no-NO', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-sm text-stone-600 dark:text-stone-400">
                      {event.time} - {event.endTime}
                    </div>
                    <div className="text-sm text-stone-500 dark:text-stone-500 mt-1">
                      {event.availableTickets} billetter tilgjengelig
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
