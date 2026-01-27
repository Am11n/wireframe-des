import { Suspense } from 'react'
import UtleieobjektDetaljSide from './UtleieobjektDetaljSide'
import type { UtleieobjektDetalj } from '../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

export default function UtleieobjektDetaljSidePreviewArrangementer() {
  const data: UtleieobjektDetalj = {
    id: 'arrangementer-001',
    category: 'arrangementer',
    subcategory: 'Konsert',
    name: 'Konsert i Kulturarena',
    address: 'Kulturveien 15',
    postalCode: '3770',
    postalArea: 'Kragerø',
    map: { lat: 58.8683, lng: 9.4103 },
    shortDescription: 'Konsert med begrenset antall billetter. Book din billett nå!',
    longDescription: 'Konsert i Kulturarena med begrenset antall billetter. Arrangementet er åpent for alle og billetter kan bookes per dag. Når billetter er utsolgt for en dag, vil det vises i kalenderen.',
    images: [
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200'
    ],
    maxParticipants: 200,
    bookingType: 'tickets',
    duration: '2 timer',
    isRecurring: false,
    registrationDeadline: { date: '2026-01-18', time: '12:00' },
    waitlistAllowed: true,
    minAge: 18,
    maxAge: undefined,
    cancellationDeadline: 24,
    refundRules: 'Full refusjon ved avbestilling mer enn 24 timer før arrangementet.',
    participationTerms: 'Alle deltakere må være minst 18 år.',
    eventDates: [
      {
        date: '2026-01-19',
        time: '19:00',
        endTime: '21:00',
        availableTickets: 100
      },
      {
        date: '2026-01-20',
        time: '19:00',
        endTime: '21:00',
        availableTickets: 150
      }
    ],
    pricing: {
      isFree: false,
      ticketPrice: 250,
      priceModel: 'per billett',
      targetGroups: [
        { group: 'Standard', price: 250, free: false },
        { group: 'Student', price: 200, free: false },
        { group: 'Senior', price: 200, free: false }
      ],
      paymentMethods: ['Kort', 'Vipps']
    },
    guidelines: 'Arrangementet starter klokken 19:00. Dørene åpner klokken 18:30.',
    faq: [
      { question: 'Hvor mange billetter kan jeg kjøpe?', answer: 'Du kan kjøpe opptil 10 billetter per bestilling.' },
      { question: 'Kan jeg avbestille billettene?', answer: 'Ja, du kan avbestille opptil 24 timer før arrangementet starter.' }
    ],
    contacts: [{
      name: 'Kragerø Kommune',
      role: 'Kultur',
      email: 'kultur@kragerø.kommune.no',
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
    quantityUnit: 'billetter'
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
