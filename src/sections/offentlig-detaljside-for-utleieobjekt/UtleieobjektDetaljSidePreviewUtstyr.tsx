import { Suspense } from 'react'
import UtleieobjektDetaljSide from './UtleieobjektDetaljSide'
import type { UtleieobjektDetalj } from '../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

export default function UtleieobjektDetaljSidePreviewUtstyr() {
  const data: UtleieobjektDetalj = {
    id: 'utstyr-001',
    category: 'utstyr',
    name: 'Fotballutstyr sett',
    pickupLocation: 'Idrettshall A, Skien',
    address: 'Idrettsveien 10',
    postalCode: '3720',
    postalArea: 'Skien',
    map: { lat: 59.2086, lng: 9.6090 },
    shortDescription: 'Komplett fotballutstyr sett for lag og arrangementer',
    longDescription: 'Komplett fotballutstyr sett inkluderer baller, kjegler, markeringer, og annet nødvendig utstyr for fotballtrening og -arrangementer. Utstyret er godt vedlikeholdt og egnet for alle aldersgrupper.',
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1200'
    ],
    quantity: 5,
    availableQuantity: 3,
    facilities: ['Fotballer', 'Kjegler', 'Markeringer', 'Nett'],
    logistics: {
      pickupRequired: true,
      deliveryAvailable: false,
      pickupHours: '08:00-16:00'
    },
    pricing: {
      isFree: false,
      rentalPrice: 200,
      deposit: 500,
      priceModel: 'per dag'
    },
    contacts: [{
      name: 'Skien Idrett',
      role: 'Utstyr',
      email: 'utstyr@skienidrett.no',
      phone: '+47 35 90 00 00'
    }],
    guidelines: 'Utstyr må returneres i samme stand som ved utleie. Skader må rapporteres umiddelbart.',
    faq: [
      { question: 'Hvor lenge kan jeg leie utstyret?', answer: 'Standard utleieperiode er 1-7 dager. Lengre perioder kan avtales.' },
      { question: 'Hva skjer hvis utstyret blir skadet?', answer: 'Skader dekkes av depositumet. Eventuelle ekstra kostnader faktureres.' }
    ],
    calendarData: {
      weekStart: '2026-01-19',
      slots: [
        { date: '2026-01-19', status: 'ledig' },
        { date: '2026-01-20', status: 'booket' },
        { date: '2026-01-21', status: 'ledig' },
        { date: '2026-01-22', status: 'reservert' },
        { date: '2026-01-23', status: 'ledig' }
      ]
    }
  }

  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-900">
          <div className="text-stone-500 dark:text-stone-400">Loading...</div>
        </div>
      }
    >
      <UtleieobjektDetaljSide
        utleieobjektId={data.id}
        category={data.category}
        data={data}
        onFavorite={(id) => console.log('Favorite clicked:', id)}
        onShare={(id) => console.log('Share clicked:', id)}
        onBookingComplete={(bookingData) => console.log('Booking completed:', bookingData)}
      />
    </Suspense>
  )
}
