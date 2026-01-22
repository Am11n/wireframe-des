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

        {/* Pricing details */}
        {!lokale.pricing.isFree && (
          <>
            {/* Tidsbasert prising */}
            {lokale.pricing.timeBasedPricing && (
              <Card>
                <CardHeader>
                  <CardTitle>Pris etter tidsrom</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {lokale.pricing.timeBasedPricing.weekdays && (
                    <div className="text-stone-700 dark:text-stone-300">
                      Hverdager: {lokale.pricing.timeBasedPricing.weekdays} kr
                    </div>
                  )}
                  {lokale.pricing.timeBasedPricing.weekend && (
                    <div className="text-stone-700 dark:text-stone-300">
                      Helg: {lokale.pricing.timeBasedPricing.weekend} kr
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Betalingsmetoder */}
            {lokale.pricing.paymentMethods && lokale.pricing.paymentMethods.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Betalingsmetoder</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {lokale.pricing.paymentMethods.map((method, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-md text-sm text-stone-700 dark:text-stone-300"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </>
    )
  }

  if (utleieobjekt.category === 'utstyr') {
    const utstyr = utleieobjekt
    return (
      <>
        {/* Transportinfo */}
        {utstyr.shortDescription && (
          <Card>
            <CardHeader>
              <CardTitle>Transportinfo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700 dark:text-stone-300">
                {utstyr.shortDescription}
              </p>
            </CardContent>
          </Card>
        )}

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

        {/* Spesifikasjoner */}
        {utstyr.specifications && (
          <Card>
            <CardHeader>
              <CardTitle>Spesifikasjoner</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700 dark:text-stone-300 whitespace-pre-line">
                {utstyr.specifications}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pricing details */}
        {(utstyr.pricing.deposit || utstyr.damageFee) && (
          <Card>
            <CardHeader>
              <CardTitle>Pris og depositum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {utstyr.pricing.deposit && (
                <div className="text-stone-700 dark:text-stone-300">
                  Depositum: {utstyr.pricing.deposit} kr
                </div>
              )}
              {utstyr.damageFee && (
                <div className="text-stone-700 dark:text-stone-300">
                  Skadeavgift: {utstyr.damageFee} kr
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Returbetingelser */}
        {(utstyr.returnDeadline || utstyr.damageLiability) && (
          <Card>
            <CardHeader>
              <CardTitle>Returbetingelser</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {utstyr.returnDeadline && (
                <div>
                  <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">
                    Returfrist
                  </div>
                  <div className="text-stone-900 dark:text-stone-100">
                    {utstyr.returnDeadline} dager etter utleie
                  </div>
                </div>
              )}
              {utstyr.damageLiability && (
                <div>
                  <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">
                    Skadeansvar
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 whitespace-pre-line">
                    {utstyr.damageLiability}
                  </p>
                </div>
              )}
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
                      {opplevelse.duration && ` (${opplevelse.duration})`}
                    </div>
                    <div className="text-sm text-stone-500 dark:text-stone-500 mt-1">
                      {event.availableTickets} billetter tilgjengelig
                    </div>
                  </div>
                ))}
              </div>
              {opplevelse.isRecurring && (
                <div className="mt-3 text-sm text-stone-600 dark:text-stone-400">
                  ⚠️ Gjentakende arrangement
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Aldersgrenser */}
        {(opplevelse.minAge || opplevelse.maxAge) && (
          <Card>
            <CardHeader>
              <CardTitle>Aldersgrenser</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-stone-700 dark:text-stone-300">
                {opplevelse.minAge && opplevelse.maxAge
                  ? `Alder: ${opplevelse.minAge} - ${opplevelse.maxAge} år`
                  : opplevelse.minAge
                    ? `Minimum alder: ${opplevelse.minAge} år`
                    : opplevelse.maxAge
                      ? `Maksimum alder: ${opplevelse.maxAge} år`
                      : null}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Påmeldingsfrist */}
        {opplevelse.registrationDeadline && (
          <Card>
            <CardHeader>
              <CardTitle>Påmeldingsfrist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-stone-700 dark:text-stone-300">
                {new Date(opplevelse.registrationDeadline.date).toLocaleDateString('no-NO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}{' '}
                kl. {opplevelse.registrationDeadline.time}
              </div>
              {opplevelse.waitlistAllowed && (
                <div className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                  Venteliste er tilgjengelig
                </div>
              )}
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

        {/* Deltakelsesvilkår */}
        {opplevelse.participationTerms && (
          <Card>
            <CardHeader>
              <CardTitle>Deltakelsesvilkår</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700 dark:text-stone-300 whitespace-pre-line">
                {opplevelse.participationTerms}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Avbestillingsregler */}
        {(opplevelse.cancellationDeadline || opplevelse.refundRules) && (
          <Card>
            <CardHeader>
              <CardTitle>Avbestillingsregler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {opplevelse.cancellationDeadline && (
                <div>
                  <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">
                    Avbestillingsfrist
                  </div>
                  <div className="text-stone-900 dark:text-stone-100">
                    {opplevelse.cancellationDeadline} timer før start
                  </div>
                </div>
              )}
              {opplevelse.refundRules && (
                <div>
                  <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">
                    Refunderingsregler
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 whitespace-pre-line">
                    {opplevelse.refundRules}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </>
    )
  }

  return null
}
