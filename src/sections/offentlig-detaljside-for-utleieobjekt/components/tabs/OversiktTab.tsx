import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'
import type { OversiktTabProps } from '../../../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'
import Fasiliteter from '../Fasiliteter'
import Tilleggstjenester from '../Tilleggstjenester'
import KategoriSpesifikkeSeksjoner from '../KategoriSpesifikkeSeksjoner'

export default function OversiktTab({ utleieobjekt }: OversiktTabProps) {
  return (
    <div className="space-y-6">
      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Beskrivelse</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-stone-700 dark:text-stone-300">
            {utleieobjekt.longDescription || utleieobjekt.shortDescription}
          </p>

          {/* Capacity */}
          {utleieobjekt.category === 'lokaler' && (
            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
              <Users className="w-5 h-5" />
              <span className="font-medium">
                MAKS TILLATT {utleieobjekt.maxPersons} personer
              </span>
            </div>
          )}

          {utleieobjekt.category === 'opplevelser' && (
            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
              <Users className="w-5 h-5" />
              <span className="font-medium">
                MAKS {utleieobjekt.maxParticipants} deltakere
              </span>
            </div>
          )}

          {utleieobjekt.category === 'utstyr' && (
            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
              <span className="font-medium">
                {utleieobjekt.availableQuantity} av {utleieobjekt.quantity} enheter tilgjengelig
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Facilities */}
      {utleieobjekt.category === 'lokaler' && utleieobjekt.facilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>FASILITETER</CardTitle>
          </CardHeader>
          <CardContent>
            <Fasiliteter facilities={utleieobjekt.facilities} />
          </CardContent>
        </Card>
      )}

      {utleieobjekt.category === 'utstyr' && utleieobjekt.facilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>INNHOLD</CardTitle>
          </CardHeader>
          <CardContent>
            <Fasiliteter facilities={utleieobjekt.facilities} />
          </CardContent>
        </Card>
      )}

      {/* Add-on Services */}
      {utleieobjekt.category === 'lokaler' && utleieobjekt.addOnServices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>TILLEGGSTJENESTER</CardTitle>
          </CardHeader>
          <CardContent>
            <Tilleggstjenester
              services={utleieobjekt.addOnServices}
              selectedServices={[]}
              onServiceToggle={() => {}}
            />
          </CardContent>
        </Card>
      )}

      {/* Category-specific sections */}
      <KategoriSpesifikkeSeksjoner utleieobjekt={utleieobjekt} />
    </div>
  )
}
