import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  X, 
  Check, 
  AlertCircle,
  Upload,
  Plus,
  Trash2,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Settings,
  Eye,
  MapPin,
  Map,
  Users,
  CreditCard,
  Download,
  Hash,
  Key,
  Volume2,
  Wrench,
  Package,
  AlertTriangle,
  ClipboardCheck,
  UserCheck,
  Timer,
  Receipt,
  Layers,
  Grid3X3
} from 'lucide-react'
import ImportUtleieobjekt from './components/ImportUtleieobjekt'

type Category = 'lokaler' | 'sport' | 'arrangementer' | 'torg'
type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6

interface UtleieobjektWizardKommuneProps {
  category?: Category | null
  mode?: 'new' | 'copy' | 'import' | null
  copyFromId?: string | null
}

const getInitialStepLabels = (): string[] => {
  return [
    'Velg kategori',
    'Opprettelsesmetode'
  ]
}

const getSubcategories = (category: Category): string[] => {
  if (category === 'lokaler') {
    return ['Selskapslokale', 'Møterom', 'Gymsal', 'Kulturarena', 'Konferanserom']
  }
  if (category === 'sport') {
    return ['Padel', 'Squash', 'Tennis', 'Cageball', 'Badminton']
  }
  if (category === 'arrangementer') {
    return ['Kurs', 'Foredrag', 'Konsert', 'Workshop', 'Seminar']
  }
  if (category === 'torg') {
    return ['Telt', 'Lydanlegg', 'Projektor', 'Bord og stoler', 'Grill', 'Partytelt']
  }
  return []
}

const getTypeStepLabels = (category: Category): string[] => {
  if (category === 'lokaler') {
    return [
      'Lokasjon',
      'Tilgjengelighet',
      'Regler',
      'Pris og betaling',
      'Publisering'
    ]
  }
  if (category === 'sport') {
    return [
      'Lokasjon',
      'Tilgjengelighet',
      'Regler',
      'Pris/Depositum',
      'Publisering'
    ]
  }
  if (category === 'arrangementer') {
    return [
      'Tidspunkter',
      'Kapasitet',
      'Pris',
      'Vilkår',
      'Publisering'
    ]
  }
  if (category === 'torg') {
    return [
      'Hentested/Logistikk',
      'Antall/Lager',
      'Tilgjengelighet',
      'Regler',
      'Pris/Depositum',
      'Publisering'
    ]
  }
  return []
}

interface CopyObject {
  id: string
  name: string
  location: string
  status: string
  category: Category
}

