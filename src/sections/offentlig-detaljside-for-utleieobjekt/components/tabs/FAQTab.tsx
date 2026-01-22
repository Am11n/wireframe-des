import { Card, CardContent } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'
import type { FAQTabProps } from '../../../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

export default function FAQTab({ faq }: FAQTabProps) {
  if (faq.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-stone-500 dark:text-stone-400">
          Ingen ofte stilte spørsmål tilgjengelig
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {faq.map((item, index) => (
        <Collapsible key={index} defaultOpen={index === 0}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardContent className="flex items-center justify-between p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <span className="font-medium text-left text-stone-900 dark:text-stone-100">
                  {item.question}
                </span>
                <ChevronDown className="w-5 h-5 text-stone-500 dark:text-stone-400 transition-transform data-[state=open]:rotate-180" />
              </CardContent>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 pb-4">
                <p className="text-stone-700 dark:text-stone-300">
                  {item.answer}
                </p>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  )
}
