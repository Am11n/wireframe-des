import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  Search, 
  LogIn, 
  Heart, 
  Share2, 
  ChevronRight,
  Home,
  MapPin,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'
import type { 
  UtleieobjektDetaljSideProps, 
  UtleieobjektDetalj,
  BookingState,
  BookingSteg
} from '../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'
import Bildegalleri from './components/Bildegalleri'
import KontaktSidebar from './components/KontaktSidebar'
import BookingKalender from './components/BookingKalender'
import TimeIntervalCalendar from './components/TimeIntervalCalendar'
import DayCalendar from './components/DayCalendar'
import DayIntervalCalendar from './components/DayIntervalCalendar'
import QuantityCalendar from './components/QuantityCalendar'
import BookingStegIndikator from './components/BookingStegIndikator'
import OversiktTab from './components/tabs/OversiktTab'
import AktivitetskalenderTab from './components/tabs/AktivitetskalenderTab'
import RetningslinjerTab from './components/tabs/RetningslinjerTab'
import FAQTab from './components/tabs/FAQTab'
import { useBookingState } from './components/hooks/useBookingState'

const categoryLabels: Record<string, string> = {
  lokaler: 'Lokaler',
  utstyr: 'Utstyr',
  opplevelser: 'Opplevelser'
}

export default function UtleieobjektDetaljSide({
  utleieobjektId,
  category,
  data,
  onFavorite,
  onShare,
  onBookingComplete
}: UtleieobjektDetaljSideProps) {
  const [activeTab, setActiveTab] = useState('oversikt')
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const bookingState = useBookingState()
  
  // In a real app, this would load data from API
  // For now, we use the provided data prop
  const utleieobjekt = data

  if (!utleieobjekt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-900">
        <div className="text-center">
          <p className="text-stone-600 dark:text-stone-400">Utleieobjekt ikke funnet</p>
        </div>
      </div>
    )
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    onFavorite?.(utleieobjektId)
  }

  const handleShare = () => {
    onShare?.(utleieobjektId)
  }

  const getAddress = () => {
    if (utleieobjekt.category === 'utstyr') {
      return `${utleieobjekt.pickupLocation}, ${utleieobjekt.address}`
    }
    return `${utleieobjekt.address}, ${utleieobjekt.postalCode} ${utleieobjekt.postalArea}`
  }

  const getCalendarData = () => {
    if (utleieobjekt.category === 'lokaler' && 'calendarData' in utleieobjekt) {
      return utleieobjekt.calendarData
    }
    if (utleieobjekt.category === 'utstyr' && 'calendarData' in utleieobjekt) {
      return utleieobjekt.calendarData
    }
    if (utleieobjekt.category === 'sport' && 'calendarData' in utleieobjekt) {
      return utleieobjekt.calendarData
    }
    if (utleieobjekt.category === 'arrangementer' && 'calendarData' in utleieobjekt) {
      return utleieobjekt.calendarData
    }
    if (utleieobjekt.category === 'torg' && 'calendarData' in utleieobjekt) {
      return utleieobjekt.calendarData
    }
    return null
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Header */}
      <header className="bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Digilist ENKEL BOOKING
              </h1>
              {/* Breadcrumbs */}
              <nav className="hidden md:flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                <Home className="w-4 h-4" />
                <ChevronRight className="w-4 h-4" />
                <span>{categoryLabels[utleieobjekt.category]}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-stone-900 dark:text-stone-100">{utleieobjekt.name}</span>
              </nav>
            </div>

            {/* Search and Login */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 border border-stone-200 dark:border-stone-700 rounded-md px-3 py-1.5">
                <Search className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Søk"
                  className="bg-transparent border-0 outline-none text-sm w-32"
                />
              </div>
              <Button variant="outline" size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                Logg inn
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <Bildegalleri
            images={utleieobjekt.images}
            currentIndex={currentImageIndex}
            onImageChange={setCurrentImageIndex}
          />
        </div>

        {/* Title and Metadata */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                {utleieobjekt.name}
              </h1>
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <MapPin className="w-4 h-4" />
                <span>{getAddress()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {utleieobjekt.category === 'opplevelser' && utleieobjekt.bookingType === 'tickets' && (
                <Button
                  size="lg"
                  className="mr-2"
                  onClick={() => {
                    // Start ticket purchase flow
                    console.log('Kjøp billett clicked')
                    // Could trigger booking flow or navigate to ticket purchase
                  }}
                >
                  Kjøp billett
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={handleFavorite}
                className={isFavorite ? 'text-red-600 dark:text-red-400' : ''}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="oversikt">Oversikt</TabsTrigger>
                {utleieobjekt.category !== 'utstyr' && (
                  <TabsTrigger value="aktivitetskalender">Aktivitetskalender</TabsTrigger>
                )}
                <TabsTrigger value="retningslinjer">Retningslinjer</TabsTrigger>
                <TabsTrigger value="faq">Ofte stilte spørsmål</TabsTrigger>
              </TabsList>

              <TabsContent value="oversikt" className="mt-6">
                <OversiktTab utleieobjekt={utleieobjekt} />
              </TabsContent>

              {utleieobjekt.category !== 'utstyr' && getCalendarData() && (
                <TabsContent value="aktivitetskalender" className="mt-6">
                  <AktivitetskalenderTab
                    calendarData={getCalendarData()!}
                    category={utleieobjekt.category}
                  />
                </TabsContent>
              )}

              <TabsContent value="retningslinjer" className="mt-6">
                <RetningslinjerTab
                  guidelines={utleieobjekt.guidelines}
                  category={utleieobjekt.category}
                />
              </TabsContent>

              <TabsContent value="faq" className="mt-6">
                <FAQTab faq={utleieobjekt.faq} />
              </TabsContent>
            </Tabs>

            {/* Booking Section */}
            {getCalendarData() && (
              <div className="mt-8 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-6">
                <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
                  Book tidspunkt
                </h2>
                
                <BookingStegIndikator
                  currentStep={bookingState.currentStep}
                  steps={[
                    { id: 'velg-tid', label: 'Velg tid' },
                    { id: 'detaljer', label: 'Detaljer' },
                    { id: 'logg-inn', label: 'Logg inn' },
                    { id: 'bekreft', label: 'Bekreft' },
                    { id: 'ferdig', label: 'Ferdig' }
                  ]}
                />

                {bookingState.currentStep === 'velg-tid' && (() => {
                  const calendarData = getCalendarData()
                  if (!calendarData) return null
                  
                  return (
                    <div className="mt-6">
                      {(() => {
                      const availabilityType = calendarData.availabilityType || 
                        (utleieobjekt.category === 'lokaler' && 'timeInterval' in utleieobjekt ? 'timeInterval' : 
                         utleieobjekt.category === 'sport' ? 'timeInterval' :
                         utleieobjekt.category === 'arrangementer' ? 'quantity' :
                         utleieobjekt.category === 'torg' && 'calendarData' in utleieobjekt ? 
                           (calendarData.slots.some(s => s.fromTime && s.toTime) ? 'day' : 'quantity') :
                         'timeInterval')
                      
                      // Determine interval
                      const interval = calendarData.interval || 
                        (utleieobjekt.category === 'sport' ? '30' :
                         utleieobjekt.category === 'lokaler' && 'interval' in utleieobjekt ? utleieobjekt.interval :
                         '60')
                      
                      // Determine quantity unit
                      const quantityUnit = 
                        utleieobjekt.category === 'arrangementer' && 'quantityUnit' in utleieobjekt ? utleieobjekt.quantityUnit :
                        utleieobjekt.category === 'torg' && 'quantityUnit' in utleieobjekt ? utleieobjekt.quantityUnit :
                        undefined

                      if (availabilityType === 'timeInterval') {
                        return (
                          <TimeIntervalCalendar
                            calendarData={calendarData}
                            selectedSlots={bookingState.selectedSlots}
                            onSlotSelect={(slot) => {
                              bookingState.setSelectedSlots([...bookingState.selectedSlots, slot])
                            }}
                            onSlotDeselect={(slot) => {
                              bookingState.setSelectedSlots(
                                bookingState.selectedSlots.filter(
                                  s => !(s.date === slot.date && s.time === slot.time)
                                )
                              )
                            }}
                            interval={interval}
                          />
                        )
                      } else if (availabilityType === 'day') {
                        // Check if it's day interval (has fromTime/toTime) or full day
                        const hasIntervals = calendarData.slots.some(s => s.fromTime && s.toTime)
                        if (hasIntervals) {
                          return (
                            <DayIntervalCalendar
                              calendarData={calendarData}
                              selectedSlots={bookingState.selectedSlots}
                              onSlotSelect={(slot) => {
                                bookingState.setSelectedSlots([...bookingState.selectedSlots, slot])
                              }}
                              onSlotDeselect={(slot) => {
                                bookingState.setSelectedSlots(
                                  bookingState.selectedSlots.filter(
                                    s => !(s.date === slot.date && !s.time)
                                  )
                                )
                              }}
                            />
                          )
                        } else {
                          return (
                            <DayCalendar
                              calendarData={calendarData}
                              selectedSlots={bookingState.selectedSlots}
                              onSlotSelect={(slot) => {
                                bookingState.setSelectedSlots([...bookingState.selectedSlots, slot])
                              }}
                              onSlotDeselect={(slot) => {
                                bookingState.setSelectedSlots(
                                  bookingState.selectedSlots.filter(
                                    s => !(s.date === slot.date && !s.time)
                                  )
                                )
                              }}
                            />
                          )
                        }
                      } else if (availabilityType === 'quantity') {
                        return (
                          <QuantityCalendar
                            calendarData={calendarData}
                            selectedSlots={bookingState.selectedSlots}
                            onSlotSelect={(slot) => {
                              bookingState.setSelectedSlots([...bookingState.selectedSlots, slot])
                            }}
                            onSlotDeselect={(slot) => {
                              bookingState.setSelectedSlots(
                                bookingState.selectedSlots.filter(
                                  s => !(s.date === slot.date && !s.time)
                                )
                              )
                            }}
                            quantityUnit={quantityUnit}
                          />
                        )
                      } else {
                        // Fallback to original BookingKalender
                        return (
                          <BookingKalender
                            calendarData={calendarData}
                            selectedSlots={bookingState.selectedSlots}
                            onSlotSelect={(slot) => {
                              bookingState.setSelectedSlots([...bookingState.selectedSlots, slot])
                            }}
                            onSlotDeselect={(slot) => {
                              bookingState.setSelectedSlots(
                                bookingState.selectedSlots.filter(
                                  s => !(s.date === slot.date && s.time === slot.time)
                                )
                              )
                            }}
                            rentalUnit={utleieobjekt.category === 'lokaler' ? utleieobjekt.rentalUnit : undefined}
                            category={utleieobjekt.category}
                          />
                        )
                      }
                    })()}
                    </div>
                  )
                })()}

                {bookingState.currentStep === 'detaljer' && (
                  <div className="mt-6">
                    <p className="text-stone-600 dark:text-stone-400 mb-4">
                      Detaljer-steg kommer her
                    </p>
                  </div>
                )}

                {bookingState.currentStep === 'logg-inn' && (
                  <div className="mt-6">
                    <p className="text-stone-600 dark:text-stone-400 mb-4">
                      Logg inn-steg kommer her
                    </p>
                  </div>
                )}

                {bookingState.currentStep === 'bekreft' && (
                  <div className="mt-6">
                    <p className="text-stone-600 dark:text-stone-400 mb-4">
                      Bekreft-steg kommer her
                    </p>
                  </div>
                )}

                {bookingState.currentStep === 'ferdig' && (
                  <div className="mt-6">
                    <p className="text-stone-600 dark:text-stone-400 mb-4">
                      Booking fullført!
                    </p>
                  </div>
                )}

                <div className="mt-6 flex gap-4">
                  {bookingState.currentStep !== 'velg-tid' && (
                    <Button
                      variant="outline"
                      onClick={() => bookingState.goToPreviousStep()}
                    >
                      Tilbake
                    </Button>
                  )}
                  {bookingState.currentStep !== 'ferdig' && (
                    <Button
                      onClick={() => {
                        if (bookingState.currentStep === 'velg-tid' && bookingState.selectedSlots.length > 0) {
                          bookingState.goToNextStep()
                        } else if (bookingState.currentStep !== 'velg-tid') {
                          bookingState.goToNextStep()
                        }
                      }}
                      disabled={bookingState.currentStep === 'velg-tid' && bookingState.selectedSlots.length === 0}
                    >
                      {bookingState.currentStep === 'bekreft' ? 'Bekreft booking' : 'Neste'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <KontaktSidebar
              contacts={utleieobjekt.contacts}
              map={utleieobjekt.map}
              address={utleieobjekt.category === 'utstyr' ? utleieobjekt.pickupLocation : utleieobjekt.address}
              postalCode={utleieobjekt.postalCode}
              postalArea={utleieobjekt.postalArea}
              openingHours={utleieobjekt.category === 'lokaler' ? utleieobjekt.openingHours : undefined}
              eventDates={utleieobjekt.category === 'opplevelser' ? utleieobjekt.eventDates : undefined}
              category={utleieobjekt.category}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
