// ============================================================================
// UTLEIEOBJEKT ADMIN - KOMPLETT TYPE-SYSTEM
// ============================================================================
// Dette er det komplette type-systemet for kommunalt utleie av lokaler,
// sportsfasiliteter, arrangementer og torg/uteområder.
// ============================================================================

// ============================================================================
// DEL 1: GRUNNLEGGENDE TYPER
// ============================================================================

// Hovedkategorier for utleieobjekter
export type Category = 'lokaler' | 'sport' | 'arrangementer' | 'torg' | 'utstyr' | 'opplevelser'

// Status for kalenderslots
export type KalenderSlotStatus = 'ledig' | 'reservert' | 'booket' | 'blokkert' | 'utilgjengelig' | 'stengt'

// Steg i bookingprosessen
export type BookingSteg = 'velg-tid' | 'detaljer' | 'logg-inn' | 'bekreft' | 'ferdig'

// Type tilgjengelighet
export type AvailabilityType = 'timeInterval' | 'day' | 'quantity'

// Tilgangstyper
export type AccessType = 'code' | 'reception' | 'janitor' | 'digital' | 'physical_key'

// Synlighetstyper
export type VisibilityType = 'public' | 'organization' | 'internal' | 'admin_only'

// Godkjenningsmodus
export type ApprovalMode = 'automatic' | 'manual' | 'conditional'

// Refusjonspolicy
export type RefundPolicy = 'full' | 'partial' | 'none'

// Ressurstype for sport
export type SportResourceType = 'court' | 'equipment'

// Tillatelsestatus
export type PermitStatus = 'not_required' | 'pending' | 'approved' | 'rejected' | 'expired'

// Vedlikeholdsstatus
export type MaintenanceStatus = 'available' | 'limited' | 'maintenance' | 'closed'

// Utlånsstatus
export type LoanStatus = 'available' | 'reserved' | 'checked_out' | 'returning' | 'inspecting' | 'maintenance' | 'overdue'

// ============================================================================
// DEL 2: FELLES STØTTETYPER
// ============================================================================

// Kontaktinformasjon
export interface Contact {
  name: string
  role: string
  email: string
  phone: string
  isPrimary?: boolean
  isEmergency?: boolean
}

// Kartkoordinater
export interface MapCoordinates {
  lat: number
  lng: number
}

// Adresse
export interface Address {
  street: string
  postalCode: string
  postalArea: string
  building?: string
  roomNumber?: string
  floor?: string
}

// Åpningstider
export interface OpeningHour {
  day: string
  from: string
  to: string
  active: boolean
}

// Universell utforming
export interface UniversalDesign {
  stepFreeAccess: boolean
  wcAccessible: boolean
  elevator: boolean
  hearingLoop: boolean
  accessibleParking: boolean
  guideDogAllowed: boolean
  signLanguageSupport: boolean
  brailleSignage: boolean
  otherAccommodation: string
}

// Tilleggstjeneste
export interface AddOnService {
  id: string
  name: string
  description: string
  price: number
  required: boolean
  needsApproval: boolean
  category?: string
  availability?: 'always' | 'on_request' | 'limited'
}

// Målgruppe med pris
export interface TargetGroup {
  id: string
  group: string
  price: number
  free: boolean
  discountPercent?: number
  requiresVerification?: boolean
}

// FAQ-element
export interface FAQItem {
  question: string
  answer: string
  category?: string
}

// Vedlegg/dokument
export interface Attachment {
  id: string
  name: string
  type: 'pdf' | 'image' | 'document'
  url: string
  uploadedAt: string
  category: 'rules' | 'floor_plan' | 'fire_instructions' | 'terms' | 'permit' | 'other'
}

// Galleri-bilde
export interface GalleryImage {
  id: string
  url: string
  thumbnailUrl?: string
  caption?: string
  isPrimary: boolean
  order: number
}

// Kalenderslot
export interface KalenderSlot {
  date: string
  time?: string
  status: KalenderSlotStatus
  fromTime?: string
  toTime?: string
  availableQuantity?: number
  totalQuantity?: number
  blockedReason?: string
}

// Kalenderdata
export interface CalendarData {
  weekStart: string
  slots: KalenderSlot[]
  availabilityType?: AvailabilityType
  interval?: string
}

// Eventdato (for arrangementer)
export interface EventDate {
  date: string
  time: string
  endTime: string
  availableTickets: number
  totalTickets?: number
  status?: 'scheduled' | 'cancelled' | 'soldout'
}

// ============================================================================
// DEL 3: BASERESOURCE - FELLES FELT FOR ALLE UTLEIEOBJEKTER
// ============================================================================

// 3.1 Identitet og struktur
export interface ResourceIdentity {
  objectId: string                    // Auto-generert UUID
  slug: string                        // URL-vennlig identifikator
  internalCode: string                // Kortkode for drift (f.eks. "MR-001")
  ownerUnit: string                   // Avdeling/virksomhet
  ownerUnitId?: string                // ID for eier-enhet
  displayName: string                 // Synlig navn for publikum
  internalName?: string               // Internt navn for admin (hvis forskjellig)
  externalId?: string                 // ID fra eksternt system ved import
}