export default function UtleieobjektWizardKommune({ 
  category: categoryProp, 
  mode: modeProp,
  copyFromId 
}: UtleieobjektWizardKommuneProps = {}) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(categoryProp || null)
  const [currentStep, setCurrentStep] = useState<Step>(0)
  const [status, setStatus] = useState<'draft' | 'ready' | 'published'>('draft')
  const [startChoice, setStartChoice] = useState<'new' | 'copy' | 'import' | null>(modeProp || null)
  const [copySearchQuery, setCopySearchQuery] = useState('')
  const [selectedCopyObject, setSelectedCopyObject] = useState<string | null>(copyFromId || null)
  const [copySettings, setCopySettings] = useState<string[]>([])

  // Sample data for kopiering - i produksjon ville dette komme fra API
  const copyObjects: CopyObject[] = [
    { id: '1', name: 'Idrettshall A', location: 'Skien', status: 'Publisert', category: 'lokaler' },
    { id: '2', name: 'Møterom 1', location: 'Skien', status: 'Publisert', category: 'lokaler' },
    { id: '3', name: 'Tennisbane 1', location: 'Skien', status: 'Utkast', category: 'sport' },
    { id: '4', name: 'Sommerfest 2024', location: 'Skien sentrum', status: 'Publisert', category: 'arrangementer' },
    { id: '5', name: 'Festtelt', location: 'Skien', status: 'Publisert', category: 'torg' },
  ]

  // Filter kopier-objekter basert på søk og kategori
  const filteredCopyObjects = copyObjects.filter(obj => {
    const matchesCategory = !selectedCategory || obj.category === selectedCategory
    const matchesSearch = !copySearchQuery || 
      obj.name.toLowerCase().includes(copySearchQuery.toLowerCase()) ||
      obj.location.toLowerCase().includes(copySearchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })
  
  const [formData, setFormData] = useState({
    // Identitet og struktur
    identity: {
      objectId: '',
      slug: '',
      internalCode: '',
      ownerUnit: '',
      ownerUnitId: '',
      displayName: '',
      internalName: '',
      externalId: ''
    },
    
    // Kategori (for bakoverkompatibilitet)
    subcategory: {
      selected: null as string | null,
      custom: '' as string
    },
    
    // Lokasjon og tilgang (utvidet)
    location: {
      address: {
        street: '',
        postalCode: '',
        postalArea: '',
        building: '',
        roomNumber: '',
        floor: ''
      },
      map: { lat: null as number | null, lng: null as number | null },
      building: '',
      roomNumber: '',
      floor: '',
      meetingPoint: '',
      directionsText: '',
      accessType: null as 'code' | 'reception' | 'janitor' | 'digital' | 'physical_key' | null,
      accessCode: '',
      accessInstructions: '',
      keyPickupLocation: '',
      keyPickupHours: '',
      keyReturnDeadline: '',
      parkingInfo: '',
      parkingSpots: null as number | null,
      loadingZone: false,
      loadingZoneHours: ''
    },
    
    // Bakoverkompatibilitet med gammel struktur
    locationAndBasis: {
      name: '',
      address: '',
      postalCode: '',
      postalArea: '',
      map: { lat: null as number | null, lng: null as number | null, markerDraggable: true },
      shortDescription: '',
      longDescription: '',
      contacts: [] as Array<{ name: string; role: string; email: string; phone: string; isPrimary?: boolean; isEmergency?: boolean }>,
      images: [] as string[],
      documents: { houseRules: null as File | null, fireInstructions: null as File | null, floorPlan: null as File | null }
    },
    
    // Målgruppe og synlighet
    audience: {
      visibility: [] as ('public' | 'organization' | 'internal' | 'admin_only')[],
      bookableBy: [] as string[],
      priorityRules: [] as Array<{ group: string; priority: number; description: string }>,
      restrictions: {
        requireOrgNumber: false,
        requireResponsibleAdult: false,
        minAge: null as number | null,
        maxAge: null as number | null,
        allowedOrganizationTypes: [] as string[],
        blockedOrganizations: [] as string[],
        membershipRequired: false,
        verificationLevel: 'none' as 'none' | 'basic' | 'strong'
      }
    },
    
    // Tidslogikk (utvidet)
    timeLogic: {
      defaultBookingLength: 60,
      minDuration: 30,
      maxDuration: 480,
      bufferBefore: 0,
      bufferAfter: 0,
      minLeadTime: 24,
      maxLeadTime: 90,
      maxBookingsPerUser: {
        perDay: null as number | null,
        perWeek: null as number | null,
        perMonth: null as number | null,
        activeBookings: null as number | null
      },
      blackoutPeriods: [] as Array<{ id: string; name: string; startDate: string; endDate: string; reason: string; recurring: boolean }>,
      cancellationRules: {
        cutoffHours: 24,
        allowPartialCancellation: false,
        lateCancellationFee: 0,
        lateCancellationThreshold: 2,
        refundPolicy: 'full' as 'full' | 'partial' | 'none',
        refundPercentage: 100
      },
      noShowRules: {
        fee: 0,
        warningCount: 3,
        consequenceAction: 'none' as 'none' | 'warning' | 'block' | 'fee',
        blockDurationDays: 30
      }
    },
    
    // Pris og økonomi (utvidet)
    pricing: {
      isFree: true,
      basePrice: 0,
      priceModel: '',
      currency: 'NOK',
      vatRate: 25,
      vatIncluded: true,
      exemptFromVat: false,
      vat: '',
      feeCode: '',
      targetGroups: [] as Array<{ id: string; group: string; price: number; free: boolean; discountPercent?: number; requiresVerification?: boolean }>,
      pricePlans: [] as Array<{ id: string; name: string; conditions: { dayOfWeek?: string[]; timeFrom?: string; timeTo?: string; seasonStart?: string; seasonEnd?: string }; price: number; active: boolean }>,
      discounts: [] as Array<{ id: string; name: string; type: 'percentage' | 'fixed'; value: number; conditions: string; validFrom?: string; validTo?: string; code?: string }>,
      deposit: {
        required: false,
        amount: 0,
        triggers: [] as string[],
        refundConditions: '',
        refundTimeline: 14,
        deductionRules: ''
      },
      fees: [] as Array<{ id: string; name: string; amount: number; type: 'fixed' | 'percentage'; mandatory: boolean; conditions: string }>,
      paymentMethods: [] as Array<{ id: string; type: 'card' | 'vipps' | 'invoice' | 'cash'; enabled: boolean; accountId?: string }>,
      invoiceSettings: {
        allowInvoice: false,
        allowedForGroups: [] as string[],
        paymentTermsDays: 14,
        minimumAmount: 500,
        requireOrgNumber: true,
        ehfEnabled: false
      },
      timeBasedPricing: { weekdays: '', weekend: '' },
      externalPriceList: { active: false, attachment: null as File | null, link: '', explanation: '' }
    },
    
    // Arbeidsflyt og godkjenning
    workflow: {
      approvalMode: '' as '' | 'automatic' | 'manual' | 'conditional',
      approvalSteps: [] as Array<{ id: string; name: string; role: string; required: boolean; order: number }>,
      autoApprovalConditions: [] as Array<{ id: string; condition: string; description: string }>,
      prePublishChecklist: [] as Array<{ id: string; item: string; completed: boolean; required: boolean }>,
      documentRequirements: [] as Array<{ id: string; name: string; type: string; required: boolean; templateUrl?: string; description: string }>,
      termsAcceptance: {
        required: false,
        documentUrl: '',
        documentId: '',
        version: '1.0',
        signatureRequired: false,
        digitalSignature: false
      }
    },
    
    // Innhold og kvalitet
    content: {
      shortDescription: '',
      longDescription: '',
      gallery: [] as Array<{ id: string; url: string; thumbnailUrl?: string; caption?: string; isPrimary: boolean; order: number }>,
      attachments: [] as Array<{ id: string; name: string; type: string; url: string; uploadedAt: string; category: string }>,
      languages: ['no'] as string[],
      translations: {} as Record<string, { shortDescription: string; longDescription: string }>,
      faq: [] as Array<{ question: string; answer: string; category?: string }>,
      guidelines: '',
      accessibilityInfo: {
        summary: '',
        universalDesign: {
          stepFreeAccess: false,
          wcAccessible: false,
          elevator: false,
          hearingLoop: false,
          accessibleParking: false,
          guideDogAllowed: true,
          signLanguageSupport: false,
          brailleSignage: false,
          otherAccommodation: ''
        },
        wheelchairAccessible: false,
        hearingAidsCompatible: false,
        visualAidsAvailable: false,
        assistanceAvailable: false,
        assistanceBookingRequired: false,
        additionalInfo: ''
      },
      keywords: [] as string[],
      seoDescription: ''
    },
    
    // Kontakter
    contacts: [] as Array<{ name: string; role: string; email: string; phone: string; isPrimary?: boolean; isEmergency?: boolean }>,
    
    // Bakoverkompatibilitet - properties
    properties: {
      types: [] as string[],
      size: '',
      maxPersons: '',
      facilities: [] as string[],
      universalDesign: {
        stepFreeAccess: false,
        wcAccessible: false,
        elevator: false,
        hearingLoop: false,
        accessibleParking: false,
        otherAccommodation: ''
      },
      addOnServices: [] as Array<{ name: string; description: string; price: string; required: boolean; needsApproval: boolean }>
    },
    
    // Tilgjengelighet
    availability: {
      availabilityType: null as 'timeInterval' | 'day' | 'quantity' | null,
      rentalUnit: '',
      interval: '',
      timeInterval: {
        interval: '',
        openingHours: [] as Array<{ day: string; active: boolean; from: string; to: string }>
      },
      day: {
        type: 'full' as 'full' | 'custom',
        fromTime: '',
        toTime: '',
        openingHours: [] as Array<{ day: string; active: boolean; from: string; to: string }>
      },
      quantity: {
        amount: '',
        unit: ''
      },
      openingHours: [] as Array<{ day: string; active: boolean; from: string; to: string }>,
      exceptions: [] as Array<{ fromDate: string; toDate: string; fromTime: string; toTime: string; reason: string; visible: boolean; repeating: boolean }>,
      presentationOnly: false
    },
    
    // Regler
    rules: {
      approvalMode: '',
      approvalRules: {
        targetGroupRules: [] as Array<{ group: string; mode: string }>,
        timeRules: [] as Array<{ condition: string; mode: string }>,
        riskRules: [] as Array<{ condition: string; threshold: string; mode: string }>
      },
      restrictions: {
        leadTime: '',
        maxDuration: '',
        maxBookingsPerWeek: '',
        cancellationDeadline: ''
      },
      umbrellaDisposal: {
        allowed: false,
        organizations: [] as string[],
        quotaPerWeek: '',
        canDistributeToSubclubs: false,
        canLockTimes: false
      }
    },
    
    // Betaling
    payment: {
      methods: [] as string[],
      accountSetup: {
        cardAccount: '',
        vippsAccount: '',
        invoiceRecipient: ''
      },
      terms: {
        pdf: null as File | null,
        requireAcceptance: false,
        visibleOnReceipt: false
      },
      identityLevel: {
        requireLogin: false,
        requireStrongAuth: false
      }
    },
    
    // Publisering
    publishing: {
      choice: 'draft',
      visibility: {
        publicCatalog: false,
        selectedTargetGroups: false,
        selectedOrganizations: false,
        targetGroups: [] as string[],
        organizations: [] as string[]
      }
    },
    
    // ===== KATEGORI-SPESIFIKKE FELT =====
    
    // Lokaler
    lokaler: {
      venueCapacity: {
        maxPersons: 0,
        seatedCapacity: 0,
        standingCapacity: 0,
        fireCapacity: 0,
        tableLayouts: [] as Array<{ id: string; name: string; capacity: number; description: string }>
      },
      roomStructure: {
        isDivisible: false,
        subRooms: [] as Array<{ id: string; name: string; capacity: number; bookableSeparately: boolean }>,
        canBookSimultaneously: false,
        sharedFacilities: [] as string[],
        adjacentRooms: [] as string[],
        parentRoomId: ''
      },
      venueAccess: {
        keyType: null as 'physical' | 'code' | 'card' | 'app' | null,
        keyPickupLocation: '',
        keyPickupHours: '',
        keyReturnDeadline: '',
        keyDeposit: 0,
        setupTimeMinutes: 0,
        teardownTimeMinutes: 0,
        cleaningIncluded: false,
        cleaningFee: 0,
        cleaningInstructions: '',
        selfServiceCleaning: false
      },
      venueEquipment: {
        includedEquipment: [] as Array<{ id: string; name: string; quantity: number; description: string }>,
        availableForRent: [] as Array<{ id: string; name: string; quantity: number; pricePerUnit: number; description: string }>,
        externalEquipmentAllowed: true,
        techSupportAvailable: false,
        techSupportFee: 0,
        techSupportHours: ''
      },
      noiseRules: {
        maxDecibelLevel: null as number | null,
        quietHoursFrom: '23:00',
        quietHoursTo: '07:00',
        musicAllowed: true,
        amplifiedSoundAllowed: true,
        livePerformanceAllowed: false,
        neighborNotificationRequired: false,
        noiseComplaintProcess: ''
      },
      seasonPricing: {
        enabled: false,
        seasons: [] as Array<{ id: string; name: string; startDate: string; endDate: string; priceMultiplier: number }>,
        peakTimes: [] as Array<{ id: string; dayOfWeek: string; timeFrom: string; timeTo: string; priceMultiplier: number }>,
        holidayPricing: [] as Array<{ id: string; date: string; name: string; priceMultiplier: number }>
      },
      facilities: [] as string[],
      addOnServices: [] as Array<{ id: string; name: string; description: string; price: number; required: boolean; needsApproval: boolean }>
    },
    
    // Arrangementer
    arrangementer: {
      eventType: 'single' as 'single' | 'recurring' | 'series',
      eventVenue: {
        type: 'custom_address' as 'linked_venue' | 'linked_outdoor' | 'custom_address',
        linkedVenueId: '',
        linkedOutdoorId: '',
        customAddress: null as { street: string; postalCode: string; postalArea: string } | null,
        venueRequirements: '',
        setupRequirements: ''
      },
      organizer: {
        organizationType: 'person' as 'person' | 'organization' | 'municipality',
        name: '',
        orgNumber: '',
        responsiblePerson: {
          name: '',
          role: '',
          phone: '',
          email: '',
          idVerified: false
        },
        emergencyContact: {
          name: '',
          role: 'Nødkontakt',
          phone: '',
          email: '',
          isPrimary: false,
          isEmergency: true
        },
        previousEvents: 0,
        verificationStatus: 'unverified' as 'unverified' | 'verified' | 'trusted'
      },
      program: {
        checkInTime: '',
        doorsOpenTime: '',
        startTime: '',
        endTime: '',
        breaks: [] as Array<{ id: string; name: string; startTime: string; duration: number }>,
        programItems: [] as Array<{ id: string; title: string; startTime: string; duration: number; presenter?: string; description?: string }>
      },
      eventCapacity: {
        totalCapacity: 0,
        ticketTypes: [] as Array<{ id: string; name: string; price: number; quantity: number; availableQuantity: number; maxPerOrder: number; restrictions?: string }>,
        sections: [] as Array<{ id: string; name: string; capacity: number; price: number }>,
        waitlistCapacity: 0
      },
      registration: {
        type: 'tickets' as 'tickets' | 'registration' | 'open',
        deadline: { date: '', time: '' },
        earlyBirdDeadline: null as { date: string; time: string } | null,
        earlyBirdDiscount: 0,
        waitlistEnabled: false,
        waitlistCapacity: 0,
        autoPromoteFromWaitlist: false,
        confirmationRequired: false,
        confirmationDeadlineHours: 48,
        allowGroupRegistration: false,
        maxGroupSize: 10,
        requiresApproval: false,
        approvalCriteria: ''
      },
      cancellation: {
        cancellationDeadlineHours: 24,
        refundPolicy: 'full' as 'full' | 'partial' | 'none',
        partialRefundPercentage: 50,
        refundDeadlineDays: 14,
        weatherCancellation: false,
        weatherPolicy: '',
        minParticipantsRequired: null as number | null,
        minParticipantsDeadlineHours: 48,
        cancellationNotificationMethods: ['email'] as string[],
        alternativeDatePolicy: ''
      },
      documentRequirements: {
        alcoholPermit: { required: false, status: 'not_required' as 'not_required' | 'pending' | 'approved' | 'rejected', applicationDeadlineDays: 30, documentId: '', expiryDate: '', notes: '' },
        fireWatch: { required: false, minPersons: 0, status: 'not_required' as 'not_required' | 'pending' | 'approved', certificateRequired: false },
        policePermit: { required: false, status: 'not_required' as 'not_required' | 'pending' | 'approved' | 'rejected', applicationDeadlineDays: 14, documentId: '', expiryDate: '', notes: '' },
        eventPermit: { required: false, status: 'not_required' as 'not_required' | 'pending' | 'approved' | 'rejected', applicationDeadlineDays: 14, documentId: '', expiryDate: '', notes: '' },
        noisePermit: { required: false, status: 'not_required' as 'not_required' | 'pending' | 'approved' | 'rejected', applicationDeadlineDays: 7, documentId: '', expiryDate: '', notes: '' },
        roadClosure: { required: false, status: 'not_required' as 'not_required' | 'pending' | 'approved' | 'rejected', applicationDeadlineDays: 21, documentId: '', expiryDate: '', notes: '' },
        healthPermit: { required: false, status: 'not_required' as 'not_required' | 'pending' | 'approved' | 'rejected', applicationDeadlineDays: 14, documentId: '', expiryDate: '', notes: '' },
        insuranceRequired: false,
        insuranceMinCoverage: 0
      },
      eventDates: [] as Array<{ date: string; time: string; endTime: string; availableTickets: number }>
    },
    
    // Sport
    sport: {
      resourceType: 'court' as 'court' | 'equipment',
      courtInfo: {
        surface: '',
        dimensions: { length: 0, width: 0 },
        indoor: true,
        lighting: true,
        lightingHours: '',
        heatingAvailable: false,
        heatingIncluded: false,
        heatingFee: 0,
        markings: [] as string[]
      },
      seasonBooking: {
        enabled: false,
        seasonStart: '',
        seasonEnd: '',
        frameTimeSlots: [] as Array<{ id: string; dayOfWeek: string; timeFrom: string; timeTo: string; allocatedTo: string; type: string }>,
        applicationDeadline: '',
        allocationMethod: 'first_come' as 'first_come' | 'lottery' | 'priority'
      },
      priorityRules: {
        levels: ['training', 'match', 'tournament', 'event'] as string[],
        trainingPriority: [] as string[],
        matchPriority: [] as string[],
        tournamentRequiresApproval: true,
        eventRequiresApproval: true,
        localClubPriority: false,
        localClubIds: [] as string[]
      },
      maintenance: {
        status: 'available' as 'available' | 'limited' | 'maintenance' | 'closed',
        nextMaintenance: '',
        maintenanceSchedule: [] as Array<{ id: string; date: string; type: string; description: string }>,
        lastInspection: '',
        inspectionFrequency: 30
      },
      inventory: {
        totalUnits: 0,
        availableUnits: 0,
        unitDescription: '',
        setContents: [] as string[],
        serialNumbers: [] as string[],
        purchaseDate: '',
        expectedLifespan: 24
      },
      condition: {
        status: 'good' as 'new' | 'good' | 'fair' | 'poor',
        lastInspection: '',
        nextInspection: '',
        maintenanceLog: [] as Array<{ id: string; date: string; type: string; description: string; cost: number }>,
        damageHistory: [] as Array<{ id: string; date: string; description: string; repaired: boolean; cost: number }>
      },
      loan: {
        maxLoanDurationDays: 7,
        pickupRequired: true,
        deliveryAvailable: false,
        deliveryFee: 0,
        pickupLocation: '',
        pickupHours: '08:00-16:00',
        returnDeadlineTime: '16:00',
        lateReturnFeePerDay: 100,
        graceHours: 2
      },
      userRequirements: {
        minAge: null as number | null,
        maxAge: null as number | null,
        certificationRequired: false,
        certificationType: '',
        certificationVerification: 'none' as 'none' | 'upload' | 'manual',
        responsibleAdultRequired: false,
        trainingRequired: false,
        trainingUrl: '',
        physicalRequirements: ''
      },
      facilities: [] as string[],
      addOnServices: [] as Array<{ id: string; name: string; description: string; price: number; required: boolean; needsApproval: boolean }>
    },
    
    // Torg
    torg: {
      area: {
        totalArea: 0,
        usableArea: 0,
        zones: [] as Array<{ id: string; name: string; area: number; type: string; capacity: number; pricePerDay: number; facilities: string[] }>,
        infrastructure: {
          powerOutlets: [] as Array<{ id: string; location: string; amperage: number; phases: number; available: boolean }>,
          waterConnections: [] as Array<{ id: string; location: string; type: string; available: boolean }>,
          drainagePoints: 0,
          toiletFacilities: false,
          toiletCount: 0,
          wasteDisposal: false,
          lightingAvailable: false,
          fencingAvailable: false
        },
        mapOverlay: null as string | null
      },
      outdoorLogistics: {
        setupTime: {
          defaultHours: 4,
          maxHours: 24,
          requiresApproval: false,
          approvalThresholdHours: 8
        },
        teardownTime: {
          defaultHours: 4,
          maxHours: 24,
          lateTeardownFeePerHour: 500
        },
        deliveryWindows: [] as Array<{ id: string; dayOfWeek: string; timeFrom: string; timeTo: string }>,
        vehicleAccess: {
          allowed: true,
          maxVehicleWeight: 3.5,
          maxVehicleHeight: 3.0,
          loadingZone: false,
          loadingZoneHours: '',
          accessRoute: ''
        },
        storageAvailable: false,
        storageArea: 0,
        storageFeePerDay: 0
      },
      safety: {
        noiseRestrictions: {
          maxDecibels: 85,
          measurementDistance: 10,
          restrictedHoursFrom: '23:00',
          restrictedHoursTo: '07:00',
          musicCurfew: '23:00',
          exemptionPossible: true
        },
        crowdManagement: {
          maxCapacity: 0,
          securityRequired: false,
          securityThreshold: 500,
          securityRatioPerPerson: 100,
          firstAidRequired: false,
          firstAidThreshold: 200,
          medicalStaffRequired: false,
          medicalStaffThreshold: 1000,
          evacuationPlanRequired: false,
          evacuationPlanThreshold: 500
        },
        fireRequirements: {
          fireExtinguishersRequired: false,
          fireExtinguisherCount: 0,
          fireWatchRequired: false,
          fireWatchThreshold: 200,
          fireWatchCertificationRequired: true,
          evacuationPlanRequired: false,
          emergencyExits: 0
        },
        barriers: {
          required: false,
          threshold: 500,
          provided: false,
          rentalFee: 0
        }
      },
      permits: {
        triggers: [
          { id: 'capacity-police', condition: 'capacity', threshold: 500, operator: 'gt', requiredPermit: 'policePermit', leadTimeDays: 14, description: 'Politigodkjenning kreves for arrangementer med over 500 deltakere' },
          { id: 'alcohol', condition: 'alcohol', threshold: true, requiredPermit: 'alcoholPermit', leadTimeDays: 30, description: 'Skjenkebevilling kreves for servering av alkohol' },
          { id: 'noise', condition: 'amplified_sound', threshold: 85, operator: 'gt', requiredPermit: 'noiseExemption', leadTimeDays: 7, description: 'Støydispensasjon kreves for forsterket lyd over 85 dB' },
          { id: 'road', condition: 'road_use', threshold: true, requiredPermit: 'roadClosure', leadTimeDays: 21, description: 'Veisperring-tillatelse kreves ved bruk av offentlig vei' },
          { id: 'food', condition: 'food', threshold: true, requiredPermit: 'healthPermit', leadTimeDays: 14, description: 'Mattilsyn-godkjenning kreves ved matservering' }
        ] as Array<{ id: string; condition: string; threshold: number | boolean; operator?: string; requiredPermit: string; leadTimeDays: number; description: string }>,
        required: {
          policePermit: { required: false, status: 'not_required' as 'not_required' | 'pending' | 'approved' | 'rejected' | 'expired', applicationDeadlineDays: 14, processingTimeDays: 7, fee: 0, documentId: '', expiryDate: '', contactInfo: '', applicationUrl: '', notes: '' },
          alcoholPermit: { required: false, status: 'not_required' as 'not_required' | 'pending' | 'approved' | 'rejected' | 'expired', applicationDeadlineDays: 30, processingTimeDays: 14, fee: 0, documentId: '', expiryDate: '', contactInfo: '', applicationUrl: '', notes: '' },
          roadClosure: { required: false, status: 'not_required' as 'not_required' | 'pending' | 'approved' | 'rejected' | 'expired', applicationDeadlineDays: 21, processingTimeDays: 10, fee: 0, documentId: '', expiryDate: '', contactInfo: '', applicationUrl: '', notes: '' },
          noiseExemption: { required: false, status: 'not_required' as 'not_required' | 'pending' | 'approved' | 'rejected' | 'expired', applicationDeadlineDays: 7, processingTimeDays: 3, fee: 0, documentId: '', expiryDate: '', contactInfo: '', applicationUrl: '', notes: '' },
          firePermit: { required: false, status: 'not_required' as 'not_required' | 'pending' | 'approved' | 'rejected' | 'expired', applicationDeadlineDays: 14, processingTimeDays: 7, fee: 0, documentId: '', expiryDate: '', contactInfo: '', applicationUrl: '', notes: '' },
          healthPermit: { required: false, status: 'not_required' as 'not_required' | 'pending' | 'approved' | 'rejected' | 'expired', applicationDeadlineDays: 14, processingTimeDays: 7, fee: 0, documentId: '', expiryDate: '', contactInfo: '', applicationUrl: '', notes: '' },
          publicGatheringPermit: { required: false, status: 'not_required' as 'not_required' | 'pending' | 'approved' | 'rejected' | 'expired', applicationDeadlineDays: 14, processingTimeDays: 7, fee: 0, documentId: '', expiryDate: '', contactInfo: '', applicationUrl: '', notes: '' }
        },
        integrations: {
          autoNotifyPolice: false,
          autoNotifyFireDept: false,
          autoNotifyHealthDept: false,
          autoCreateCase: false,
          caseSystemIntegration: ''
        }
      },
      outdoorDeposit: {
        baseAmount: 5000,
        additionalPerZone: 1000,
        additionalForInfrastructure: true,
        infrastructureDepositPerUnit: 500,
        maxDeposit: 50000,
        inspectionProcess: {
          preInspectionRequired: true,
          postInspectionRequired: true,
          inspectorRole: 'Driftsansvarlig',
          inspectionChecklistId: '',
          damageReportingDeadlineHours: 48,
          photoDocumentationRequired: true
        },
        damageHandling: {
          deductionProcess: 'Skader dokumenteres med foto og trekkes fra depositum etter inspeksjon',
          disputeProcess: 'Tvist kan klages inn til kommunens klagenemnd innen 14 dager',
          disputeDeadlineDays: 14,
          insuranceRequirements: 'Ansvarsforsikring anbefales for arrangementer over 200 deltakere',
          insuranceMinCoverage: 1000000
        }
      },
      equipmentAvailable: [] as Array<{ id: string; name: string; quantity: number; pricePerDay: number; included: boolean }>,
      facilities: [] as string[]
    }
  })

  const validationErrors: string[] = []
  
  // Validation logic - kategori-spesifikk
  if (!selectedCategory && currentStep === 0) {
    // Ingen validering når kategori skal velges
  }

  if (selectedCategory && ((currentStep === 0 && selectedCategory) || (currentStep === 1 && !startChoice))) {
    if (!startChoice) validationErrors.push('Velg opprettelsesmetode')
  }

  // Lokaler validering
  if (selectedCategory === 'lokaler' && currentStep === 1 && startChoice === 'new') {
    if (!formData.subcategory.selected) {
      validationErrors.push('Underkategori må være valgt')
    }
    if (!formData.locationAndBasis.name) validationErrors.push('Navn på utleieobjekt må være fylt')
    if (!formData.locationAndBasis.address) validationErrors.push('Adresse må være fylt')
    if (!formData.locationAndBasis.postalCode) validationErrors.push('Postnummer må være fylt')
    if (!formData.locationAndBasis.postalArea) validationErrors.push('Poststed må være fylt')
  }

  if (selectedCategory === 'lokaler' && currentStep === 2) {
    if (!formData.locationAndBasis.name) validationErrors.push('Navn på utleieobjekt må være fylt')
    if (!formData.locationAndBasis.address) validationErrors.push('Adresse må være fylt')
    if (!formData.locationAndBasis.postalCode) validationErrors.push('Postnummer må være fylt')
    if (!formData.locationAndBasis.postalArea) validationErrors.push('Poststed må være fylt')
  }

  if (selectedCategory === 'lokaler' && currentStep === 2) {
    if (!formData.availability.availabilityType) validationErrors.push('Tilgjengelighetstype må være valgt')
    if (formData.availability.availabilityType === 'timeInterval') {
      if (!formData.availability.timeInterval.interval) validationErrors.push('Intervall må være valgt')
      if (formData.availability.timeInterval.openingHours.filter(h => h.active).length === 0 && !formData.availability.presentationOnly) {
        validationErrors.push('Minst én aktiv ukedag med gyldige tider, eller velg "kun presentasjon"')
      }
    }
    if (formData.availability.availabilityType === 'day') {
      if (formData.availability.day.type === 'custom' && (!formData.availability.day.fromTime || !formData.availability.day.toTime)) {
        validationErrors.push('Fra-til tid må være satt for dagsintervall')
      }
      if (formData.availability.day.openingHours.filter(h => h.active).length === 0 && !formData.availability.presentationOnly) {
        validationErrors.push('Minst én aktiv ukedag med gyldige tider, eller velg "kun presentasjon"')
      }
    }
  }

  if (selectedCategory === 'lokaler' && currentStep === 3) {
    if (!formData.rules.approvalMode) validationErrors.push('En godkjenningsmodus må være valgt')
    if (formData.rules.umbrellaDisposal.allowed && formData.rules.umbrellaDisposal.organizations.length === 0) {
      validationErrors.push('Hvis paraply = ja: minst én org + kvote må settes')
    }
  }

  if (selectedCategory === 'lokaler' && currentStep === 4) {
    if (!formData.pricing.isFree) {
      if (!formData.pricing.priceModel) validationErrors.push('Prismodell må være valgt')
      if (formData.pricing.targetGroups.length === 0) validationErrors.push('Minst én pris må være definert')
      if (formData.payment.methods.length === 0) validationErrors.push('Minst én betalingsmetode må være valgt')
    }
    if (formData.payment.terms.requireAcceptance && !formData.payment.terms.pdf) {
      validationErrors.push('PDF må være lastet opp hvis aksept kreves')
    }
  }

  // Sport validering
  if (selectedCategory === 'sport' && currentStep === 1 && startChoice === 'new') {
    if (!formData.subcategory.selected) {
      validationErrors.push('Underkategori må være valgt')
    }
    if (!formData.locationAndBasis.name) validationErrors.push('Navn på utleieobjekt må være fylt')
    if (!formData.locationAndBasis.address) validationErrors.push('Adresse må være fylt')
    if (!formData.locationAndBasis.postalCode) validationErrors.push('Postnummer må være fylt')
    if (!formData.locationAndBasis.postalArea) validationErrors.push('Poststed må være fylt')
  }

  if (selectedCategory === 'sport' && currentStep === 2) {
    if (!formData.availability.availabilityType || formData.availability.availabilityType !== 'timeInterval') {
      validationErrors.push('Sport må bruke Tidsintervall')
    }
    if (formData.availability.availabilityType === 'timeInterval') {
      if (!formData.availability.timeInterval.interval) validationErrors.push('Intervall må være valgt')
      if (formData.availability.timeInterval.openingHours.filter(h => h.active).length === 0 && !formData.availability.presentationOnly) {
        validationErrors.push('Minst én aktiv ukedag med gyldige tider, eller velg "kun presentasjon"')
      }
    }
  }

  if (selectedCategory === 'sport' && currentStep === 3) {
    if (!formData.rules.approvalMode) validationErrors.push('En godkjenningsmodus må være valgt')
  }

  if (selectedCategory === 'sport' && currentStep === 4) {
    if (!formData.pricing.isFree) {
      if (!formData.pricing.priceModel) validationErrors.push('Utleiepris må være fylt')
      if (formData.payment.methods.length === 0) validationErrors.push('Minst én betalingsmetode må være valgt')
    }
  }

  // Arrangementer validering
  if (selectedCategory === 'arrangementer' && currentStep === 1 && startChoice === 'new') {
    if (!formData.subcategory.selected) {
      validationErrors.push('Underkategori må være valgt')
    }
    if (!formData.locationAndBasis.name) validationErrors.push('Navn på arrangement må være fylt')
  }

  if (selectedCategory === 'arrangementer' && currentStep === 2) {
    if (!formData.availability.availabilityType || formData.availability.availabilityType !== 'quantity') {
      validationErrors.push('Arrangementer må bruke Antall tilgjengelighet')
    }
    if (formData.availability.availabilityType === 'quantity') {
      if (!formData.availability.quantity.amount) validationErrors.push('Antall må være fylt')
      if (!formData.availability.quantity.unit) validationErrors.push('Enhet må være valgt')
    }
  }

  if (selectedCategory === 'arrangementer' && currentStep === 3) {
    if (!formData.pricing.isFree) {
      // Validering for pris hvis betalt
    }
  }

  // Torg validering
  if (selectedCategory === 'torg' && currentStep === 1 && startChoice === 'new') {
    if (!formData.subcategory.selected) {
      validationErrors.push('Underkategori må være valgt')
    }
    if (!formData.locationAndBasis.name) validationErrors.push('Navn på utstyr må være fylt')
    if (!formData.locationAndBasis.address) validationErrors.push('Hentested må være fylt')
    if (!formData.locationAndBasis.postalCode) validationErrors.push('Postnummer må være fylt')
    if (!formData.locationAndBasis.postalArea) validationErrors.push('Poststed må være fylt')
  }

  if (selectedCategory === 'torg' && currentStep === 2) {
    if (!formData.properties.size) validationErrors.push('Antall enheter må være fylt')
  }

  if (selectedCategory === 'torg' && currentStep === 3) {
    if (!formData.availability.availabilityType) validationErrors.push('Tilgjengelighetstype må være valgt')
    if (formData.availability.availabilityType === 'day') {
      if (formData.availability.day.type === 'custom' && (!formData.availability.day.fromTime || !formData.availability.day.toTime)) {
        validationErrors.push('Fra-til tid må være satt for dagsintervall')
      }
      if (formData.availability.day.openingHours.filter(h => h.active).length === 0 && !formData.availability.presentationOnly) {
        validationErrors.push('Minst én aktiv ukedag med gyldige tider, eller velg "kun presentasjon"')
      }
    }
    if (formData.availability.availabilityType === 'quantity') {
      if (!formData.availability.quantity.amount) validationErrors.push('Antall må være fylt')
      if (!formData.availability.quantity.unit) validationErrors.push('Enhet må være valgt')
    }
  }

  if (selectedCategory === 'torg' && currentStep === 4) {
    if (!formData.rules.approvalMode) validationErrors.push('En godkjenningsmodus må være valgt')
  }

  if (selectedCategory === 'torg' && currentStep === 5) {
    if (!formData.pricing.isFree) {
      if (!formData.pricing.priceModel) validationErrors.push('Utleiepris må være fylt')
      if (formData.payment.methods.length === 0) validationErrors.push('Minst én betalingsmetode må være valgt')
    }
  }

  const canProceed = validationErrors.length === 0

  const getMaxStep = (): number => {
    if (!selectedCategory) return 1
    if (selectedCategory === 'lokaler') return 5
    if (selectedCategory === 'sport') return 5
    if (selectedCategory === 'arrangementer') return 5
    if (selectedCategory === 'torg') return 6
    return 1
  }

  const handleNext = () => {
    // Hvis vi er på opprettelsesmetode-steg og har valgt kopier eller import, gå til første type-spesifikke steg
    if (((currentStep === 0 && selectedCategory) || (currentStep === 1 && selectedCategory && (!startChoice || startChoice === 'copy' || startChoice === 'import'))) && startChoice && startChoice !== 'import') {
      const firstTypeStep = 1 // First type-specific step (includes subcategory)
      setCurrentStep(firstTypeStep as Step)
      return
    }
    
    const maxStep = getMaxStep()
    if (currentStep < maxStep && canProceed) {
      setCurrentStep((prev) => (prev + 1) as Step)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      // Hvis vi er på første type-spesifikke steg og har startChoice, gå tilbake til opprettelsesmetode
      if (selectedCategory && startChoice) {
        const firstTypeStep = 1 // First type-specific step for all categories
        if (currentStep === firstTypeStep) {
          setStartChoice(null)
          // Gå til opprettelsesmetode-steg (0 hvis kategori er gitt som prop, ellers 1)
          setCurrentStep(categoryProp ? 0 : 1)
          return
        }
      }
      
      // Hvis vi er på opprettelsesmetode-steg og har kategori, gå tilbake til kategori-valg
      if (selectedCategory && ((currentStep === 0 && selectedCategory) || (currentStep === 1 && (!startChoice || startChoice === 'copy' || startChoice === 'import')))) {
        if (startChoice === 'copy') {
          // Hvis vi er i kopier-modus, bare nullstill kopier-valg
          setStartChoice(null)
          setSelectedCopyObject(null)
          setCopySearchQuery('')
          setCopySettings([])
        } else if (startChoice === 'import') {
          // Hvis vi er i import-modus, bare nullstill import-valg
          setStartChoice(null)
        } else {
          // Hvis vi ikke har valgt noe, gå tilbake til kategori-valg
          setSelectedCategory(null)
          setStartChoice(null)
          setCurrentStep(0)
        }
        return
      }
      
      // Standard: gå tilbake ett steg
      setCurrentStep((prev) => (prev - 1) as Step)
    } else if (currentStep === 0 && selectedCategory) {
      // Hvis vi er på steg 0 og har kategori, gå tilbake til kategori-valg
      setSelectedCategory(null)
    }
  }

  const handleSaveDraft = () => {
    setStatus('draft')
  }

  const handlePublish = () => {
    setStatus('published')
  }

  // Checklist for publishing - kategori-spesifikk (utvidet med nye felt)
  const getPublishingChecklist = () => {
    // Felles sjekker for alle kategorier
    const commonRequired = [
      { label: 'Synlig navn definert', checked: !!formData.identity.displayName || !!formData.locationAndBasis.name },
      { label: 'Adresse definert', checked: !!formData.locationAndBasis.address || !!formData.location.address.street },
      { label: 'Tilgangstype valgt', checked: !!formData.location.accessType },
      { label: 'Målgruppe definert', checked: formData.audience.visibility.length > 0 },
      { label: 'Godkjenningstype valgt', checked: !!formData.rules.approvalMode || !!formData.workflow.approvalMode }
    ]
    
    const commonRecommended = [
      { label: 'Eier-enhet angitt', checked: !!formData.identity.ownerUnit },
      { label: 'Intern kode definert', checked: !!formData.identity.internalCode },
      { label: 'Kort beskrivelse', checked: !!formData.locationAndBasis.shortDescription || !!formData.content.shortDescription },
      { label: 'Kontaktpersoner', checked: formData.locationAndBasis.contacts.length > 0 || formData.contacts.length > 0 },
      { label: 'Bilder lastet opp', checked: formData.locationAndBasis.images.length > 0 || formData.content.gallery.length > 0 }
    ]

    if (selectedCategory === 'lokaler') {
      return {
        required: [
          ...commonRequired,
          { label: 'Tilgjengelighet definert', checked: formData.availability.presentationOnly || formData.availability.openingHours.some(h => h.active) },
          { label: 'Kapasitet definert', checked: formData.lokaler.venueCapacity.maxPersons > 0 || !!formData.properties.maxPersons },
          ...(formData.pricing.isFree ? [] : [
            { label: 'Pris definert', checked: formData.pricing.targetGroups.length > 0 || formData.pricing.basePrice > 0 },
            { label: 'Betalingsmetode satt', checked: formData.payment.methods.length > 0 || formData.pricing.paymentMethods.length > 0 }
          ])
        ],
        recommended: [
          ...commonRecommended,
          { label: 'Støyregler definert', checked: formData.lokaler.noiseRules.maxDecibelLevel !== null },
          { label: 'Universell utforming utfylt', checked: Object.values(formData.properties.universalDesign).some(v => v === true || (typeof v === 'string' && v.length > 0)) },
          { label: 'Leiebetingelser PDF', checked: !!formData.payment.terms.pdf },
          { label: 'Buffer-tider satt', checked: formData.timeLogic.bufferBefore > 0 || formData.timeLogic.bufferAfter > 0 }
        ]
      }
    }
    if (selectedCategory === 'sport') {
      return {
        required: [
          ...commonRequired,
          { label: 'Ressurstype valgt (bane/utstyr)', checked: !!formData.sport.resourceType },
          { label: 'Tilgjengelighet definert', checked: formData.availability.presentationOnly || (formData.availability.availabilityType === 'timeInterval' && formData.availability.timeInterval.openingHours.some(h => h.active)) },
          ...(formData.pricing.isFree ? [] : [
            { label: 'Pris definert', checked: !!formData.pricing.priceModel || formData.pricing.basePrice > 0 },
            { label: 'Betalingsmetode satt', checked: formData.payment.methods.length > 0 }
          ]),
          ...(formData.sport.resourceType === 'equipment' ? [
            { label: 'Antall enheter definert', checked: formData.sport.inventory.totalUnits > 0 },
            { label: 'Hentested definert', checked: !!formData.sport.loan.pickupLocation }
          ] : []),
          ...(formData.sport.resourceType === 'court' ? [
            { label: 'Baneunderlag definert', checked: !!formData.sport.courtInfo.surface }
          ] : [])
        ],
        recommended: [
          ...commonRecommended,
          { label: 'Lang beskrivelse', checked: !!formData.locationAndBasis.longDescription },
          { label: 'Vilkår PDF', checked: !!formData.payment.terms.pdf },
          ...(formData.sport.resourceType === 'equipment' ? [
            { label: 'Tilstandsvurdering', checked: !!formData.sport.condition.status },
            { label: 'Utlånsregler definert', checked: formData.sport.loan.maxLoanDurationDays > 0 }
          ] : [])
        ]
      }
    }
    if (selectedCategory === 'arrangementer') {
      return {
        required: [
          { label: 'Navn på arrangement', checked: !!formData.locationAndBasis.name || !!formData.identity.displayName },
          { label: 'Arrangørtype valgt', checked: !!formData.arrangementer.organizer.organizationType },
          { label: 'Ansvarlig person definert', checked: !!formData.arrangementer.organizer.responsiblePerson.name },
          { label: 'Kapasitet definert', checked: (formData.availability.availabilityType === 'quantity' && !!formData.availability.quantity.amount) || formData.arrangementer.eventCapacity.totalCapacity > 0 },
          { label: 'Programtider satt', checked: !!formData.arrangementer.program.startTime && !!formData.arrangementer.program.endTime },
          ...(formData.pricing.isFree ? [] : [
            { label: 'Pris definert', checked: formData.pricing.basePrice > 0 || formData.pricing.targetGroups.length > 0 }
          ])
        ],
        recommended: [
          ...commonRecommended,
          { label: 'Nødkontakt definert', checked: !!formData.arrangementer.organizer.emergencyContact.name },
          { label: 'Avbestillingsregler definert', checked: formData.arrangementer.cancellation.cancellationDeadlineHours > 0 },
          { label: 'Vilkår aksept konfigurert', checked: formData.workflow.termsAcceptance.required }
        ]
      }
    }
    if (selectedCategory === 'torg') {
      return {
        required: [
          ...commonRequired,
          { label: 'Antall enheter definert', checked: !!formData.properties.size },
          { label: 'Tilgjengelighet definert', checked: formData.availability.presentationOnly || (formData.availability.availabilityType === 'day' && formData.availability.day.openingHours.some(h => h.active)) || (formData.availability.availabilityType === 'quantity' && !!formData.availability.quantity.amount) },
          ...(formData.pricing.isFree ? [] : [
            { label: 'Pris definert', checked: !!formData.pricing.priceModel || formData.pricing.basePrice > 0 },
            { label: 'Betalingsmetode satt', checked: formData.payment.methods.length > 0 }
          ])
        ],
        recommended: [
          ...commonRecommended,
          { label: 'Depositum konfigurert', checked: formData.torg.outdoorDeposit.baseAmount > 0 },
          { label: 'Kontrollprosess definert', checked: formData.torg.outdoorDeposit.inspectionProcess.preInspectionRequired || formData.torg.outdoorDeposit.inspectionProcess.postInspectionRequired }
        ]
      }
    }
    return { required: [], recommended: [] }
  }

  const publishingChecklist = getPublishingChecklist()

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Opprett utleieobjekt
          </h1>
          <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 flex-wrap">
            {(() => {
              // Hvis vi ikke har valgt kategori eller er på opprettelsesmetode, vis initial breadcrumb
              if (!selectedCategory || (currentStep <= 1 && !startChoice)) {
                const labels = getInitialStepLabels()
                const stepIndex = !selectedCategory ? 0 : 1
                return labels.map((label, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className={index === stepIndex ? 'font-medium text-stone-900 dark:text-stone-100' : ''}>
                      {index + 1} {label}
                    </span>
                    {index < labels.length - 1 && <ChevronRight className="w-4 h-4" />}
                  </div>
                ))
              }
              // Ellers vis type-spesifikke steg
              const labels = getTypeStepLabels(selectedCategory)
              // Beregn hvilket steg vi er på i type-spesifikke steg
              // For lokaler: steg 1 = Lokasjon (index 0), steg 2 = Tilgjengelighet (index 1), etc.
              // For sport: steg 1 = Lokasjon (index 0), steg 2 = Tilgjengelighet (index 1), etc.
              // For arrangementer: steg 1 = Tidspunkter (index 0), steg 2 = Kapasitet (index 1), etc.
              // For torg: steg 1 = Hentested/Logistikk (index 0), steg 2 = Antall/Lager (index 1), etc.
              let typeStepIndex = 0
              if (selectedCategory === 'lokaler') {
                typeStepIndex = currentStep === 1 ? 0 : currentStep === 2 ? 1 : currentStep === 3 ? 2 : currentStep === 4 ? 3 : currentStep === 5 ? 4 : 0
              } else if (selectedCategory === 'sport') {
                typeStepIndex = currentStep === 1 ? 0 : currentStep === 2 ? 1 : currentStep === 3 ? 2 : currentStep === 4 ? 3 : currentStep === 5 ? 4 : 0
              } else if (selectedCategory === 'arrangementer') {
                typeStepIndex = currentStep === 1 ? 0 : currentStep === 2 ? 1 : currentStep === 3 ? 2 : currentStep === 4 ? 3 : currentStep === 5 ? 4 : 0
              } else if (selectedCategory === 'torg') {
                typeStepIndex = currentStep === 1 ? 0 : currentStep === 2 ? 1 : currentStep === 3 ? 2 : currentStep === 4 ? 3 : currentStep === 5 ? 4 : currentStep === 6 ? 5 : 0
              }
              return labels.map((label, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className={index === typeStepIndex ? 'font-medium text-stone-900 dark:text-stone-100' : ''}>
                    {index + 1} {label}
                  </span>
                  {index < labels.length - 1 && <ChevronRight className="w-4 h-4" />}
                </div>
              ))
            })()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 0: Velg kategori (hvis kategori ikke er gitt) */}
            {currentStep === 0 && !selectedCategory && (
              <Card>
                <CardHeader>
                  <CardTitle>Velg type utleieobjekt</CardTitle>
                  <CardDescription>Velg hvilken type utleieobjekt du vil opprette</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <button
                      onClick={() => {
                        setSelectedCategory('lokaler')
                        setCurrentStep(1)
                      }}
                      className="p-6 border-2 border-stone-200 dark:border-stone-700 rounded-lg hover:border-stone-900 dark:hover:border-stone-100 transition-colors text-left"
                    >
                      <div className="font-medium text-stone-900 dark:text-stone-100 mb-1">
                        Lokaler
                      </div>
                      <div className="text-sm text-stone-600 dark:text-stone-400">
                        Selskapslokale, Møterom, Gymsal, Kulturarena, Konferanserom
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategory('sport')
                        setCurrentStep(1)
                      }}
                      className="p-6 border-2 border-stone-200 dark:border-stone-700 rounded-lg hover:border-stone-900 dark:hover:border-stone-100 transition-colors text-left"
                    >
                      <div className="font-medium text-stone-900 dark:text-stone-100 mb-1">
                        Sport
                      </div>
                      <div className="text-sm text-stone-600 dark:text-stone-400">
                        Padel, Squash, Tennis, Cageball, Badminton
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategory('arrangementer')
                        setCurrentStep(1)
                      }}
                      className="p-6 border-2 border-stone-200 dark:border-stone-700 rounded-lg hover:border-stone-900 dark:hover:border-stone-100 transition-colors text-left"
                    >
                      <div className="font-medium text-stone-900 dark:text-stone-100 mb-1">
                        Arrangementer
                      </div>
                      <div className="text-sm text-stone-600 dark:text-stone-400">
                        Kurs, Foredrag, Konsert, Workshop, Seminar
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategory('torg')
                        setCurrentStep(1)
                      }}
                      className="p-6 border-2 border-stone-200 dark:border-stone-700 rounded-lg hover:border-stone-900 dark:hover:border-stone-100 transition-colors text-left"
                    >
                      <div className="font-medium text-stone-900 dark:text-stone-100 mb-1">
                        Torg
                      </div>
                      <div className="text-sm text-stone-600 dark:text-stone-400">
                        Telt, Lydanlegg, Projektor, Bord og stoler, Grill, Partytelt
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 0/1: Opprettelsesmetode (hvis kategori er valgt) */}
            {((currentStep === 0 && selectedCategory) || (currentStep === 1 && selectedCategory && (!startChoice || startChoice === 'copy' || startChoice === 'import'))) && (
              <Card>
                <CardHeader>
                  <CardTitle>Opprettelsesmetode</CardTitle>
                  <CardDescription>
                    Velg hvordan du vil opprette utleieobjektet ({selectedCategory === 'lokaler' ? 'Lokaler' : selectedCategory === 'sport' ? 'Sport' : selectedCategory === 'arrangementer' ? 'Arrangementer' : 'Torg'})
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => {
                        setStartChoice('new')
                        setCurrentStep(1) // Go to subcategory step
                      }}
                      className="p-6 border-2 border-stone-200 dark:border-stone-700 rounded-lg hover:border-stone-900 dark:hover:border-stone-100 transition-colors text-left"
                    >
                      <div className="font-medium text-stone-900 dark:text-stone-100 mb-1">
                        Opprette nytt utleieobjekt
                      </div>
                      <div className="text-sm text-stone-600 dark:text-stone-400">
                        Start fra scratch med et tomt objekt
                      </div>
                    </button>
                    <button
                      onClick={() => setStartChoice('copy')}
                      className="p-6 border-2 border-stone-200 dark:border-stone-700 rounded-lg hover:border-stone-900 dark:hover:border-stone-100 transition-colors text-left"
                    >
                      <div className="font-medium text-stone-900 dark:text-stone-100 mb-1">
                        Kopier eksisterende
                      </div>
                      <div className="text-sm text-stone-600 dark:text-stone-400">
                        Bruk et eksisterende objekt som mal
                      </div>
                    </button>
                    <button
                      onClick={() => setStartChoice('import')}
                      className="p-6 border-2 border-stone-200 dark:border-stone-700 rounded-lg hover:border-stone-900 dark:hover:border-stone-100 transition-colors text-left"
                    >
                      <div className="font-medium text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Importer fra ekstern kilde
                      </div>
                      <div className="text-sm text-stone-600 dark:text-stone-400">
                        Importer fra finn.no, bookup.no eller lignende
                      </div>
                    </button>
                  </div>
                  {startChoice === 'import' && (
                    <ImportUtleieobjekt
                      onImport={(importedData) => {
                        // Map importert data til formData
                        setFormData({
                          ...formData,
                          locationAndBasis: {
                            ...formData.locationAndBasis,
                            name: importedData.name || formData.locationAndBasis.name,
                            address: importedData.address || formData.locationAndBasis.address,
                            postalCode: importedData.postalCode || formData.locationAndBasis.postalCode,
                            postalArea: importedData.postalArea || formData.locationAndBasis.postalArea,
                            shortDescription: importedData.shortDescription || formData.locationAndBasis.shortDescription,
                            longDescription: importedData.description || formData.locationAndBasis.longDescription,
                            images: importedData.images || formData.locationAndBasis.images,
                            contacts: importedData.contact ? [{
                              name: importedData.contact.name,
                              role: '',
                              email: importedData.contact.email,
                              phone: importedData.contact.phone
                            }] : formData.locationAndBasis.contacts
                          },
                          properties: {
                            ...formData.properties,
                            size: importedData.size || formData.properties.size,
                            maxPersons: importedData.maxPersons || formData.properties.maxPersons,
                            facilities: importedData.facilities || formData.properties.facilities
                          },
                          pricing: {
                            ...formData.pricing,
                            isFree: !importedData.price,
                            priceModel: importedData.price ? importedData.price.toString() : formData.pricing.priceModel
                          }
                        })
                        // Gå til første type-spesifikke steg
                        setCurrentStep(1) // Subcategory step
                        setStartChoice('new') // Sett til 'new' etter import slik at resten av wizarden fungerer normalt
                      }}
                      onCancel={() => {
                        setStartChoice(null)
                      }}
                    />
                  )}
                  {startChoice === 'copy' && (
                    <div className="mt-4 p-4 bg-stone-100 dark:bg-stone-800 rounded-lg space-y-4">
                      <div>
                        <Label>Velg objekt å kopiere</Label>
                        <div className="mt-2 space-y-2">
                          <Input 
                            placeholder="Søk etter objekt..." 
                            className="w-full"
                            value={copySearchQuery}
                            onChange={(e) => setCopySearchQuery(e.target.value)}
                          />
                          {copySearchQuery && (
                            <div className="border rounded-lg max-h-60 overflow-y-auto">
                              {filteredCopyObjects.length === 0 ? (
                                <div className="p-4 text-center text-sm text-stone-500">
                                  Ingen objekter funnet
                                </div>
                              ) : (
                                filteredCopyObjects.map((obj) => (
                                  <button
                                    key={obj.id}
                                    onClick={() => {
                                      setSelectedCopyObject(obj.id)
                                      setCopySearchQuery(obj.name)
                                    }}
                                    className={`w-full p-3 text-left hover:bg-stone-200 dark:hover:bg-stone-700 border-b last:border-b-0 ${
                                      selectedCopyObject === obj.id ? 'bg-stone-200 dark:bg-stone-700' : ''
                                    }`}
                                  >
                                    <div className="font-medium">{obj.name}</div>
                                    <div className="text-xs text-stone-500">{obj.location} • {obj.status}</div>
                                  </button>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label>Kopier-innstillinger</Label>
                        <div className="mt-2 space-y-2">
                          {selectedCategory === 'lokaler' && ['Lokasjon', 'Tilgjengelighet', 'Regler', 'Pris og betaling'].map((item) => (
                            <label key={item} className="flex items-center gap-2">
                              <input 
                                type="checkbox" 
                                className="rounded"
                                checked={copySettings.includes(item)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setCopySettings([...copySettings, item])
                                  } else {
                                    setCopySettings(copySettings.filter(s => s !== item))
                                  }
                                }}
                              />
                              <span className="text-sm">{item}</span>
                            </label>
                          ))}
                          {selectedCategory === 'sport' && ['Lokasjon', 'Tilgjengelighet', 'Regler', 'Pris/Depositum'].map((item) => (
                            <label key={item} className="flex items-center gap-2">
                              <input 
                                type="checkbox" 
                                className="rounded"
                                checked={copySettings.includes(item)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setCopySettings([...copySettings, item])
                                  } else {
                                    setCopySettings(copySettings.filter(s => s !== item))
                                  }
                                }}
                              />
                              <span className="text-sm">{item}</span>
                            </label>
                          ))}
                          {selectedCategory === 'arrangementer' && ['Tidspunkter', 'Kapasitet', 'Pris', 'Vilkår'].map((item) => (
                            <label key={item} className="flex items-center gap-2">
                              <input 
                                type="checkbox" 
                                className="rounded"
                                checked={copySettings.includes(item)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setCopySettings([...copySettings, item])
                                  } else {
                                    setCopySettings(copySettings.filter(s => s !== item))
                                  }
                                }}
                              />
                              <span className="text-sm">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          // Her kan du legge til logikk for å faktisk kopiere data
                          setCurrentStep(1) // First type-specific step
                        }} 
                        className="w-full"
                        disabled={!selectedCopyObject || copySettings.length === 0}
                      >
                        Fortsett med kopi
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Lokaler: Step 1 - Lokasjon */}
            {selectedCategory === 'lokaler' && currentStep === 1 && startChoice === 'new' && (
              <>
              {/* Identitet og struktur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    Identitet og struktur
                  </CardTitle>
                  <CardDescription>Intern identifikasjon og organisatorisk tilhørighet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="subcategory-select-lokaler">Underkategori {!formData.subcategory.selected && <span className="text-red-600">*</span>}</Label>
                    <select
                      id="subcategory-select-lokaler"
                      value={formData.subcategory.selected || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        subcategory: { ...formData.subcategory, selected: e.target.value || null, custom: '' } 
                      })}
                      className="w-full mt-2 p-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    >
                      <option value="">Velg underkategori...</option>
                      {getSubcategories('lokaler').map((subcat) => (
                        <option key={subcat} value={subcat}>{subcat}</option>
                      ))}
                    </select>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="displayName">Synlig navn (for publikum) {!formData.identity.displayName && <span className="text-red-600">*</span>}</Label>
                      <Input
                        id="displayName"
                        value={formData.identity.displayName}
                        onChange={(e) => {
                          const value = e.target.value
                          setFormData({ 
                            ...formData, 
                            identity: { ...formData.identity, displayName: value },
                            locationAndBasis: { ...formData.locationAndBasis, name: value }
                          })
                        }}
                        className="mt-2"
                        placeholder="F.eks. Møterom Y - Kragerø"
                      />
                      <p className="text-xs text-stone-500 mt-1">Dette vises i katalogen og på bookingsiden</p>
                    </div>
                    <div>
                      <Label htmlFor="internalName">Internt navn (valgfritt)</Label>
                      <Input
                        id="internalName"
                        value={formData.identity.internalName}
                        onChange={(e) => setFormData({ ...formData, identity: { ...formData.identity, internalName: e.target.value } })}
                        className="mt-2"
                        placeholder="F.eks. Møterom Y (2. etg kulturhus)"
                      />
                      <p className="text-xs text-stone-500 mt-1">Kun synlig for administratorer</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="internalCode">Intern kortkode</Label>
                      <Input
                        id="internalCode"
                        value={formData.identity.internalCode}
                        onChange={(e) => setFormData({ ...formData, identity: { ...formData.identity, internalCode: e.target.value } })}
                        className="mt-2"
                        placeholder="F.eks. MR-Y-001"
                      />
                      <p className="text-xs text-stone-500 mt-1">For drift og rapporter</p>
                    </div>
                    <div>
                      <Label htmlFor="ownerUnit">Eier-enhet / Avdeling</Label>
                      <select
                        id="ownerUnit"
                        value={formData.identity.ownerUnit}
                        onChange={(e) => setFormData({ ...formData, identity: { ...formData.identity, ownerUnit: e.target.value } })}
                        className="w-full mt-2 p-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                      >
                        <option value="">Velg avdeling...</option>
                        <option value="Kultur og idrett">Kultur og idrett</option>
                        <option value="Teknisk drift">Teknisk drift</option>
                        <option value="Oppvekst">Oppvekst</option>
                        <option value="Helse og omsorg">Helse og omsorg</option>
                        <option value="Administrasjon">Administrasjon</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="slug">URL-slug (auto)</Label>
                      <Input
                        id="slug"
                        value={formData.identity.slug || formData.identity.displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                        onChange={(e) => setFormData({ ...formData, identity: { ...formData.identity, slug: e.target.value } })}
                        className="mt-2"
                        placeholder="moeterom-y-kragero"
                      />
                      <p className="text-xs text-stone-500 mt-1">Brukes i URL-en</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lokasjon og adresse */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Lokasjon
                  </CardTitle>
                  <CardDescription>Adresse og kartposisjon</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="address">Adresse {!formData.locationAndBasis.address && <span className="text-red-600">*</span>}</Label>
                      <Input
                        id="address"
                        value={formData.locationAndBasis.address}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          locationAndBasis: { ...formData.locationAndBasis, address: e.target.value },
                          location: { ...formData.location, address: { ...formData.location.address, street: e.target.value } }
                        })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postnummer {!formData.locationAndBasis.postalCode && <span className="text-red-600">*</span>}</Label>
                      <Input
                        id="postalCode"
                        value={formData.locationAndBasis.postalCode}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          locationAndBasis: { ...formData.locationAndBasis, postalCode: e.target.value },
                          location: { ...formData.location, address: { ...formData.location.address, postalCode: e.target.value } }
                        })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="postalArea">Poststed {!formData.locationAndBasis.postalArea && <span className="text-red-600">*</span>}</Label>
                      <Input
                        id="postalArea"
                        value={formData.locationAndBasis.postalArea}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          locationAndBasis: { ...formData.locationAndBasis, postalArea: e.target.value },
                          location: { ...formData.location, address: { ...formData.location.address, postalArea: e.target.value } }
                        })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="building">Bygg / Anlegg</Label>
                      <Input
                        id="building"
                        value={formData.location.building}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          location: { ...formData.location, building: e.target.value, address: { ...formData.location.address, building: e.target.value } }
                        })}
                        className="mt-2"
                        placeholder="F.eks. Kulturhuset"
                      />
                    </div>
                    <div>
                      <Label htmlFor="floor">Etasje</Label>
                      <Input
                        id="floor"
                        value={formData.location.floor}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          location: { ...formData.location, floor: e.target.value, address: { ...formData.location.address, floor: e.target.value } }
                        })}
                        className="mt-2"
                        placeholder="F.eks. 2. etasje"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="roomNumber">Romnummer / Sone</Label>
                    <Input
                      id="roomNumber"
                      value={formData.location.roomNumber}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        location: { ...formData.location, roomNumber: e.target.value, address: { ...formData.location.address, roomNumber: e.target.value } }
                      })}
                      className="mt-2"
                      placeholder="F.eks. Y-201"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Kart</Label>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Map className="w-4 h-4 mr-2" />
                          Vis kart
                        </Button>
                        <Button variant="outline" size="sm">
                          <MapPin className="w-4 h-4 mr-2" />
                          Oppdater fra adresse
                        </Button>
                      </div>
                    </div>
                    <div className="h-48 bg-stone-100 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 flex items-center justify-center">
                      <div className="text-center text-stone-500">
                        <Map className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">Kart-visning</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="meetingPoint">Møtepunkt / "Møt opp her"-tekst</Label>
                    <Input
                      id="meetingPoint"
                      value={formData.location.meetingPoint}
                      onChange={(e) => setFormData({ ...formData, location: { ...formData.location, meetingPoint: e.target.value } })}
                      className="mt-2"
                      placeholder="F.eks. Hovedinngang, ta heis til 2. etasje"
                    />
                    <p className="text-xs text-stone-500 mt-1">Vises til brukere som har booket</p>
                  </div>
                  <div>
                    <Label htmlFor="directionsText">Veibeskrivelse</Label>
                    <textarea
                      id="directionsText"
                      value={formData.location.directionsText}
                      onChange={(e) => setFormData({ ...formData, location: { ...formData.location, directionsText: e.target.value } })}
                      className="mt-2 w-full min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      placeholder="F.eks. Fra sentrum: Følg skiltene mot kulturhuset. Parkering på baksiden."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tilgang og logistikk */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Tilgang og logistikk
                  </CardTitle>
                  <CardDescription>Hvordan brukere får tilgang til lokalet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Tilgangstype</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                      {[
                        { value: 'code', label: 'Kode', icon: Hash },
                        { value: 'reception', label: 'Resepsjon', icon: Users },
                        { value: 'janitor', label: 'Vaktmester', icon: Wrench },
                        { value: 'digital', label: 'Digital nøkkel', icon: Key },
                        { value: 'physical_key', label: 'Fysisk nøkkel', icon: Key }
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setFormData({ ...formData, location: { ...formData.location, accessType: value as typeof formData.location.accessType } })}
                          className={`p-3 border rounded-lg text-center transition-colors ${
                            formData.location.accessType === value
                              ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-300'
                              : 'border-stone-200 dark:border-stone-700 hover:border-stone-400'
                          }`}
                        >
                          <Icon className="w-5 h-5 mx-auto mb-1" />
                          <span className="text-xs">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.location.accessType === 'code' && (
                    <div>
                      <Label htmlFor="accessInstructions">Kodeinstruksjoner</Label>
                      <textarea
                        id="accessInstructions"
                        value={formData.location.accessInstructions}
                        onChange={(e) => setFormData({ ...formData, location: { ...formData.location, accessInstructions: e.target.value } })}
                        className="mt-2 w-full min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                        placeholder="F.eks. Kode sendes på SMS 1 time før booking starter"
                      />
                    </div>
                  )}

                  {(formData.location.accessType === 'physical_key' || formData.location.accessType === 'janitor') && (
                    <div className="space-y-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
                      <div>
                        <Label htmlFor="keyPickupLocation">Nøkkelhentested</Label>
                        <Input
                          id="keyPickupLocation"
                          value={formData.location.keyPickupLocation}
                          onChange={(e) => setFormData({ ...formData, location: { ...formData.location, keyPickupLocation: e.target.value } })}
                          className="mt-2"
                          placeholder="F.eks. Servicetorget, 1. etasje"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="keyPickupHours">Hentetider</Label>
                          <Input
                            id="keyPickupHours"
                            value={formData.location.keyPickupHours}
                            onChange={(e) => setFormData({ ...formData, location: { ...formData.location, keyPickupHours: e.target.value } })}
                            className="mt-2"
                            placeholder="F.eks. 08:00-16:00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="keyReturnDeadline">Innleveringsfrist</Label>
                          <Input
                            id="keyReturnDeadline"
                            value={formData.location.keyReturnDeadline}
                            onChange={(e) => setFormData({ ...formData, location: { ...formData.location, keyReturnDeadline: e.target.value } })}
                            className="mt-2"
                            placeholder="F.eks. Neste virkedag kl 10:00"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="parkingInfo">Parkeringsinfo</Label>
                      <Input
                        id="parkingInfo"
                        value={formData.location.parkingInfo}
                        onChange={(e) => setFormData({ ...formData, location: { ...formData.location, parkingInfo: e.target.value } })}
                        className="mt-2"
                        placeholder="F.eks. Gratis parkering på baksiden"
                      />
                    </div>
                    <div>
                      <Label htmlFor="parkingSpots">Antall plasser</Label>
                      <Input
                        id="parkingSpots"
                        type="number"
                        value={formData.location.parkingSpots || ''}
                        onChange={(e) => setFormData({ ...formData, location: { ...formData.location, parkingSpots: e.target.value ? parseInt(e.target.value) : null } })}
                        className="mt-2"
                        placeholder="F.eks. 20"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.location.loadingZone}
                        onChange={(e) => setFormData({ ...formData, location: { ...formData.location, loadingZone: e.target.checked } })}
                        className="rounded"
                      />
                      <span className="text-sm">Innlastingssone tilgjengelig</span>
                    </label>
                    {formData.location.loadingZone && (
                      <div className="flex-1">
                        <Input
                          value={formData.location.loadingZoneHours}
                          onChange={(e) => setFormData({ ...formData, location: { ...formData.location, loadingZoneHours: e.target.value } })}
                          placeholder="Tilgjengelig tider (f.eks. 08:00-16:00)"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Beskrivelse og innhold */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Beskrivelse
                  </CardTitle>
                  <CardDescription>Beskrivelse som vises for brukere</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="shortDescription">Kort beskrivelse (maks 200 tegn)</Label>
                    <textarea
                      id="shortDescription"
                      value={formData.locationAndBasis.shortDescription}
                      onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, shortDescription: e.target.value } })}
                      className="mt-2 w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      maxLength={200}
                    />
                    <p className="text-xs text-stone-500 mt-1">{formData.locationAndBasis.shortDescription.length}/200 tegn</p>
                  </div>
                  <div>
                    <Label htmlFor="longDescription">Lang beskrivelse (fritekst)</Label>
                    <textarea
                      id="longDescription"
                      value={formData.locationAndBasis.longDescription}
                      onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, longDescription: e.target.value } })}
                      className="mt-2 w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Kontaktpersoner</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({
                          ...formData,
                          locationAndBasis: {
                            ...formData.locationAndBasis,
                            contacts: [...formData.locationAndBasis.contacts, { name: '', role: '', email: '', phone: '' }]
                          }
                        })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Legg til kontakt
                      </Button>
                    </div>
                    <div className="space-y-3 mt-2">
                      {formData.locationAndBasis.contacts.map((contact, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">Navn</Label>
                              <Input
                                value={contact.name}
                                onChange={(e) => {
                                  const updated = formData.locationAndBasis.contacts.map((c, i) =>
                                    i === index ? { ...c, name: e.target.value } : c
                                  )
                                  setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, contacts: updated } })
                                }}
                                className="mt-1"
                                placeholder="F.eks. Ola Nordmann"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Rolle</Label>
                              <select
                                value={contact.role}
                                onChange={(e) => {
                                  const updated = formData.locationAndBasis.contacts.map((c, i) =>
                                    i === index ? { ...c, role: e.target.value } : c
                                  )
                                  setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, contacts: updated } })
                                }}
                                className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                              >
                                <option value="">Velg rolle</option>
                                <option value="drift">Drift</option>
                                <option value="nokkel">Nøkkel</option>
                                <option value="fagansvarlig">Fagansvarlig</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">E-post</Label>
                              <Input
                                type="email"
                                value={contact.email}
                                onChange={(e) => {
                                  const updated = formData.locationAndBasis.contacts.map((c, i) =>
                                    i === index ? { ...c, email: e.target.value } : c
                                  )
                                  setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, contacts: updated } })
                                }}
                                className="mt-1"
                                placeholder="ola@example.com"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Telefon</Label>
                              <Input
                                type="tel"
                                value={contact.phone}
                                onChange={(e) => {
                                  const updated = formData.locationAndBasis.contacts.map((c, i) =>
                                    i === index ? { ...c, phone: e.target.value } : c
                                  )
                                  setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, contacts: updated } })
                                }}
                                className="mt-1"
                                placeholder="+47 123 45 678"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updated = formData.locationAndBasis.contacts.filter((_, i) => i !== index)
                                setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, contacts: updated } })
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Slett
                            </Button>
                          </div>
                        </div>
                      ))}
                      {formData.locationAndBasis.contacts.length === 0 && (
                        <div className="p-4 border border-dashed rounded-lg text-center text-stone-500 text-sm">
                          Ingen kontaktpersoner lagt til ennå
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Media</Label>
                    <div className="mt-2 space-y-3">
                      <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-stone-400" />
                        <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">Last opp bilder</p>
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Last opp husregler
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Last opp branninstruks
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Last opp plantegning (valgfri)
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label>Egenskaper</Label>
                    <div className="mt-2 space-y-6">
                      <div>
                        <Label>Kapasitet og størrelse</Label>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="size" className="text-xs">Størrelse m² (valgfri)</Label>
                        <Input id="size" type="number" value={formData.properties.size} onChange={(e) => setFormData({ ...formData, properties: { ...formData.properties, size: e.target.value } })} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="maxPersons" className="text-xs">Max antall personer (valgfri)</Label>
                        <Input id="maxPersons" type="number" value={formData.properties.maxPersons} onChange={(e) => setFormData({ ...formData, properties: { ...formData.properties, maxPersons: e.target.value } })} className="mt-1" />
                      </div>
                      </div>
                      </div>
                      <div>
                        <Label>Fasiliteter (valgfri, men sterk anbefaling)</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {['Kjøkken', 'Garderobe', 'Dusj', 'Parkering', 'WiFi', 'Projektor/TV', 'Lydanlegg', 'Scene', 'Kiosk', 'Catering', 'Teleslynge', 'Toalett', 'Vertskap/betjening', 'Annet'].map((facility) => (
                        <label key={facility} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.properties.facilities.includes(facility)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, properties: { ...formData.properties, facilities: [...formData.properties.facilities, facility] } })
                              } else {
                                setFormData({ ...formData, properties: { ...formData.properties, facilities: formData.properties.facilities.filter(f => f !== facility) } })
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{facility}</span>
                        </label>
                      ))}
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <Label>Universell utforming</Label>
                    <div className="mt-2 space-y-3">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.properties.universalDesign.stepFreeAccess} onChange={(e) => setFormData({ ...formData, properties: { ...formData.properties, universalDesign: { ...formData.properties.universalDesign, stepFreeAccess: e.target.checked } } })} className="rounded" />
                        <span className="text-sm">Trinnfri adkomst</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.properties.universalDesign.wcAccessible} onChange={(e) => setFormData({ ...formData, properties: { ...formData.properties, universalDesign: { ...formData.properties.universalDesign, wcAccessible: e.target.checked } } })} className="rounded" />
                        <span className="text-sm">HC-toalett</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.properties.universalDesign.elevator} onChange={(e) => setFormData({ ...formData, properties: { ...formData.properties, universalDesign: { ...formData.properties.universalDesign, elevator: e.target.checked } } })} className="rounded" />
                        <span className="text-sm">Heis</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.properties.universalDesign.hearingLoop} onChange={(e) => setFormData({ ...formData, properties: { ...formData.properties, universalDesign: { ...formData.properties.universalDesign, hearingLoop: e.target.checked } } })} className="rounded" />
                        <span className="text-sm">Teleslynge</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.properties.universalDesign.accessibleParking} onChange={(e) => setFormData({ ...formData, properties: { ...formData.properties, universalDesign: { ...formData.properties.universalDesign, accessibleParking: e.target.checked } } })} className="rounded" />
                        <span className="text-sm">HC-parkering</span>
                      </label>
                      <div>
                        <Label className="text-xs">Annen tilrettelegging (tekst)</Label>
                        <textarea value={formData.properties.universalDesign.otherAccommodation} onChange={(e) => setFormData({ ...formData, properties: { ...formData.properties, universalDesign: { ...formData.properties.universalDesign, otherAccommodation: e.target.value } } })} className="mt-1 w-full min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-sm" />
                      </div>
                      </div>
                      </div>
                      <Separator />
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Tilleggstjenester (valgfri, men sentral)</Label>
                      <Button variant="outline" size="sm" onClick={() => setFormData({ ...formData, properties: { ...formData.properties, addOnServices: [...formData.properties.addOnServices, { name: '', description: '', price: '', required: false, needsApproval: false }] } })}>
                        <Plus className="w-4 h-4 mr-2" />
                        Legg til tjeneste
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {formData.properties.addOnServices.map((service, index) => (
                        <div key={index} className="p-3 border rounded-lg space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Navn</Label>
                              <Input value={service.name} className="mt-1" />
                            </div>
                            <div>
                              <Label className="text-xs">Pris (valgfri)</Label>
                              <Input type="number" value={service.price} className="mt-1" />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">Beskrivelse</Label>
                            <textarea value={service.description} className="mt-1 w-full min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-sm" />
                          </div>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" checked={service.required} className="rounded" />
                              <span className="text-xs">Påkrevd for enkelte bookinger</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" checked={service.needsApproval} className="rounded" />
                              <span className="text-xs">Krever godkjenning</span>
                            </label>
                          </div>
                        </div>
                      ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Kapasitet og rom */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    Kapasitet og rom
                  </CardTitle>
                  <CardDescription>Detaljert kapasitetsinformasjon for ulike oppsett</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Kapasitet i flere dimensjoner</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs">Sitteplasser</Label>
                        <Input
                          type="number"
                          value={formData.lokaler.venueCapacity.seatedCapacity}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            lokaler: { 
                              ...formData.lokaler, 
                              venueCapacity: { ...formData.lokaler.venueCapacity, seatedCapacity: parseInt(e.target.value) || 0 } 
                            } 
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Ståplasser</Label>
                        <Input
                          type="number"
                          value={formData.lokaler.venueCapacity.standingCapacity}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            lokaler: { 
                              ...formData.lokaler, 
                              venueCapacity: { ...formData.lokaler.venueCapacity, standingCapacity: parseInt(e.target.value) || 0 } 
                            } 
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Brannkapasitet</Label>
                        <Input
                          type="number"
                          value={formData.lokaler.venueCapacity.fireCapacity}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            lokaler: { 
                              ...formData.lokaler, 
                              venueCapacity: { ...formData.lokaler.venueCapacity, fireCapacity: parseInt(e.target.value) || 0 } 
                            } 
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Maks personer totalt</Label>
                        <Input
                          type="number"
                          value={formData.lokaler.venueCapacity.maxPersons}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            lokaler: { 
                              ...formData.lokaler, 
                              venueCapacity: { ...formData.lokaler.venueCapacity, maxPersons: parseInt(e.target.value) || 0 } 
                            } 
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Bordoppsett</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({
                          ...formData,
                          lokaler: {
                            ...formData.lokaler,
                            venueCapacity: {
                              ...formData.lokaler.venueCapacity,
                              tableLayouts: [...formData.lokaler.venueCapacity.tableLayouts, { id: `layout-${Date.now()}`, name: '', capacity: 0, description: '' }]
                            }
                          }
                        })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Legg til oppsett
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {formData.lokaler.venueCapacity.tableLayouts.map((layout, index) => (
                        <div key={layout.id || index} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="flex-1">
                            <Input
                              value={layout.name}
                              onChange={(e) => {
                                const updated = formData.lokaler.venueCapacity.tableLayouts.map((l, i) =>
                                  i === index ? { ...l, name: e.target.value } : l
                                )
                                setFormData({ 
                                  ...formData, 
                                  lokaler: { 
                                    ...formData.lokaler, 
                                    venueCapacity: { ...formData.lokaler.venueCapacity, tableLayouts: updated } 
                                  } 
                                })
                              }}
                              placeholder="F.eks. U-form"
                            />
                          </div>
                          <div className="w-24">
                            <Input
                              type="number"
                              value={layout.capacity}
                              onChange={(e) => {
                                const updated = formData.lokaler.venueCapacity.tableLayouts.map((l, i) =>
                                  i === index ? { ...l, capacity: parseInt(e.target.value) || 0 } : l
                                )
                                setFormData({ 
                                  ...formData, 
                                  lokaler: { 
                                    ...formData.lokaler, 
                                    venueCapacity: { ...formData.lokaler.venueCapacity, tableLayouts: updated } 
                                  } 
                                })
                              }}
                              placeholder="Kap."
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updated = formData.lokaler.venueCapacity.tableLayouts.filter((_, i) => i !== index)
                              setFormData({ 
                                ...formData, 
                                lokaler: { 
                                  ...formData.lokaler, 
                                  venueCapacity: { ...formData.lokaler.venueCapacity, tableLayouts: updated } 
                                } 
                              })
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {formData.lokaler.venueCapacity.tableLayouts.length === 0 && (
                        <div className="p-4 border border-dashed rounded-lg text-center text-stone-500 text-sm">
                          Ingen bordoppsett definert
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Romstruktur</Label>
                    <div className="mt-2 space-y-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.lokaler.roomStructure.isDivisible}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            lokaler: { 
                              ...formData.lokaler, 
                              roomStructure: { ...formData.lokaler.roomStructure, isDivisible: e.target.checked } 
                            } 
                          })}
                          className="rounded"
                        />
                        <span className="text-sm">Rommet kan deles i mindre soner</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.lokaler.roomStructure.canBookSimultaneously}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            lokaler: { 
                              ...formData.lokaler, 
                              roomStructure: { ...formData.lokaler.roomStructure, canBookSimultaneously: e.target.checked } 
                            } 
                          })}
                          className="rounded"
                        />
                        <span className="text-sm">Tillater samtidige bookinger (flere leietakere)</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Støyregler */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Støyregler
                  </CardTitle>
                  <CardDescription>Regler for støy og musikk</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs">Maks desibelnivå (dB)</Label>
                      <Input
                        type="number"
                        value={formData.lokaler.noiseRules.maxDecibelLevel || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          lokaler: { 
                            ...formData.lokaler, 
                            noiseRules: { ...formData.lokaler.noiseRules, maxDecibelLevel: e.target.value ? parseInt(e.target.value) : null } 
                          } 
                        })}
                        className="mt-1"
                        placeholder="F.eks. 85"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Stilletid fra</Label>
                      <Input
                        type="time"
                        value={formData.lokaler.noiseRules.quietHoursFrom}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          lokaler: { 
                            ...formData.lokaler, 
                            noiseRules: { ...formData.lokaler.noiseRules, quietHoursFrom: e.target.value } 
                          } 
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Stilletid til</Label>
                      <Input
                        type="time"
                        value={formData.lokaler.noiseRules.quietHoursTo}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          lokaler: { 
                            ...formData.lokaler, 
                            noiseRules: { ...formData.lokaler.noiseRules, quietHoursTo: e.target.value } 
                          } 
                        })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.lokaler.noiseRules.musicAllowed}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            lokaler: { 
                              ...formData.lokaler, 
                              noiseRules: { ...formData.lokaler.noiseRules, musicAllowed: e.target.checked } 
                            } 
                          })}
                          className="rounded"
                        />
                        <span className="text-sm">Musikk tillatt</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.lokaler.noiseRules.amplifiedSoundAllowed}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            lokaler: { 
                              ...formData.lokaler, 
                              noiseRules: { ...formData.lokaler.noiseRules, amplifiedSoundAllowed: e.target.checked } 
                            } 
                          })}
                          className="rounded"
                        />
                        <span className="text-sm">Forsterket lyd tillatt</span>
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.lokaler.noiseRules.livePerformanceAllowed}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            lokaler: { 
                              ...formData.lokaler, 
                              noiseRules: { ...formData.lokaler.noiseRules, livePerformanceAllowed: e.target.checked } 
                            } 
                          })}
                          className="rounded"
                        />
                        <span className="text-sm">Liveopptreden tillatt</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.lokaler.noiseRules.neighborNotificationRequired}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            lokaler: { 
                              ...formData.lokaler, 
                              noiseRules: { ...formData.lokaler.noiseRules, neighborNotificationRequired: e.target.checked } 
                            } 
                          })}
                          className="rounded"
                        />
                        <span className="text-sm">Krever nabovarsel</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </>
            )}

            {/* Lokaler: Step 2 - Tilgjengelighet */}
            {selectedCategory === 'lokaler' && currentStep === 2 && (
              <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Tilgjengelighet
                  </CardTitle>
                  <CardDescription>Definer når objektet er tilgjengelig for booking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Tilgjengelighetstype {!formData.availability.availabilityType && <span className="text-red-600">*</span>}</Label>
                    <div className="mt-2 flex gap-4">
                      <label className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="availabilityType-lokaler" 
                          value="timeInterval" 
                          checked={formData.availability.availabilityType === 'timeInterval'} 
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            availability: { 
                              ...formData.availability, 
                              availabilityType: 'timeInterval' as const,
                              timeInterval: {
                                interval: formData.availability.timeInterval.interval || '',
                                openingHours: formData.availability.timeInterval.openingHours.length > 0 
                                  ? formData.availability.timeInterval.openingHours 
                                  : formData.availability.openingHours
                              }
                            } 
                          })} 
                        />
                        <span>Tidsintervall</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="availabilityType-lokaler" 
                          value="day" 
                          checked={formData.availability.availabilityType === 'day'} 
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            availability: { 
                              ...formData.availability, 
                              availabilityType: 'day' as const,
                              day: {
                                type: formData.availability.day.type || 'full',
                                fromTime: formData.availability.day.fromTime || '',
                                toTime: formData.availability.day.toTime || '',
                                openingHours: formData.availability.day.openingHours.length > 0 
                                  ? formData.availability.day.openingHours 
                                  : formData.availability.openingHours
                              }
                            } 
                          })} 
                        />
                        <span>Dag</span>
                      </label>
                    </div>
                  </div>
                  
                  {formData.availability.availabilityType === 'timeInterval' && (
                    <div>
                      <Label>Intervall {!formData.availability.timeInterval.interval && <span className="text-red-600">*</span>}</Label>
                      <select 
                        value={formData.availability.timeInterval.interval} 
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          availability: { 
                            ...formData.availability, 
                            timeInterval: { 
                              ...formData.availability.timeInterval, 
                              interval: e.target.value 
                            } 
                          } 
                        })} 
                        className="mt-2 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                      >
                        <option value="">Velg intervall</option>
                        <option value="15">15 minutter</option>
                        <option value="30">30 minutter</option>
                        <option value="60">60 minutter</option>
                        <option value="custom">Tilpasset</option>
                      </select>
                    </div>
                  )}
                  
                  {formData.availability.availabilityType === 'day' && (
                    <div>
                      <Label>Dagstype</Label>
                      <div className="mt-2 space-y-2">
                        <label className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="dayType-lokaler" 
                            value="full" 
                            checked={formData.availability.day.type === 'full'} 
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              availability: { 
                                ...formData.availability, 
                                day: { ...formData.availability.day, type: 'full' as const } 
                              } 
                            })} 
                          />
                          <span className="text-sm">Hel dag</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              name="dayType-lokaler" 
                              value="custom" 
                              checked={formData.availability.day.type === 'custom'} 
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                availability: { 
                                  ...formData.availability, 
                                  day: { ...formData.availability.day, type: 'custom' as const } 
                                } 
                              })} 
                            />
                            <span className="text-sm">Dagsintervall:</span>
                          </label>
                          <Input 
                            type="time" 
                            value={formData.availability.day.fromTime} 
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              availability: { 
                                ...formData.availability, 
                                day: { ...formData.availability.day, fromTime: e.target.value } 
                              } 
                            })} 
                            className="w-32" 
                            disabled={formData.availability.day.type !== 'custom'}
                          />
                          <span className="text-stone-500">til</span>
                          <Input 
                            type="time" 
                            value={formData.availability.day.toTime} 
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              availability: { 
                                ...formData.availability, 
                                day: { ...formData.availability.day, toTime: e.target.value } 
                              } 
                            })} 
                            className="w-32" 
                            disabled={formData.availability.day.type !== 'custom'}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <Separator />
                  {(formData.availability.availabilityType === 'timeInterval' || formData.availability.availabilityType === 'day') && (
                    <div>
                      <Label>Åpningstider {((formData.availability.availabilityType === 'timeInterval' 
                        ? formData.availability.timeInterval.openingHours.filter(h => h.active).length === 0
                        : formData.availability.day.openingHours.filter(h => h.active).length === 0) 
                        && !formData.availability.presentationOnly) && <span className="text-red-600">*</span>}</Label>
                      <div className="mt-2 space-y-2">
                        {['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'].map((day) => {
                          const openingHours = formData.availability.availabilityType === 'timeInterval' 
                            ? formData.availability.timeInterval.openingHours 
                            : formData.availability.day.openingHours
                          const openingHour = openingHours.find(h => h.day === day) || { day, active: false, from: '08:00', to: '22:00' }
                          return (
                            <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
                              <label className="flex items-center gap-2 min-w-[100px]">
                                <input 
                                  type="checkbox" 
                                  checked={openingHour.active} 
                                  onChange={(e) => {
                                    const currentHours = formData.availability.availabilityType === 'timeInterval'
                                      ? formData.availability.timeInterval.openingHours
                                      : formData.availability.day.openingHours
                                    if (e.target.checked) {
                                      const updated = [...currentHours.filter(h => h.day !== day), { day, active: true, from: '08:00', to: '22:00' }]
                                      if (formData.availability.availabilityType === 'timeInterval') {
                                        setFormData({ 
                                          ...formData, 
                                          availability: { 
                                            ...formData.availability, 
                                            timeInterval: { ...formData.availability.timeInterval, openingHours: updated } 
                                          } 
                                        })
                                      } else {
                                        setFormData({ 
                                          ...formData, 
                                          availability: { 
                                            ...formData.availability, 
                                            day: { ...formData.availability.day, openingHours: updated } 
                                          } 
                                        })
                                      }
                                    } else {
                                      const updated = currentHours.filter(h => h.day !== day)
                                      if (formData.availability.availabilityType === 'timeInterval') {
                                        setFormData({ 
                                          ...formData, 
                                          availability: { 
                                            ...formData.availability, 
                                            timeInterval: { ...formData.availability.timeInterval, openingHours: updated } 
                                          } 
                                        })
                                      } else {
                                        setFormData({ 
                                          ...formData, 
                                          availability: { 
                                            ...formData.availability, 
                                            day: { ...formData.availability.day, openingHours: updated } 
                                          } 
                                        })
                                      }
                                    }
                                  }} 
                                  className="rounded" 
                                />
                                <span className="text-sm">{day}</span>
                              </label>
                              {openingHour.active && (
                                <div className="flex items-center gap-2 flex-1">
                                  <Input 
                                    type="time" 
                                    value={openingHour.from} 
                                    onChange={(e) => {
                                      const currentHours = formData.availability.availabilityType === 'timeInterval'
                                        ? formData.availability.timeInterval.openingHours
                                        : formData.availability.day.openingHours
                                      const updated = currentHours.map(h => h.day === day ? { ...h, from: e.target.value } : h)
                                      if (formData.availability.availabilityType === 'timeInterval') {
                                        setFormData({ 
                                          ...formData, 
                                          availability: { 
                                            ...formData.availability, 
                                            timeInterval: { ...formData.availability.timeInterval, openingHours: updated } 
                                          } 
                                        })
                                      } else {
                                        setFormData({ 
                                          ...formData, 
                                          availability: { 
                                            ...formData.availability, 
                                            day: { ...formData.availability.day, openingHours: updated } 
                                          } 
                                        })
                                      }
                                    }} 
                                    className="w-32" 
                                  />
                                  <span className="text-stone-500">til</span>
                                  <Input 
                                    type="time" 
                                    value={openingHour.to} 
                                    onChange={(e) => {
                                      const currentHours = formData.availability.availabilityType === 'timeInterval'
                                        ? formData.availability.timeInterval.openingHours
                                        : formData.availability.day.openingHours
                                      const updated = currentHours.map(h => h.day === day ? { ...h, to: e.target.value } : h)
                                      if (formData.availability.availabilityType === 'timeInterval') {
                                        setFormData({ 
                                          ...formData, 
                                          availability: { 
                                            ...formData.availability, 
                                            timeInterval: { ...formData.availability.timeInterval, openingHours: updated } 
                                          } 
                                        })
                                      } else {
                                        setFormData({ 
                                          ...formData, 
                                          availability: { 
                                            ...formData.availability, 
                                            day: { ...formData.availability.day, openingHours: updated } 
                                          } 
                                        })
                                      }
                                    }} 
                                    className="w-32" 
                                  />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={formData.availability.presentationOnly} onChange={(e) => setFormData({ ...formData, availability: { ...formData.availability, presentationOnly: e.target.checked } })} className="rounded" />
                      <span className="text-sm">Ingen aktiv kalender, kun presentasjon</span>
                    </label>
                  </div>
                  <Separator />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Unntak og sperringer</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({
                          ...formData,
                          availability: {
                            ...formData.availability,
                            exceptions: [...formData.availability.exceptions, { fromDate: '', toDate: '', fromTime: '', toTime: '', reason: '', visible: true, repeating: false }]
                          }
                        })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Legg til sperring
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {formData.availability.exceptions.map((exception, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Fra dato</Label>
                              <Input
                                type="date"
                                value={exception.fromDate}
                                onChange={(e) => {
                                  const updated = formData.availability.exceptions.map((ex, i) =>
                                    i === index ? { ...ex, fromDate: e.target.value } : ex
                                  )
                                  setFormData({ ...formData, availability: { ...formData.availability, exceptions: updated } })
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Til dato</Label>
                              <Input
                                type="date"
                                value={exception.toDate}
                                onChange={(e) => {
                                  const updated = formData.availability.exceptions.map((ex, i) =>
                                    i === index ? { ...ex, toDate: e.target.value } : ex
                                  )
                                  setFormData({ ...formData, availability: { ...formData.availability, exceptions: updated } })
                                }}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Fra klokkeslett (valgfri)</Label>
                              <Input
                                type="time"
                                value={exception.fromTime}
                                onChange={(e) => {
                                  const updated = formData.availability.exceptions.map((ex, i) =>
                                    i === index ? { ...ex, fromTime: e.target.value } : ex
                                  )
                                  setFormData({ ...formData, availability: { ...formData.availability, exceptions: updated } })
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Til klokkeslett (valgfri)</Label>
                              <Input
                                type="time"
                                value={exception.toTime}
                                onChange={(e) => {
                                  const updated = formData.availability.exceptions.map((ex, i) =>
                                    i === index ? { ...ex, toTime: e.target.value } : ex
                                  )
                                  setFormData({ ...formData, availability: { ...formData.availability, exceptions: updated } })
                                }}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">Årsak</Label>
                            <Input
                              value={exception.reason}
                              onChange={(e) => {
                                const updated = formData.availability.exceptions.map((ex, i) =>
                                  i === index ? { ...ex, reason: e.target.value } : ex
                                )
                                setFormData({ ...formData, availability: { ...formData.availability, exceptions: updated } })
                              }}
                              className="mt-1"
                              placeholder="F.eks. Vedlikehold, Stengt, Arrangement, Ferie"
                            />
                          </div>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={exception.visible}
                                onChange={(e) => {
                                  const updated = formData.availability.exceptions.map((ex, i) =>
                                    i === index ? { ...ex, visible: e.target.checked } : ex
                                  )
                                  setFormData({ ...formData, availability: { ...formData.availability, exceptions: updated } })
                                }}
                                className="rounded"
                              />
                              <span className="text-xs">Synlig for søker</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={exception.repeating}
                                onChange={(e) => {
                                  const updated = formData.availability.exceptions.map((ex, i) =>
                                    i === index ? { ...ex, repeating: e.target.checked } : ex
                                  )
                                  setFormData({ ...formData, availability: { ...formData.availability, exceptions: updated } })
                                }}
                                className="rounded"
                              />
                              <span className="text-xs">Gjentakende sperring</span>
                            </label>
                          </div>
                          {exception.repeating && (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">Periode</Label>
                                <select className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                                  <option>Ukentlig</option>
                                  <option>Månedlig</option>
                                </select>
                              </div>
                            </div>
                          )}
                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updated = formData.availability.exceptions.filter((_, i) => i !== index)
                                setFormData({ ...formData, availability: { ...formData.availability, exceptions: updated } })
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Slett
                            </Button>
                          </div>
                        </div>
                      ))}
                      {formData.availability.exceptions.length === 0 && (
                        <div className="p-4 border border-dashed rounded-lg text-center text-stone-500 text-sm">
                          Ingen sperringer lagt til ennå
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tidsregler */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="w-5 h-5" />
                    Tidsregler
                  </CardTitle>
                  <CardDescription>Buffer-tider, avbestilling og no-show regler</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Standard booking-lengde (min)</Label>
                      <Input
                        type="number"
                        value={formData.timeLogic.defaultBookingLength}
                        onChange={(e) => setFormData({ ...formData, timeLogic: { ...formData.timeLogic, defaultBookingLength: parseInt(e.target.value) || 60 } })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Minimum varighet (min)</Label>
                      <Input
                        type="number"
                        value={formData.timeLogic.minDuration}
                        onChange={(e) => setFormData({ ...formData, timeLogic: { ...formData.timeLogic, minDuration: parseInt(e.target.value) || 30 } })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Maksimum varighet (min)</Label>
                      <Input
                        type="number"
                        value={formData.timeLogic.maxDuration}
                        onChange={(e) => setFormData({ ...formData, timeLogic: { ...formData.timeLogic, maxDuration: parseInt(e.target.value) || 480 } })}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Buffer-tider (rigg/rydd)</Label>
                    <p className="text-xs text-stone-500 mb-2">Tid som legges til før og etter booking for klargjøring</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Buffer før (minutter)</Label>
                        <Input
                          type="number"
                          value={formData.timeLogic.bufferBefore}
                          onChange={(e) => setFormData({ ...formData, timeLogic: { ...formData.timeLogic, bufferBefore: parseInt(e.target.value) || 0 } })}
                          className="mt-1"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Buffer etter (minutter)</Label>
                        <Input
                          type="number"
                          value={formData.timeLogic.bufferAfter}
                          onChange={(e) => setFormData({ ...formData, timeLogic: { ...formData.timeLogic, bufferAfter: parseInt(e.target.value) || 0 } })}
                          className="mt-1"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Booking-frister</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label className="text-xs">Minimum ledetid (timer)</Label>
                        <Input
                          type="number"
                          value={formData.timeLogic.minLeadTime}
                          onChange={(e) => setFormData({ ...formData, timeLogic: { ...formData.timeLogic, minLeadTime: parseInt(e.target.value) || 24 } })}
                          className="mt-1"
                          placeholder="24"
                        />
                        <p className="text-xs text-stone-500 mt-1">Hvor tidlig i forveien må man booke</p>
                      </div>
                      <div>
                        <Label className="text-xs">Maksimum ledetid (dager)</Label>
                        <Input
                          type="number"
                          value={formData.timeLogic.maxLeadTime}
                          onChange={(e) => setFormData({ ...formData, timeLogic: { ...formData.timeLogic, maxLeadTime: parseInt(e.target.value) || 90 } })}
                          className="mt-1"
                          placeholder="90"
                        />
                        <p className="text-xs text-stone-500 mt-1">Hvor langt frem i tid kan man booke</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Avbestillingsregler</Label>
                    <div className="mt-2 space-y-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Avbestillingsfrist (timer før)</Label>
                          <Input
                            type="number"
                            value={formData.timeLogic.cancellationRules.cutoffHours}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              timeLogic: { 
                                ...formData.timeLogic, 
                                cancellationRules: { ...formData.timeLogic.cancellationRules, cutoffHours: parseInt(e.target.value) || 24 } 
                              } 
                            })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Refusjonspolicy</Label>
                          <select
                            value={formData.timeLogic.cancellationRules.refundPolicy}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              timeLogic: { 
                                ...formData.timeLogic, 
                                cancellationRules: { ...formData.timeLogic.cancellationRules, refundPolicy: e.target.value as 'full' | 'partial' | 'none' } 
                              } 
                            })}
                            className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                          >
                            <option value="full">Full refusjon</option>
                            <option value="partial">Delvis refusjon</option>
                            <option value="none">Ingen refusjon</option>
                          </select>
                        </div>
                      </div>
                      {formData.timeLogic.cancellationRules.refundPolicy === 'partial' && (
                        <div>
                          <Label className="text-xs">Refusjonsprosent</Label>
                          <Input
                            type="number"
                            value={formData.timeLogic.cancellationRules.refundPercentage}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              timeLogic: { 
                                ...formData.timeLogic, 
                                cancellationRules: { ...formData.timeLogic.cancellationRules, refundPercentage: parseInt(e.target.value) || 50 } 
                              } 
                            })}
                            className="mt-1"
                            max={100}
                            min={0}
                          />
                        </div>
                      )}
                      <div>
                        <Label className="text-xs">Gebyr for sen avbestilling (kr)</Label>
                        <Input
                          type="number"
                          value={formData.timeLogic.cancellationRules.lateCancellationFee}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            timeLogic: { 
                              ...formData.timeLogic, 
                              cancellationRules: { ...formData.timeLogic.cancellationRules, lateCancellationFee: parseInt(e.target.value) || 0 } 
                            } 
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>No-show regler</Label>
                    <div className="mt-2 space-y-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">No-show gebyr (kr)</Label>
                          <Input
                            type="number"
                            value={formData.timeLogic.noShowRules.fee}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              timeLogic: { 
                                ...formData.timeLogic, 
                                noShowRules: { ...formData.timeLogic.noShowRules, fee: parseInt(e.target.value) || 0 } 
                              } 
                            })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Konsekvens ved gjentatte no-shows</Label>
                          <select
                            value={formData.timeLogic.noShowRules.consequenceAction}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              timeLogic: { 
                                ...formData.timeLogic, 
                                noShowRules: { ...formData.timeLogic.noShowRules, consequenceAction: e.target.value as 'none' | 'warning' | 'block' | 'fee' } 
                              } 
                            })}
                            className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                          >
                            <option value="none">Ingen konsekvens</option>
                            <option value="warning">Advarsel</option>
                            <option value="block">Blokker bruker</option>
                            <option value="fee">Gebyr</option>
                          </select>
                        </div>
                      </div>
                      {formData.timeLogic.noShowRules.consequenceAction === 'block' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs">Antall no-shows før blokkering</Label>
                            <Input
                              type="number"
                              value={formData.timeLogic.noShowRules.warningCount}
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                timeLogic: { 
                                  ...formData.timeLogic, 
                                  noShowRules: { ...formData.timeLogic.noShowRules, warningCount: parseInt(e.target.value) || 3 } 
                                } 
                              })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Blokkeringsvarighet (dager)</Label>
                            <Input
                              type="number"
                              value={formData.timeLogic.noShowRules.blockDurationDays}
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                timeLogic: { 
                                  ...formData.timeLogic, 
                                  noShowRules: { ...formData.timeLogic.noShowRules, blockDurationDays: parseInt(e.target.value) || 30 } 
                                } 
                              })}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              </>
            )}

            {/* Lokaler: Step 3 - Regler */}
            {selectedCategory === 'lokaler' && currentStep === 3 && (
              <>
              {/* Målgruppe og synlighet */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Målgruppe og synlighet
                  </CardTitle>
                  <CardDescription>Definer hvem som kan se og booke dette objektet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Synlighet</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {[
                        { value: 'public', label: 'Offentlig (alle)', description: 'Synlig for alle i katalogen' },
                        { value: 'organization', label: 'Lag og foreninger', description: 'Kun for registrerte organisasjoner' },
                        { value: 'internal', label: 'Intern', description: 'Kun for kommunens ansatte' },
                        { value: 'admin_only', label: 'Kun admin', description: 'Skjult fra katalogen' }
                      ].map(({ value, label, description }) => (
                        <label 
                          key={value}
                          className={`flex items-start gap-2 p-3 border rounded-lg cursor-pointer ${
                            formData.audience.visibility.includes(value as typeof formData.audience.visibility[number])
                              ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
                              : 'border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={formData.audience.visibility.includes(value as typeof formData.audience.visibility[number])}
                            onChange={(e) => {
                              const current = formData.audience.visibility
                              const updated = e.target.checked 
                                ? [...current, value as typeof formData.audience.visibility[number]]
                                : current.filter(v => v !== value)
                              setFormData({ ...formData, audience: { ...formData.audience, visibility: updated } })
                            }}
                            className="mt-1 rounded"
                          />
                          <div>
                            <div className="font-medium text-sm">{label}</div>
                            <div className="text-xs text-stone-500">{description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Hvem kan booke</Label>
                    <div className="mt-2 space-y-2">
                      {['Innbygger (privatperson)', 'Lag og forening', 'Bedrift/næringsliv', 'Kommunale enheter'].map((group) => (
                        <label key={group} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.audience.bookableBy.includes(group)}
                            onChange={(e) => {
                              const current = formData.audience.bookableBy
                              const updated = e.target.checked 
                                ? [...current, group]
                                : current.filter(g => g !== group)
                              setFormData({ ...formData, audience: { ...formData.audience, bookableBy: updated } })
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{group}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Restriksjoner</Label>
                    <div className="mt-2 space-y-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.audience.restrictions.requireOrgNumber}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            audience: { 
                              ...formData.audience, 
                              restrictions: { ...formData.audience.restrictions, requireOrgNumber: e.target.checked } 
                            } 
                          })}
                          className="rounded"
                        />
                        <span className="text-sm">Krev organisasjonsnummer</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.audience.restrictions.requireResponsibleAdult}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            audience: { 
                              ...formData.audience, 
                              restrictions: { ...formData.audience.restrictions, requireResponsibleAdult: e.target.checked } 
                            } 
                          })}
                          className="rounded"
                        />
                        <span className="text-sm">Krev ansvarlig voksen (over 18 år)</span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Minimum alder</Label>
                          <Input
                            type="number"
                            value={formData.audience.restrictions.minAge || ''}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              audience: { 
                                ...formData.audience, 
                                restrictions: { ...formData.audience.restrictions, minAge: e.target.value ? parseInt(e.target.value) : null } 
                              } 
                            })}
                            className="mt-1"
                            placeholder="Ingen grense"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Maksimum alder</Label>
                          <Input
                            type="number"
                            value={formData.audience.restrictions.maxAge || ''}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              audience: { 
                                ...formData.audience, 
                                restrictions: { ...formData.audience.restrictions, maxAge: e.target.value ? parseInt(e.target.value) : null } 
                              } 
                            })}
                            className="mt-1"
                            placeholder="Ingen grense"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Verifiseringsnivå</Label>
                        <select
                          value={formData.audience.restrictions.verificationLevel}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            audience: { 
                              ...formData.audience, 
                              restrictions: { ...formData.audience.restrictions, verificationLevel: e.target.value as 'none' | 'basic' | 'strong' } 
                            } 
                          })}
                          className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        >
                          <option value="none">Ingen (innlogging ikke påkrevd)</option>
                          <option value="basic">Grunnleggende (innlogging)</option>
                          <option value="strong">Sterk (BankID/MinID)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Regler og godkjenning */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5" />
                    Regler og godkjenning
                  </CardTitle>
                  <CardDescription>Definer godkjenning, begrensninger og paraplyorganisasjon-disponering</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Godkjenning {!formData.rules.approvalMode && <span className="text-red-600">*</span>}</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="approvalMode" value="automatic" checked={formData.rules.approvalMode === 'automatic'} onChange={(e) => setFormData({ ...formData, rules: { ...formData.rules, approvalMode: e.target.value } })} />
                        <div>
                          <div className="font-medium">Automatisk bekreftelse</div>
                          <div className="text-xs text-stone-500">Bookinger godkjennes automatisk</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="approvalMode" value="manual" checked={formData.rules.approvalMode === 'manual'} onChange={(e) => setFormData({ ...formData, rules: { ...formData.rules, approvalMode: e.target.value } })} />
                        <div>
                          <div className="font-medium">Krever saksbehandlergodkjenning</div>
                          <div className="text-xs text-stone-500">Alle bookinger må godkjennes manuelt</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="approvalMode" value="partial" checked={formData.rules.approvalMode === 'partial'} onChange={(e) => setFormData({ ...formData, rules: { ...formData.rules, approvalMode: e.target.value } })} />
                        <div>
                          <div className="font-medium">Delvis godkjenning (regelstyrt)</div>
                          <div className="text-xs text-stone-500">Godkjenning basert på regler</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {formData.rules.approvalMode === 'partial' && (
                    <div>
                      <Label>Regler ved delvis godkjenning</Label>
                      <div className="mt-2 space-y-4">
                        <div>
                          <Label className="text-xs mb-2 block">Målgruppe-regler</Label>
                          <div className="space-y-2">
                            {['Barn/unge', 'Ideell', 'Kommersiell'].map((group) => {
                              const rule = formData.rules.approvalRules.targetGroupRules.find(r => r.group === group)
                              return (
                                <div key={group} className="flex items-center gap-4 p-2 border rounded">
                                  <span className="text-sm min-w-[100px]">{group}:</span>
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`group-${group}`}
                                      value="automatic"
                                      checked={rule?.mode === 'automatic'}
                                      onChange={(e) => {
                                        const existing = formData.rules.approvalRules.targetGroupRules.filter(r => r.group !== group)
                                        setFormData({
                                          ...formData,
                                          rules: {
                                            ...formData.rules,
                                            approvalRules: {
                                              ...formData.rules.approvalRules,
                                              targetGroupRules: [...existing, { group, mode: e.target.value }]
                                            }
                                          }
                                        })
                                      }}
                                    />
                                    <span className="text-xs">Automatisk</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`group-${group}`}
                                      value="manual"
                                      checked={rule?.mode === 'manual'}
                                      onChange={(e) => {
                                        const existing = formData.rules.approvalRules.targetGroupRules.filter(r => r.group !== group)
                                        setFormData({
                                          ...formData,
                                          rules: {
                                            ...formData.rules,
                                            approvalRules: {
                                              ...formData.rules.approvalRules,
                                              targetGroupRules: [...existing, { group, mode: e.target.value }]
                                            }
                                          }
                                        })
                                      }}
                                    />
                                    <span className="text-xs">Manuell</span>
                                  </label>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator />
                  <div>
                    <Label>Begrensninger</Label>
                    <div className="mt-2 space-y-4">
                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded"
                          />
                          <div>
                            <div className="text-sm font-medium">Booking ikke skal utføres av personer under 18 år</div>
                            <div className="text-xs text-stone-500">Anbefalt for lokaler som krever ansvarlig voksen ved booking</div>
                          </div>
                        </label>
                      </div>
                      <div>
                        <Label className="text-xs">Avbestillingsfrist (timer før start)</Label>
                        <Input
                          type="number"
                          value={formData.rules.restrictions.cancellationDeadline}
                          onChange={(e) => setFormData({ ...formData, rules: { ...formData.rules, restrictions: { ...formData.rules.restrictions, cancellationDeadline: e.target.value } } })}
                          className="mt-1"
                          placeholder="F.eks. 24"
                        />
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label>Paraplyorganisasjon-disponering (valgfri, men viktig for Skien)</Label>
                    <div className="mt-2 space-y-4">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.rules.umbrellaDisposal.allowed} onChange={(e) => setFormData({ ...formData, rules: { ...formData.rules, umbrellaDisposal: { ...formData.rules.umbrellaDisposal, allowed: e.target.checked } } })} className="rounded" />
                        <span className="text-sm">Tillat paraplyorganisasjon å disponere tider</span>
                      </label>
                      {formData.rules.umbrellaDisposal.allowed && (
                        <>
                          <div>
                            <Label className="text-xs">Velg paraplyorganisasjon(er)</Label>
                            <Input placeholder="Søk organisasjoner..." className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-xs">Kvote/rammetid pr uke (timer)</Label>
                            <Input type="number" className="mt-1" />
                          </div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={formData.rules.umbrellaDisposal.canDistributeToSubclubs} onChange={(e) => setFormData({ ...formData, rules: { ...formData.rules, umbrellaDisposal: { ...formData.rules.umbrellaDisposal, canDistributeToSubclubs: e.target.checked } } })} className="rounded" />
                            <span className="text-sm">Kan fordele til underklubber</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={formData.rules.umbrellaDisposal.canLockTimes} onChange={(e) => setFormData({ ...formData, rules: { ...formData.rules, umbrellaDisposal: { ...formData.rules.umbrellaDisposal, canLockTimes: e.target.checked } } })} className="rounded" />
                            <span className="text-sm">Kan låse tider i kalender</span>
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dokumentkrav og vilkår */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Dokumentkrav og vilkår
                  </CardTitle>
                  <CardDescription>Krav til dokumenter og vilkårsaksept</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Påkrevde dokumenter fra leietaker</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({
                          ...formData,
                          workflow: {
                            ...formData.workflow,
                            documentRequirements: [...formData.workflow.documentRequirements, { id: `doc-${Date.now()}`, name: '', type: '', required: false, description: '' }]
                          }
                        })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Legg til krav
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {formData.workflow.documentRequirements.map((doc, index) => (
                        <div key={doc.id || index} className="p-4 border rounded-lg space-y-3">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label className="text-xs">Dokumentnavn</Label>
                              <Input
                                value={doc.name}
                                onChange={(e) => {
                                  const updated = formData.workflow.documentRequirements.map((d, i) => 
                                    i === index ? { ...d, name: e.target.value } : d
                                  )
                                  setFormData({ ...formData, workflow: { ...formData.workflow, documentRequirements: updated } })
                                }}
                                className="mt-1"
                                placeholder="F.eks. Skjenkebevilling"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Type</Label>
                              <select
                                value={doc.type}
                                onChange={(e) => {
                                  const updated = formData.workflow.documentRequirements.map((d, i) => 
                                    i === index ? { ...d, type: e.target.value } : d
                                  )
                                  setFormData({ ...formData, workflow: { ...formData.workflow, documentRequirements: updated } })
                                }}
                                className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                              >
                                <option value="">Velg type...</option>
                                <option value="permit">Tillatelse</option>
                                <option value="insurance">Forsikring</option>
                                <option value="certificate">Sertifikat</option>
                                <option value="plan">Plan/tegning</option>
                                <option value="other">Annet</option>
                              </select>
                            </div>
                            <div className="flex items-end gap-2">
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={doc.required}
                                  onChange={(e) => {
                                    const updated = formData.workflow.documentRequirements.map((d, i) => 
                                      i === index ? { ...d, required: e.target.checked } : d
                                    )
                                    setFormData({ ...formData, workflow: { ...formData.workflow, documentRequirements: updated } })
                                  }}
                                  className="rounded"
                                />
                                <span className="text-xs">Påkrevd</span>
                              </label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updated = formData.workflow.documentRequirements.filter((_, i) => i !== index)
                                  setFormData({ ...formData, workflow: { ...formData.workflow, documentRequirements: updated } })
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">Beskrivelse</Label>
                            <Input
                              value={doc.description}
                              onChange={(e) => {
                                const updated = formData.workflow.documentRequirements.map((d, i) => 
                                  i === index ? { ...d, description: e.target.value } : d
                                )
                                setFormData({ ...formData, workflow: { ...formData.workflow, documentRequirements: updated } })
                              }}
                              className="mt-1"
                              placeholder="Beskriv når og hvorfor dette dokumentet kreves"
                            />
                          </div>
                        </div>
                      ))}
                      {formData.workflow.documentRequirements.length === 0 && (
                        <div className="p-4 border border-dashed rounded-lg text-center text-stone-500 text-sm">
                          Ingen dokumentkrav lagt til
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Vilkårsaksept</Label>
                    <div className="mt-2 space-y-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.workflow.termsAcceptance.required}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            workflow: { 
                              ...formData.workflow, 
                              termsAcceptance: { ...formData.workflow.termsAcceptance, required: e.target.checked } 
                            } 
                          })}
                          className="rounded"
                        />
                        <span className="text-sm">Krev aksept av vilkår ved booking</span>
                      </label>

                      {formData.workflow.termsAcceptance.required && (
                        <div className="space-y-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
                          <div>
                            <Label className="text-xs">Vilkårdokument URL</Label>
                            <Input
                              value={formData.workflow.termsAcceptance.documentUrl}
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                workflow: { 
                                  ...formData.workflow, 
                                  termsAcceptance: { ...formData.workflow.termsAcceptance, documentUrl: e.target.value } 
                                } 
                              })}
                              className="mt-1"
                              placeholder="https://..."
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={formData.workflow.termsAcceptance.signatureRequired}
                                onChange={(e) => setFormData({ 
                                  ...formData, 
                                  workflow: { 
                                    ...formData.workflow, 
                                    termsAcceptance: { ...formData.workflow.termsAcceptance, signatureRequired: e.target.checked } 
                                  } 
                                })}
                                className="rounded"
                              />
                              <span className="text-xs">Krev signatur</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={formData.workflow.termsAcceptance.digitalSignature}
                                onChange={(e) => setFormData({ 
                                  ...formData, 
                                  workflow: { 
                                    ...formData.workflow, 
                                    termsAcceptance: { ...formData.workflow.termsAcceptance, digitalSignature: e.target.checked } 
                                  } 
                                })}
                                className="rounded"
                              />
                              <span className="text-xs">Digital signatur (BankID)</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              </>
            )}

            {/* Lokaler: Step 4 - Pris og betaling */}
            {selectedCategory === 'lokaler' && currentStep === 4 && (
              <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Pris og betaling
                  </CardTitle>
                  <CardDescription>Kommunal prisstyring, betalingsmetoder og vilkår</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Gratis eller betalt</Label>
                    <div className="mt-2 flex gap-4">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="isFree" checked={formData.pricing.isFree} onChange={() => setFormData({ ...formData, pricing: { ...formData.pricing, isFree: true } })} />
                        <span>Gratis (uavhengig av målgruppe og formål)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="isFree" checked={!formData.pricing.isFree} onChange={() => setFormData({ ...formData, pricing: { ...formData.pricing, isFree: false } })} />
                        <span>Betalt</span>
                      </label>
                    </div>
                  </div>
                  {!formData.pricing.isFree && (
                    <>
                      <div>
                        <Label htmlFor="priceModel">Prismodell {!formData.pricing.priceModel && <span className="text-red-600">*</span>}</Label>
                        <select id="priceModel" value={formData.pricing.priceModel} onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, priceModel: e.target.value } })} className="mt-2 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                          <option value="">Velg prismodell</option>
                          <option value="per-hour">Pris per time</option>
                          <option value="per-day">Pris per dag</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="vat">MVA prosent (standard)</Label>
                          <Input id="vat" type="number" value={formData.pricing.vat} onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, vat: e.target.value } })} className="mt-2" placeholder="25" />
                        </div>
                        <div>
                          <Label htmlFor="feeCode">Avgiftskode (for faktura/regnskap)</Label>
                          <Input id="feeCode" value={formData.pricing.feeCode} onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, feeCode: e.target.value } })} className="mt-2" placeholder="F.eks. 1234" />
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Målgrupper (kommunekjerne)</Label>
                          <Button variant="outline" size="sm" onClick={() => setFormData({ ...formData, pricing: { ...formData.pricing, targetGroups: [...formData.pricing.targetGroups, { id: `tg-${Date.now()}`, group: '', price: 0, free: false, discountPercent: 0 }] } })}>
                            <Plus className="w-4 h-4 mr-2" />
                            Legg til målgruppe-linje
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {formData.pricing.targetGroups.map((tg, index) => (
                            <div key={tg.id || index} className="p-4 border rounded-lg w-full">
                              <div className="grid grid-cols-4 gap-4 items-end">
                                <div className="flex-1">
                                  <Label className="text-xs">Målgruppe</Label>
                                  <select
                                    value={tg.group}
                                    onChange={(e) => {
                                      const updated = formData.pricing.targetGroups.map((item, i) =>
                                        i === index ? { ...item, group: e.target.value } : item
                                      )
                                      setFormData({ ...formData, pricing: { ...formData.pricing, targetGroups: updated } })
                                    }}
                                    className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                  >
                                    <option value="">Velg målgruppe</option>
                                    <option value="Standard">Standard</option>
                                    <option value="Ideell">Ideell / Lag og foreninger</option>
                                    <option value="Kommersiell">Kommersiell</option>
                                    <option value="Barn og unge">Barn og unge</option>
                                    <option value="Kommunal">Kommunale enheter</option>
                                  </select>
                                </div>
                                <div className="flex-1">
                                  <Label className="text-xs">Pris (kr)</Label>
                                  <Input
                                    type="number"
                                    value={tg.price}
                                    onChange={(e) => {
                                      const updated = formData.pricing.targetGroups.map((item, i) =>
                                        i === index ? { ...item, price: parseFloat(e.target.value) || 0 } : item
                                      )
                                      setFormData({ ...formData, pricing: { ...formData.pricing, targetGroups: updated } })
                                    }}
                                    className="mt-1 w-full"
                                  />
                                </div>
                                <div className="flex-1">
                                  <Label className="text-xs">Rabatt %</Label>
                                  <Input
                                    type="number"
                                    value={tg.discountPercent || ''}
                                    onChange={(e) => {
                                      const updated = formData.pricing.targetGroups.map((item, i) =>
                                        i === index ? { ...item, discountPercent: parseFloat(e.target.value) || 0 } : item
                                      )
                                      setFormData({ ...formData, pricing: { ...formData.pricing, targetGroups: updated } })
                                    }}
                                    className="mt-1 w-full"
                                    placeholder="0"
                                  />
                                </div>
                                <div className="flex items-end justify-end gap-3">
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={tg.free}
                                      onChange={(e) => {
                                        const updated = formData.pricing.targetGroups.map((item, i) =>
                                          i === index ? { ...item, free: e.target.checked } : item
                                        )
                                        setFormData({ ...formData, pricing: { ...formData.pricing, targetGroups: updated } })
                                      }}
                                      className="rounded"
                                    />
                                    <span className="text-xs">Gratis for målgruppen</span>
                                  </label>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const updated = formData.pricing.targetGroups.filter((_, i) => i !== index)
                                      setFormData({ ...formData, pricing: { ...formData.pricing, targetGroups: updated } })
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <label className="flex items-center gap-2 mt-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">"Kun definerte målgrupper kan bestille"</span>
                        </label>
                      </div>
                      <div>
                        <Label>Åpningstider med pris (dersom dere priser etter tidsrom)</Label>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs">Hverdager: pris</Label>
                            <Input type="number" value={formData.pricing.timeBasedPricing.weekdays} onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, timeBasedPricing: { ...formData.pricing.timeBasedPricing, weekdays: e.target.value } } })} className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-xs">Helg: pris</Label>
                            <Input type="number" value={formData.pricing.timeBasedPricing.weekend} onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, timeBasedPricing: { ...formData.pricing.timeBasedPricing, weekend: e.target.value } } })} className="mt-1" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {!formData.pricing.isFree && (
                    <>
                      <Separator />
                      <div>
                        <Label>Betalingsmetoder {formData.payment.methods.length === 0 && <span className="text-red-600">*</span>}</Label>
                        <div className="mt-2 space-y-2">
                          {['Faktura (EHF)', 'Kort', 'Vipps', 'Betaling utenfor systemet'].map((method) => (
                            <label key={method} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800">
                              <input type="checkbox" checked={formData.payment.methods.includes(method)} onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({ ...formData, payment: { ...formData.payment, methods: [...formData.payment.methods, method] } })
                                } else {
                                  setFormData({ ...formData, payment: { ...formData.payment, methods: formData.payment.methods.filter(m => m !== method) } })
                                }
                              }} className="rounded" />
                              <span className="text-sm">{method}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <Label>Konto-oppsett (betinget Må)</Label>
                        <div className="mt-2 space-y-4">
                          {formData.payment.methods.includes('Kort') && (
                            <div>
                              <Label className="text-xs">Hvis kort: velg mottakerkonto</Label>
                              <select className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                                <option>Velg konto</option>
                              </select>
                            </div>
                          )}
                          {formData.payment.methods.includes('Vipps') && (
                            <div>
                              <Label className="text-xs">Hvis Vipps: velg mottakerkonto / sales unit</Label>
                              <select className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                                <option>Velg konto</option>
                              </select>
                            </div>
                          )}
                          {formData.payment.methods.includes('Faktura (EHF)') && (
                            <div>
                              <Label className="text-xs">Hvis faktura: sett fakturamottaker-regel</Label>
                              <div className="mt-2 space-y-2">
                                <label className="flex items-center gap-2">
                                  <input type="radio" name="invoiceRecipient" value="organization" />
                                  <span className="text-sm">Organisasjon faktureres</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input type="radio" name="invoiceRecipient" value="private" />
                                  <span className="text-sm">Privatperson faktureres (kun hvis kommunen tillater)</span>
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}
                  <div>
                    <Label>Leiebetingelser (kommunekrav)</Label>
                    <div className="mt-2 space-y-4">
                      <div>
                        <Label className="text-xs mb-2 block">Last opp leiebetingelser (PDF) (anbefalt som krav før publisering)</Label>
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Last opp PDF
                        </Button>
                      </div>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.payment.terms.requireAcceptance} onChange={(e) => setFormData({ ...formData, payment: { ...formData.payment, terms: { ...formData.payment.terms, requireAcceptance: e.target.checked } } })} className="rounded" />
                        <span className="text-sm">Krev aksept ved bestilling</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.payment.terms.visibleOnReceipt} onChange={(e) => setFormData({ ...formData, payment: { ...formData.payment, terms: { ...formData.payment.terms, visibleOnReceipt: e.target.checked } } })} className="rounded" />
                        <span className="text-sm">Synlig på kvittering</span>
                      </label>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label>Identitetsnivå (valgfri, per lokale)</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.payment.identityLevel.requireLogin} onChange={(e) => setFormData({ ...formData, payment: { ...formData.payment, identityLevel: { ...formData.payment.identityLevel, requireLogin: e.target.checked } } })} className="rounded" />
                        <span className="text-sm">Krev innlogging for å bestille</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.payment.identityLevel.requireStrongAuth} onChange={(e) => setFormData({ ...formData, payment: { ...formData.payment, identityLevel: { ...formData.payment.identityLevel, requireStrongAuth: e.target.checked } } })} className="rounded" />
                        <span className="text-sm">Krev sterk autentisering (BankID/ID-porten)</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Depositum og gebyrer */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Depositum og gebyrer
                  </CardTitle>
                  <CardDescription>Sikkerhet for skade og ekstra kostnader</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={formData.pricing.deposit.required} 
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          pricing: { 
                            ...formData.pricing, 
                            deposit: { ...formData.pricing.deposit, required: e.target.checked } 
                          } 
                        })} 
                        className="rounded" 
                      />
                      <span className="text-sm font-medium">Krev depositum</span>
                    </label>
                  </div>

                  {formData.pricing.deposit.required && (
                    <div className="space-y-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Depositumbeløp (kr)</Label>
                          <Input
                            type="number"
                            value={formData.pricing.deposit.amount}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              pricing: { 
                                ...formData.pricing, 
                                deposit: { ...formData.pricing.deposit, amount: parseInt(e.target.value) || 0 } 
                              } 
                            })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Refusjonstid (dager etter arrangement)</Label>
                          <Input
                            type="number"
                            value={formData.pricing.deposit.refundTimeline}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              pricing: { 
                                ...formData.pricing, 
                                deposit: { ...formData.pricing.deposit, refundTimeline: parseInt(e.target.value) || 14 } 
                              } 
                            })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Triggere (når kreves depositum)</Label>
                        <div className="mt-2 space-y-2">
                          {['Alkoholservering', 'Over 50 personer', 'Privat arrangement', 'Kommersiell bruk'].map((trigger) => (
                            <label key={trigger} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={formData.pricing.deposit.triggers.includes(trigger)}
                                onChange={(e) => {
                                  const current = formData.pricing.deposit.triggers
                                  const updated = e.target.checked 
                                    ? [...current, trigger]
                                    : current.filter(t => t !== trigger)
                                  setFormData({ 
                                    ...formData, 
                                    pricing: { 
                                      ...formData.pricing, 
                                      deposit: { ...formData.pricing.deposit, triggers: updated } 
                                    } 
                                  })
                                }}
                                className="rounded"
                              />
                              <span className="text-sm">{trigger}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Refusjonsbetingelser</Label>
                        <textarea
                          value={formData.pricing.deposit.refundConditions}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            pricing: { 
                              ...formData.pricing, 
                              deposit: { ...formData.pricing.deposit, refundConditions: e.target.value } 
                            } 
                          })}
                          className="mt-1 w-full min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                          placeholder="F.eks. Depositum refunderes i sin helhet dersom lokalet leveres tilbake i samme stand..."
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Trekkeregler ved skade</Label>
                        <textarea
                          value={formData.pricing.deposit.deductionRules}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            pricing: { 
                              ...formData.pricing, 
                              deposit: { ...formData.pricing.deposit, deductionRules: e.target.value } 
                            } 
                          })}
                          className="mt-1 w-full min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                          placeholder="F.eks. Ved skade trekkes dokumentert kostnad fra depositum..."
                        />
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Tilleggsgebyrer</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({
                          ...formData,
                          pricing: {
                            ...formData.pricing,
                            fees: [...formData.pricing.fees, { id: `fee-${Date.now()}`, name: '', amount: 0, type: 'fixed', mandatory: false, conditions: '' }]
                          }
                        })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Legg til gebyr
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {formData.pricing.fees.map((fee, index) => (
                        <div key={fee.id || index} className="p-4 border rounded-lg space-y-3">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label className="text-xs">Navn på gebyr</Label>
                              <Input
                                value={fee.name}
                                onChange={(e) => {
                                  const updated = formData.pricing.fees.map((f, i) => 
                                    i === index ? { ...f, name: e.target.value } : f
                                  )
                                  setFormData({ ...formData, pricing: { ...formData.pricing, fees: updated } })
                                }}
                                className="mt-1"
                                placeholder="F.eks. Rengjøring"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Beløp</Label>
                              <Input
                                type="number"
                                value={fee.amount}
                                onChange={(e) => {
                                  const updated = formData.pricing.fees.map((f, i) => 
                                    i === index ? { ...f, amount: parseFloat(e.target.value) || 0 } : f
                                  )
                                  setFormData({ ...formData, pricing: { ...formData.pricing, fees: updated } })
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Type</Label>
                              <select
                                value={fee.type}
                                onChange={(e) => {
                                  const updated = formData.pricing.fees.map((f, i) => 
                                    i === index ? { ...f, type: e.target.value as 'fixed' | 'percentage' } : f
                                  )
                                  setFormData({ ...formData, pricing: { ...formData.pricing, fees: updated } })
                                }}
                                className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                              >
                                <option value="fixed">Fast beløp (kr)</option>
                                <option value="percentage">Prosent (%)</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={fee.mandatory}
                                onChange={(e) => {
                                  const updated = formData.pricing.fees.map((f, i) => 
                                    i === index ? { ...f, mandatory: e.target.checked } : f
                                  )
                                  setFormData({ ...formData, pricing: { ...formData.pricing, fees: updated } })
                                }}
                                className="rounded"
                              />
                              <span className="text-xs">Obligatorisk</span>
                            </label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updated = formData.pricing.fees.filter((_, i) => i !== index)
                                setFormData({ ...formData, pricing: { ...formData.pricing, fees: updated } })
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Slett
                            </Button>
                          </div>
                        </div>
                      ))}
                      {formData.pricing.fees.length === 0 && (
                        <div className="p-4 border border-dashed rounded-lg text-center text-stone-500 text-sm">
                          Ingen tilleggsgebyrer lagt til
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              </>
            )}

            {/* Lokaler: Step 5 - Publisering */}
            {selectedCategory === 'lokaler' && currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Publisering</CardTitle>
                  <CardDescription>Kontrollert aktivering med tydelig status og sjekkliste</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Publiseringsvalg</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="publishChoice" value="draft" checked={formData.publishing.choice === 'draft'} onChange={(e) => setFormData({ ...formData, publishing: { ...formData.publishing, choice: e.target.value } })} />
                        <div>
                          <div className="font-medium">Lagre som utkast</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="publishChoice" value="publish" checked={formData.publishing.choice === 'publish'} onChange={(e) => setFormData({ ...formData, publishing: { ...formData.publishing, choice: e.target.value } })} />
                        <div>
                          <div className="font-medium">Publiser og gjør tilgjengelig for utleie</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="publishChoice" value="presentation" checked={formData.publishing.choice === 'presentation'} onChange={(e) => setFormData({ ...formData, publishing: { ...formData.publishing, choice: e.target.value } })} />
                        <div>
                          <div className="font-medium">Ikke aktiv kalender, kun presentasjon</div>
                          <div className="text-xs text-stone-500">For lokaler som ikke skal bookes digitalt</div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label>Oppsummering før publisering</Label>
                    <div className="mt-2 p-4 bg-stone-100 dark:bg-stone-800 rounded-lg space-y-2 text-sm">
                      <div><span className="text-stone-500">Navn og adresse:</span> <span className="font-medium">{formData.locationAndBasis.name || 'Ikke satt'}, {formData.locationAndBasis.address || 'Ikke satt'}</span></div>
                      <div><span className="text-stone-500">Kategori:</span> <span className="font-medium">{selectedCategory === 'lokaler' ? 'Lokaler' : selectedCategory === 'sport' ? 'Sport' : selectedCategory === 'arrangementer' ? 'Arrangementer' : 'Torg'}</span></div>
                      <div><span className="text-stone-500">Leies ut per og intervall:</span> <span className="font-medium">{formData.availability.rentalUnit || 'Ikke satt'} / {formData.availability.interval || 'Ikke satt'}</span></div>
                      <div><span className="text-stone-500">Godkjenning:</span> <span className="font-medium">{formData.rules.approvalMode || 'Ikke satt'}</span></div>
                      <div><span className="text-stone-500">Pris og målgrupper:</span> <span className="font-medium">{formData.pricing.isFree ? 'Gratis' : formData.pricing.targetGroups.length > 0 ? `${formData.pricing.targetGroups.length} målgrupper` : 'Ikke satt'}</span></div>
                      <div><span className="text-stone-500">Betaling:</span> <span className="font-medium">{formData.payment.methods.join(', ') || 'Ikke satt'}</span></div>
                      <div><span className="text-stone-500">Vilkår:</span> <span className="font-medium">{formData.payment.terms.pdf ? 'PDF lastet opp' : 'Ikke lastet opp'}</span></div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label>Sjekkliste før publisering (automatisk)</Label>
                    <div className="mt-2 space-y-3">
                      <div>
                        <Label className="text-xs text-stone-500 uppercase mb-2 block">Må</Label>
                        <div className="space-y-1">
                          {publishingChecklist.required.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              {item.checked ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}
                              <span className={`text-sm ${item.checked ? 'text-stone-700 dark:text-stone-300' : 'text-red-600'}`}>
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-stone-500 uppercase mb-2 block">Anbefalt</Label>
                        <div className="space-y-1">
                          {publishingChecklist.recommended.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              {item.checked ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-amber-600" />
                              )}
                              <span className={`text-sm ${item.checked ? 'text-stone-700 dark:text-stone-300' : 'text-amber-600'}`}>
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={handlePublish} className="flex-1" disabled={!publishingChecklist.required.every(item => item.checked)}>
                      Publiser nå
                    </Button>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Vis offentlig side
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sport: Step 1 - Lokasjon */}
            {selectedCategory === 'sport' && currentStep === 1 && startChoice === 'new' && (
              <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Ressurstype og grunninfo
                  </CardTitle>
                  <CardDescription>Type ressurs og grunnleggende informasjon</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="subcategory-select-sport">Underkategori {!formData.subcategory.selected && <span className="text-red-600">*</span>}</Label>
                    <select
                      id="subcategory-select-sport"
                      value={formData.subcategory.selected || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        subcategory: { ...formData.subcategory, selected: e.target.value || null, custom: '' } 
                      })}
                      className="w-full mt-2 p-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    >
                      <option value="">Velg underkategori...</option>
                      {getSubcategories('sport').map((subcat) => (
                        <option key={subcat} value={subcat}>{subcat}</option>
                      ))}
                    </select>
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="sport-name">Navn på utleieobjekt {!formData.locationAndBasis.name && <span className="text-red-600">*</span>}</Label>
                    <Input
                      id="sport-name"
                      value={formData.locationAndBasis.name}
                      onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, name: e.target.value } })}
                      className="mt-2"
                      placeholder="F.eks. Padelbane 1"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="sport-address">Adresse {!formData.locationAndBasis.address && <span className="text-red-600">*</span>}</Label>
                      <Input
                        id="sport-address"
                        value={formData.locationAndBasis.address}
                        onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, address: e.target.value } })}
                        className="mt-2"
                        placeholder="Gateadresse"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sport-postal-code">Postnummer {!formData.locationAndBasis.postalCode && <span className="text-red-600">*</span>}</Label>
                      <Input
                        id="sport-postal-code"
                        value={formData.locationAndBasis.postalCode}
                        onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, postalCode: e.target.value } })}
                        className="mt-2"
                        placeholder="0000"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="sport-postal-area">Poststed {!formData.locationAndBasis.postalArea && <span className="text-red-600">*</span>}</Label>
                    <Input
                      id="sport-postal-area"
                      value={formData.locationAndBasis.postalArea}
                      onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, postalArea: e.target.value } })}
                      className="mt-2"
                      placeholder="By"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sport-description">Beskrivelse</Label>
                    <textarea
                      id="sport-description"
                      value={formData.locationAndBasis.longDescription}
                      onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, longDescription: e.target.value } })}
                      className="mt-2 w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      placeholder="Beskriv banen/fasiliteten"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Kontaktpersoner</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({
                          ...formData,
                          locationAndBasis: {
                            ...formData.locationAndBasis,
                            contacts: [...formData.locationAndBasis.contacts, { name: '', role: '', email: '', phone: '' }]
                          }
                        })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Legg til kontakt
                      </Button>
                    </div>
                    <div className="space-y-3 mt-2">
                      {formData.locationAndBasis.contacts.map((contact, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Navn</Label>
                              <Input value={contact.name} className="mt-1" />
                            </div>
                            <div>
                              <Label className="text-xs">Rolle</Label>
                              <select className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                                <option value="">Velg rolle</option>
                                <option value="drift">Drift</option>
                                <option value="nokkel">Nøkkel</option>
                                <option value="fagansvarlig">Fagansvarlig</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">E-post</Label>
                              <Input type="email" value={contact.email} className="mt-1" />
                            </div>
                            <div>
                              <Label className="text-xs">Telefon</Label>
                              <Input type="tel" value={contact.phone} className="mt-1" />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button variant="ghost" size="sm" onClick={() => {
                              const updated = formData.locationAndBasis.contacts.filter((_, i) => i !== index)
                              setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, contacts: updated } })
                            }}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Slett
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label>Fasiliteter (valgfri, men sterk anbefaling)</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {['Kjøkken', 'Garderobe', 'Dusj', 'Parkering', 'WiFi', 'Projektor/TV', 'Lydanlegg', 'Scene', 'Kiosk', 'Catering', 'Teleslynge', 'Toalett', 'Vertskap/betjening', 'Annet'].map((facility) => (
                        <label key={facility} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.properties.facilities.includes(facility)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, properties: { ...formData.properties, facilities: [...formData.properties.facilities, facility] } })
                              } else {
                                setFormData({ ...formData, properties: { ...formData.properties, facilities: formData.properties.facilities.filter(f => f !== facility) } })
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{facility}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label>Media</Label>
                    <div className="mt-2 space-y-3">
                      <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-stone-400" />
                        <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">Last opp bilder</p>
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Velg filer
                        </Button>
                      </div>
                      {formData.locationAndBasis.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {formData.locationAndBasis.images.map((img, index) => (
                            <div key={index} className="relative aspect-square border rounded-lg overflow-hidden">
                              <img src={img} alt={`Bilde ${index + 1}`} className="w-full h-full object-cover" />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-1 right-1"
                                onClick={() => {
                                  const updated = formData.locationAndBasis.images.filter((_, i) => i !== index)
                                  setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, images: updated } })
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ressurstype-valg */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Ressurstype
                  </CardTitle>
                  <CardDescription>Er dette en bane/fasilitet eller utstyr?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'court', label: 'Bane / Fasilitet', description: 'Tidsbasert booking (f.eks. padelbane, tennisbane)' },
                      { value: 'equipment', label: 'Utstyr', description: 'Antallsbasert utlån (f.eks. racket, ball)' }
                    ].map(({ value, label, description }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormData({ 
                          ...formData, 
                          sport: { ...formData.sport, resourceType: value as 'court' | 'equipment' } 
                        })}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          formData.sport.resourceType === value
                            ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
                            : 'border-stone-200 dark:border-stone-700 hover:border-stone-400'
                        }`}
                      >
                        <div className="font-medium">{label}</div>
                        <div className="text-xs text-stone-500 mt-1">{description}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Baneinfo (hvis bane) */}
              {formData.sport.resourceType === 'court' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Grid3X3 className="w-5 h-5" />
                      Baneinfo
                    </CardTitle>
                    <CardDescription>Detaljer om banen</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs">Underlag</Label>
                        <select
                          value={formData.sport.courtInfo.surface}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            sport: { ...formData.sport, courtInfo: { ...formData.sport.courtInfo, surface: e.target.value } } 
                          })}
                          className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        >
                          <option value="">Velg underlag...</option>
                          <option value="kunstgress">Kunstgress</option>
                          <option value="gress">Gress</option>
                          <option value="grus">Grus</option>
                          <option value="asfalt">Asfalt</option>
                          <option value="parkett">Parkett</option>
                          <option value="gummi">Gummi</option>
                          <option value="annet">Annet</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs">Lengde (m)</Label>
                        <Input
                          type="number"
                          value={formData.sport.courtInfo.dimensions.length}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            sport: { 
                              ...formData.sport, 
                              courtInfo: { 
                                ...formData.sport.courtInfo, 
                                dimensions: { ...formData.sport.courtInfo.dimensions, length: parseFloat(e.target.value) || 0 } 
                              } 
                            } 
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Bredde (m)</Label>
                        <Input
                          type="number"
                          value={formData.sport.courtInfo.dimensions.width}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            sport: { 
                              ...formData.sport, 
                              courtInfo: { 
                                ...formData.sport.courtInfo, 
                                dimensions: { ...formData.sport.courtInfo.dimensions, width: parseFloat(e.target.value) || 0 } 
                              } 
                            } 
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.sport.courtInfo.indoor}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              sport: { ...formData.sport, courtInfo: { ...formData.sport.courtInfo, indoor: e.target.checked } } 
                            })}
                            className="rounded"
                          />
                          <span className="text-sm">Innendørs</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.sport.courtInfo.lighting}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              sport: { ...formData.sport, courtInfo: { ...formData.sport.courtInfo, lighting: e.target.checked } } 
                            })}
                            className="rounded"
                          />
                          <span className="text-sm">Lysanlegg</span>
                        </label>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.sport.courtInfo.heatingAvailable}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              sport: { ...formData.sport, courtInfo: { ...formData.sport.courtInfo, heatingAvailable: e.target.checked } } 
                            })}
                            className="rounded"
                          />
                          <span className="text-sm">Oppvarming tilgjengelig</span>
                        </label>
                        {formData.sport.courtInfo.heatingAvailable && (
                          <label className="flex items-center gap-2 ml-6">
                            <input
                              type="checkbox"
                              checked={formData.sport.courtInfo.heatingIncluded}
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                sport: { ...formData.sport, courtInfo: { ...formData.sport.courtInfo, heatingIncluded: e.target.checked } } 
                              })}
                              className="rounded"
                            />
                            <span className="text-xs">Inkludert i prisen</span>
                          </label>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Utstyrsinfo (hvis utstyr) */}
              {formData.sport.resourceType === 'equipment' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Utstyrsinfo
                    </CardTitle>
                    <CardDescription>Detaljer om utstyret</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Antall enheter</Label>
                        <Input
                          type="number"
                          value={formData.sport.inventory.totalUnits}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            sport: { ...formData.sport, inventory: { ...formData.sport.inventory, totalUnits: parseInt(e.target.value) || 0 } } 
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Tilgjengelig nå</Label>
                        <Input
                          type="number"
                          value={formData.sport.inventory.availableUnits}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            sport: { ...formData.sport, inventory: { ...formData.sport.inventory, availableUnits: parseInt(e.target.value) || 0 } } 
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Beskrivelse av enhet</Label>
                      <Input
                        value={formData.sport.inventory.unitDescription}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          sport: { ...formData.sport, inventory: { ...formData.sport.inventory, unitDescription: e.target.value } } 
                        })}
                        className="mt-1"
                        placeholder="F.eks. 1 racket + 3 baller"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Tilstand</Label>
                      <select
                        value={formData.sport.condition.status}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          sport: { ...formData.sport, condition: { ...formData.sport.condition, status: e.target.value as 'new' | 'good' | 'fair' | 'poor' } } 
                        })}
                        className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                      >
                        <option value="new">Nytt</option>
                        <option value="good">God</option>
                        <option value="fair">OK</option>
                        <option value="poor">Dårlig</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Utlånsregler (for utstyr) */}
              {formData.sport.resourceType === 'equipment' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Utlånsregler
                    </CardTitle>
                    <CardDescription>Regler for utlån av utstyr</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Maks utlånstid (dager)</Label>
                        <Input
                          type="number"
                          value={formData.sport.loan.maxLoanDurationDays}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            sport: { ...formData.sport, loan: { ...formData.sport.loan, maxLoanDurationDays: parseInt(e.target.value) || 7 } } 
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Gebyr for sen retur (kr/dag)</Label>
                        <Input
                          type="number"
                          value={formData.sport.loan.lateReturnFeePerDay}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            sport: { ...formData.sport, loan: { ...formData.sport.loan, lateReturnFeePerDay: parseInt(e.target.value) || 0 } } 
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Hentested</Label>
                      <Input
                        value={formData.sport.loan.pickupLocation}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          sport: { ...formData.sport, loan: { ...formData.sport.loan, pickupLocation: e.target.value } } 
                        })}
                        className="mt-1"
                        placeholder="F.eks. Servicetorget"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Hentetider</Label>
                        <Input
                          value={formData.sport.loan.pickupHours}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            sport: { ...formData.sport, loan: { ...formData.sport.loan, pickupHours: e.target.value } } 
                          })}
                          className="mt-1"
                          placeholder="F.eks. 08:00-16:00"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Returfrist (tid)</Label>
                        <Input
                          value={formData.sport.loan.returnDeadlineTime}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            sport: { ...formData.sport, loan: { ...formData.sport.loan, returnDeadlineTime: e.target.value } } 
                          })}
                          className="mt-1"
                          placeholder="F.eks. 16:00"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              </>
            )}

            {/* Sport: Step 2 - Tilgjengelighet */}
            {selectedCategory === 'sport' && currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tilgjengelighet</CardTitle>
                  <CardDescription>Definer når objektet er tilgjengelig for booking (kun Tidsintervall)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Intervall {!formData.availability.timeInterval.interval && <span className="text-red-600">*</span>}</Label>
                    <select 
                      value={formData.availability.timeInterval.interval} 
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          availability: { 
                            ...formData.availability, 
                            availabilityType: 'timeInterval' as const,
                            timeInterval: { 
                              ...formData.availability.timeInterval, 
                              interval: e.target.value 
                            } 
                          } 
                        })
                      }} 
                      className="mt-2 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    >
                      <option value="">Velg intervall</option>
                      <option value="15">15 minutter</option>
                      <option value="30">30 minutter</option>
                      <option value="60">60 minutter</option>
                      <option value="custom">Tilpasset</option>
                    </select>
                  </div>
                  <Separator />
                  <div>
                    <Label>Åpningstider {formData.availability.timeInterval.openingHours.filter(h => h.active).length === 0 && !formData.availability.presentationOnly && <span className="text-red-600">*</span>}</Label>
                    <div className="mt-2 space-y-2">
                      {['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'].map((day) => {
                        const openingHours = formData.availability.timeInterval.openingHours
                        const openingHour = openingHours.find(h => h.day === day) || { day, active: false, from: '08:00', to: '22:00' }
                        return (
                          <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
                            <label className="flex items-center gap-2 min-w-[100px]">
                              <input 
                                type="checkbox" 
                                checked={openingHour.active} 
                                onChange={(e) => {
                                  const currentHours = formData.availability.timeInterval.openingHours
                                  if (e.target.checked) {
                                    const updated = [...currentHours.filter(h => h.day !== day), { day, active: true, from: '08:00', to: '22:00' }]
                                    setFormData({ 
                                      ...formData, 
                                      availability: { 
                                        ...formData.availability, 
                                        availabilityType: 'timeInterval' as const,
                                        timeInterval: { ...formData.availability.timeInterval, openingHours: updated } 
                                      } 
                                    })
                                  } else {
                                    const updated = currentHours.filter(h => h.day !== day)
                                    setFormData({ 
                                      ...formData, 
                                      availability: { 
                                        ...formData.availability, 
                                        timeInterval: { ...formData.availability.timeInterval, openingHours: updated } 
                                      } 
                                    })
                                  }
                                }} 
                                className="rounded" 
                              />
                              <span className="text-sm">{day}</span>
                            </label>
                            {openingHour.active && (
                              <div className="flex items-center gap-2 flex-1">
                                <Input 
                                  type="time" 
                                  value={openingHour.from} 
                                  onChange={(e) => {
                                    const currentHours = formData.availability.timeInterval.openingHours
                                    const updated = currentHours.map(h => h.day === day ? { ...h, from: e.target.value } : h)
                                    setFormData({ 
                                      ...formData, 
                                      availability: { 
                                        ...formData.availability, 
                                        timeInterval: { ...formData.availability.timeInterval, openingHours: updated } 
                                      } 
                                    })
                                  }} 
                                  className="w-32" 
                                />
                                <span className="text-stone-500">til</span>
                                <Input 
                                  type="time" 
                                  value={openingHour.to} 
                                  onChange={(e) => {
                                    const currentHours = formData.availability.timeInterval.openingHours
                                    const updated = currentHours.map(h => h.day === day ? { ...h, to: e.target.value } : h)
                                    setFormData({ 
                                      ...formData, 
                                      availability: { 
                                        ...formData.availability, 
                                        timeInterval: { ...formData.availability.timeInterval, openingHours: updated } 
                                      } 
                                    })
                                  }} 
                                  className="w-32" 
                                />
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={formData.availability.presentationOnly} 
                        onChange={(e) => setFormData({ ...formData, availability: { ...formData.availability, presentationOnly: e.target.checked } })} 
                        className="rounded" 
                      />
                      <span className="text-sm">Ingen aktiv kalender, kun presentasjon</span>
                    </label>
                  </div>
                  <div>
                    <Label>Lagerstatus</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="lagerstatus" value="available" />
                        <div>
                          <div className="font-medium">Tilgjengelig</div>
                          <div className="text-xs text-stone-500">Utstyret er klart for utleie</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="lagerstatus" value="limited" />
                        <div>
                          <div className="font-medium">Begrenset tilgjengelighet</div>
                          <div className="text-xs text-stone-500">Noen enheter er utilgjengelige</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="lagerstatus" value="maintenance" />
                        <div>
                          <div className="font-medium">Vedlikehold</div>
                          <div className="text-xs text-stone-500">Utstyret er under vedlikehold</div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label>Spesifikasjoner</Label>
                    <textarea
                      className="mt-2 w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      placeholder="Detaljerte spesifikasjoner, modell, størrelse, vekt, etc."
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sport: Step 3 - Regler */}
            {selectedCategory === 'sport' && currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Regler og godkjenning</CardTitle>
                  <CardDescription>Definer godkjenning og begrensninger</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Godkjenning {!formData.rules.approvalMode && <span className="text-red-600">*</span>}</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="approvalMode-sport" value="automatic" checked={formData.rules.approvalMode === 'automatic'} onChange={(e) => setFormData({ ...formData, rules: { ...formData.rules, approvalMode: e.target.value } })} />
                        <div>
                          <div className="font-medium">Automatisk bekreftelse</div>
                          <div className="text-xs text-stone-500">Bookinger godkjennes automatisk</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="approvalMode-sport" value="manual" checked={formData.rules.approvalMode === 'manual'} onChange={(e) => setFormData({ ...formData, rules: { ...formData.rules, approvalMode: e.target.value } })} />
                        <div>
                          <div className="font-medium">Krever saksbehandlergodkjenning</div>
                          <div className="text-xs text-stone-500">Alle bookinger må godkjennes manuelt</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sport: Step 3 - Regler */}
            {selectedCategory === 'sport' && currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Regler og godkjenning</CardTitle>
                  <CardDescription>Definer godkjenning og begrensninger</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Godkjenning {!formData.rules.approvalMode && <span className="text-red-600">*</span>}</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="sport-approval" value="automatic" checked={formData.rules.approvalMode === 'automatic'} onChange={(e) => setFormData({ ...formData, rules: { ...formData.rules, approvalMode: e.target.value } })} />
                        <div>
                          <div className="font-medium">Automatisk bekreftelse</div>
                          <div className="text-xs text-stone-500">Bookinger godkjennes automatisk</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="sport-approval" value="manual" checked={formData.rules.approvalMode === 'manual'} onChange={(e) => setFormData({ ...formData, rules: { ...formData.rules, approvalMode: e.target.value } })} />
                        <div>
                          <div className="font-medium">Krever saksbehandlergodkjenning</div>
                          <div className="text-xs text-stone-500">Alle bookinger må godkjennes manuelt</div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label>Begrensninger</Label>
                    <div className="mt-2 space-y-4">
                      <div>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <div>
                            <div className="text-sm font-medium">Booking ikke skal utføres av personer under 18 år</div>
                            <div className="text-xs text-stone-500">Anbefalt for utstyr som krever ansvarlig voksen</div>
                          </div>
                        </label>
                      </div>
                      <div>
                        <Label className="text-xs">Avbestillingsfrist (timer før start)</Label>
                        <Input
                          type="number"
                          value={formData.rules.restrictions.cancellationDeadline}
                          onChange={(e) => setFormData({ ...formData, rules: { ...formData.rules, restrictions: { ...formData.rules.restrictions, cancellationDeadline: e.target.value } } })}
                          className="mt-1"
                          placeholder="F.eks. 24"
                        />
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label>Returbetingelser</Label>
                    <div className="mt-2 space-y-4">
                      <div>
                        <Label className="text-xs">Returfrist (dager etter utleie)</Label>
                        <Input type="number" className="mt-1" placeholder="F.eks. 7" />
                      </div>
                      <div>
                        <Label className="text-xs">Skadeansvar</Label>
                        <textarea
                          className="mt-1 w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                          placeholder="Beskriv skadeansvar og hva som gjelder ved skade"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Utstyr: Step 5 - Pris/Depositum */}
            {/* Sport: Step 4 - Pris/Depositum */}
            {selectedCategory === 'sport' && currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pris/Depositum</CardTitle>
                  <CardDescription>Utleiepris, depositum og betalingsmetoder</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Gratis eller betalt</Label>
                    <div className="mt-2 flex gap-4">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="sport-isFree" checked={formData.pricing.isFree} onChange={() => setFormData({ ...formData, pricing: { ...formData.pricing, isFree: true } })} />
                        <span>Gratis</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="sport-isFree" checked={!formData.pricing.isFree} onChange={() => setFormData({ ...formData, pricing: { ...formData.pricing, isFree: false } })} />
                        <span>Betalt</span>
                      </label>
                    </div>
                  </div>
                  {!formData.pricing.isFree && (
                    <>
                      <div>
                        <Label htmlFor="sport-price">Utleiepris *</Label>
                        <Input
                          id="sport-price"
                          type="number"
                          value={formData.pricing.priceModel}
                          onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, priceModel: e.target.value } })}
                          className="mt-2"
                          placeholder="F.eks. 500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="sport-deposit">Depositum</Label>
                          <Input id="sport-deposit" type="number" className="mt-2" placeholder="F.eks. 1000" />
                        </div>
                        <div>
                          <Label htmlFor="sport-damage-fee">Skadeavgift</Label>
                          <Input id="sport-damage-fee" type="number" className="mt-2" placeholder="F.eks. 500" />
                        </div>
                      </div>
                      <div>
                        <Label>Betalingsmetoder {formData.payment.methods.length === 0 && <span className="text-red-600">*</span>}</Label>
                        <div className="mt-2 space-y-2">
                          {['Faktura (EHF)', 'Kort', 'Vipps'].map((method) => (
                            <label key={method} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800">
                              <input
                                type="checkbox"
                                checked={formData.payment.methods.includes(method)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({ ...formData, payment: { ...formData.payment, methods: [...formData.payment.methods, method] } })
                                  } else {
                                    setFormData({ ...formData, payment: { ...formData.payment, methods: formData.payment.methods.filter(m => m !== method) } })
                                  }
                                }}
                                className="rounded"
                              />
                              <span className="text-sm">{method}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div>
                    <Label>Vilkår</Label>
                    <div className="mt-2 space-y-4">
                      <div>
                        <Label className="text-xs mb-2 block">Last opp vilkår (PDF)</Label>
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Last opp PDF
                        </Button>
                      </div>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.payment.terms.requireAcceptance} onChange={(e) => setFormData({ ...formData, payment: { ...formData.payment, terms: { ...formData.payment.terms, requireAcceptance: e.target.checked } } })} className="rounded" />
                        <span className="text-sm">Krev aksept ved bestilling</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sport: Step 5 - Publisering */}
            {selectedCategory === 'sport' && currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Publisering</CardTitle>
                  <CardDescription>Kontrollert aktivering med tydelig status og sjekkliste</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Publiseringsvalg</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="sport-publish" value="draft" checked={formData.publishing.choice === 'draft'} onChange={(e) => setFormData({ ...formData, publishing: { ...formData.publishing, choice: e.target.value } })} />
                        <div className="font-medium">Lagre som utkast</div>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="sport-publish" value="publish" checked={formData.publishing.choice === 'publish'} onChange={(e) => setFormData({ ...formData, publishing: { ...formData.publishing, choice: e.target.value } })} />
                        <div className="font-medium">Publiser og gjør tilgjengelig for utleie</div>
                      </label>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label>Sjekkliste før publisering</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Navn og hentested</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Antall enheter</span>
                      </div>
                      {!formData.pricing.isFree && (
                        <>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Pris definert</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Betalingsmetode satt</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={handlePublish} className="flex-1" disabled={!formData.locationAndBasis.name || !formData.locationAndBasis.address}>
                      Publiser nå
                    </Button>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Vis offentlig side
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Arrangementer: Step 1 - Tidspunkter */}
            {selectedCategory === 'arrangementer' && currentStep === 1 && startChoice === 'new' && (
              <>
              {/* Grunninfo og arrangør */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Grunninfo og arrangør
                  </CardTitle>
                  <CardDescription>Grunnleggende informasjon og arrangørinformasjon</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="subcategory-select-arrangementer">Underkategori {!formData.subcategory.selected && <span className="text-red-600">*</span>}</Label>
                    <select
                      id="subcategory-select-arrangementer"
                      value={formData.subcategory.selected || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        subcategory: { ...formData.subcategory, selected: e.target.value || null, custom: '' } 
                      })}
                      className="w-full mt-2 p-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    >
                      <option value="">Velg underkategori...</option>
                      {getSubcategories('arrangementer').map((subcat) => (
                        <option key={subcat} value={subcat}>{subcat}</option>
                      ))}
                    </select>
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="arrangementer-name">Navn på arrangement {!formData.locationAndBasis.name && <span className="text-red-600">*</span>}</Label>
                    <Input
                      id="arrangementer-name"
                      value={formData.locationAndBasis.name}
                      onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, name: e.target.value } })}
                      className="mt-2"
                      placeholder="F.eks. Sommerfest 2024"
                    />
                  </div>
                  <div>
                    <Label htmlFor="arrangementer-description">Beskrivelse</Label>
                    <textarea
                      id="arrangementer-description"
                      value={formData.locationAndBasis.longDescription}
                      onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, longDescription: e.target.value } })}
                      className="mt-2 w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      placeholder="Beskriv arrangementet"
                    />
                  </div>
                  <div>
                    <Label>Datoer *</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex-1">
                          <Label className="text-xs">Fra dato</Label>
                          <Input type="date" className="mt-1" />
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs">Til dato</Label>
                          <Input type="date" className="mt-1" />
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Legg til dato
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Klokkeslett</Label>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Fra klokkeslett</Label>
                        <Input type="time" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Til klokkeslett</Label>
                        <Input type="time" className="mt-1" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Varighet</Label>
                    <Input type="text" className="mt-2" placeholder="F.eks. 2 timer" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Gjentakende arrangement</span>
                    </label>
                  </div>
                  <Separator />
                  <div>
                    <Label>Media</Label>
                    <div className="mt-2 space-y-3">
                      <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-stone-400" />
                        <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">Last opp bilder</p>
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Velg filer
                        </Button>
                      </div>
                      {formData.locationAndBasis.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {formData.locationAndBasis.images.map((img, index) => (
                            <div key={index} className="relative aspect-square border rounded-lg overflow-hidden">
                              <img src={img} alt={`Bilde ${index + 1}`} className="w-full h-full object-cover" />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-1 right-1"
                                onClick={() => {
                                  const updated = formData.locationAndBasis.images.filter((_, i) => i !== index)
                                  setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, images: updated } })
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Arrangør */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Arrangør
                  </CardTitle>
                  <CardDescription>Hvem er ansvarlig for arrangementet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Arrangørtype</Label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {[
                        { value: 'person', label: 'Privatperson' },
                        { value: 'organization', label: 'Organisasjon' },
                        { value: 'municipality', label: 'Kommunal enhet' }
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setFormData({ 
                            ...formData, 
                            arrangementer: { 
                              ...formData.arrangementer, 
                              organizer: { ...formData.arrangementer.organizer, organizationType: value as 'person' | 'organization' | 'municipality' } 
                            } 
                          })}
                          className={`p-3 border rounded-lg text-center transition-colors ${
                            formData.arrangementer.organizer.organizationType === value
                              ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
                              : 'border-stone-200 dark:border-stone-700 hover:border-stone-400'
                          }`}
                        >
                          <span className="text-sm">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.arrangementer.organizer.organizationType !== 'person' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Organisasjonsnavn</Label>
                        <Input
                          value={formData.arrangementer.organizer.name}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            arrangementer: { 
                              ...formData.arrangementer, 
                              organizer: { ...formData.arrangementer.organizer, name: e.target.value } 
                            } 
                          })}
                          className="mt-1"
                          placeholder="F.eks. Skien Idrettsforening"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Org.nummer</Label>
                        <Input
                          value={formData.arrangementer.organizer.orgNumber}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            arrangementer: { 
                              ...formData.arrangementer, 
                              organizer: { ...formData.arrangementer.organizer, orgNumber: e.target.value } 
                            } 
                          })}
                          className="mt-1"
                          placeholder="F.eks. 912345678"
                        />
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <Label>Ansvarlig person</Label>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Navn</Label>
                        <Input
                          value={formData.arrangementer.organizer.responsiblePerson.name}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            arrangementer: { 
                              ...formData.arrangementer, 
                              organizer: { 
                                ...formData.arrangementer.organizer, 
                                responsiblePerson: { ...formData.arrangementer.organizer.responsiblePerson, name: e.target.value } 
                              } 
                            } 
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Rolle</Label>
                        <Input
                          value={formData.arrangementer.organizer.responsiblePerson.role}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            arrangementer: { 
                              ...formData.arrangementer, 
                              organizer: { 
                                ...formData.arrangementer.organizer, 
                                responsiblePerson: { ...formData.arrangementer.organizer.responsiblePerson, role: e.target.value } 
                              } 
                            } 
                          })}
                          className="mt-1"
                          placeholder="F.eks. Prosjektleder"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Telefon</Label>
                        <Input
                          value={formData.arrangementer.organizer.responsiblePerson.phone}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            arrangementer: { 
                              ...formData.arrangementer, 
                              organizer: { 
                                ...formData.arrangementer.organizer, 
                                responsiblePerson: { ...formData.arrangementer.organizer.responsiblePerson, phone: e.target.value } 
                              } 
                            } 
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">E-post</Label>
                        <Input
                          value={formData.arrangementer.organizer.responsiblePerson.email}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            arrangementer: { 
                              ...formData.arrangementer, 
                              organizer: { 
                                ...formData.arrangementer.organizer, 
                                responsiblePerson: { ...formData.arrangementer.organizer.responsiblePerson, email: e.target.value } 
                              } 
                            } 
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Nødkontakt</Label>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Navn</Label>
                        <Input
                          value={formData.arrangementer.organizer.emergencyContact.name}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            arrangementer: { 
                              ...formData.arrangementer, 
                              organizer: { 
                                ...formData.arrangementer.organizer, 
                                emergencyContact: { ...formData.arrangementer.organizer.emergencyContact, name: e.target.value } 
                              } 
                            } 
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Telefon</Label>
                        <Input
                          value={formData.arrangementer.organizer.emergencyContact.phone}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            arrangementer: { 
                              ...formData.arrangementer, 
                              organizer: { 
                                ...formData.arrangementer.organizer, 
                                emergencyContact: { ...formData.arrangementer.organizer.emergencyContact, phone: e.target.value } 
                              } 
                            } 
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Program */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Program
                  </CardTitle>
                  <CardDescription>Tidspunkter for innsjekk, dører og program</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label className="text-xs">Innsjekk</Label>
                      <Input
                        type="time"
                        value={formData.arrangementer.program.checkInTime}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          arrangementer: { 
                            ...formData.arrangementer, 
                            program: { ...formData.arrangementer.program, checkInTime: e.target.value } 
                          } 
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Dører åpner</Label>
                      <Input
                        type="time"
                        value={formData.arrangementer.program.doorsOpenTime}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          arrangementer: { 
                            ...formData.arrangementer, 
                            program: { ...formData.arrangementer.program, doorsOpenTime: e.target.value } 
                          } 
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Start</Label>
                      <Input
                        type="time"
                        value={formData.arrangementer.program.startTime}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          arrangementer: { 
                            ...formData.arrangementer, 
                            program: { ...formData.arrangementer.program, startTime: e.target.value } 
                          } 
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Slutt</Label>
                      <Input
                        type="time"
                        value={formData.arrangementer.program.endTime}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          arrangementer: { 
                            ...formData.arrangementer, 
                            program: { ...formData.arrangementer.program, endTime: e.target.value } 
                          } 
                        })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              </>
            )}

            {/* Arrangementer: Step 2 - Kapasitet */}
            {selectedCategory === 'arrangementer' && currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Kapasitet</CardTitle>
                  <CardDescription>Antall tilgjengelighet (billetter eller plasser)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="arrangementer-quantity">Antall {!formData.availability.quantity.amount && <span className="text-red-600">*</span>}</Label>
                    <Input
                      id="arrangementer-quantity"
                      type="number"
                      value={formData.availability.quantity.amount}
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          availability: { 
                            ...formData.availability, 
                            availabilityType: 'quantity' as const,
                            quantity: { 
                              ...formData.availability.quantity, 
                              amount: e.target.value 
                            } 
                          } 
                        })
                      }}
                      className="mt-2"
                      placeholder="F.eks. 100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="arrangementer-unit">Enhet {!formData.availability.quantity.unit && <span className="text-red-600">*</span>}</Label>
                    <select
                      id="arrangementer-unit"
                      value={formData.availability.quantity.unit}
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          availability: { 
                            ...formData.availability, 
                            quantity: { 
                              ...formData.availability.quantity, 
                              unit: e.target.value 
                            } 
                          } 
                        })
                      }}
                      className="mt-2 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    >
                      <option value="">Velg enhet</option>
                      <option value="billetter">Billetter</option>
                      <option value="plasser">Plasser</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Opplevelser: Step 3 - Pris */}
            {/* Arrangementer: Step 3 - Pris */}
            {selectedCategory === 'arrangementer' && currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pris</CardTitle>
                  <CardDescription>Billettpriser, rabatter og målgrupper</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Gratis eller betalt</Label>
                    <div className="mt-2 flex gap-4">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="opplevelser-isFree" checked={formData.pricing.isFree} onChange={() => setFormData({ ...formData, pricing: { ...formData.pricing, isFree: true } })} />
                        <span>Gratis</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="opplevelser-isFree" checked={!formData.pricing.isFree} onChange={() => setFormData({ ...formData, pricing: { ...formData.pricing, isFree: false } })} />
                        <span>Betalt</span>
                      </label>
                    </div>
                  </div>
                  {!formData.pricing.isFree && (
                    <>
                      <div>
                        <Label>Billettpriser</Label>
                        <div className="mt-2 space-y-2">
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Legg til billettpris
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>Rabatter</Label>
                        <div className="mt-2 space-y-2">
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Legg til rabatt
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>Målgrupper</Label>
                        <div className="mt-2 space-y-2">
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Legg til målgruppe
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>Gruppepriser</Label>
                        <div className="mt-2 space-y-2">
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Legg til gruppepris
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Opplevelser: Step 4 - Vilkår */}
            {/* Arrangementer: Step 4 - Vilkår */}
            {selectedCategory === 'arrangementer' && currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Vilkår</CardTitle>
                  <CardDescription>Deltakelsesvilkår, avbestillingsregler og aldersgrenser</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Deltakelsesvilkår</Label>
                    <textarea
                      className="mt-2 w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      placeholder="Beskriv deltakelsesvilkårene"
                    />
                  </div>
                  <div>
                    <Label>Avbestillingsregler</Label>
                    <div className="mt-2 space-y-4">
                      <div>
                        <Label className="text-xs">Avbestillingsfrist (timer før start)</Label>
                        <Input type="number" className="mt-1" placeholder="F.eks. 24" />
                      </div>
                      <div>
                        <Label className="text-xs">Refunderingsregler</Label>
                        <textarea
                          className="mt-1 w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                          placeholder="Beskriv refunderingsregler"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Aldersgrenser</Label>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Minimum alder</Label>
                        <Input type="number" className="mt-1" placeholder="F.eks. 18" />
                      </div>
                      <div>
                        <Label className="text-xs">Maksimum alder</Label>
                        <Input type="number" className="mt-1" placeholder="F.eks. 99" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Påmelding</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Krev påmelding</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Krev kontaktinformasjon</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Opplevelser: Step 5 - Publisering */}
            {/* Arrangementer: Step 5 - Publisering */}
            {selectedCategory === 'arrangementer' && currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Publisering</CardTitle>
                  <CardDescription>Kontrollert aktivering med tydelig status og sjekkliste</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Publiseringsvalg</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="opplevelser-publish" value="draft" checked={formData.publishing.choice === 'draft'} onChange={(e) => setFormData({ ...formData, publishing: { ...formData.publishing, choice: e.target.value } })} />
                        <div className="font-medium">Lagre som utkast</div>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="opplevelser-publish" value="publish" checked={formData.publishing.choice === 'publish'} onChange={(e) => setFormData({ ...formData, publishing: { ...formData.publishing, choice: e.target.value } })} />
                        <div className="font-medium">Publiser og gjør tilgjengelig for booking</div>
                      </label>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label>Sjekkliste før publisering</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Navn og tidspunkter</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Kapasitet definert</span>
                      </div>
                      {!formData.pricing.isFree && (
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Pris definert</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={handlePublish} className="flex-1" disabled={!formData.locationAndBasis.name}>
                      Publiser nå
                    </Button>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Vis offentlig side
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Torg: Step 1 - Hentested/Logistikk */}
            {selectedCategory === 'torg' && currentStep === 1 && startChoice === 'new' && (
              <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Grunninfo og lokasjon
                  </CardTitle>
                  <CardDescription>Grunnleggende informasjon om område/utstyr</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="subcategory-select-torg">Underkategori {!formData.subcategory.selected && <span className="text-red-600">*</span>}</Label>
                    <select
                      id="subcategory-select-torg"
                      value={formData.subcategory.selected || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        subcategory: { ...formData.subcategory, selected: e.target.value || null, custom: '' } 
                      })}
                      className="w-full mt-2 p-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    >
                      <option value="">Velg underkategori...</option>
                      {getSubcategories('torg').map((subcat) => (
                        <option key={subcat} value={subcat}>{subcat}</option>
                      ))}
                    </select>
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="torg-name">Navn på utstyr {!formData.locationAndBasis.name && <span className="text-red-600">*</span>}</Label>
                    <Input
                      id="torg-name"
                      value={formData.locationAndBasis.name}
                      onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, name: e.target.value } })}
                      className="mt-2"
                      placeholder="F.eks. Festtelt"
                    />
                  </div>
                  <div>
                    <Label htmlFor="torg-address">Hentested {!formData.locationAndBasis.address && <span className="text-red-600">*</span>}</Label>
                    <Input
                      id="torg-address"
                      value={formData.locationAndBasis.address}
                      onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, address: e.target.value } })}
                      className="mt-2"
                      placeholder="F.eks. Idrettshall A, Lager 2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="torg-postal-code">Postnummer {!formData.locationAndBasis.postalCode && <span className="text-red-600">*</span>}</Label>
                      <Input
                        id="torg-postal-code"
                        value={formData.locationAndBasis.postalCode}
                        onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, postalCode: e.target.value } })}
                        className="mt-2"
                        placeholder="0000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="torg-postal-area">Poststed {!formData.locationAndBasis.postalArea && <span className="text-red-600">*</span>}</Label>
                      <Input
                        id="torg-postal-area"
                        value={formData.locationAndBasis.postalArea}
                        onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, postalArea: e.target.value } })}
                        className="mt-2"
                        placeholder="By"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="torg-description">Beskrivelse</Label>
                    <textarea
                      id="torg-description"
                      value={formData.locationAndBasis.longDescription}
                      onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, longDescription: e.target.value } })}
                      className="mt-2 w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      placeholder="Beskriv utstyret, inkludert spesifikasjoner og tilstand"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Kontaktpersoner</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({
                          ...formData,
                          locationAndBasis: {
                            ...formData.locationAndBasis,
                            contacts: [...formData.locationAndBasis.contacts, { name: '', role: '', email: '', phone: '' }]
                          }
                        })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Legg til kontakt
                      </Button>
                    </div>
                    <div className="space-y-3 mt-2">
                      {formData.locationAndBasis.contacts.map((contact, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Navn</Label>
                              <Input value={contact.name} className="mt-1" />
                            </div>
                            <div>
                              <Label className="text-xs">Rolle</Label>
                              <select className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                                <option value="">Velg rolle</option>
                                <option value="drift">Drift</option>
                                <option value="nokkel">Nøkkel</option>
                                <option value="fagansvarlig">Fagansvarlig</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">E-post</Label>
                              <Input type="email" value={contact.email} className="mt-1" />
                            </div>
                            <div>
                              <Label className="text-xs">Telefon</Label>
                              <Input type="tel" value={contact.phone} className="mt-1" />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button variant="ghost" size="sm" onClick={() => {
                              const updated = formData.locationAndBasis.contacts.filter((_, i) => i !== index)
                              setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, contacts: updated } })
                            }}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Slett
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Transportinfo</Label>
                    <textarea
                      value={formData.locationAndBasis.shortDescription}
                      onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, shortDescription: e.target.value } })}
                      className="mt-2 w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      placeholder="Informasjon om transport, størrelse, vekt, etc."
                    />
                  </div>
                  <Separator />
                  <div>
                    <Label>Logistikk</Label>
                    <div className="mt-2 space-y-3">
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <div>
                          <div className="font-medium text-sm">Henting påkrevd</div>
                          <div className="text-xs text-stone-500">Utstyret må hentes på angitt sted</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <div>
                          <div className="font-medium text-sm">Levering tilgjengelig</div>
                          <div className="text-xs text-stone-500">Utstyret kan leveres til deg</div>
                        </div>
                      </label>
                      <div>
                        <Label className="text-xs">Hentetider</Label>
                        <Input type="text" className="mt-1" placeholder="F.eks. 08:00-16:00" />
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label>Media</Label>
                    <div className="mt-2 space-y-3">
                      <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-stone-400" />
                        <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">Last opp bilder</p>
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Velg filer
                        </Button>
                      </div>
                      {formData.locationAndBasis.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {formData.locationAndBasis.images.map((img, index) => (
                            <div key={index} className="relative aspect-square border rounded-lg overflow-hidden">
                              <img src={img} alt={`Bilde ${index + 1}`} className="w-full h-full object-cover" />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-1 right-1"
                                onClick={() => {
                                  const updated = formData.locationAndBasis.images.filter((_, i) => i !== index)
                                  setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, images: updated } })
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Depositum for utstyr */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    Depositum
                  </CardTitle>
                  <CardDescription>Depositum for sikkerhet mot skade på utstyr</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Depositumbeløp (kr)</Label>
                      <Input
                        type="number"
                        value={formData.torg.outdoorDeposit.baseAmount}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          torg: { 
                            ...formData.torg, 
                            outdoorDeposit: { ...formData.torg.outdoorDeposit, baseAmount: parseInt(e.target.value) || 0 } 
                          } 
                        })}
                        className="mt-1"
                        placeholder="0 = ingen depositum"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Maks depositum (kr)</Label>
                      <Input
                        type="number"
                        value={formData.torg.outdoorDeposit.maxDeposit}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          torg: { 
                            ...formData.torg, 
                            outdoorDeposit: { ...formData.torg.outdoorDeposit, maxDeposit: parseInt(e.target.value) || 10000 } 
                          } 
                        })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.torg.outdoorDeposit.inspectionProcess.preInspectionRequired}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          torg: { 
                            ...formData.torg, 
                            outdoorDeposit: { 
                              ...formData.torg.outdoorDeposit, 
                              inspectionProcess: { ...formData.torg.outdoorDeposit.inspectionProcess, preInspectionRequired: e.target.checked } 
                            } 
                          } 
                        })}
                        className="rounded"
                      />
                      <span className="text-sm">Kontroll av utstyr ved utlevering</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.torg.outdoorDeposit.inspectionProcess.postInspectionRequired}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          torg: { 
                            ...formData.torg, 
                            outdoorDeposit: { 
                              ...formData.torg.outdoorDeposit, 
                              inspectionProcess: { ...formData.torg.outdoorDeposit.inspectionProcess, postInspectionRequired: e.target.checked } 
                            } 
                          } 
                        })}
                        className="rounded"
                      />
                      <span className="text-sm">Kontroll av utstyr ved retur</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.torg.outdoorDeposit.inspectionProcess.photoDocumentationRequired}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          torg: { 
                            ...formData.torg, 
                            outdoorDeposit: { 
                              ...formData.torg.outdoorDeposit, 
                              inspectionProcess: { ...formData.torg.outdoorDeposit.inspectionProcess, photoDocumentationRequired: e.target.checked } 
                            } 
                          } 
                        })}
                        className="rounded"
                      />
                      <span className="text-sm">Fotodokumentasjon av tilstand</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
              </>
            )}

            {/* Torg: Step 2 - Antall/Lager */}
            {selectedCategory === 'torg' && currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Antall/Lager</CardTitle>
                  <CardDescription>Lagerstatus og tilgjengelighet per enhet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="torg-quantity">Antall enheter *</Label>
                    <Input
                      id="torg-quantity"
                      type="number"
                      value={formData.properties.size}
                      onChange={(e) => setFormData({ ...formData, properties: { ...formData.properties, size: e.target.value } })}
                      className="mt-2"
                      placeholder="F.eks. 10"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Torg: Step 3 - Tilgjengelighet */}
            {selectedCategory === 'torg' && currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tilgjengelighet</CardTitle>
                  <CardDescription>Definer når objektet er tilgjengelig for booking (Dag ELLER Antall tilgjengelighet)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Tilgjengelighetstype {!formData.availability.availabilityType && <span className="text-red-600">*</span>}</Label>
                    <div className="mt-2 flex gap-4">
                      <label className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="availabilityType-torg" 
                          value="day" 
                          checked={formData.availability.availabilityType === 'day'} 
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            availability: { 
                              ...formData.availability, 
                              availabilityType: 'day' as const,
                              day: {
                                type: formData.availability.day.type || 'full',
                                fromTime: formData.availability.day.fromTime || '',
                                toTime: formData.availability.day.toTime || '',
                                openingHours: formData.availability.day.openingHours.length > 0 
                                  ? formData.availability.day.openingHours 
                                  : formData.availability.openingHours
                              }
                            } 
                          })} 
                        />
                        <span>Dag</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="availabilityType-torg" 
                          value="quantity" 
                          checked={formData.availability.availabilityType === 'quantity'} 
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            availability: { 
                              ...formData.availability, 
                              availabilityType: 'quantity' as const
                            } 
                          })} 
                        />
                        <span>Antall tilgjengelighet</span>
                      </label>
                    </div>
                  </div>
                  
                  {formData.availability.availabilityType === 'day' && (
                    <>
                      <div>
                        <Label>Dagstype</Label>
                        <div className="mt-2 space-y-2">
                          <label className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              name="dayType-torg" 
                              value="full" 
                              checked={formData.availability.day.type === 'full'} 
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                availability: { 
                                  ...formData.availability, 
                                  day: { ...formData.availability.day, type: 'full' as const } 
                                } 
                              })} 
                            />
                            <span className="text-sm">Hel dag</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2">
                              <input 
                                type="radio" 
                                name="dayType-torg" 
                                value="custom" 
                                checked={formData.availability.day.type === 'custom'} 
                                onChange={(e) => setFormData({ 
                                  ...formData, 
                                  availability: { 
                                    ...formData.availability, 
                                    day: { ...formData.availability.day, type: 'custom' as const } 
                                  } 
                                })} 
                              />
                              <span className="text-sm">Dagsintervall:</span>
                            </label>
                            <Input 
                              type="time" 
                              value={formData.availability.day.fromTime} 
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                availability: { 
                                  ...formData.availability, 
                                  day: { ...formData.availability.day, fromTime: e.target.value } 
                                } 
                              })} 
                              className="w-32" 
                              disabled={formData.availability.day.type !== 'custom'}
                            />
                            <span className="text-stone-500">til</span>
                            <Input 
                              type="time" 
                              value={formData.availability.day.toTime} 
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                availability: { 
                                  ...formData.availability, 
                                  day: { ...formData.availability.day, toTime: e.target.value } 
                                } 
                              })} 
                              className="w-32" 
                              disabled={formData.availability.day.type !== 'custom'}
                            />
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <Label>Åpningstider {formData.availability.day.openingHours.filter(h => h.active).length === 0 && !formData.availability.presentationOnly && <span className="text-red-600">*</span>}</Label>
                        <div className="mt-2 space-y-2">
                          {['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'].map((day) => {
                            const openingHours = formData.availability.day.openingHours
                            const openingHour = openingHours.find(h => h.day === day) || { day, active: false, from: '08:00', to: '22:00' }
                            return (
                              <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
                                <label className="flex items-center gap-2 min-w-[100px]">
                                  <input 
                                    type="checkbox" 
                                    checked={openingHour.active} 
                                    onChange={(e) => {
                                      const currentHours = formData.availability.day.openingHours
                                      if (e.target.checked) {
                                        const updated = [...currentHours.filter(h => h.day !== day), { day, active: true, from: '08:00', to: '22:00' }]
                                        setFormData({ 
                                          ...formData, 
                                          availability: { 
                                            ...formData.availability, 
                                            day: { ...formData.availability.day, openingHours: updated } 
                                          } 
                                        })
                                      } else {
                                        const updated = currentHours.filter(h => h.day !== day)
                                        setFormData({ 
                                          ...formData, 
                                          availability: { 
                                            ...formData.availability, 
                                            day: { ...formData.availability.day, openingHours: updated } 
                                          } 
                                        })
                                      }
                                    }} 
                                    className="rounded" 
                                  />
                                  <span className="text-sm">{day}</span>
                                </label>
                                {openingHour.active && (
                                  <div className="flex items-center gap-2 flex-1">
                                    <Input 
                                      type="time" 
                                      value={openingHour.from} 
                                      onChange={(e) => {
                                        const currentHours = formData.availability.day.openingHours
                                        const updated = currentHours.map(h => h.day === day ? { ...h, from: e.target.value } : h)
                                        setFormData({ 
                                          ...formData, 
                                          availability: { 
                                            ...formData.availability, 
                                            day: { ...formData.availability.day, openingHours: updated } 
                                          } 
                                        })
                                      }} 
                                      className="w-32" 
                                    />
                                    <span className="text-stone-500">til</span>
                                    <Input 
                                      type="time" 
                                      value={openingHour.to} 
                                      onChange={(e) => {
                                        const currentHours = formData.availability.day.openingHours
                                        const updated = currentHours.map(h => h.day === day ? { ...h, to: e.target.value } : h)
                                        setFormData({ 
                                          ...formData, 
                                          availability: { 
                                            ...formData.availability, 
                                            day: { ...formData.availability.day, openingHours: updated } 
                                          } 
                                        })
                                      }} 
                                      className="w-32" 
                                    />
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {formData.availability.availabilityType === 'quantity' && (
                    <>
                      <div>
                        <Label htmlFor="torg-quantity-amount">Antall {!formData.availability.quantity.amount && <span className="text-red-600">*</span>}</Label>
                        <Input
                          id="torg-quantity-amount"
                          type="number"
                          value={formData.availability.quantity.amount}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            availability: { 
                              ...formData.availability, 
                              quantity: { 
                                ...formData.availability.quantity, 
                                amount: e.target.value 
                              } 
                            } 
                          })}
                          className="mt-2"
                          placeholder="F.eks. 50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="torg-quantity-unit">Enhet {!formData.availability.quantity.unit && <span className="text-red-600">*</span>}</Label>
                        <select
                          id="torg-quantity-unit"
                          value={formData.availability.quantity.unit}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            availability: { 
                              ...formData.availability, 
                              quantity: { 
                                ...formData.availability.quantity, 
                                unit: e.target.value 
                              } 
                            } 
                          })}
                          className="mt-2 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        >
                          <option value="">Velg enhet</option>
                          <option value="stoler">Stoler</option>
                          <option value="bord">Bord</option>
                          <option value="telt">Telt</option>
                          <option value="enheter">Enheter</option>
                        </select>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={formData.availability.presentationOnly} 
                        onChange={(e) => setFormData({ ...formData, availability: { ...formData.availability, presentationOnly: e.target.checked } })} 
                        className="rounded" 
                      />
                      <span className="text-sm">Ingen aktiv kalender, kun presentasjon</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Torg: Step 4 - Regler */}
            {selectedCategory === 'torg' && currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Regler og godkjenning</CardTitle>
                  <CardDescription>Definer godkjenning og begrensninger</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Godkjenning {!formData.rules.approvalMode && <span className="text-red-600">*</span>}</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="approvalMode-torg" value="automatic" checked={formData.rules.approvalMode === 'automatic'} onChange={(e) => setFormData({ ...formData, rules: { ...formData.rules, approvalMode: e.target.value } })} />
                        <div>
                          <div className="font-medium">Automatisk bekreftelse</div>
                          <div className="text-xs text-stone-500">Bookinger godkjennes automatisk</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="approvalMode-torg" value="manual" checked={formData.rules.approvalMode === 'manual'} onChange={(e) => setFormData({ ...formData, rules: { ...formData.rules, approvalMode: e.target.value } })} />
                        <div>
                          <div className="font-medium">Krever saksbehandlergodkjenning</div>
                          <div className="text-xs text-stone-500">Alle bookinger må godkjennes manuelt</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Torg: Step 5 - Pris/Depositum */}
            {selectedCategory === 'torg' && currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pris/Depositum</CardTitle>
                  <CardDescription>Definer priser og depositum</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.pricing.isFree}
                        onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, isFree: e.target.checked } })}
                        className="rounded"
                      />
                      <span className="text-sm">Gratis utleie</span>
                    </label>
                  </div>
                  {!formData.pricing.isFree && (
                    <>
                      <div>
                        <Label htmlFor="torg-price">Utleiepris {!formData.pricing.priceModel && <span className="text-red-600">*</span>}</Label>
                        <Input
                          id="torg-price"
                          type="number"
                          value={formData.pricing.priceModel}
                          onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, priceModel: e.target.value } })}
                          className="mt-2"
                          placeholder="F.eks. 500"
                        />
                      </div>
                      <div>
                        <Label>Betalingsmetoder {formData.payment.methods.length === 0 && <span className="text-red-600">*</span>}</Label>
                        <div className="mt-2 space-y-2">
                          {['Faktura (EHF)', 'Kort', 'Vipps'].map((method) => (
                            <label key={method} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800">
                              <input
                                type="checkbox"
                                checked={formData.payment.methods.includes(method)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({ ...formData, payment: { ...formData.payment, methods: [...formData.payment.methods, method] } })
                                  } else {
                                    setFormData({ ...formData, payment: { ...formData.payment, methods: formData.payment.methods.filter(m => m !== method) } })
                                  }
                                }}
                                className="rounded"
                              />
                              <span className="text-sm">{method}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Torg: Step 6 - Publisering */}
            {selectedCategory === 'torg' && currentStep === 6 && (
              <Card>
                <CardHeader>
                  <CardTitle>Publisering</CardTitle>
                  <CardDescription>Kontrollert aktivering med tydelig status og sjekkliste</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Publiseringsvalg</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="torg-publish" value="draft" checked={formData.publishing.choice === 'draft'} onChange={(e) => setFormData({ ...formData, publishing: { ...formData.publishing, choice: e.target.value } })} />
                        <div className="font-medium">Lagre som utkast</div>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
                        <input type="radio" name="torg-publish" value="publish" checked={formData.publishing.choice === 'publish'} onChange={(e) => setFormData({ ...formData, publishing: { ...formData.publishing, choice: e.target.value } })} />
                        <div className="font-medium">Publiser og gjør tilgjengelig for booking</div>
                      </label>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label>Sjekkliste før publisering</Label>
                    <div className="mt-2 space-y-2">
                      {publishingChecklist.required.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {item.checked ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`text-sm ${item.checked ? 'text-stone-700 dark:text-stone-300' : 'text-red-600'}`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={handlePublish} className="flex-1" disabled={!formData.locationAndBasis.name}>
                      Publiser nå
                    </Button>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Vis offentlig side
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleBack} 
                  disabled={currentStep === 0 && !selectedCategory}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Tilbake
                </Button>
                <Button variant="ghost" onClick={handleSaveDraft}>
                  <Save className="w-4 h-4 mr-2" />
                  Lagre utkast
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    // Reset til start
                    setSelectedCategory(null)
                    setCurrentStep(0)
                    setStartChoice(null)
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Avbryt
                </Button>
                {currentStep === 0 && !selectedCategory ? (
                  <Button onClick={handleNext} disabled={!selectedCategory}>
                    Neste
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : ((currentStep === 0 && selectedCategory) || (currentStep === 1 && selectedCategory && (!startChoice || startChoice === 'copy' || startChoice === 'import'))) ? (
                  startChoice === 'import' ? null : (
                    <Button 
                      onClick={handleNext} 
                      disabled={startChoice === 'copy' ? (!selectedCopyObject || copySettings.length === 0) : !startChoice}
                    >
                      Neste
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )
                ) : currentStep < getMaxStep() ? (
                  <Button onClick={handleNext} disabled={!canProceed}>
                    Neste
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handlePublish} disabled={!publishingChecklist.required.every(item => item.checked)}>
                    Publiser
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Badge variant={status === 'draft' ? 'outline' : status === 'ready' ? 'secondary' : 'default'}>
                    {status === 'draft' ? 'Utkast' : status === 'ready' ? 'Klar for publisering' : 'Publisert'}
                  </Badge>
                </div>

                {validationErrors.length > 0 && (
                  <div>
                    <Label className="text-xs text-stone-500 uppercase mb-2 block">
                      Mangler før publisering
                    </Label>
                    <div className="space-y-1">
                      {validationErrors.map((error, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div>
                  <Label className="text-xs text-stone-500 uppercase mb-2 block">
                    Kort oppsummering
                  </Label>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-stone-500">Navn:</span>
                      <div className="font-medium">{formData.locationAndBasis.name || 'Ikke satt'}</div>
                    </div>
                    <div>
                      <span className="text-stone-500">Kategori:</span>
                      <div className="font-medium">{selectedCategory === 'lokaler' ? 'Lokaler' : selectedCategory === 'sport' ? 'Sport' : selectedCategory === 'arrangementer' ? 'Arrangementer' : selectedCategory === 'torg' ? 'Torg' : 'Ikke satt'}</div>
                    </div>
                    <div>
                      <span className="text-stone-500">Leies ut per:</span>
                      <div className="font-medium">{formData.availability.rentalUnit || 'Ikke satt'}</div>
                    </div>
                    <div>
                      <span className="text-stone-500">Godkjenning:</span>
                      <div className="font-medium">
                        {formData.rules.approvalMode === 'automatic' ? 'Automatisk' :
                         formData.rules.approvalMode === 'manual' ? 'Manuell' :
                         formData.rules.approvalMode === 'partial' ? 'Regelstyrt' : 'Ikke satt'}
                      </div>
                    </div>
                    <div>
                      <span className="text-stone-500">Pris:</span>
                      <div className="font-medium">
                        {formData.pricing.isFree ? 'Gratis' : formData.pricing.targetGroups.length > 0 ? `${formData.pricing.targetGroups.length} målgrupper` : 'Ikke satt'}
                      </div>
                    </div>
                    <div>
                      <span className="text-stone-500">Betalingsmåte:</span>
                      <div className="font-medium">{formData.payment.methods.join(', ') || 'Ikke satt'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
