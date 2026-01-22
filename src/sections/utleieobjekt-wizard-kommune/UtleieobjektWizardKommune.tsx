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
  Building,
  CreditCard,
  Shield,
  Globe,
  Download
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
    subcategory: {
      selected: null as string | null,
      custom: '' as string
    },
    locationAndBasis: {
      name: '',
      address: '',
      postalCode: '',
      postalArea: '',
      map: { lat: null as number | null, lng: null as number | null, markerDraggable: true },
      shortDescription: '',
      longDescription: '',
      contacts: [] as Array<{ name: string; role: string; email: string; phone: string }>,
      images: [] as string[],
      documents: { houseRules: null as File | null, fireInstructions: null as File | null, floorPlan: null as File | null }
    },
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
    pricing: {
      isFree: true,
      priceModel: '',
      vat: '',
      feeCode: '',
      targetGroups: [] as Array<{ group: string; priceReduction: string; free: boolean }>,
      timeBasedPricing: { weekdays: '', weekend: '' },
      externalPriceList: { active: false, attachment: null as File | null, link: '', explanation: '' }
    },
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
    publishing: {
      choice: 'draft',
      visibility: {
        publicCatalog: false,
        selectedTargetGroups: false,
        selectedOrganizations: false,
        targetGroups: [] as string[],
        organizations: [] as string[]
      }
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

  // Checklist for publishing - kategori-spesifikk
  const getPublishingChecklist = () => {
    if (selectedCategory === 'lokaler') {
      return {
        required: [
          { label: 'Navn og adresse', checked: !!formData.locationAndBasis.name && !!formData.locationAndBasis.address },
          { label: 'Tilgjengelighet definert eller "kun presentasjon"', checked: formData.availability.presentationOnly || formData.availability.openingHours.some(h => h.active) },
          ...(formData.pricing.isFree ? [] : [
            { label: 'Pris definert', checked: formData.pricing.targetGroups.length > 0 },
            { label: 'Betalingsmetode satt', checked: formData.payment.methods.length > 0 },
            { label: 'Konto-oppsett ferdig', checked: true }
          ])
        ],
        recommended: [
          { label: 'Bilder', checked: formData.locationAndBasis.images.length > 0 },
          { label: 'Leiebetingelser PDF', checked: !!formData.payment.terms.pdf },
          { label: 'Universell utforming utfylt', checked: Object.values(formData.properties.universalDesign).some(v => v === true || (typeof v === 'string' && v.length > 0)) }
        ]
      }
    }
    if (selectedCategory === 'sport') {
      return {
        required: [
          { label: 'Navn og hentested', checked: !!formData.locationAndBasis.name && !!formData.locationAndBasis.address },
          { label: 'Tilgjengelighet definert eller "kun presentasjon"', checked: formData.availability.presentationOnly || (formData.availability.availabilityType === 'timeInterval' && formData.availability.timeInterval.openingHours.some(h => h.active)) },
          ...(formData.pricing.isFree ? [] : [
            { label: 'Pris definert', checked: !!formData.pricing.priceModel },
            { label: 'Betalingsmetode satt', checked: formData.payment.methods.length > 0 }
          ])
        ],
        recommended: [
          { label: 'Beskrivelse', checked: !!formData.locationAndBasis.longDescription },
          { label: 'Kontaktpersoner', checked: formData.locationAndBasis.contacts.length > 0 },
          { label: 'Vilkår PDF', checked: !!formData.payment.terms.pdf }
        ]
      }
    }
    if (selectedCategory === 'arrangementer') {
      return {
        required: [
          { label: 'Navn på arrangement', checked: !!formData.locationAndBasis.name },
          { label: 'Kapasitet definert', checked: formData.availability.availabilityType === 'quantity' && !!formData.availability.quantity.amount },
          ...(formData.pricing.isFree ? [] : [
            { label: 'Pris definert', checked: true }
          ])
        ],
        recommended: [
          { label: 'Beskrivelse', checked: !!formData.locationAndBasis.longDescription },
          { label: 'Datoer definert', checked: true },
          { label: 'Vilkår definert', checked: true }
        ]
      }
    }
    if (selectedCategory === 'torg') {
      return {
        required: [
          { label: 'Navn og hentested', checked: !!formData.locationAndBasis.name && !!formData.locationAndBasis.address },
          { label: 'Antall enheter', checked: !!formData.properties.size },
          { label: 'Tilgjengelighet definert eller "kun presentasjon"', checked: formData.availability.presentationOnly || (formData.availability.availabilityType === 'day' && formData.availability.day.openingHours.some(h => h.active)) || (formData.availability.availabilityType === 'quantity' && !!formData.availability.quantity.amount) },
          ...(formData.pricing.isFree ? [] : [
            { label: 'Pris definert', checked: !!formData.pricing.priceModel },
            { label: 'Betalingsmetode satt', checked: formData.payment.methods.length > 0 }
          ])
        ],
        recommended: [
          { label: 'Beskrivelse', checked: !!formData.locationAndBasis.longDescription },
          { label: 'Kontaktpersoner', checked: formData.locationAndBasis.contacts.length > 0 },
          { label: 'Vilkår PDF', checked: !!formData.payment.terms.pdf }
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
              <Card>
                <CardHeader>
                  <CardTitle>Lokasjon</CardTitle>
                  <CardDescription>Grunnleggende informasjon om lokale/banen</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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

                  <div>
                    <Label htmlFor="name">Navn på utleieobjekt {!formData.locationAndBasis.name && <span className="text-red-600">*</span>}</Label>
                    <Input
                      id="name"
                      value={formData.locationAndBasis.name}
                      onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, name: e.target.value } })}
                      className="mt-2"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="address">Adresse {!formData.locationAndBasis.address && <span className="text-red-600">*</span>}</Label>
                      <Input
                        id="address"
                        value={formData.locationAndBasis.address}
                        onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, address: e.target.value } })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postnummer {!formData.locationAndBasis.postalCode && <span className="text-red-600">*</span>}</Label>
                      <Input
                        id="postalCode"
                        value={formData.locationAndBasis.postalCode}
                        onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, postalCode: e.target.value } })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="postalArea">Poststed {!formData.locationAndBasis.postalArea && <span className="text-red-600">*</span>}</Label>
                    <Input
                      id="postalArea"
                      value={formData.locationAndBasis.postalArea}
                      onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, postalArea: e.target.value } })}
                      className="mt-2"
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
                    <div className="h-64 bg-stone-100 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 flex items-center justify-center">
                      <div className="text-center text-stone-500">
                        <Map className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">Kart-visning</p>
                      </div>
                    </div>
                  </div>
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
            )}

            {/* Lokaler: Step 2 - Tilgjengelighet */}
            {selectedCategory === 'lokaler' && currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tilgjengelighet</CardTitle>
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
            )}

            {/* Lokaler: Step 3 - Regler */}
            {selectedCategory === 'lokaler' && currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Regler og godkjenning</CardTitle>
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
            )}

            {/* Lokaler: Step 4 - Pris og betaling */}
            {selectedCategory === 'lokaler' && currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pris og betaling</CardTitle>
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
                          <Button variant="outline" size="sm" onClick={() => setFormData({ ...formData, pricing: { ...formData.pricing, targetGroups: [...formData.pricing.targetGroups, { group: '', priceReduction: '', free: false }] } })}>
                            <Plus className="w-4 h-4 mr-2" />
                            Legg til målgruppe-linje
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {formData.pricing.targetGroups.map((tg, index) => (
                            <div key={index} className="p-4 border rounded-lg w-full">
                              <div className="grid grid-cols-3 gap-4 items-end">
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
                                    <option value="Ideell">Ideell</option>
                                    <option value="Kommersiell">Kommersiell</option>
                                    <option value="Barn og unge">Barn og unge</option>
                                  </select>
                                </div>
                                <div className="flex-1">
                                  <Label className="text-xs">Prisreduksjon prosent</Label>
                                  <Input
                                    type="number"
                                    value={tg.priceReduction}
                                    onChange={(e) => {
                                      const updated = formData.pricing.targetGroups.map((item, i) =>
                                        i === index ? { ...item, priceReduction: e.target.value } : item
                                      )
                                      setFormData({ ...formData, pricing: { ...formData.pricing, targetGroups: updated } })
                                    }}
                                    className="mt-1 w-full"
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
              <Card>
                <CardHeader>
                  <CardTitle>Lokasjon</CardTitle>
                  <CardDescription>Grunnleggende informasjon om banen/fasiliteten</CardDescription>
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
              <Card>
                <CardHeader>
                  <CardTitle>Tidspunkter</CardTitle>
                  <CardDescription>Datoer, klokkeslett og varighet for arrangementet</CardDescription>
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
              <Card>
                <CardHeader>
                  <CardTitle>Hentested/Logistikk</CardTitle>
                  <CardDescription>Grunnleggende informasjon om utstyret</CardDescription>
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