// 3.2 Lokasjon og tilgang
export interface ResourceLocation {
  address: Address
  map: MapCoordinates
  building?: string                   // Bygg/anlegg navn
  roomNumber?: string                 // Romnummer/sone
  floor?: string                      // Etasje
  meetingPoint?: string               // "Møt opp her"-tekst
  directionsText?: string             // Veibeskrivelse
  accessType: AccessType
  accessCode?: string                 // Kode hvis relevant (kryptert)
  accessInstructions: string          // Detaljerte tilgangsinstrukser
  keyPickupLocation?: string          // Hvor hentes nøkkel
  keyPickupHours?: string             // Når kan nøkkel hentes
  keyReturnDeadline?: string          // Frist for retur av nøkkel
  parkingInfo?: string                // Parkering/innlasting
  parkingSpots?: number               // Antall parkeringsplasser
  loadingZone: boolean                // Har lastesone
  loadingZoneHours?: string           // Tider for lastesone
}

// 3.3 Målgruppe og synlighet
export interface ResourceAudience {
  visibility: VisibilityType[]        // Hvem kan se objektet
  bookableBy: VisibilityType[]        // Hvem kan booke
  priorityRules: PriorityRule[]       // Prioriteringsregler
  restrictions: AudienceRestrictions
}

export interface PriorityRule {
  id: string
  name: string
  priority: number                    // 1 = høyest
  targetGroups: string[]
  conditions?: string                 // Betingelser for prioritet
}

export interface AudienceRestrictions {
  requireOrgNumber: boolean           // Krever organisasjonsnummer
  requireResponsibleAdult: boolean    // Krever ansvarlig voksen
  minAge: number | null               // Minimum alder
  maxAge: number | null               // Maksimum alder
  allowedOrganizationTypes: string[]  // Tillatte organisasjonstyper
  blockedOrganizations?: string[]     // Blokkerte organisasjoner
  membershipRequired?: boolean        // Krever medlemskap
  verificationLevel: 'none' | 'email' | 'phone' | 'bankid'
}

// 3.4 Tidslogikk
export interface ResourceTimeLogic {
  defaultBookingLength: number        // Standard lengde i minutter
  minDuration: number                 // Minimum varighet i minutter
  maxDuration: number                 // Maksimum varighet i minutter
  bufferBefore: number                // Rigg-tid før (minutter)
  bufferAfter: number                 // Rydd-tid etter (minutter)
  minLeadTime: number                 // Minste tid før booking (timer)
  maxLeadTime: number                 // Maks tid før booking (dager)
  maxBookingsPerUser: MaxBookingsLimit
  blackoutPeriods: BlackoutPeriod[]
  cancellationRules: CancellationRules
  noShowRules: NoShowRules
}

export interface MaxBookingsLimit {
  perDay: number | null
  perWeek: number | null
  perMonth: number | null
  activeBookings: number | null       // Maks samtidige aktive bookinger
}

export interface BlackoutPeriod {
  id: string
  name: string
  fromDate: string
  toDate: string
  reason: string
  recurring: boolean                  // Gjentas årlig
  visible: boolean                    // Synlig for brukere
}

export interface CancellationRules {
  cutoffHours: number                 // Timer før booking
  allowPartialCancellation: boolean   // Tillat delvis avbestilling
  lateCancellationFee: number         // Gebyr for sen avbestilling
  lateCancellationThreshold: number   // Timer før for å definere "sen"
  refundPolicy: RefundPolicy
  refundPercentage?: number           // Hvis partial
}

export interface NoShowRules {
  fee: number                         // Gebyr for no-show
  warningCount: number                // Antall advarsler før konsekvens
  consequenceAction: 'none' | 'fee' | 'block_temporary' | 'block_permanent'
  blockDurationDays?: number          // Dager for midlertidig blokkering
}

// 3.5 Pris og økonomi
export interface ResourcePricing {
  isFree: boolean
  basePrice: number
  priceModel: string                  // "per time", "per dag", etc.
  currency: string                    // NOK
  vatRate: number                     // MVA-sats (0, 12, 25)
  vatIncluded: boolean                // Er MVA inkludert i pris
  exemptFromVat: boolean              // Fritatt fra MVA
  feeCode?: string                    // Kommunal gebyr-kode
  
  targetGroups: TargetGroup[]
  pricePlans: PricePlan[]
  discounts: Discount[]
  
  deposit: DepositConfig
  fees: Fee[]
  
  paymentMethods: PaymentMethod[]
  invoiceSettings?: InvoiceSettings
}

export interface PricePlan {
  id: string
  name: string
  price: number
  conditions: {
    dayOfWeek?: string[]              // Hvilke dager gjelder planen
    timeFrom?: string                 // Fra klokkeslett
    timeTo?: string                   // Til klokkeslett
    seasonStart?: string              // Sesong start
    seasonEnd?: string                // Sesong slutt
    minDuration?: number              // Minimum varighet for å kvalifisere
  }
  priority: number                    // Hvilken plan som velges ved overlapp
}

export interface Discount {
  id: string
  name: string
  type: 'percentage' | 'fixed'
  value: number
  targetGroups: string[]
  validFrom?: string
  validTo?: string
  requiresCode: boolean
  code?: string
  maxUsage?: number
}

export interface DepositConfig {
  required: boolean
  amount: number
  triggers: string[]                  // Hva utløser depositum
  refundConditions: string            // Betingelser for refusjon
  refundTimeline: number              // Dager til refusjon etter retur
  deductionRules: string              // Regler for trekk fra depositum
}

export interface Fee {
  id: string
  name: string
  amount: number
  type: 'fixed' | 'per_hour' | 'per_day' | 'percentage'
  category: 'cleaning' | 'security' | 'setup' | 'equipment' | 'damage' | 'late' | 'other'
  mandatory: boolean
  conditions?: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'vipps' | 'invoice' | 'ehf' | 'cash' | 'free'
  enabled: boolean
  accountNumber?: string
  settings?: Record<string, unknown>
}

