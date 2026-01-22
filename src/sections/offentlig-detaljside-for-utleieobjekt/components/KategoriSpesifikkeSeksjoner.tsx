import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { UtleieobjektDetalj } from '../../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

interface KategoriSpesifikkeSeksjonerProps {
  utleieobjekt: UtleieobjektDetalj
}

export default function KategoriSpesifikkeSeksjoner({
  utleieobjekt
}: KategoriSpesifikkeSeksjonerProps) {
  if (utleieobjekt.category === 'lokaler') {
    const lokale = utleieobjekt
    return (
      <>
        {/* Universal Design */}
        {(lokale.universalDesign.stepFreeAccess ||
          lokale.universalDesign.wcAccessible ||
          lokale.universalDesign.elevator ||
          lokale.universalDesign.hearingLoop ||
          lokale.universalDesign.accessibleParking ||
          lokale.universalDesign.otherAccommodation) && (
          <Card>
            <CardHeader>
              <CardTitle>Universell utforming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lokale.universalDesign.stepFreeAccess && (
                  <div className="text-sm text-stone-700 dark:text-stone-300">
                    ✓ Trinnfri adkomst
                  </div>
                )}
                {lokale.universalDesign.wcAccessible && (
                  <div className="text-sm text-stone-700 dark:text-stone-300">
                    ✓ HC-toalett
                  </div>
                )}
                {lokale.universalDesign.elevator && (
                  <div className="text-sm text-stone-700 dark:text-stone-300">
                    ✓ Heis
                  </div>
                )}
                {lokale.universalDesign.hearingLoop && (
                  <div className="text-sm text-stone-700 dark:text-stone-300">
                    ✓ Teleslynge
                  </div>
                )}
                {lokale.universalDesign.accessibleParking && (
                  <div className="text-sm text-stone-700 dark:text-stone-300">
                    ✓ HC-parkering
                  </div>
                )}
                {lokale.universalDesign.otherAccommodation && (
                  <div className="text-sm text-stone-700 dark:text-stone-300">
                    {lokale.universalDesign.otherAccommodation}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Size */}
        {lokale.size && (
          <Card>
            <CardHeader>
              <CardTitle>Størrelse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700 dark:text-stone-300">{lokale.size}</p>
            </CardContent>
          </Card>
        )}
      </>
    )
  }

  if (utleieobjekt.category === 'utstyr') {
    const utstyr = utleieobjekt
    return (
      <>
        {/* Logistics */}
        <Card>
          <CardHeader>
            <CardTitle>Logistikk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">
                Hentested
              </div>
              <div className="text-stone-900 dark:text-stone-100">
                {utstyr.pickupLocation}
              </div>
            </div>
            {utstyr.logistics.pickupRequired && (
              <div>
                <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Hentetider
                </div>
                <div className="text-stone-900 dark:text-stone-100">
                  {utstyr.logistics.pickupHours}
                </div>
              </div>
            )}
            {utstyr.logistics.deliveryAvailable && (
              <div>
                <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Levering
                </div>
                <div className="text-stone-900 dark:text-stone-100">
                  Levering er tilgjengelig
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing details */}
        {utstyr.pricing.deposit && (
          <Card>
            <CardHeader>
              <CardTitle>Depositum</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700 dark:text-stone-300">
                Depositum: {utstyr.pricing.deposit} kr
              </p>
            </CardContent>
          </Card>
        )}
      </>
    )
  }

  if (utleieobjekt.category === 'opplevelser') {
    const opplevelse = utleieobjekt
    return (
      <>
        {/* Event details */}
        {opplevelse.eventDates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Arrangementstider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {opplevelse.eventDates.map((event, index) => (
                  <div
                    key={index}
                    className="border-b border-stone-200 dark:border-stone-700 pb-3 last:border-0"
                  >
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
            </CardContent>
          </Card>
        )}

        {/* Booking type */}
        <Card>
          <CardHeader>
            <CardTitle>Påmelding</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-stone-700 dark:text-stone-300 mb-4">
              {opplevelse.bookingType === 'tickets'
                ? 'Billetter kan kjøpes for dette arrangementet'
                : 'Påmelding kreves for dette arrangementet'}
            </p>
            {opplevelse.bookingType === 'tickets' && (
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  // Start booking flow for tickets
                  console.log('Kjøp billett clicked')
                }}
              >
                Kjøp billett
              </Button>
            )}
          </CardContent>
        </Card>
      </>
    )
  }

  return null
}
