// Base types
export type Category = 'lokaler' | 'utstyr' | 'opplevelser'
export type KalenderSlotStatus = 'ledig' | 'reservert' | 'booket' | 'blokkert' | 'utilgjengelig' | 'stengt'
export type BookingSteg = 'velg-tid' | 'detaljer' | 'logg-inn' | 'bekreft' | 'ferdig'

// Contact information
export interface Contact {
  name: string
  role: string
  email: string
  phone: string
}

// Map coordinates
export interface MapCoordinates {
  lat: number
  lng: number
}

// Opening hours
export interface OpeningHour {
  day: string
  from: string
  to: string
  active: boolean
}

// Universal design
export interface UniversalDesign {
  stepFreeAccess: boolean
  wcAccessible: boolean
  elevator: boolean
  hearingLoop: boolean
  accessibleParking: boolean
  otherAccommodation: string
}

// Add-on service
export interface AddOnService {
  id: string
  name: string
  description: string
  price: number
  required: boolean
  needsApproval: boolean
}

// Pricing
export interface TargetGroup {
  group: string
  price: number
  free: boolean
}

export interface Pricing {
  isFree: boolean
  basePrice?: number
  rentalPrice?: number
  deposit?: number
  ticketPrice?: number
  priceModel: string
  targetGroups?: TargetGroup[]
}

// Calendar slot
export interface KalenderSlot {
  date: string
  time?: string
  status: KalenderSlotStatus
}

export interface CalendarData {
  weekStart: string
  slots: KalenderSlot[]
}

// Event date (for opplevelser)
export interface EventDate {
  date: string
  time: string
  endTime: string
  availableTickets: number
}

// Logistics (for utstyr)
export interface Logistics {
  pickupRequired: boolean
  deliveryAvailable: boolean
  pickupHours: string
}

// FAQ item
export interface FAQItem {
  question: string
  answer: string
}

// Base rental object detail (common fields)
export interface BaseUtleieobjektDetalj {
  id: string
  category: Category
  name: string
  shortDescription: string
  longDescription: string
  images: string[]
  contacts: Contact[]
  map: MapCoordinates
  pricing: Pricing
  guidelines: string
  faq: FAQItem[]
}

// Lokaler (rooms/venues)
export interface LokaleDetalj extends BaseUtleieobjektDetalj {
  category: 'lokaler'
  address: string
  postalCode: string
  postalArea: string
  maxPersons: number
  size: string
  facilities: string[]
  universalDesign: UniversalDesign
  addOnServices: AddOnService[]
  openingHours: OpeningHour[]
  rentalUnit: 'hour' | 'day'
  interval: string
  calendarData: CalendarData
}

// Utstyr (equipment)
export interface UtstyrDetalj extends BaseUtleieobjektDetalj {
  category: 'utstyr'
  pickupLocation: string
  address: string
  postalCode: string
  postalArea: string
  quantity: number
  availableQuantity: number
  facilities: string[]
  logistics: Logistics
  calendarData: CalendarData
}

// Opplevelser (experiences/events)
export interface OpplevelseDetalj extends BaseUtleieobjektDetalj {
  category: 'opplevelser'
  address: string
  postalCode: string
  postalArea: string
  maxParticipants: number
  eventDates: EventDate[]
  bookingType: 'tickets' | 'registration'
}

// Union type for all categories
export type UtleieobjektDetalj = LokaleDetalj | UtstyrDetalj | OpplevelseDetalj

// Booking state
export interface BookingState {
  currentStep: BookingSteg
  selectedSlots: KalenderSlot[]
  selectedAddOnServices: string[]
  bookingDetails: {
    name: string
    email: string
    phone: string
    organization?: string
    message?: string
  }
  isLoggedIn: boolean
  guestBooking: boolean
}

// Props for main component
export interface UtleieobjektDetaljSideProps {
  utleieobjektId: string
  category: Category
  data?: UtleieobjektDetalj
  onFavorite?: (id: string) => void
  onShare?: (id: string) => void
  onBookingComplete?: (bookingData: BookingState) => void
}

// Props for sub-components
export interface BildegalleriProps {
  images: string[]
  currentIndex?: number
  onImageChange?: (index: number) => void
}

export interface KontaktSidebarProps {
  contacts: Contact[]
  map: MapCoordinates
  address: string
  postalCode: string
  postalArea: string
  openingHours?: OpeningHour[]
  eventDates?: EventDate[]
  category: Category
}

export interface BookingKalenderProps {
  calendarData: CalendarData
  selectedSlots: KalenderSlot[]
  onSlotSelect: (slot: KalenderSlot) => void
  onSlotDeselect: (slot: KalenderSlot) => void
  rentalUnit?: 'hour' | 'day'
  category: Category
}

export interface BookingStegIndikatorProps {
  currentStep: BookingSteg
  steps: Array<{ id: BookingSteg; label: string }>
}

export interface TilleggstjenesterProps {
  services: AddOnService[]
  selectedServices: string[]
  onServiceToggle: (serviceId: string) => void
}

export interface FasiliteterProps {
  facilities: string[]
}

export interface OversiktTabProps {
  utleieobjekt: UtleieobjektDetalj
}

export interface AktivitetskalenderTabProps {
  calendarData: CalendarData
  category: Category
}

export interface RetningslinjerTabProps {
  guidelines: string
  category: Category
}

export interface FAQTabProps {
  faq: FAQItem[]
}