export interface InvoiceSettings {
  allowInvoice: boolean
  allowedForGroups: string[]
  paymentTermsDays: number
  minimumAmount: number
  requireOrgNumber: boolean
  ehfEnabled: boolean
}

// 3.6 Arbeidsflyt og etterlevelse
export interface ResourceWorkflow {
  approvalMode: ApprovalMode
  approvalSteps: ApprovalStep[]
  autoApprovalConditions: AutoApprovalCondition[]
  prePublishChecklist: ChecklistItem[]
  documentRequirements: DocumentRequirement[]
  termsAcceptance: TermsConfig
}

export interface ApprovalStep {
  id: string
  order: number
  name: string
  role: string                        // Rolle som kan godkjenne
  required: boolean
  autoApprove: boolean
  autoApproveConditions?: string[]
  notifyOnSubmit: boolean
  escalationHours?: number            // Timer før eskalering
}

export interface AutoApprovalCondition {
  id: string
  name: string
  conditions: {
    targetGroups?: string[]
    maxDuration?: number
    maxCapacity?: number
    excludeDates?: string[]           // Datoer som ikke auto-godkjennes
    requirePreviousBooking?: boolean  // Krever tidligere booking
  }
}

export interface ChecklistItem {
  id: string
  label: string
  required: boolean
  category: 'identity' | 'location' | 'pricing' | 'content' | 'legal'
  validationRule?: string
}

export interface DocumentRequirement {
  id: string
  name: string
  type: string
  required: boolean
  requiresApproval: boolean
  validityPeriod?: number             // Dager dokumentet er gyldig
  triggers?: string[]                 // Hva utløser kravet
}

export interface TermsConfig {
  required: boolean
  documentUrl?: string
  documentId?: string
  version: string
  signatureRequired: boolean
  digitalSignature: boolean
}

// 3.7 Innhold og kvalitet
export interface ResourceContent {
  shortDescription: string
  longDescription: string
  gallery: GalleryImage[]
  attachments: Attachment[]
  languages: ('no' | 'en' | 'ar' | 'pl' | 'so')[]
  translations?: Record<string, ContentTranslation>
  faq: FAQItem[]
  guidelines: string
  accessibilityInfo: AccessibilityInfo
  keywords?: string[]
  seoDescription?: string
}

export interface ContentTranslation {
  displayName: string
  shortDescription: string
  longDescription: string
  guidelines: string
  faq: FAQItem[]
}

export interface AccessibilityInfo {
  summary: string
  universalDesign: UniversalDesign
  wheelchairAccessible: boolean
  hearingAidsCompatible: boolean
  visualAidsAvailable: boolean
  assistanceAvailable: boolean
  assistanceBookingRequired: boolean
  additionalInfo: string
}

// 3.8 Metadata og status
export interface ResourceMetadata {
  status: 'draft' | 'pending_review' | 'published' | 'archived' | 'suspended'
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  publishedAt?: string
  archivedAt?: string
  version: number
  importSource?: string
  lastBooking?: string
  totalBookings: number
  rating?: number
  reviewCount?: number
}

// ============================================================================
// DEL 4: BASERESOURCE - SAMMENSATT INTERFACE
// ============================================================================

export interface BaseResource {
  // Identitet
  identity: ResourceIdentity
  
  // Kategori
  category: Category
  subcategory?: string
  
  // Lokasjon
  location: ResourceLocation
  
  // Målgruppe
  audience: ResourceAudience
  
  // Tidslogikk
  timeLogic: ResourceTimeLogic
  
  // Pris
  pricing: ResourcePricing
  
  // Arbeidsflyt
  workflow: ResourceWorkflow
  
  // Innhold
  content: ResourceContent
  
  // Metadata
  metadata: ResourceMetadata
  
  // Kalender
  calendarData: CalendarData
  
  // Kontakter
  contacts: Contact[]
}

// ============================================================================
// DEL 5: LOKALER - UTVIDET DATAMODELL
// ============================================================================

// Kapasitet for lokaler
export interface VenueCapacity {
  maxPersons: number
  seatedCapacity: number
  standingCapacity: number
  fireCapacity: number                // Brannforskrift maks
  tableLayouts: TableLayout[]
}

export interface TableLayout {
  id: string
  name: string                        // "U-form", "Klasserom", "Bankett", etc.
  capacity: number
  description?: string
  imageUrl?: string
}

// Rom-struktur
export interface RoomStructure {
  isDivisible: boolean
  subRooms: SubRoom[]
  canBookSimultaneously: boolean
  sharedFacilities: string[]
  adjacentRooms: string[]
  parentRoomId?: string               // Hvis dette er et underrom
}

export interface SubRoom {
  id: string
  name: string
  capacity: number
  size: number                        // m²
  canBookSeparately: boolean
  priceAdjustment?: number            // Prisendring i forhold til hovedrom
}

// Tilgang for lokaler
export interface VenueAccess {
  keyType: AccessType
  keyPickupLocation: string
  keyPickupHours: string
  keyReturnDeadline: string
  keyDeposit?: number
  setupTimeMinutes: number
  teardownTimeMinutes: number
  cleaningIncluded: boolean
  cleaningFee?: number
  cleaningInstructions?: string
  selfServiceCleaning: boolean
}

// Utstyr for lokaler
export interface VenueEquipment {
  includedEquipment: EquipmentItem[]
  availableForRent: EquipmentItem[]
  externalEquipmentAllowed: boolean
  techSupportAvailable: boolean
  techSupportFee?: number
  techSupportHours?: string
}

