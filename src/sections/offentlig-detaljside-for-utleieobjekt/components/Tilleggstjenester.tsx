import { Checkbox } from '@/components/ui/checkbox'
import type { TilleggstjenesterProps } from '../../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

export default function Tilleggstjenester({
  services,
  selectedServices,
  onServiceToggle
}: TilleggstjenesterProps) {
  return (
    <div className="space-y-3">
      {services.map((service) => {
        const isSelected = selectedServices.includes(service.id)
        return (
          <label
            key={service.id}
            className="flex items-start gap-3 p-4 border border-stone-200 dark:border-stone-700 rounded-lg cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onServiceToggle(service.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-stone-900 dark:text-stone-100">
                    {service.name}
                  </div>
                  <div className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                    {service.description}
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="font-semibold text-stone-900 dark:text-stone-100">
                    +{service.price} kr
                  </div>
                </div>
              </div>
            </div>
          </label>
        )
      })}
    </div>
  )
}
