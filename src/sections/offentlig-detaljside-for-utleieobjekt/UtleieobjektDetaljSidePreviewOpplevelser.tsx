import { Suspense } from 'react'
import UtleieobjektDetaljSide from './UtleieobjektDetaljSide'
import type { UtleieobjektDetalj } from '../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

export default function UtleieobjektDetaljSidePreviewOpplevelser() {
  const data: UtleieobjektDetalj = {
    id: 'opplevelse-001',
    category: 'opplevelser',
    name: 'Sommerfest 2024',
    address: 'Skien sentrum',
    postalCode: '3720',
    postalArea: 'Skien',
    map: { lat: 59.2086, lng: 9.6090 },
    shortDescription: 'Årlig sommerfest i Skien sentrum med musikk, mat og aktiviteter',
    longDescription: 'Velkommen til vår årlige sommerfest i Skien sentrum! Arrangementet inkluderer live musikk, matstasjoner, aktiviteter for hele familien, og mye mer. Perfekt for alle aldersgrupper.',
    images: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200',
      'https://images.unsplash.com/photo-1478146897154-1976b1f16c7a?w=1200'
    ],
    maxParticipants: 500,
    eventDates: [
      {
        date: '2026-06-15',
        time: '14:00',
        endTime: '22:00',
        availableTickets: 350
      },
      {
        date: '2026-06-16',
        time: '12:00',
        endTime: '20:00',
        availableTickets: 400
      }
    ],
    pricing: {
      isFree: false,
      ticketPrice: 150,
      priceModel: 'per billett',
      targetGroups: [
        { group: 'Voksne', price: 150, free: false },
        { group: 'Barn (under 12)', price: 75, free: false },
        { group: 'Senior', price: 100, free: false }
      ]
    },
    bookingType: 'tickets',
    contacts: [{
      name: 'Skien Kultur',
      role: 'Arrangement',
      email: 'kultur@skien.kommune.no',
      phone: '+47 35 90 00 00'
    }],
    guidelines: 'Arrangementet er utendørs. Ta med passende klær. Dyr er ikke tillatt.',
    faq: [
      { question: 'Er arrangementet utendørs?', answer: 'Ja, arrangementet er utendørs i Skien sentrum.' },
      { question: 'Kan jeg kjøpe billetter på døren?', answer: 'Ja, hvis det er ledige billetter. Vi anbefaler forhåndsbestilling.' },
      { question: 'Er det mat og drikke tilgjengelig?', answer: 'Ja, det er flere matstasjoner og drikkestasjoner på arrangementet.' }
    ]
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