export interface EquipmentItem {
  id: string
  name: string
  quantity: number
  included: boolean
  rentalPrice?: number
  description?: string
}

// Støyregler
export interface NoiseRules {
  maxDecibelLevel: number | null
  quietHoursFrom: string
  quietHoursTo: string
  musicAllowed: boolean
  amplifiedSoundAllowed: boolean
  livePerformanceAllowed: boolean
  neighborNotificationRequired: boolean
  noiseComplaintProcess: string
}

// Sesongprising for lokaler
export interface SeasonPricing {
  enabled: boolean
  seasons: Season[]
  peakTimes: PeakTime[]
  holidayPricing: HolidayPricing[]
}

export interface Season {
  id: string
  name: string
  startDate: string                   // MM-DD format
  endDate: string                     // MM-DD format
  priceMultiplier: number             // 1.0 = normal, 1.5 = 50% høyere
}

export interface PeakTime {
  id: string
  name: string
  dayOfWeek: string[]
  timeFrom: string
  timeTo: string
  priceMultiplier: number
}

export interface HolidayPricing {
  id: string
  date: string
  name: string
  priceMultiplier: number
  bookingRestrictions?: string
}

// Komplett Lokale-type
export interface LokaleDetalj extends BaseResource {
  category: 'lokaler'
  
  // Lokale-spesifikke felt
  venueCapacity: VenueCapacity
  roomStructure: RoomStructure
  venueAccess: VenueAccess
  venueEquipment: VenueEquipment
  noiseRules: NoiseRules
  seasonPricing: SeasonPricing
  
  // Fasiliteter
  facilities: string[]
  
  // Åpningstider
  openingHours: OpeningHour[]
  
  // Utleieenhet
  rentalUnit: 'hour' | 'day' | 'half_day'
  interval: string                    // Minutter mellom slots
  
  // Tilleggstjenester
  addOnServices: AddOnService[]
  
  // Legacy-felter for bakoverkompatibilitet
  address: string
  postalCode: string
  postalArea: string
  maxPersons: number
  size: string
  universalDesign: UniversalDesign
  map: MapCoordinates
  name: string
  shortDescription: string
  longDescription: string
  images: string[]
  guidelines: string
  faq: FAQItem[]
  id: string
}

// ============================================================================
// DEL 6: ARRANGEMENTER - UTVIDET DATAMODELL
// ============================================================================

// Arrangørinfo
export interface OrganizerInfo {
  organizationType: 'person' | 'organization' | 'municipality'
  name: string
  orgNumber?: string
  responsiblePerson: {
    name: string
    role: string
    phone: string
    email: string
    idVerified: boolean
  }
  emergencyContact: Contact
  previousEvents?: number             // Antall tidligere arrangementer
  verificationStatus: 'unverified' | 'verified' | 'trusted'
}

// Programstruktur
export interface EventProgram {
  checkInTime: string
  doorsOpenTime: string
  startTime: string
  endTime: string
  breaks: EventBreak[]
  programItems: ProgramItem[]
}

export interface EventBreak {
  id: string
  name: string
  startTime: string
  duration: number                    // Minutter
}

export interface ProgramItem {
  id: string
  title: string
  description?: string
  startTime: string
  duration: number                    // Minutter
  presenter?: string
  location?: string                   // Hvis flere rom/scener
}

// Kapasitet per billettype
export interface EventCapacity {
  totalCapacity: number
  ticketTypes: TicketType[]
  sections: EventSection[]
  waitlistCapacity: number
}

export interface TicketType {
  id: string
  name: string                        // "Voksen", "Barn", "Student", etc.
  price: number
  quantity: number
  availableQuantity: number
  description?: string
  restrictions?: string               // F.eks. "Krever gyldig studentbevis"
  salesStart?: string
  salesEnd?: string
  maxPerOrder: number
}

export interface EventSection {
  id: string
  name: string                        // "Parterre", "Balkong", etc.
  capacity: number
  priceAdjustment: number             // +/- i forhold til basisprisen
  accessibility: boolean              // HC-tilpasset
}

// Påmelding og venteliste
export interface EventRegistration {
  type: 'tickets' | 'registration' | 'free' | 'lottery'
  deadline: { date: string; time: string }
  earlyBirdDeadline?: { date: string; time: string }
  earlyBirdDiscount?: number
  waitlistEnabled: boolean
  waitlistCapacity: number
  autoPromoteFromWaitlist: boolean
  confirmationRequired: boolean
  confirmationDeadlineHours: number
  allowGroupRegistration: boolean
  maxGroupSize: number
  requiresApproval: boolean
  approvalCriteria?: string
}

// Avlysning og refusjon
export interface EventCancellation {
  cancellationDeadlineHours: number
  refundPolicy: RefundPolicy
  partialRefundPercentage?: number
  refundDeadlineDays: number
  weatherCancellation: boolean
  weatherPolicy?: string
  minParticipantsRequired: number | null
  minParticipantsDeadlineHours: number
  cancellationNotificationMethods: ('email' | 'sms' | 'push')[]
  alternativeDatePolicy?: string
}

// Dokumentkrav for arrangementer
export interface EventDocumentRequirements {
  alcoholPermit: PermitRequirement
  fireWatch: {
    required: boolean
    minPersons: number
    status: PermitStatus
    certificateRequired: boolean
  }
  policePermit: PermitRequirement
  eventPermit: PermitRequirement
  noisePermit: PermitRequirement
  roadClosure: PermitRequirement
  healthPermit: PermitRequirement
  insuranceRequired: boolean
  insuranceMinCoverage?: number
}

