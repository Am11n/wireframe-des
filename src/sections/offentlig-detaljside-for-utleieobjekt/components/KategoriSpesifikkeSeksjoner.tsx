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

        {/* Pris og betaling - kombinert */}
        {!lokale.pricing.isFree && (lokale.pricing.timeBasedPricing || (lokale.pricing.paymentMethods && lokale.pricing.paymentMethods.length > 0)) && (
          <Card>
            <CardHeader>
              <CardTitle>Pris og betaling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lokale.pricing.timeBasedPricing && (
                <div>
                  <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">
                    Pris etter tidsrom
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {lokale.pricing.timeBasedPricing.weekdays && (
                      <div>
                        <div className="text-xs text-stone-500 dark:text-stone-400">Hverdager</div>
                        <div className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                          {lokale.pricing.timeBasedPricing.weekdays} kr
                        </div>
                      </div>
                    )}
                    {lokale.pricing.timeBasedPricing.weekend && (
                      <div>
                        <div className="text-xs text-stone-500 dark:text-stone-400">Helg</div>
                        <div className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                          {lokale.pricing.timeBasedPricing.weekend} kr
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {lokale.pricing.paymentMethods && lokale.pricing.paymentMethods.length > 0 && (
                <div className={lokale.pricing.timeBasedPricing ? 'pt-3 border-t border-stone-200 dark:border-stone-700' : ''}>
                  <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">
                    Betalingsmetoder
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lokale.pricing.paymentMethods.map((method, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 rounded-md text-xs text-stone-700 dark:text-stone-300"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </>
    )
  }

  if (utleieobjekt.category === 'utstyr') {
    const utstyr = utleieobjekt
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logistikk og transport - kombinert */}
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
            {utstyr.shortDescription && (
              <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
                <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Transportinfo
                </div>
                <p className="text-sm text-stone-700 dark:text-stone-300">
                  {utstyr.shortDescription}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Spesifikasjoner og returbetingelser - kombinert */}
        {(utstyr.specifications || utstyr.returnDeadline || utstyr.damageLiability) && (
          <Card>
            <CardHeader>
              <CardTitle>Detaljer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {utstyr.specifications && (
                <div>
                  <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">
                    Spesifikasjoner
                  </div>
                  <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-line">
                    {utstyr.specifications}
                  </p>
                </div>
              )}
              {(utstyr.returnDeadline || utstyr.damageLiability) && (
                <div className="pt-2 border-t border-stone-200 dark:border-stone-700 space-y-2">
                  {utstyr.returnDeadline && (
                    <div>
                      <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">
                        Returfrist
                      </div>
                      <div className="text-sm text-stone-900 dark:text-stone-100">
                        {utstyr.returnDeadline} dager etter utleie
                      </div>
                    </div>
                  )}
                  {utstyr.damageLiability && (
                    <div>
                      <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">
                        Skadeansvar
                      </div>
                      <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-line">
                        {utstyr.damageLiability}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Pris og depositum - kompakt */}
        {(utstyr.pricing.deposit || utstyr.damageFee) && (
          <Card>
            <CardHeader>
              <CardTitle>Pris og depositum</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {utstyr.pricing.deposit && (
                  <div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">Depositum</div>
                    <div className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                      {utstyr.pricing.deposit} kr
                    </div>
                  </div>
                )}
                {utstyr.damageFee && (
                  <div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">Skadeavgift</div>
                    <div className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                      {utstyr.damageFee} kr
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  if (utleieobjekt.category === 'opplevelser') {
    const opplevelse = utleieobjekt
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Arrangementstider med varighet og gjentakelse */}
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

        {/* Påmelding og frist - kombinert */}
        <Card>
          <CardHeader>
            <CardTitle>Påmelding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-stone-700 dark:text-stone-300">
              {opplevelse.bookingType === 'tickets'
                ? 'Billetter kan kjøpes for dette arrangementet'
                : 'Påmelding kreves for dette arrangementet'}
            </p>
            {opplevelse.registrationDeadline && (
              <div className="pt-3 border-t border-stone-200 dark:border-stone-700">
                <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Påmeldingsfrist
                </div>
                <div className="text-sm text-stone-900 dark:text-stone-100">
                  {new Date(opplevelse.registrationDeadline.date).toLocaleDateString('no-NO', {
                    day: 'numeric',
                    month: 'short'
                  })}{' '}
                  kl. {opplevelse.registrationDeadline.time}
                </div>
                {opplevelse.waitlistAllowed && (
                  <div className="mt-2 text-xs text-stone-500 dark:text-stone-500">
                    Venteliste tilgjengelig
                  </div>
                )}
              </div>
            )}
            {opplevelse.bookingType === 'tickets' && (
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  console.log('Kjøp billett clicked')
                }}
              >
                Kjøp billett
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Aldersgrenser og avbestilling - kombinert */}
        {((opplevelse.minAge || opplevelse.maxAge) || opplevelse.cancellationDeadline) && (
          <Card>
            <CardHeader>
              <CardTitle>Viktig informasjon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(opplevelse.minAge || opplevelse.maxAge) && (
                <div>
                  <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">
                    Aldersgrenser
                  </div>
                  <div className="text-sm text-stone-900 dark:text-stone-100">
                    {opplevelse.minAge && opplevelse.maxAge
                      ? `${opplevelse.minAge} - ${opplevelse.maxAge} år`
                      : opplevelse.minAge
                        ? `Fra ${opplevelse.minAge} år`
                        : opplevelse.maxAge
                          ? `Til ${opplevelse.maxAge} år`
                          : null}
                  </div>
                </div>
              )}
              {opplevelse.cancellationDeadline && (
                <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
                  <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">
                    Avbestillingsfrist
                  </div>
                  <div className="text-sm text-stone-900 dark:text-stone-100">
                    {opplevelse.cancellationDeadline} timer før start
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Vilkår og regler - kombinert */}
        {(opplevelse.participationTerms || opplevelse.refundRules) && (
          <Card>
            <CardHeader>
              <CardTitle>Vilkår og regler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {opplevelse.participationTerms && (
                <div>
                  <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">
                    Deltakelsesvilkår
                  </div>
                  <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-line">
                    {opplevelse.participationTerms}
                  </p>
                </div>
              )}
              {opplevelse.refundRules && (
                <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
                  <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">
                    Refunderingsregler
                  </div>
                  <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-line">
                    {opplevelse.refundRules}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return null
}
