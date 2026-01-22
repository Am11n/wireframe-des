import { Suspense } from 'react'
import UtleieobjektDetaljSide from './UtleieobjektDetaljSide'
import type { UtleieobjektDetalj } from '../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

export default function UtleieobjektDetaljSidePreviewTorgDay() {
  const data: UtleieobjektDetalj = {
    id: 'torg-day-001',
    category: 'torg',
    name: 'Festtelt - Kragerø',
    pickupLocation: 'Lagerhuset, Industriveien 20',
    address: 'Industriveien 20',
    postalCode: '3770',
    postalArea: 'Kragerø',
    map: { lat: 58.8683, lng: 9.4103 },
    shortDescription: 'Stort festtelt med booking per dag med tidsintervall. Perfekt for arrangementer.',
    longDescription: 'Stort festtelt tilgjengelig for utleie. Teltet kan bookes per dag med valgfritt tidsintervall. Perfekt for større arrangementer, fester og markeder.',
    images: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200'
    ],
    quantity: 1,
    availableQuantity: 1,
    facilities: ['Oppsett', 'Nedrigg', 'Transport'],
    logistics: {
      pickupRequired: true,
      deliveryAvailable: true,
      pickupHours: '08:00-16:00'
    },
    specifications: 'Teltet er 10x15 meter og kan romme opptil 150 personer.',
    damageFee: 5000,
    returnDeadline: 1,
    damageLiability: 'Leietaker er ansvarlig for skader på teltet.',
    pricing: {
      isFree: false,
      basePrice: 3000,
      deposit: 5000,
      priceModel: 'per dag',
      targetGroups: [
        { group: 'Standard', price: 3000, free: false },
        { group: 'Organisasjoner', price: 2500, free: false }
      ],
      paymentMethods: ['Kort', 'Vipps', 'Faktura (EHF)']
    },
    guidelines: 'Teltet må returneres i samme stand som ved utleie. Leietaker er ansvarlig for oppsett og nedrigg.',
    faq: [
      { question: 'Hvor lang tid i forveien kan jeg booke?', answer: 'Du kan booke opptil 3 måneder i forveien.' },
      { question: 'Kan jeg avlyse bookingen?', answer: 'Ja, du kan avlyse opptil 48 timer før bookingen starter.' }
    ],
    contacts: [{
      name: 'Kragerø Kommune',
      role: 'Drift',
      email: 'torg@kragerø.kommune.no',
      phone: '+47 35 58 50 00'
    }],
    calendarData: {
      weekStart: '2026-01-19',
      availabilityType: 'day',
      slots: [
        { date: '2026-01-19', status: 'ledig', fromTime: '08:00', toTime: '20:00' },
        { date: '2026-01-20', status: 'ledig', fromTime: '08:00', toTime: '20:00' },
        { date: '2026-01-21', status: 'reservert', fromTime: '10:00', toTime: '18:00' },
        { date: '2026-01-22', status: 'booket', fromTime: '09:00', toTime: '22:00' },
        { date: '2026-01-23', status: 'ledig', fromTime: '08:00', toTime: '20:00' },
        { date: '2026-01-24', status: 'ledig', fromTime: '08:00', toTime: '20:00' },
        { date: '2026-01-25', status: 'ledig', fromTime: '08:00', toTime: '20:00' }
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