export interface PermitRequirement {
  required: boolean
  status: PermitStatus
  applicationDeadlineDays: number
  documentId?: string
  expiryDate?: string
  notes?: string
}

// Sted-tilknytning for arrangementer
export interface EventVenue {
  type: 'linked_venue' | 'linked_outdoor' | 'custom_address'
  linkedVenueId?: string
  linkedOutdoorId?: string
  customAddress?: Address
  venueRequirements?: string
  setupRequirements?: string
}

// Komplett Arrangement-type
export interface ArrangementDetalj extends BaseResource {
  category: 'arrangementer'
  
  // Arrangement-spesifikke felt
  eventType: 'single' | 'recurring' | 'series'
  eventVenue: EventVenue
  organizer: OrganizerInfo
  program: EventProgram
  eventCapacity: EventCapacity
  registration: EventRegistration
  cancellation: EventCancellation
  documentRequirements: EventDocumentRequirements
  
  // Event-datoer
  eventDates: EventDate[]
  
  // Booking-type
  bookingType: 'tickets' | 'registration'
  
  // Varighet
  duration?: string
  isRecurring: boolean
  recurrencePattern?: RecurrencePattern
  
  // Aldersbegrensninger
  minAge?: number
  maxAge?: number
  
  // Deltakelsesvilkår
  participationTerms?: string
  
  // Legacy-felter for bakoverkompatibilitet
  address: string
  postalCode: string
  postalArea: string
  maxParticipants: number
  registrationDeadline?: { date: string; time: string }
  waitlistAllowed?: boolean
  cancellationDeadline?: number
  refundRules?: string
  quantityUnit?: string
  map: MapCoordinates
  name: string
  shortDescription: string
  longDescription: string
  images: string[]
  guidelines: string
  faq: FAQItem[]
  id: string
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
  interval: number
  daysOfWeek?: string[]
  endDate?: string
  maxOccurrences?: number
}

// ============================================================================
// DEL 7: SPORT - DELT MODELL (BANE VS UTSTYR)
// ============================================================================

// 7.1 Felles sport-felt
export interface SportBase extends BaseResource {
  category: 'sport'
  resourceType: SportResourceType
  
  // Fasiliteter
  facilities: string[]
  
  // Legacy-felter
  address: string
  postalCode: string
  postalArea: string
  map: MapCoordinates
  name: string
  shortDescription: string
  longDescription: string
  images: string[]
  guidelines: string
  faq: FAQItem[]
  id: string
}

// 7.2 Sport-Bane (tidsbasert)
export interface SportCourtInfo {
  surface: string                     // Grus, kunstgress, parkett, etc.
  dimensions: { length: number; width: number }
  indoor: boolean
  lighting: boolean
  lightingHours?: string
  heatingAvailable: boolean
  heatingIncluded: boolean
  heatingFee?: number
  markings: string[]                  // Linjer for ulike sporter
}

export interface SeasonBooking {
  enabled: boolean
  seasonStart: string
  seasonEnd: string
  frameTimeSlots: FrameTimeSlot[]
  applicationDeadline: string
  allocationMethod: 'first_come' | 'lottery' | 'priority'
}

export interface FrameTimeSlot {
  id: string
  dayOfWeek: string
  timeFrom: string
  timeTo: string
  allocatedTo?: string                // Organisasjon/lag
  type: 'training' | 'match' | 'tournament' | 'open'
}

export interface CourtPriorityRules {
  levels: ('training' | 'match' | 'tournament' | 'event')[]
  trainingPriority: string[]          // Org-IDer med treningsprioritet
  matchPriority: string[]             // Org-IDer med kampprioritet
  tournamentRequiresApproval: boolean
  eventRequiresApproval: boolean
  localClubPriority: boolean
  localClubIds: string[]
}

export interface CourtMaintenance {
  status: MaintenanceStatus
  nextMaintenance?: string
  maintenanceSchedule: MaintenanceEntry[]
  lastInspection?: string
  inspectionFrequency: number         // Dager mellom inspeksjoner
}

export interface MaintenanceEntry {
  id: string
  date: string
  type: string
  description: string
  performedBy?: string
  nextScheduled?: string
}

// Komplett Sport-Bane type
export interface SportCourtDetalj extends SportBase {
  resourceType: 'court'
  
  courtInfo: SportCourtInfo
  seasonBooking: SeasonBooking
  priorityRules: CourtPriorityRules
  maintenance: CourtMaintenance
  
  // Kapasitet
  maxPersons: number
  size?: string
  
  // Universell utforming
  universalDesign: UniversalDesign
  
  // Tilleggstjenester
  addOnServices: AddOnService[]
  
  // Åpningstider
  openingHours: OpeningHour[]
  
  // Utleieenhet
  rentalUnit: 'hour' | 'day'
  interval: string
}

// 7.3 Sport-Utstyr (antallsbasert)
export interface SportInventory {
  totalUnits: number
  availableUnits: number
  unitDescription: string
  setContents: string[]
  serialNumbers?: string[]
  purchaseDate?: string
  expectedLifespan?: number           // Måneder
}

export interface EquipmentCondition {
  status: 'good' | 'fair' | 'poor' | 'needs_repair'
  lastInspection: string
  nextInspection: string
  maintenanceLog: MaintenanceEntry[]
  damageHistory: DamageEntry[]
}

