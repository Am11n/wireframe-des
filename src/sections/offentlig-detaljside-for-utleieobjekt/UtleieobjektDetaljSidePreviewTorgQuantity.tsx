import { Suspense } from 'react'
import UtleieobjektDetaljSide from './UtleieobjektDetaljSide'
import type { UtleieobjektDetalj } from '../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

export default function UtleieobjektDetaljSidePreviewTorgQuantity() {
  const data: UtleieobjektDetalj = {
    id: 'torg-quantity-001',
    category: 'torg',
    name: 'Bord og stoler - Kragerø',
    pickupLocation: 'Lagerhuset, Industriveien 20',
    address: 'Industriveien 20',
    postalCode: '3770',
    postalArea: 'Kragerø',
    map: { lat: 58.8683, lng: 9.4103 },
    shortDescription: 'Bord og stoler tilgjengelig for utleie. Book antall du trenger per dag.',
    longDescription: 'Bord og stoler tilgjengelig for utleie. Du kan leie så mange du trenger per dag. Når alle er utleid, vil dagen vises som utsolgt i kalenderen.',
    images: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200'
    ],
    quantity: 200,
    availableQuantity: 150,
    facilities: ['Oppsett', 'Nedrigg', 'Transport'],
    logistics: {
      pickupRequired: true,
      deliveryAvailable: true,
      pickupHours: '08:00-16:00'
    },
    specifications: 'Hvert sett består av 1 bord og 4 stoler. Totalt 200 sett tilgjengelig.',
    damageFee: 500,
    returnDeadline: 1,
    damageLiability: 'Leietaker er ansvarlig for skader på utstyret.',
    pricing: {
      isFree: false,
      basePrice: 50,
      deposit: 2000,
      priceModel: 'per sett',
      targetGroups: [
        { group: 'Standard', price: 50, free: false },
        { group: 'Organisasjoner', price: 40, free: false }
      ],
      paymentMethods: ['Kort', 'Vipps', 'Faktura (EHF)']
    },
    guidelines: 'Utstyret må returneres i samme stand som ved utleie. Leietaker er ansvarlig for transport.',
    faq: [
      { question: 'Hvor mange sett kan jeg leie?', answer: 'Du kan leie så mange sett som er tilgjengelig på den valgte dagen.' },
      { question: 'Kan jeg avlyse bookingen?', answer: 'Ja, du kan avlyse opptil 24 timer før bookingen starter.' }
    ],
    contacts: [{
      name: 'Kragerø Kommune',
      role: 'Drift',
      email: 'torg@kragerø.kommune.no',
      phone: '+47 35 58 50 00'
    }],
    calendarData: {
      weekStart: '2026-01-19',
      availabilityType: 'quantity',
      slots: [
        { date: '2026-01-19', status: 'ledig', availableQuantity: 100, totalQuantity: 200 },
        { date: '2026-01-20', status: 'ledig', availableQuantity: 150, totalQuantity: 200 },
        { date: '2026-01-21', status: 'ledig', availableQuantity: 200, totalQuantity: 200 },
        { date: '2026-01-22', status: 'ledig', availableQuantity: 50, totalQuantity: 200 },
        { date: '2026-01-23', status: 'booket', availableQuantity: 0, totalQuantity: 200 },
        { date: '2026-01-24', status: 'ledig', availableQuantity: 180, totalQuantity: 200 },
        { date: '2026-01-25', status: 'ledig', availableQuantity: 200, totalQuantity: 200 }
      ]
    },
    quantityUnit: 'stoler'
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
