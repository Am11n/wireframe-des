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
  Globe
} from 'lucide-react'

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

const STEP_LABELS = [
  'Oppstartsvalg',
  'Lokasjon og basis',
  'Egenskaper',
  'Tilgjengelighet',
  'Regler og godkjenning',
  'Pris og målgrupper',
  'Betaling og vilkår',
  'Publisering'
]

export default function UtleieobjektWizardKommune() {
  const [currentStep, setCurrentStep] = useState<Step>(0)
  const [status, setStatus] = useState<'draft' | 'ready' | 'published'>('draft')
  const [startChoice, setStartChoice] = useState<'new' | 'copy' | null>(null)
  
  const [formData, setFormData] = useState({
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
      rentalUnit: '',
      interval: '',
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
  
  // Validation logic
  if (currentStep === 1) {
    if (!formData.locationAndBasis.name) validationErrors.push('Navn på utleieobjekt må være fylt')
    if (!formData.locationAndBasis.address) validationErrors.push('Adresse må være fylt')
    if (!formData.locationAndBasis.postalCode) validationErrors.push('Postnummer må være fylt')
    if (!formData.locationAndBasis.postalArea) validationErrors.push('Poststed må være fylt')
  }

  if (currentStep === 2) {
    if (formData.properties.types.length === 0) validationErrors.push('Minst én type må være valgt')
  }

  if (currentStep === 3) {
    if (!formData.availability.rentalUnit) validationErrors.push('Leies ut per må være valgt')
    if (!formData.availability.interval) validationErrors.push('Intervall må være valgt')
    if (formData.availability.openingHours.filter(h => h.active).length === 0 && !formData.availability.presentationOnly) {
      validationErrors.push('Minst én aktiv ukedag med gyldige tider, eller velg "kun presentasjon"')
    }
  }

  if (currentStep === 4) {
    if (!formData.rules.approvalMode) validationErrors.push('En godkjenningsmodus må være valgt')
    if (formData.rules.umbrellaDisposal.allowed && formData.rules.umbrellaDisposal.organizations.length === 0) {
      validationErrors.push('Hvis paraply = ja: minst én org + kvote må settes')
    }
  }

  if (currentStep === 5) {
    if (!formData.pricing.isFree) {
      if (!formData.pricing.priceModel) validationErrors.push('Prismodell må være valgt')
      if (formData.pricing.targetGroups.length === 0) validationErrors.push('Minst én pris må være definert')
    }
  }

  if (currentStep === 6) {
    if (!formData.pricing.isFree) {
      if (formData.payment.methods.length === 0) validationErrors.push('Minst én betalingsmetode må være valgt')
    }
    if (formData.payment.terms.requireAcceptance && !formData.payment.terms.pdf) {
      validationErrors.push('PDF må være lastet opp hvis aksept kreves')
    }
  }

  const canProceed = validationErrors.length === 0

  const handleNext = () => {
    if (currentStep < 7 && canProceed) {
      setCurrentStep((prev) => (prev + 1) as Step)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => (prev - 1) as Step)
    }
  }

  const handleSaveDraft = () => {
    setStatus('draft')
  }

  const handlePublish = () => {
    setStatus('published')
  }

  // Checklist for publishing
  const publishingChecklist = {
    required: [
      { label: 'Navn og adresse', checked: !!formData.locationAndBasis.name && !!formData.locationAndBasis.address },
      { label: 'Type valgt', checked: formData.properties.types.length > 0 },
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

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Opprett utleieobjekt
          </h1>
          <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 flex-wrap">
            {STEP_LABELS.map((label, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className={index === currentStep ? 'font-medium text-stone-900 dark:text-stone-100' : ''}>
                  {index + 1} {label}
                </span>
                {index < STEP_LABELS.length - 1 && <ChevronRight className="w-4 h-4" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 0: Oppstartsvalg */}
            {currentStep === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Opprettelsesmetode</CardTitle>
                  <CardDescription>Velg hvordan du vil opprette utleieobjektet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <button
                    onClick={() => {
                      setStartChoice('new')
                      setCurrentStep(1)
                    }}
                    className="w-full p-6 border-2 border-stone-200 dark:border-stone-700 rounded-lg hover:border-stone-900 dark:hover:border-stone-100 transition-colors text-left"
                  >
                    <div className="font-medium text-stone-900 dark:text-stone-100 mb-1">
                      Opprett nytt utleieobjekt
                    </div>
                    <div className="text-sm text-stone-600 dark:text-stone-400">
                      Start fra scratch med et tomt objekt
                    </div>
                  </button>
                  <button
                    onClick={() => setStartChoice('copy')}
                    className="w-full p-6 border-2 border-stone-200 dark:border-stone-700 rounded-lg hover:border-stone-900 dark:hover:border-stone-100 transition-colors text-left"
                  >
                    <div className="font-medium text-stone-900 dark:text-stone-100 mb-1">
                      Kopier eksisterende (mal)
                    </div>
                    <div className="text-sm text-stone-600 dark:text-stone-400">
                      Bruk et eksisterende objekt som mal
                    </div>
                  </button>
                  {startChoice === 'copy' && (
                    <div className="mt-4 p-4 bg-stone-100 dark:bg-stone-800 rounded-lg space-y-4">
                      <div>
                        <Label>Velg objekt å kopiere</Label>
                        <Input placeholder="Søk etter objekt..." className="mt-2" />
                      </div>
                      <div>
                        <Label>Kopier-innstillinger</Label>
                        <div className="mt-2 space-y-2">
                          {['Grunninfo', 'Detaljer og fasiliteter', 'Tilgjengelighet', 'Regler og godkjenning', 'Pris og målgrupper', 'Betaling og vilkår'].map((item) => (
                            <label key={item} className="flex items-center gap-2">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <Button onClick={() => setCurrentStep(1)} className="w-full">
                        Fortsett med kopi
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 1: Lokasjon og basis - Simplified for space */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Lokasjon og basis</CardTitle>
                  <CardDescription>Grunnleggende informasjon om utleieobjektet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="name">Navn på utleieobjekt *</Label>
                    <Input
                      id="name"
                      value={formData.locationAndBasis.name}
                      onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, name: e.target.value } })}
                      className="mt-2"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="address">Adresse *</Label>
                      <Input
                        id="address"
                        value={formData.locationAndBasis.address}
                        onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, address: e.target.value } })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postnummer *</Label>
                      <Input
                        id="postalCode"
                        value={formData.locationAndBasis.postalCode}
                        onChange={(e) => setFormData({ ...formData, locationAndBasis: { ...formData.locationAndBasis, postalCode: e.target.value } })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="postalArea">Poststed *</Label>
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
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Legg til kontakt
                      </Button>
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
                </CardContent>
              </Card>
            )}

            {/* Step 2: Egenskaper */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Egenskaper</CardTitle>
                  <CardDescription>Kategori, kapasitet, fasiliteter og universell utforming</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Type utleieobjekt (minst én) *</Label>
                    <div className="mt-2 space-y-2">
                      {['Lokaler og baner', 'Utstyr og inventar', 'Opplevelser og arrangement'].map((type) => (
                        <label key={type} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800">
                          <input
                            type="checkbox"
                            checked={formData.properties.types.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, properties: { ...formData.properties, types: [...formData.properties.types, type] } })
                              } else {
                                setFormData({ ...formData, properties: { ...formData.properties, types: formData.properties.types.filter(t => t !== type) } })
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Separator />
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
                </CardContent>
              </Card>
            )}

            {/* Step 3: Tilgjengelighet - Simplified */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tilgjengelighet</CardTitle>
                  <CardDescription>Definer når objektet er tilgjengelig for booking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Leies ut per *</Label>
                    <div className="mt-2 flex gap-4">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="rentalUnit" value="hour" checked={formData.availability.rentalUnit === 'hour'} onChange={(e) => setFormData({ ...formData, availability: { ...formData.availability, rentalUnit: e.target.value } })} />
                        <span>Time</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="rentalUnit" value="day" checked={formData.availability.rentalUnit === 'day'} onChange={(e) => setFormData({ ...formData, availability: { ...formData.availability, rentalUnit: e.target.value } })} />
                        <span>Dag</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label>Intervall *</Label>
                    {formData.availability.rentalUnit === 'hour' ? (
                      <select value={formData.availability.interval} onChange={(e) => setFormData({ ...formData, availability: { ...formData.availability, interval: e.target.value } })} className="mt-2 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                        <option value="">Velg intervall</option>
                        <option value="15">15 minutter</option>
                        <option value="30">30 minutter</option>
                        <option value="60">60 minutter</option>
                        <option value="custom">Tilpasset</option>
                      </select>
                    ) : (
                      <div className="mt-2 space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="dayInterval" value="full" />
                          <span className="text-sm">Heldag</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2">
                            <input type="radio" name="dayInterval" value="custom" />
                            <span className="text-sm">Dagsintervall:</span>
                          </label>
                          <Input type="time" className="w-32" />
                          <span className="text-stone-500">til</span>
                          <Input type="time" className="w-32" />
                        </div>
                      </div>
                    )}
                  </div>
                  <Separator />
                  <div>
                    <Label>Åpningstider *</Label>
                    <div className="mt-2 space-y-2">
                      {['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'].map((day) => {
                        const openingHour = formData.availability.openingHours.find(h => h.day === day) || { day, active: false, from: '08:00', to: '22:00' }
                        return (
                          <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
                            <label className="flex items-center gap-2 min-w-[100px]">
                              <input type="checkbox" checked={openingHour.active} onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({ ...formData, availability: { ...formData.availability, openingHours: [...formData.availability.openingHours.filter(h => h.day !== day), { day, active: true, from: '08:00', to: '22:00' }] } })
                                } else {
                                  setFormData({ ...formData, availability: { ...formData.availability, openingHours: formData.availability.openingHours.filter(h => h.day !== day) } })
                                }
                              }} className="rounded" />
                              <span className="text-sm">{day}</span>
                            </label>
                            {openingHour.active && (
                              <div className="flex items-center gap-2 flex-1">
                                <Input type="time" value={openingHour.from} onChange={(e) => {
                                  const updated = formData.availability.openingHours.map(h => h.day === day ? { ...h, from: e.target.value } : h)
                                  setFormData({ ...formData, availability: { ...formData.availability, openingHours: updated } })
                                }} className="w-32" />
                                <span className="text-stone-500">til</span>
                                <Input type="time" value={openingHour.to} onChange={(e) => {
                                  const updated = formData.availability.openingHours.map(h => h.day === day ? { ...h, to: e.target.value } : h)
                                  setFormData({ ...formData, availability: { ...formData.availability, openingHours: updated } })
                                }} className="w-32" />
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
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
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Legg til sperring
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Steps 4-7 are similar structure - showing key parts only due to length */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Regler og godkjenning</CardTitle>
                  <CardDescription>Definer godkjenning, begrensninger og paraplyorganisasjon-disponering</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Godkjenning *</Label>
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
                  <Separator />
                  <div>
                    <Label>Begrensninger (anbefalt)</Label>
                    <div className="mt-2 space-y-4">
                      <div>
                        <Label className="text-xs">Ledetid før booking</Label>
                        <div className="flex gap-2 mt-1">
                          <Input type="number" className="flex-1" />
                          <select className="w-32 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                            <option>Timer</option>
                            <option>Dager</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Maks varighet per booking</Label>
                        <Input type="number" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Maks bookinger per uke per organisasjon</Label>
                        <Input type="number" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Avbestillingsfrist (timer før start)</Label>
                        <Input type="number" className="mt-1" />
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

            {/* Step 5: Pris og målgrupper - Simplified */}
            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pris og målgrupper</CardTitle>
                  <CardDescription>Kommunal prisstyring med MVA/avgiftskode og målgrupper</CardDescription>
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
                        <Label htmlFor="priceModel">Prismodell *</Label>
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
                        <div className="space-y-2">
                          {formData.pricing.targetGroups.map((tg, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <Label className="text-xs">Målgruppe</Label>
                                  <select className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                                    <option>Velg målgruppe</option>
                                    <option>Ideell</option>
                                    <option>Kommersiell</option>
                                    <option>Barn og unge</option>
                                  </select>
                                </div>
                                <div>
                                  <Label className="text-xs">Prisreduksjon prosent</Label>
                                  <Input type="number" value={tg.priceReduction} className="mt-1" />
                                </div>
                                <div className="flex items-end">
                                  <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={tg.free} className="rounded" />
                                    <span className="text-xs">Gratis for målgruppen</span>
                                  </label>
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
                </CardContent>
              </Card>
            )}

            {/* Step 6: Betaling og vilkår - Simplified */}
            {currentStep === 6 && (
              <Card>
                <CardHeader>
                  <CardTitle>Betaling og vilkår</CardTitle>
                  <CardDescription>Sikre korrekt oppgjør, riktig betalingsmåte og leiebetingelser</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!formData.pricing.isFree && (
                    <>
                      <div>
                        <Label>Betalingsmetoder *</Label>
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

            {/* Step 7: Publisering */}
            {currentStep === 7 && (
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
                    <Label>Synlighet</Label>
                    <div className="mt-2 space-y-3">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.publishing.visibility.publicCatalog} onChange={(e) => setFormData({ ...formData, publishing: { ...formData.publishing, visibility: { ...formData.publishing.visibility, publicCatalog: e.target.checked } } })} className="rounded" />
                        <span className="text-sm">Synlig i offentlig katalog</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.publishing.visibility.selectedTargetGroups} onChange={(e) => setFormData({ ...formData, publishing: { ...formData.publishing, visibility: { ...formData.publishing.visibility, selectedTargetGroups: e.target.checked } } })} className="rounded" />
                        <span className="text-sm">Synlig kun for utvalgte målgrupper/organisasjoner</span>
                      </label>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label>Oppsummering før publisering</Label>
                    <div className="mt-2 p-4 bg-stone-100 dark:bg-stone-800 rounded-lg space-y-2 text-sm">
                      <div><span className="text-stone-500">Navn og adresse:</span> <span className="font-medium">{formData.locationAndBasis.name || 'Ikke satt'}, {formData.locationAndBasis.address || 'Ikke satt'}</span></div>
                      <div><span className="text-stone-500">Type:</span> <span className="font-medium">{formData.properties.types.join(', ') || 'Ikke satt'}</span></div>
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

            {/* Navigation Buttons */}
            {currentStep > 0 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Tilbake
                  </Button>
                  <Button variant="ghost" onClick={handleSaveDraft}>
                    <Save className="w-4 h-4 mr-2" />
                    Lagre utkast
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => {}}>
                    <X className="w-4 h-4 mr-2" />
                    Avbryt
                  </Button>
                  {currentStep < 7 ? (
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
            )}
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
                      <div className="font-medium">{formData.properties.types.join(', ') || 'Ikke satt'}</div>
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