export interface DamageEntry {
  id: string
  date: string
  description: string
  repairCost?: number
  repairedDate?: string
  reportedBy: string
  bookingId?: string
}

export interface LoanConfig {
  maxLoanDurationDays: number
  pickupRequired: boolean
  deliveryAvailable: boolean
  deliveryFee?: number
  pickupLocation: string
  pickupHours: string
  returnDeadlineTime: string
  lateReturnFeePerDay: number
  graceHours: number                  // Timer etter frist før gebyr
}

export interface UserRequirements {
  minAge: number | null
  maxAge: number | null
  certificationRequired: boolean
  certificationType?: string
  certificationVerification: 'none' | 'self_declaration' | 'document' | 'registry'
  responsibleAdultRequired: boolean
  trainingRequired: boolean
  trainingUrl?: string
  physicalRequirements?: string
}

// Komplett Sport-Utstyr type
export interface SportEquipmentDetalj extends SportBase {
  resourceType: 'equipment'
  
  inventory: SportInventory
  condition: EquipmentCondition
  loan: LoanConfig
  userRequirements: UserRequirements
  
  // Depositum og avgifter
  deposit: number
  damageFee: number
  
  // Spesifikasjoner
  specifications?: string
  
  // Logistikk (fra gammel modell)
  logistics: Logistics
  
  // Antall
  quantity: number
  availableQuantity: number
}

// Legacy Logistics interface
export interface Logistics {
  pickupRequired: boolean
  deliveryAvailable: boolean
  pickupHours: string
}

// Union type for Sport
export type SportDetalj = SportCourtDetalj | SportEquipmentDetalj

// ============================================================================
// DEL 8: TORG/UTEOMRÅDE - UTVIDET DATAMODELL
// ============================================================================

// Areal og soner
export interface OutdoorArea {
  totalArea: number                   // m²
  usableArea: number                  // m² tilgjengelig for bruk
  zones: OutdoorZone[]
  infrastructure: OutdoorInfrastructure
  mapOverlay?: {
    imageUrl: string
    zones: ZoneOverlay[]
  }
}

export interface OutdoorZone {
  id: string
  name: string
  area: number                        // m²
  type: 'general' | 'stage' | 'vendor' | 'seating' | 'parking' | 'backstage'
  capacity: number
  pricePerDay?: number
  facilities: string[]
  restrictions?: string
}

export interface ZoneOverlay {
  zoneId: string
  coordinates: Array<{ x: number; y: number }>
  color?: string
}

export interface OutdoorInfrastructure {
  powerOutlets: PowerOutlet[]
  waterConnections: WaterConnection[]
  drainagePoints: number
  toiletFacilities: boolean
  toiletCount?: number
  wasteDisposal: boolean
  lightingAvailable: boolean
  fencingAvailable: boolean
}

export interface PowerOutlet {
  id: string
  location: string
  amperage: number
  phases: 1 | 3
  available: boolean
}

export interface WaterConnection {
  id: string
  location: string
  type: 'drinking' | 'utility' | 'fire_hydrant'
  available: boolean
}

// Logistikk for torg
export interface OutdoorLogistics {
  setupTime: {
    defaultHours: number
    maxHours: number
    requiresApproval: boolean
    approvalThresholdHours: number
  }
  teardownTime: {
    defaultHours: number
    maxHours: number
    lateTeardownFeePerHour: number
  }
  deliveryWindows: DeliveryWindow[]
  vehicleAccess: {
    allowed: boolean
    maxVehicleWeight: number          // Tonn
    maxVehicleHeight: number          // Meter
    loadingZone: boolean
    loadingZoneHours?: string
    accessRoute?: string
  }
  storageAvailable: boolean
  storageArea?: number
  storageFeePerDay?: number
}

export interface DeliveryWindow {
  id: string
  dayOfWeek: string[]
  timeFrom: string
  timeTo: string
  restrictions?: string
}

// Sikkerhetskrav
export interface OutdoorSafety {
  noiseRestrictions: {
    maxDecibels: number
    measurementDistance: number       // Meter fra kilde
    restrictedHoursFrom: string
    restrictedHoursTo: string
    musicCurfew: string
    exemptionPossible: boolean
  }
  crowdManagement: {
    maxCapacity: number
    securityRequired: boolean
    securityThreshold: number
    securityRatioPerPerson: number    // 1 vakt per X personer
    firstAidRequired: boolean
    firstAidThreshold: number
    medicalStaffRequired: boolean
    medicalStaffThreshold: number
    evacuationPlanRequired: boolean
    evacuationPlanThreshold: number
  }
  fireRequirements: {
    fireExtinguishersRequired: boolean
    fireExtinguisherCount: number
    fireWatchRequired: boolean
    fireWatchThreshold: number
    fireWatchCertificationRequired: boolean
    evacuationPlanRequired: boolean
    emergencyExits: number
  }
  barriers: {
    required: boolean
    threshold: number
    provided: boolean
    rentalFee?: number
  }
}

// Tillatelser for torg
export interface OutdoorPermits {
  triggers: PermitTrigger[]
  required: {
    policePermit: OutdoorPermitConfig
    alcoholPermit: OutdoorPermitConfig
    roadClosure: OutdoorPermitConfig
    noiseExemption: OutdoorPermitConfig
    firePermit: OutdoorPermitConfig
    healthPermit: OutdoorPermitConfig
    publicGatheringPermit: OutdoorPermitConfig
  }
  integrations: {
    autoNotifyPolice: boolean
    autoNotifyFireDept: boolean
    autoNotifyHealthDept: boolean
    autoCreateCase: boolean
    caseSystemIntegration?: string
  }
}

