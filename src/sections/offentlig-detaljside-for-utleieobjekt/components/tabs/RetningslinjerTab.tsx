import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { RetningslinjerTabProps } from '../../../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

export default function RetningslinjerTab({
  guidelines,
  category
}: RetningslinjerTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Retningslinjer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-stone dark:prose-invert max-w-none">
          <p className="text-stone-700 dark:text-stone-300 whitespace-pre-line">
            {guidelines}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
