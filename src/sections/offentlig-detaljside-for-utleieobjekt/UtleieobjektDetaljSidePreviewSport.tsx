import { Suspense } from 'react'
import UtleieobjektDetaljSide from './UtleieobjektDetaljSide'
import type { UtleieobjektDetalj } from '../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

export default function UtleieobjektDetaljSidePreviewSport() {
  const data: UtleieobjektDetalj = {
    id: 'sport-001',
    category: 'sport',
    subcategory: 'Padel',
    name: 'Padelbane - Kragerø',
    address: 'Idrettsveien 5',
    postalCode: '3770',
    postalArea: 'Kragerø',
    map: { lat: 58.8683, lng: 9.4103 },
    shortDescription: 'Moderne padelbane med 30-minutters booking. Perfekt for padel-enthusiaster.',
    longDescription: 'Moderne padelbane i Kragerø. Perfekt for padel-enthusiaster. Banen er godt vedlikeholdt med moderne fasiliteter. Booking basert på 30-minutters intervaller.',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200'
    ],
    maxPersons: 4,
    size: '200 m²',
    facilities: ['Parkering', 'Garderobe', 'Dusj', 'Kiosk'],
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
        id: 'equipment',
        name: 'Padelutstyr',
        description: 'Leie av padel-racket og baller',
        price: 100,
        required: false,
        needsApproval: false
      }
    ],
    contacts: [{
      name: 'Kragerø Kommune',
      role: 'Drift',
      email: 'padel@kragerø.kommune.no',
      phone: '+47 35 58 50 00'
    }],
    openingHours: [
      { day: 'Mandag', from: '07:00', to: '22:00', active: true },
      { day: 'Tirsdag', from: '07:00', to: '22:00', active: true },
      { day: 'Onsdag', from: '07:00', to: '22:00', active: true },
      { day: 'Torsdag', from: '07:00', to: '22:00', active: true },
      { day: 'Fredag', from: '07:00', to: '22:00', active: true },
      { day: 'Lørdag', from: '08:00', to: '20:00', active: true },
      { day: 'Søndag', from: '08:00', to: '20:00', active: true }
    ],
    rentalUnit: 'hour',
    interval: '30',
    pricing: {
      isFree: false,
      basePrice: 300,
      deposit: 500,
      priceModel: 'per 30 min',
      targetGroups: [
        { group: 'Standard', price: 300, free: false },
        { group: 'Organisasjoner', price: 250, free: false }
      ],
      paymentMethods: ['Kort', 'Vipps']
    },
    guidelines: 'Leietaker er ansvarlig for å rydde opp etter seg. Røyking er ikke tillatt.',
    faq: [
      { question: 'Hvor lang tid i forveien kan jeg booke?', answer: 'Du kan booke opptil 2 måneder i forveien.' },
      { question: 'Kan jeg avlyse bookingen?', answer: 'Ja, du kan avlyse opptil 2 timer før bookingen starter.' }
    ],
    calendarData: {
      weekStart: '2026-01-19',
      availabilityType: 'timeInterval',
      interval: '30',
      slots: [
        { date: '2026-01-19', time: '08:00', status: 'ledig' },
        { date: '2026-01-19', time: '08:30', status: 'ledig' },
        { date: '2026-01-19', time: '09:00', status: 'reservert' },
        { date: '2026-01-19', time: '09:30', status: 'booket' },
        { date: '2026-01-19', time: '10:00', status: 'ledig' },
        { date: '2026-01-19', time: '10:30', status: 'ledig' },
        { date: '2026-01-19', time: '11:00', status: 'ledig' },
        { date: '2026-01-19', time: '11:30', status: 'ledig' },
        { date: '2026-01-19', time: '12:00', status: 'ledig' },
        { date: '2026-01-19', time: '12:30', status: 'reservert' },
        { date: '2026-01-19', time: '13:00', status: 'ledig' },
        { date: '2026-01-19', time: '13:30', status: 'ledig' },
        { date: '2026-01-20', time: '08:00', status: 'ledig' },
        { date: '2026-01-20', time: '08:30', status: 'ledig' },
        { date: '2026-01-20', time: '09:00', status: 'ledig' },
        { date: '2026-01-20', time: '09:30', status: 'reservert' },
        { date: '2026-01-20', time: '10:00', status: 'ledig' },
        { date: '2026-01-20', time: '10:30', status: 'ledig' }
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