export interface PermitTrigger {
  id: string
  condition: 'capacity' | 'alcohol' | 'amplified_sound' | 'road_use' | 'food' | 'duration' | 'time_of_day'
  threshold: number | boolean | string
  operator?: 'gt' | 'gte' | 'lt' | 'lte' | 'eq'
  requiredPermit: string
  leadTimeDays: number
  description: string
}

export interface OutdoorPermitConfig {
  required: boolean
  status: PermitStatus
  applicationDeadlineDays: number
  processingTimeDays: number
  fee?: number
  documentId?: string
  expiryDate?: string
  contactInfo?: string
  applicationUrl?: string
  notes?: string
}

// Depositum og skadehåndtering
export interface OutdoorDeposit {
  baseAmount: number
  additionalPerZone: number
  additionalForInfrastructure: boolean
  infrastructureDepositPerUnit: number
  maxDeposit: number
  inspectionProcess: {
    preInspectionRequired: boolean
    postInspectionRequired: boolean
    inspectorRole: string
    inspectionChecklistId?: string
    damageReportingDeadlineHours: number
    photoDocumentationRequired: boolean
  }
  damageHandling: {
    deductionProcess: string
    disputeProcess: string
    disputeDeadlineDays: number
    insuranceRequirements?: string
    insuranceMinCoverage?: number
  }
}

// Komplett Torg-type
export interface TorgDetalj extends BaseResource {
  category: 'torg'
  
  // Torg-spesifikke felt
  area: OutdoorArea
  outdoorLogistics: OutdoorLogistics
  safety: OutdoorSafety
  permits: OutdoorPermits
  outdoorDeposit: OutdoorDeposit
  
  // Utstyr hvis relevant
  equipmentAvailable?: EquipmentItem[]
  
  // Fra gammel modell
  pickupLocation: string
  quantity: number
  availableQuantity: number
  facilities: string[]
  logistics: Logistics
  specifications?: string
  damageFee?: number
  returnDeadline?: number
  damageLiability?: string
  quantityUnit?: string
  
  // Legacy-felter
  address: string
  postalCode: string
  postalArea: string
  map: MapCoordinates
  name: string
  shortDescription: string
  longDescription: string
  images: string[]
  guidelines: string
  faq: FAQItem[]
  id: string
}

// ============================================================================
// DEL 9: UTSTYR OG OPPLEVELSER (LEGACY/ENKLERE MODELLER)
// ============================================================================

// Utstyr (enklere modell, ikke sport-relatert)
export interface UtstyrDetalj extends BaseResource {
  category: 'utstyr'
  
  pickupLocation: string
  quantity: number
  availableQuantity: number
  facilities: string[]
  logistics: Logistics
  specifications?: string
  damageFee?: number
  returnDeadline?: number
  damageLiability?: string
  
  // Legacy-felter
  address: string
  postalCode: string
  postalArea: string
  map: MapCoordinates
  name: string
  shortDescription: string
  longDescription: string
  images: string[]
  guidelines: string
  faq: FAQItem[]
  id: string
}

// Opplevelser (enklere arrangement-modell)
export interface OpplevelseDetalj extends BaseResource {
  category: 'opplevelser'
  
  maxParticipants: number
  eventDates: EventDate[]
  bookingType: 'tickets' | 'registration'
  duration?: string
  isRecurring?: boolean
  registrationDeadline?: { date: string; time: string }
  waitlistAllowed?: boolean
  minAge?: number
  maxAge?: number
  cancellationDeadline?: number
  refundRules?: string
  participationTerms?: string
  
  // Legacy-felter
  address: string
  postalCode: string
  postalArea: string
  map: MapCoordinates
  name: string
  shortDescription: string
  longDescription: string
  images: string[]
  guidelines: string
  faq: FAQItem[]
  id: string
}

// ============================================================================
// DEL 10: UNION TYPES OG EKSPORT
// ============================================================================

// Union type for alle kategorier
export type UtleieobjektDetalj = 
  | LokaleDetalj 
  | UtstyrDetalj 
  | OpplevelseDetalj 
  | SportCourtDetalj 
  | SportEquipmentDetalj 
  | ArrangementDetalj 
  | TorgDetalj

// ============================================================================
// DEL 11: WIZARD FORM STATE
// ============================================================================

export interface WizardFormData {
  // Identitet
  identity: Partial<ResourceIdentity>
  
  // Kategori og underkategori
  category: Category | null
  subcategory: string | null
  
  // Lokasjon
  location: Partial<ResourceLocation>
  
  // Målgruppe
  audience: Partial<ResourceAudience>
  
  // Tidslogikk
  timeLogic: Partial<ResourceTimeLogic>
  
  // Pris
  pricing: Partial<ResourcePricing>
  
  // Arbeidsflyt
  workflow: Partial<ResourceWorkflow>
  
  // Innhold
  content: Partial<ResourceContent>
  
  // Kontakter
  contacts: Contact[]
  
  // Tilgjengelighet (legacy format for wizard)
  availability: {
    availabilityType: AvailabilityType | null
    rentalUnit: string
    interval: string
    timeInterval: {
      interval: string
      openingHours: OpeningHour[]
    }
    day: {
      type: 'full' | 'custom'
      fromTime: string
      toTime: string
      openingHours: OpeningHour[]
    }
    quantity: {
      amount: string
      unit: string
    }
    openingHours: OpeningHour[]
    exceptions: BlackoutPeriod[]
    presentationOnly: boolean
  }
  
