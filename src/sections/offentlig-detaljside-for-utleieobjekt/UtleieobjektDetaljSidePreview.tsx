import { Suspense } from 'react'
import UtleieobjektDetaljSide from './UtleieobjektDetaljSide'
import type { UtleieobjektDetalj } from '../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

interface UtleieobjektDetaljSidePreviewProps {
  category?: 'lokaler' | 'utstyr' | 'opplevelser'
}

export default function UtleieobjektDetaljSidePreview({
  category = 'lokaler'
}: UtleieobjektDetaljSidePreviewProps) {
  // For now, we'll use a simple approach - in production this would load from API
  // Get sample data for the selected category
  const sampleData = {
    lokaler: {
      id: 'lokale-001',
      category: 'lokaler' as const,
      name: 'Møterom Y - Kragerø',
      address: 'Møterom Yveien 51',
      postalCode: '3770',
      postalArea: 'Kragerø',
      map: { lat: 58.8683, lng: 9.4103 },
      shortDescription: 'Moderne møterom y i Kragerø. Perfekt for trening, events og arrangementer.',
      longDescription: 'Moderne møterom y i Kragerø. Perfekt for trening, events og arrangementer. Godt vedlikeholdt med moderne fasiliteter.',
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
      addOnServices: [],
      contacts: [{
        name: 'Kragerø Kommune',
        role: 'Drift',
        email: 'møteromy@kragerø.kommune.no',
        phone: '+47 35 58 50 00'
      }],
      openingHours: [],
      rentalUnit: 'hour' as const,
      interval: '60',
      pricing: {
        isFree: false,
        basePrice: 500,
        priceModel: 'per time',
        targetGroups: []
      },
      guidelines: 'Leietaker er ansvarlig for å rydde opp etter seg.',
      faq: [],
      calendarData: {
        weekStart: '2026-01-19',
        slots: []
      }
    }
  }
  
  const data = sampleData[category] as UtleieobjektDetalj

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
        onFavorite={(id) => {
          console.log('Favorite clicked:', id)
        }}
        onShare={(id) => {
          console.log('Share clicked:', id)
        }}
        onBookingComplete={(bookingData) => {
          console.log('Booking completed:', bookingData)
        }}
      />
    </Suspense>
  )
}