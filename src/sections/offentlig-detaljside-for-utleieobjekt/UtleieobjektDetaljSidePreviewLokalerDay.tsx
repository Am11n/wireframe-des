import { Suspense } from 'react'
import UtleieobjektDetaljSide from './UtleieobjektDetaljSide'
import type { UtleieobjektDetalj } from '../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

export default function UtleieobjektDetaljSidePreviewLokalerDay() {
  const data: UtleieobjektDetalj = {
    id: 'lokale-day-001',
    category: 'lokaler',
    subcategory: 'Selskapslokale',
    name: 'Selskapslokale - Kragerø (Hel dag)',
    address: 'Festveien 10',
    postalCode: '3770',
    postalArea: 'Kragerø',
    map: { lat: 58.8683, lng: 9.4103 },
    shortDescription: 'Stort selskapslokale med booking per hel dag. Perfekt for større arrangementer.',
    longDescription: 'Stort selskapslokale i Kragerø. Perfekt for større arrangementer, fester og selskaper. Godt vedlikeholdt med moderne fasiliteter. Rommet er egnet for større grupper og kan bookes per hel dag.',
    images: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200'
    ],
    maxPersons: 100,
    size: '300 m²',
    facilities: ['Kjøkken', 'Garderobe', 'Dusj', 'Parkering', 'WiFi', 'Lydanlegg', 'Scene'],
    universalDesign: {
      stepFreeAccess: true,
      wcAccessible: true,
      elevator: true,
      hearingLoop: true,
      accessibleParking: true,
      otherAccommodation: ''
    },
    addOnServices: [
      {
        id: 'catering',
        name: 'Catering',
        description: 'Catering-tjeneste tilgjengelig',
        price: 5000,
        required: false,
        needsApproval: true
      }
    ],
    contacts: [{
      name: 'Kragerø Kommune',
      role: 'Drift',
      email: 'selskapslokale@kragerø.kommune.no',
      phone: '+47 35 58 50 00'
    }],
    openingHours: [
      { day: 'Mandag', from: '08:00', to: '24:00', active: true },
      { day: 'Tirsdag', from: '08:00', to: '24:00', active: true },
      { day: 'Onsdag', from: '08:00', to: '24:00', active: true },
      { day: 'Torsdag', from: '08:00', to: '24:00', active: true },
      { day: 'Fredag', from: '08:00', to: '24:00', active: true },
      { day: 'Lørdag', from: '08:00', to: '24:00', active: true },
      { day: 'Søndag', from: '08:00', to: '24:00', active: true }
    ],
    rentalUnit: 'day',
    interval: '',
    pricing: {
      isFree: false,
      basePrice: 5000,
      priceModel: 'per dag',
      targetGroups: [
        { group: 'Standard', price: 5000, free: false },
        { group: 'Organisasjoner', price: 4000, free: false }
      ],
      timeBasedPricing: {
        weekdays: 5000,
        weekend: 6000
      },
      paymentMethods: ['Kort', 'Vipps', 'Faktura (EHF)']
    },
    guidelines: 'Leietaker er ansvarlig for å rydde opp etter seg. Røyking er ikke tillatt. Dyr er ikke tillatt.',
    faq: [
      { question: 'Hvor lang tid i forveien kan jeg booke?', answer: 'Du kan booke opptil 3 måneder i forveien.' },
      { question: 'Kan jeg avlyse bookingen?', answer: 'Ja, du kan avlyse opptil 48 timer før bookingen starter.' }
    ],
    calendarData: {
      weekStart: '2026-01-19',
      availabilityType: 'day',
      slots: [
        { date: '2026-01-19', status: 'ledig' },
        { date: '2026-01-20', status: 'ledig' },
        { date: '2026-01-21', status: 'reservert' },
        { date: '2026-01-22', status: 'booket' },
        { date: '2026-01-23', status: 'ledig' },
        { date: '2026-01-24', status: 'ledig' },
        { date: '2026-01-25', status: 'ledig' }
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