  // Regler (legacy format)
  rules: {
    approvalMode: string
    approvalRules: {
      targetGroupRules: Array<{ group: string; mode: string }>
      timeRules: Array<{ condition: string; mode: string }>
      riskRules: Array<{ condition: string; threshold: string; mode: string }>
    }
    restrictions: {
      leadTime: string
      maxDuration: string
      maxBookingsPerWeek: string
      cancellationDeadline: string
    }
    umbrellaDisposal: {
      allowed: boolean
      organizations: string[]
      quotaPerWeek: string
      canDistributeToSubclubs: boolean
      canLockTimes: boolean
    }
  }
  
  // Betaling (legacy format)
  payment: {
    methods: string[]
    accountSetup: {
      cardAccount: string
      vippsAccount: string
      invoiceRecipient: string
    }
    terms: {
      pdf: File | null
      requireAcceptance: boolean
      visibleOnReceipt: boolean
    }
    identityLevel: {
      requireLogin: boolean
      requireStrongAuth: boolean
    }
  }
  
  // Publisering
  publishing: {
    choice: string
    visibility: {
      publicCatalog: boolean
      selectedTargetGroups: boolean
      selectedOrganizations: boolean
      targetGroups: string[]
      organizations: string[]
    }
  }
  
  // Kategori-spesifikke felt
  lokaler?: {
    venueCapacity: Partial<VenueCapacity>
    roomStructure: Partial<RoomStructure>
    venueAccess: Partial<VenueAccess>
    venueEquipment: Partial<VenueEquipment>
    noiseRules: Partial<NoiseRules>
    seasonPricing: Partial<SeasonPricing>
    facilities: string[]
    universalDesign: Partial<UniversalDesign>
    addOnServices: AddOnService[]
  }
  
  arrangementer?: {
    eventType: 'single' | 'recurring' | 'series'
    eventVenue: Partial<EventVenue>
    organizer: Partial<OrganizerInfo>
    program: Partial<EventProgram>
    eventCapacity: Partial<EventCapacity>
    registration: Partial<EventRegistration>
    cancellation: Partial<EventCancellation>
    documentRequirements: Partial<EventDocumentRequirements>
    eventDates: EventDate[]
  }
  
  sport?: {
    resourceType: SportResourceType
    // Bane-spesifikke
    courtInfo?: Partial<SportCourtInfo>
    seasonBooking?: Partial<SeasonBooking>
    priorityRules?: Partial<CourtPriorityRules>
    maintenance?: Partial<CourtMaintenance>
    // Utstyr-spesifikke
    inventory?: Partial<SportInventory>
    condition?: Partial<EquipmentCondition>
    loan?: Partial<LoanConfig>
    userRequirements?: Partial<UserRequirements>
    // Felles
    facilities: string[]
    universalDesign: Partial<UniversalDesign>
    addOnServices: AddOnService[]
  }
  
  torg?: {
    area: Partial<OutdoorArea>
    outdoorLogistics: Partial<OutdoorLogistics>
    safety: Partial<OutdoorSafety>
    permits: Partial<OutdoorPermits>
    outdoorDeposit: Partial<OutdoorDeposit>
    equipmentAvailable: EquipmentItem[]
    facilities: string[]
  }
}

// ============================================================================
// DEL 12: VALIDERING
// ============================================================================

export interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning'
  category: 'identity' | 'location' | 'audience' | 'time' | 'pricing' | 'workflow' | 'content' | 'category_specific'
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
  completionPercentage: number
}

export interface ChecklistItemStatus {
  id: string
  label: string
  checked: boolean
  required: boolean
  category: string
}

export interface PublishingChecklist {
  required: ChecklistItemStatus[]
  recommended: ChecklistItemStatus[]
  categorySpecific: ChecklistItemStatus[]
}

// ============================================================================
// DEL 13: BOOKING STATE (fra offentlig side)
// ============================================================================

export interface BookingState {
  currentStep: BookingSteg
  selectedSlots: KalenderSlot[]
  selectedAddOnServices: string[]
  selectedQuantity?: number
  selectedDay?: string
  selectedTicketTypes?: Array<{ typeId: string; quantity: number }>
  bookingDetails: {
    name: string
    email: string
    phone: string
    organization?: string
    orgNumber?: string
    message?: string
    acceptedTerms: boolean
  }
  isLoggedIn: boolean
  guestBooking: boolean
  verificationLevel?: 'none' | 'email' | 'phone' | 'bankid'
}

// ============================================================================
// DEL 14: KOMPONENT PROPS
// ============================================================================

export interface UtleieobjektDetaljSideProps {
  utleieobjektId: string
  category: Category
  data?: UtleieobjektDetalj
  onFavorite?: (id: string) => void
  onShare?: (id: string) => void
  onBookingComplete?: (bookingData: BookingState) => void
}

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
  availabilityType?: AvailabilityType
  interval?: string
  quantityUnit?: string
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

// ============================================================================
// DEL 15: LEGACY KOMPATIBILITET
// ============================================================================

// For bakoverkompatibilitet med eksisterende kode
export interface Pricing {
  isFree: boolean
  basePrice?: number
  rentalPrice?: number
  deposit?: number
  ticketPrice?: number
  priceModel: string
  targetGroups?: TargetGroup[]
  timeBasedPricing?: { weekdays?: number; weekend?: number }
  paymentMethods?: string[]
}

// Gammel BaseUtleieobjektDetalj for bakoverkompatibilitet
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
