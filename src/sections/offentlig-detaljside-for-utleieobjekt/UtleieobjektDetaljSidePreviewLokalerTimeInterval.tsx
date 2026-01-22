import { Suspense } from 'react'
import UtleieobjektDetaljSide from './UtleieobjektDetaljSide'
import type { UtleieobjektDetalj } from '../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

export default function UtleieobjektDetaljSidePreviewLokalerTimeInterval() {
  const data: UtleieobjektDetalj = {
    id: 'lokale-timeinterval-001',
    category: 'lokaler',
    name: 'Møterom Y - Kragerø (Tidsintervall)',
    address: 'Møterom Yveien 51',
    postalCode: '3770',
    postalArea: 'Kragerø',
    map: { lat: 58.8683, lng: 9.4103 },
    shortDescription: 'Moderne møterom med timebasert booking. Perfekt for møter og arrangementer.',
    longDescription: 'Moderne møterom y i Kragerø. Perfekt for trening, events og arrangementer. Godt vedlikeholdt med moderne fasiliteter. Rommet er egnet for møter, presentasjoner, kurs og små arrangementer. Booking basert på tidsintervaller.',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200'
    ],
    maxPersons: 30,
    size: '120 m²',
    facilities: ['WiFi', 'Projektor', 'Whiteboard', 'Kaffe/te', 'Aircondition'],
    universalDesign: {
      stepFreeAccess: true,
      wcAccessible: true,
      elevator: false,
      hearingLoop: false,
      accessibleParking: true,
      otherAccommodation: ''
    },
    addOnServices: [
      {
        id: 'extra-time',
        name: 'Ekstra tid',
        description: 'Forleng bookingen med 30 minutter',
        price: 200,
        required: false,
        needsApproval: false
      }
    ],
    contacts: [{
      name: 'Kragerø Kommune',
      role: 'Drift',
      email: 'møteromy@kragerø.kommune.no',
      phone: '+47 35 58 50 00'
    }],
    openingHours: [
      { day: 'Mandag', from: '07:00', to: '23:00', active: true },
      { day: 'Tirsdag', from: '07:00', to: '23:00', active: true },
      { day: 'Onsdag', from: '07:00', to: '23:00', active: true },
      { day: 'Torsdag', from: '07:00', to: '23:00', active: true },
      { day: 'Fredag', from: '07:00', to: '22:00', active: true },
      { day: 'Lørdag', from: '09:00', to: '20:00', active: true },
      { day: 'Søndag', from: '09:00', to: '20:00', active: true }
    ],
    rentalUnit: 'hour',
    interval: '60',
    pricing: {
      isFree: false,
      basePrice: 500,
      priceModel: 'per time',
      targetGroups: [
        { group: 'Standard', price: 500, free: false },
        { group: 'Organisasjoner', price: 400, free: false }
      ],
      timeBasedPricing: {
        weekdays: 500,
        weekend: 600
      },
      paymentMethods: ['Kort', 'Vipps', 'Faktura (EHF)']
    },
    guidelines: 'Leietaker er ansvarlig for å rydde opp etter seg. Røyking er ikke tillatt. Dyr er ikke tillatt.',
    faq: [
      { question: 'Hvor lang tid i forveien kan jeg booke?', answer: 'Du kan booke opptil 3 måneder i forveien.' },
      { question: 'Kan jeg avlyse bookingen?', answer: 'Ja, du kan avlyse opptil 24 timer før bookingen starter.' }
    ],
    calendarData: {
      weekStart: '2026-01-19',
      availabilityType: 'timeInterval',
      interval: '60',
      slots: [
        { date: '2026-01-19', time: '10:00', status: 'ledig' },
        { date: '2026-01-19', time: '11:00', status: 'ledig' },
        { date: '2026-01-19', time: '12:00', status: 'reservert' },
        { date: '2026-01-19', time: '13:00', status: 'booket' },
        { date: '2026-01-19', time: '14:00', status: 'ledig' },
        { date: '2026-01-19', time: '15:00', status: 'ledig' },
        { date: '2026-01-19', time: '16:00', status: 'ledig' },
        { date: '2026-01-20', time: '09:00', status: 'ledig' },
        { date: '2026-01-20', time: '10:00', status: 'ledig' },
        { date: '2026-01-20', time: '11:00', status: 'reservert' },
        { date: '2026-01-20', time: '12:00', status: 'ledig' },
        { date: '2026-01-20', time: '13:00', status: 'ledig' },
        { date: '2026-01-20', time: '14:00', status: 'ledig' }
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
