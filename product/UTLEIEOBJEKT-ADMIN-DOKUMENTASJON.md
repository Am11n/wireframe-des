# Utleieobjekt Admin - Komplett Systemdokumentasjon

> **Versjon**: 1.0  
> **Sist oppdatert**: 2026-02-06  
> **Formål**: Komplett dokumentasjon for implementering av kommunalt bookingsystem for utleieobjekter

---

## Innholdsfortegnelse

1. [Systemoversikt](#1-systemoversikt)
2. [Arkitektur og datamodell](#2-arkitektur-og-datamodell)
3. [BaseResource - Felles modell](#3-baseresource---felles-modell)
4. [Lokaler - Datamodell](#4-lokaler---datamodell)
5. [Arrangementer - Datamodell](#5-arrangementer---datamodell)
6. [Sport - Datamodell](#6-sport---datamodell)
7. [Torg - Datamodell](#7-torg---datamodell)
8. [Wizard-flyt og UI](#8-wizard-flyt-og-ui)
9. [Validering og sjekklister](#9-validering-og-sjekklister)
10. [Statuser og livssyklus](#10-statuser-og-livssyklus)
11. [Tillatelses-system](#11-tillatelses-system)
12. [Implementeringsguide](#12-implementeringsguide)
13. [API-spesifikasjon](#13-api-spesifikasjon)
14. [Referanser](#14-referanser)

---

## 1. Systemoversikt

### 1.1 Hva er Utleieobjekt Admin?

Et backoffice-system for kommuner til å opprette, administrere og publisere utleieobjekter som innbyggere og organisasjoner kan booke. Systemet dekker fire hovedkategorier:

| Kategori | Beskrivelse | Eksempler |
|----------|-------------|-----------|
| **Lokaler** | Fysiske rom og lokaler | Møterom, selskapslokale, gymsal, kulturarena |
| **Sport** | Idrettsbaner (tidsbasert) | Padelbane, fotballbane, tennisbane, squashbane |
| **Arrangementer** | Planlagte hendelser | Konserter, kurs, seminarer, workshops |
| **Torg** | Utleibart utstyr og objekter | Telt, lydanlegg, projektor, bord og stoler, grill |

### 1.2 Designprinsipper

1. **Komplett ved opprettelse**: Objekter skal være fullstendige nok til å unngå manuell oppfølging
2. **Juridisk korrekt**: Alle nødvendige tillatelser og dokumentkrav skal være ivaretatt
3. **Kommunal tilpasning**: Støtte for målgruppeprising, paraplydisponering, og saksbehandling
4. **Reduser kundestøtte**: Klar informasjon om tilgang, regler, og forventninger

### 1.3 Brukerroller

| Rolle | Beskrivelse | Tilganger |
|-------|-------------|-----------|
| **Admin** | Systemadministrator | Full tilgang til alt |
| **Saksbehandler** | Behandler bookingforespørsler | Godkjenne/avslå bookinger, redigere objekter |
| **Driftsansvarlig** | Ansvar for vedlikehold | Oppdatere status, legge til sperringer |
| **Innbygger** | Sluttbruker | Søke og booke (offentlig side) |
| **Organisasjon** | Lag/foreninger | Booke med rabatt |

---

## 2. Arkitektur og datamodell

### 2.1 Overordnet struktur

```
┌─────────────────────────────────────────────────────────────┐
│                      BaseResource                           │
│  (Felles felt for alle utleieobjekter)                     │
├─────────────────────────────────────────────────────────────┤
│  - Identity (ID, slug, koder, eier)                        │
│  - Location (adresse, kart, tilgang)                       │
│  - Audience (synlighet, målgrupper, begrensninger)         │
│  - TimeLogic (varighet, buffer, blackout, avbestilling)    │
│  - Pricing (priser, depositum, avgifter, betaling)         │
│  - Workflow (godkjenning, sjekklister, dokumenter)         │
│  - Content (beskrivelse, bilder, FAQ, tilgjengelighet)     │
│  - Metadata (status, opprettet, oppdatert)                 │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┬─────────────────────┐
        │                     │                     │                     │
        ▼                     ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│    Lokaler    │   │ Arrangementer │   │     Sport     │   │     Torg      │
│               │   │               │   │   (Baner)     │   │   (Utstyr)    │
│ + Kapasitet   │   │ + Arrangør    │   │               │   │               │
│ + Rom-struktur│   │ + Program     │   │ + Bane-info   │   │ + Antall      │
│ + Tilgang     │   │ + Kapasitet   │   │ + Multi-bane  │   │ + Tilstand    │
│ + Utstyr      │   │ + Påmelding   │   │ + Prioritet   │   │ + Utlån       │
│ + Støy        │   │ + Avlysning   │   │ + Vedlikehold │   │ + Henting     │
│               │   │ + Dokumenter  │   │               │   │ + Depositum   │
└───────────────┘   └───────────────┘   └───────────────┘   └───────────────┘
```

### 2.2 Relasjoner

```
Utleieobjekt ──────────┬──────── Kontakter (1:N)
                       ├──────── Bilder (1:N)
                       ├──────── Vedlegg (1:N)
                       ├──────── Målgrupper (1:N)
                       ├──────── Prisplaner (1:N)
                       ├──────── Blackout-perioder (1:N)
                       ├──────── Tilleggstjenester (1:N)
                       └──────── Tillatelser (1:N)

Lokaler ───────────────┬──────── Underrom (1:N)
                       ├──────── Bordoppsett (1:N)
                       └──────── Inkludert utstyr (1:N)

Arrangementer ─────────┬──────── Eventdatoer (1:N)
                       ├──────── Billettyper (1:N)
                       ├──────── Programposter (1:N)
                       └──────── Dokumentkrav (1:N)

Sport ─────────────────┬──────── Baner/Soner (1:N)
                       ├──────── Tidsluker per bane (1:N)
                       └──────── Vedlikeholdslogg (1:N)

Torg ──────────────────┬──────── Vedlikeholdslogg (1:N)
                       └──────── Skadehistorikk (1:N)
```

---

## 3. BaseResource - Felles modell

Alle utleieobjekter arver fra `BaseResource` som inneholder felles felt.

### 3.1 Identity (Identitet)

| Felt | Type | Handling | Beskrivelse |
|------|------|----------|-------------|
| `objectId` | UUID | Auto-generert | Unik identifikator |
| `displayName` | string | **Admin skriver inn** | Synlig navn for publikum |
| `slug` | string | Auto-generert | URL-vennlig ID basert på displayName |
| `ownerUnit` | string | Auto-satt | Settes fra innlogget admin sin enhet |

**Admin skriver kun:**
```json
{
  "displayName": "Møterom Y - Kragerø"
}
```

**Systemet genererer:**
```json
{
  "objectId": "550e8400-e29b-41d4-a716-446655440001",
  "displayName": "Møterom Y - Kragerø",
  "slug": "moeterom-y-kragero",
  "ownerUnit": "Kultur og idrett"
}
```

### 3.2 Location (Lokasjon og tilgang)

| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `address.street` | string | Ja | Gateadresse |
| `address.postalCode` | string | Ja | Postnummer |
| `address.postalArea` | string | Ja | Poststed |
| `address.building` | string | Nei | Byggnavn |
| `address.roomNumber` | string | Nei | Romnummer/sone |
| `address.floor` | string | Nei | Etasje |
| `map.lat` | number | Ja | Breddegrad |
| `map.lng` | number | Ja | Lengdegrad |
| `meetingPoint` | string | Anbefalt | "Møt opp her"-tekst |
| `directionsText` | string | Nei | Veibeskrivelse |
| `accessType` | enum | Ja | `code`, `reception`, `janitor`, `digital`, `physical_key` |
| `accessCode` | string | Betinget | Tilgangskode (kryptert) |
| `accessInstructions` | string | Ja | Detaljerte tilgangsinstrukser |
| `keyPickupLocation` | string | Betinget | Hvor hentes nøkkel |
| `keyPickupHours` | string | Betinget | Hentetider for nøkkel |
| `keyReturnDeadline` | string | Betinget | Frist for retur av nøkkel |
| `parkingInfo` | string | Nei | Parkering og innlasting |
| `parkingSpots` | number | Nei | Antall parkeringsplasser |
| `loadingZone` | boolean | Nei | Har lastesone |
| `loadingZoneHours` | string | Nei | Tider for lastesone |

**Tilgangstyper:**
| Type | Beskrivelse | Bruksområde |
|------|-------------|-------------|
| `code` | Tastekode ved inngang | Selvbetjente lokaler |
| `reception` | Hent nøkkel i resepsjon | Bemannede bygg |
| `janitor` | Avtale med vaktmester | Etter arbeidstid |
| `digital` | App/BankID-basert | Moderne bygg |
| `physical_key` | Fysisk nøkkel | Eldre bygg |

### 3.3 Audience (Målgruppe og synlighet)

| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `visibility` | array | Ja | Hvem kan *se* objektet |
| `bookableBy` | array | Ja | Hvem kan *booke* objektet |
| `priorityRules` | array | Nei | Prioriteringsregler ved konflikt |
| `restrictions.requireOrgNumber` | boolean | Nei | Krever organisasjonsnummer |
| `restrictions.requireResponsibleAdult` | boolean | Nei | Krever ansvarlig voksen (18+) |
| `restrictions.minAge` | number | Nei | Minimum alder |
| `restrictions.maxAge` | number | Nei | Maksimum alder |
| `restrictions.allowedOrganizationTypes` | array | Nei | Tillatte organisasjonstyper |
| `restrictions.blockedOrganizations` | array | Nei | Blokkerte organisasjoner |
| `restrictions.membershipRequired` | boolean | Nei | Krever medlemskap |
| `restrictions.verificationLevel` | enum | Nei | `none`, `email`, `phone`, `bankid` |

**Synlighetstyper:**
| Type | Beskrivelse |
|------|-------------|
| `public` | Alle kan se |
| `organization` | Kun organisasjoner/lag/foreninger |
| `internal` | Kun kommunalt ansatte |
| `admin_only` | Kun administratorer |

### 3.4 TimeLogic (Tidslogikk)

| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `defaultBookingLength` | number | Ja | Standard lengde i minutter |
| `minDuration` | number | Ja | Minimum varighet i minutter |
| `maxDuration` | number | Ja | Maksimum varighet i minutter |
| `bufferBefore` | number | Nei | Rigg-tid før booking (minutter) |
| `bufferAfter` | number | Nei | Rydd-tid etter booking (minutter) |
| `minLeadTime` | number | Nei | Minste tid før booking (timer) |
| `maxLeadTime` | number | Nei | Maks tid før booking (dager) |
| `maxBookingsPerUser.perDay` | number | Nei | Maks bookinger per dag per bruker |
| `maxBookingsPerUser.perWeek` | number | Nei | Maks bookinger per uke |
| `maxBookingsPerUser.perMonth` | number | Nei | Maks bookinger per måned |
| `maxBookingsPerUser.activeBookings` | number | Nei | Maks samtidige aktive bookinger |

**Blackout-perioder:**
```typescript
interface BlackoutPeriod {
  id: string
  name: string           // "Sommerferie", "Vedlikehold"
  fromDate: string       // ISO dato
  toDate: string         // ISO dato
  reason: string         // Beskrivelse
  recurring: boolean     // Gjentas årlig
  visible: boolean       // Synlig for brukere
}
```

**Avbestillingsregler:**
```typescript
interface CancellationRules {
  cutoffHours: number              // Timer før booking
  allowPartialCancellation: boolean
  lateCancellationFee: number      // Gebyr for sen avbestilling
  lateCancellationThreshold: number // Timer for "sen"
  refundPolicy: 'full' | 'partial' | 'none'
  refundPercentage?: number
}
```

**No-show regler:**
```typescript
interface NoShowRules {
  fee: number                      // Gebyr
  warningCount: number             // Advarsler før konsekvens
  consequenceAction: 'none' | 'fee' | 'block_temporary' | 'block_permanent'
  blockDurationDays?: number
}
```

### 3.5 Pricing (Pris og økonomi)

| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `isFree` | boolean | Ja | Gratis eller betalt |
| `basePrice` | number | Betinget | Grunnpris (hvis betalt) |
| `priceModel` | string | Betinget | "per time", "per dag", "per billett" |
| `currency` | string | Ja | Valuta (default: "NOK") |
| `vatRate` | number | Betinget | MVA-sats (0, 12, 25) |
| `vatIncluded` | boolean | Betinget | MVA inkludert i pris |
| `exemptFromVat` | boolean | Nei | Fritatt fra MVA |
| `feeCode` | string | Nei | Kommunal gebyr-kode |

**Målgruppepriser:**
```typescript
interface TargetGroup {
  id: string
  group: string                    // "Ideell", "Kommersiell", "Barn og unge"
  price: number                    // Pris for denne gruppen
  free: boolean                    // Gratis for gruppen
  discountPercent?: number         // Alternativt: rabatt i prosent
  requiresVerification?: boolean   // Krever verifisering
}
```

**Prisplaner (tidsbasert):**
```typescript
interface PricePlan {
  id: string
  name: string
  price: number
  conditions: {
    dayOfWeek?: string[]           // "Mandag", "Tirsdag"...
    timeFrom?: string              // "08:00"
    timeTo?: string                // "16:00"
    minDuration?: number           // Minutter
  }
  priority: number                 // Ved overlapp
}
```

**Depositum:**
```typescript
interface DepositConfig {
  required: boolean
  amount: number
  triggers: string[]               // ["alkohol", "over_100_personer"]
  refundConditions: string         // Betingelser for refusjon
  refundTimeline: number           // Dager til refusjon
  deductionRules: string           // Regler for trekk
}
```

**Avgifter:**
```typescript
interface Fee {
  id: string
  name: string                     // "Renhold", "Vakthold"
  amount: number
  type: 'fixed' | 'per_hour' | 'per_day' | 'percentage'
  category: 'cleaning' | 'security' | 'setup' | 'equipment' | 'damage' | 'late' | 'other'
  mandatory: boolean
  conditions?: string
}
```

**Betalingsmetoder:**
```typescript
interface PaymentMethod {
  id: string
  type: 'card' | 'vipps' | 'invoice' | 'ehf' | 'cash' | 'free'
  enabled: boolean
  accountNumber?: string
  settings?: Record<string, unknown>
}
```

### 3.6 Workflow (Arbeidsflyt og etterlevelse)

| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `approvalMode` | enum | Ja | `automatic`, `manual`, `conditional` |
| `approvalSteps` | array | Nei | Godkjenningstrinn |
| `autoApprovalConditions` | array | Nei | Betingelser for auto-godkjenning |
| `prePublishChecklist` | array | Auto | Sjekkliste før publisering |
| `documentRequirements` | array | Nei | Påkrevde dokumenter |
| `termsAcceptance.required` | boolean | Nei | Krever aksept av vilkår |
| `termsAcceptance.documentUrl` | string | Betinget | URL til vilkårsdokument |
| `termsAcceptance.signatureRequired` | boolean | Nei | Krever signatur |
| `termsAcceptance.digitalSignature` | boolean | Nei | Digital signatur (BankID) |

**Godkjenningstrinn:**
```typescript
interface ApprovalStep {
  id: string
  order: number
  name: string
  role: string                     // Rolle som kan godkjenne
  required: boolean
  autoApprove: boolean
  autoApproveConditions?: string[]
  notifyOnSubmit: boolean
  escalationHours?: number         // Timer før eskalering
}
```

**Auto-godkjenning betingelser:**
```typescript
interface AutoApprovalCondition {
  id: string
  name: string
  conditions: {
    targetGroups?: string[]        // Godkjennes for disse gruppene
    maxDuration?: number           // Maks varighet
    maxCapacity?: number           // Maks antall deltakere
    excludeDates?: string[]        // Datoer som IKKE auto-godkjennes
    requirePreviousBooking?: boolean
  }
}
```

### 3.7 Content (Innhold og kvalitet)

| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `shortDescription` | string | Ja | Kort beskrivelse (maks 200 tegn) |
| `longDescription` | string | Anbefalt | Lang beskrivelse |
| `gallery` | array | Anbefalt | Bilder |
| `attachments` | array | Nei | Vedlegg (PDF, etc.) |
| `languages` | array | Nei | Støttede språk |
| `translations` | object | Nei | Oversettelser |
| `faq` | array | Anbefalt | Ofte stilte spørsmål |
| `guidelines` | string | Anbefalt | Retningslinjer/husregler |
| `accessibilityInfo` | object | Anbefalt | Tilgjengelighetsinformasjon |
| `keywords` | array | Nei | Søkeord |

**Galleri-bilde:**
```typescript
interface GalleryImage {
  id: string
  url: string
  thumbnailUrl?: string
  caption?: string
  isPrimary: boolean
  order: number
}
```

**Vedlegg:**
```typescript
interface Attachment {
  id: string
  name: string
  type: 'pdf' | 'image' | 'document'
  url: string
  uploadedAt: string
  category: 'rules' | 'floor_plan' | 'fire_instructions' | 'terms' | 'permit' | 'other'
}
```

**Tilgjengelighetsinformasjon:**
```typescript
interface AccessibilityInfo {
  summary: string
  universalDesign: {
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
  wheelchairAccessible: boolean
  hearingAidsCompatible: boolean
  visualAidsAvailable: boolean
  assistanceAvailable: boolean
  assistanceBookingRequired: boolean
  additionalInfo: string
}
```

### 3.8 Metadata

| Felt | Type | Beskrivelse |
|------|------|-------------|
| `status` | enum | `draft`, `pending_review`, `published`, `archived`, `suspended` |
| `createdAt` | datetime | Opprettelsestidspunkt |
| `createdBy` | string | Hvem opprettet |
| `updatedAt` | datetime | Sist oppdatert |
| `updatedBy` | string | Hvem oppdaterte |
| `publishedAt` | datetime | Publiseringstidspunkt |
| `archivedAt` | datetime | Arkiveringstidspunkt |
| `version` | number | Versjonsnummer |
| `importSource` | string | Kilde ved import |
| `lastBooking` | datetime | Siste booking |
| `totalBookings` | number | Totalt antall bookinger |
| `rating` | number | Gjennomsnittsrating |
| `reviewCount` | number | Antall anmeldelser |

---

## 4. Lokaler - Datamodell

Lokaler utvider BaseResource med rom-spesifikke felt.

### 4.1 Kapasitet

```typescript
interface VenueCapacity {
  maxPersons: number              // Obligatorisk
  seatedCapacity: number          // Anbefalt
  standingCapacity: number        // Anbefalt
  fireCapacity: number            // Brannforskrift - anbefalt hvis > 50
  tableLayouts: TableLayout[]     // Bordoppsett
}

interface TableLayout {
  id: string
  name: string                    // "U-form", "Klasserom", "Bankett"
  capacity: number
  description?: string
  imageUrl?: string
}
```

### 4.2 Rom-struktur

```typescript
interface RoomStructure {
  isDivisible: boolean            // Kan deles i underrom
  subRooms: SubRoom[]
  canBookSimultaneously: boolean  // Flere samtidige bookinger
  sharedFacilities: string[]      // Delte fasiliteter
  adjacentRooms: string[]         // Tilstøtende rom (for varsling)
  parentRoomId?: string           // Hvis dette er et underrom
}

interface SubRoom {
  id: string
  name: string
  capacity: number
  size: number                    // m²
  canBookSeparately: boolean
  priceAdjustment?: number
}
```

### 4.3 Tilgang

```typescript
interface VenueAccess {
  keyType: AccessType
  keyPickupLocation: string
  keyPickupHours: string
  keyReturnDeadline: string
  keyDeposit?: number
  setupTimeMinutes: number        // Riggetid
  teardownTimeMinutes: number     // Ryddetid
  cleaningIncluded: boolean
  cleaningFee?: number
  cleaningInstructions?: string
  selfServiceCleaning: boolean
}
```

### 4.4 Utstyr

```typescript
interface VenueEquipment {
  includedEquipment: EquipmentItem[]
  availableForRent: EquipmentItem[]
  externalEquipmentAllowed: boolean
  techSupportAvailable: boolean
  techSupportFee?: number
  techSupportHours?: string
}

interface EquipmentItem {
  id: string
  name: string
  quantity: number
  included: boolean
  rentalPrice?: number
  description?: string
}
```

### 4.5 Støyregler

```typescript
interface NoiseRules {
  maxDecibelLevel: number | null
  quietHoursFrom: string          // "23:00"
  quietHoursTo: string            // "07:00"
  musicAllowed: boolean
  amplifiedSoundAllowed: boolean
  livePerformanceAllowed: boolean
  neighborNotificationRequired: boolean
  noiseComplaintProcess: string
}
```

### 4.6 Fasiliteter (standardliste)

```typescript
const VENUE_FACILITIES = [
  'Kjøkken',
  'Garderobe',
  'Dusj',
  'Parkering',
  'WiFi',
  'Projektor/TV',
  'Lydanlegg',
  'Scene',
  'Kiosk',
  'Catering',
  'Teleslynge',
  'Toalett',
  'HC-toalett',
  'Vertskap/betjening',
  'Aircondition',
  'Whiteboard',
  'Flipover',
  'Videokonferanse'
]
```

---

## 5. Arrangementer - Datamodell

Arrangementer er hendelser med billetter/påmelding.

### 5.1 Arrangørinfo

```typescript
interface OrganizerInfo {
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
  previousEvents?: number         // Antall tidligere arrangementer
  verificationStatus: 'unverified' | 'verified' | 'trusted'
}
```

### 5.2 Program

```typescript
interface EventProgram {
  checkInTime: string
  doorsOpenTime: string
  startTime: string
  endTime: string
  breaks: EventBreak[]
  programItems: ProgramItem[]
}

interface EventBreak {
  id: string
  name: string
  startTime: string
  duration: number                // Minutter
}

interface ProgramItem {
  id: string
  title: string
  description?: string
  startTime: string
  duration: number                // Minutter
  presenter?: string
  location?: string               // Hvis flere rom/scener
}
```

### 5.3 Kapasitet og billetter

```typescript
interface EventCapacity {
  totalCapacity: number
  ticketTypes: TicketType[]
  sections: EventSection[]
  waitlistCapacity: number
}

interface TicketType {
  id: string
  name: string                    // "Voksen", "Barn", "Student"
  price: number
  quantity: number
  availableQuantity: number
  description?: string
  restrictions?: string           // "Krever gyldig studentbevis"
  salesStart?: string
  salesEnd?: string
  maxPerOrder: number
}

interface EventSection {
  id: string
  name: string                    // "Parterre", "Balkong"
  capacity: number
  priceAdjustment: number
  accessibility: boolean          // HC-tilpasset
}
```

### 5.4 Påmelding

```typescript
interface EventRegistration {
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
```

### 5.5 Avlysning og refusjon

```typescript
interface EventCancellation {
  cancellationDeadlineHours: number
  refundPolicy: 'full' | 'partial' | 'none'
  partialRefundPercentage?: number
  refundDeadlineDays: number
  weatherCancellation: boolean
  weatherPolicy?: string
  minParticipantsRequired: number | null
  minParticipantsDeadlineHours: number
  cancellationNotificationMethods: ('email' | 'sms' | 'push')[]
  alternativeDatePolicy?: string
}
```

### 5.6 Dokumentkrav

```typescript
interface EventDocumentRequirements {
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

interface PermitRequirement {
  required: boolean
  status: 'not_required' | 'pending' | 'approved' | 'rejected' | 'expired'
  applicationDeadlineDays: number
  documentId?: string
  expiryDate?: string
  notes?: string
}
```

### 5.7 Sted-tilknytning

```typescript
interface EventVenue {
  type: 'linked_venue' | 'linked_outdoor' | 'custom_address'
  linkedVenueId?: string          // Kobling til Lokaler
  linkedOutdoorId?: string        // Kobling til Torg
  customAddress?: Address         // Egen adresse
  venueRequirements?: string
  setupRequirements?: string
}
```

---

## 6. Sport - Datamodell

Sport dekker **idrettsbaner** - tidsbaserte ressurser som kan bookes i definerte tidsrom. Ett sport-objekt kan inneholde **flere baner/soner**, der hver bane har sin egen kalender.

### 6.1 Bane-info (Court)

```typescript
interface SportCourtInfo {
  surface: string                 // "Grus", "Kunstgress", "Parkett"
  dimensions: { length: number; width: number }
  indoor: boolean
  lighting: boolean
  lightingHours?: string
  heatingAvailable: boolean
  heatingIncluded: boolean
  heatingFee?: number
  markings: string[]              // Linjer for ulike sporter
}
```

### 6.2 Multi-bane struktur

Ett sport-objekt kan ha flere baner/soner som bookes individuelt. Kalenderen vises som en matrise med baner som rader og tidsluker som kolonner.

```typescript
interface MultiCourtStructure {
  courts: Court[]
  sharedFacilities: string[]      // Garderobe, dusj, klubbhus
  commonRules: string             // Felles regler for alle baner
  bookingRules: CourtBookingRules
}

interface CourtBookingRules {
  slotDurationMinutes: 30 | 45 | 60   // Admin velger: 30, 45 eller 60 min per tidsluke
  minDurationMinutes: number          // Min. varighet kunde kan booke (f.eks. 30, 60, 90)
  maxDurationMinutes: number          // Maks varighet kunde kan booke (f.eks. 60, 90, 120)
  bufferMinutes: number               // Buffer mellom bookinger (rigg/rydd)
  advanceBookingDays: number          // Hvor langt frem kan man booke
  cancellationHours: number           // Timer før for gratis avbestilling
}

interface Court {
  id: string
  name: string                    // "Bane 1", "Bane 2", "Hovedbane"
  courtInfo: SportCourtInfo
  status: 'available' | 'maintenance' | 'closed'
  priceAdjustment?: number        // Kan ha ulik pris per bane
  bookingSlots: BookingSlot[]
  bookingRulesOverride?: Partial<CourtBookingRules>  // Overstyr felles regler for denne banen
}

interface BookingSlot {
  id: string
  courtId: string
  dayOfWeek: string               // "Mandag", "Tirsdag"...
  timeFrom: string                // "08:00"
  timeTo: string                  // "09:00"
  status: 'available' | 'booked' | 'blocked'
  bookedBy?: string
  bookingId?: string
}
```

**Eksempel: Multi-bane kalender (Drammen Padel)**
```
              08:00   09:00   10:00   11:00   12:00   13:00   ...
            ┌───────┬───────┬───────┬───────┬───────┬───────┐
  Bane 1    │ Ledig │Opptatt│ Ledig │ Ledig │Opptatt│ Ledig │
            ├───────┼───────┼───────┼───────┼───────┼───────┤
  Bane 2    │Opptatt│ Ledig │ Ledig │Opptatt│ Ledig │ Ledig │
            ├───────┼───────┼───────┼───────┼───────┼───────┤
  Bane 3    │ Ledig │ Ledig │Opptatt│ Ledig │ Ledig │Opptatt│
            ├───────┼───────┼───────┼───────┼───────┼───────┤
  Bane 4    │ Ledig │Opptatt│ Ledig │ Ledig │ Ledig │ Ledig │
            └───────┴───────┴───────┴───────┴───────┴───────┘
```

**Eksempel: Booking-regler**
```json
{
  "slotDurationMinutes": 60,     // Admin velger 60 min tidsluker
  "minDurationMinutes": 60,      // Kunde må booke minst 1 time
  "maxDurationMinutes": 120,     // Kunde kan booke maks 2 timer
  "bufferMinutes": 0,
  "advanceBookingDays": 14,
  "cancellationHours": 24
}
```

**Tilgjengelige tidsluke-valg for admin:**
| Varighet | Eksempel på min/max kombinasjoner |
|----------|-----------------------------------|
| 30 min   | Min: 30, 60, 90 / Max: 60, 90, 120 |
| 45 min   | Min: 45, 90 / Max: 90, 135, 180 |
| 60 min   | Min: 60, 120 / Max: 120, 180, 240 |

### 6.3 Prioritetsregler

```typescript
interface CourtPriorityRules {
  levels: ('training' | 'match' | 'tournament' | 'event')[]
  trainingPriority: string[]      // Org-IDer med treningsprioritet
  matchPriority: string[]         // Org-IDer med kampprioritet
  tournamentRequiresApproval: boolean
  eventRequiresApproval: boolean
  localClubPriority: boolean
  localClubIds: string[]
}
```

### 6.4 Vedlikehold

```typescript
interface CourtMaintenance {
  status: 'available' | 'limited' | 'maintenance' | 'closed'
  nextMaintenance?: string
  maintenanceSchedule: MaintenanceEntry[]
  lastInspection?: string
  inspectionFrequency: number     // Dager mellom inspeksjoner
}

interface MaintenanceEntry {
  id: string
  date: string
  type: string
  description: string
  performedBy?: string
  nextScheduled?: string
}
```

### 6.5 Brukerkrav

```typescript
interface UserRequirements {
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
```

---

## 7. Torg - Datamodell

Torg håndterer **utleibart utstyr og objekter** - antallsbaserte ressurser som kan lånes ut.

### 7.1 Utstyrsinventar

```typescript
interface EquipmentInventory {
  totalUnits: number
  availableUnits: number
  unitDescription: string
  setContents: string[]           // Hva inneholder ett sett
  serialNumbers?: string[]
  purchaseDate?: string
  expectedLifespan?: number       // Måneder
}
```

### 7.2 Tilstand og vedlikehold

```typescript
interface EquipmentCondition {
  status: 'good' | 'fair' | 'poor' | 'needs_repair'
  lastInspection: string
  nextInspection: string
  maintenanceLog: MaintenanceEntry[]
  damageHistory: DamageEntry[]
}

interface MaintenanceEntry {
  id: string
  date: string
  type: string
  description: string
  performedBy?: string
  nextScheduled?: string
}

interface DamageEntry {
  id: string
  date: string
  description: string
  repairCost?: number
  repairedDate?: string
  reportedBy: string
  bookingId?: string
}
```

### 7.3 Utlånskonfigurasjon

```typescript
interface LoanConfig {
  maxLoanDurationDays: number
  pickupRequired: boolean
  deliveryAvailable: boolean
  deliveryFee?: number
  pickupLocation: string
  pickupHours: string
  returnDeadlineTime: string
  lateReturnFeePerDay: number
  graceHours: number              // Timer etter frist før gebyr
}
```

### 7.4 Depositum og skadehåndtering

```typescript
interface EquipmentDeposit {
  baseAmount: number
  maxDeposit: number
  inspectionProcess: {
    preInspectionRequired: boolean   // Ved utlevering
    postInspectionRequired: boolean  // Ved retur
    photoDocumentationRequired: boolean
  }
  damageHandling: {
    deductionProcess: string
    disputeDeadlineDays: number
  }
}
```

### 7.5 Utlåns-livssyklus

```
┌─────────────┐
│ Tilgjengelig│
└──────┬──────┘
       │ Booking bekreftet
       ▼
┌─────────────┐
│  Reservert  │
└──────┬──────┘
       │ Hentet av låner
       ▼
┌─────────────┐         ┌─────────────┐
│  Utlevert   │────────►│  Forsinket  │
└──────┬──────┘ Frist   └──────┬──────┘
       │ passert               │
       │ Innlevering           │
       ▼                       │
┌─────────────┐                │
│ Under retur │◄───────────────┘
└──────┬──────┘
       │ Inspeksjon
       ▼
┌─────────────┐         ┌─────────────┐
│   Sjekket   │────────►│ Vedlikehold │
└──────┬──────┘ Skade   └──────┬──────┘
       │ OK                    │ Reparert
       ▼                       │
┌─────────────┐◄───────────────┘
│ Tilgjengelig│
└─────────────┘
```

---

## 8. Wizard-flyt og UI

### 8.1 Steg per kategori

#### Lokaler (5 steg)
| Steg | Navn | Innhold |
|------|------|---------|
| 1 | Lokasjon | Identitet, adresse, kart, beskrivelse, kontakter, media, egenskaper, fasiliteter, universell utforming, tilleggstjenester |
| 2 | Tilgjengelighet | Type (tidsintervall/dag), intervall, åpningstider, unntak, blackout-perioder |
| 3 | Regler | Godkjenningsmodus, begrensninger, paraplydisponering, tidslogikk |
| 4 | Pris og betaling | Prismodell, målgrupper, betalingsmetoder, depositum, avgifter, vilkår |
| 5 | Publisering | Synlighet, målgrupper, sjekkliste, oppsummering |

#### Sport (5 steg)
| Steg | Navn | Innhold |
|------|------|---------|
| 1 | Lokasjon | Identitet, adresse, bane-info (underlag, dimensjoner, belysning), multi-bane oppsett |
| 2 | Tilgjengelighet | Åpningstider per bane, tidsluker |
| 3 | Regler | Godkjenning, prioritetsregler, vedlikeholdsstatus |
| 4 | Pris/Depositum | Priser per bane, betalingsmetoder |
| 5 | Publisering | Synlighet, sjekkliste |

#### Arrangementer (5 steg)
| Steg | Navn | Innhold |
|------|------|---------|
| 1 | Tidspunkter | Eventdatoer, program, varighet, gjentagelse |
| 2 | Kapasitet | Billettyper, soner, venteliste |
| 3 | Pris | Billettpriser, målgrupper, betalingsmetoder |
| 4 | Vilkår | Avbestilling, refusjon, dokumentkrav, tillatelser |
| 5 | Publisering | Synlighet, arrangørinfo, sjekkliste |

#### Torg (6 steg)
| Steg | Navn | Innhold |
|------|------|---------|
| 1 | Hentested | Identitet, hentested/plassering, utstyrsbeskrivelse |
| 2 | Antall/Lager | Tilgjengelig mengde, enheter, tilstand |
| 3 | Tilgjengelighet | Dag/antall-basert, hentetider |
| 4 | Regler | Godkjenning, utlånsregler, returfrister |
| 5 | Pris/Depositum | Priser, depositum, skadehåndtering |
| 6 | Publisering | Sjekkliste, synlighet |

### 8.2 UI-komponenter

```
┌─────────────────────────────────────────────────────────────────────┐
│ Header                                                               │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Opprett utleieobjekt                                            │ │
│ │ 1 Lokasjon > 2 Tilgjengelighet > 3 Regler > 4 Pris > 5 Publiser│ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ ┌─────────────────────────┐ │
│ │ Hovedinnhold (2/3)                  │ │ Sidepanel (1/3)         │ │
│ │                                     │ │                         │ │
│ │ ┌─────────────────────────────────┐ │ │ ┌─────────────────────┐ │ │
│ │ │ Seksjon 1                       │ │ │ │ Status              │ │ │
│ │ │ [Felt 1]                        │ │ │ │ ● Utkast            │ │ │
│ │ │ [Felt 2]                        │ │ │ └─────────────────────┘ │ │
│ │ │ [Felt 3]                        │ │ │                         │ │
│ │ └─────────────────────────────────┘ │ │ ┌─────────────────────┐ │ │
│ │                                     │ │ │ Sjekkliste          │ │ │
│ │ ┌─────────────────────────────────┐ │ │ │ ✓ Navn              │ │ │
│ │ │ Seksjon 2                       │ │ │ │ ✓ Adresse           │ │ │
│ │ │ [Felt 4]                        │ │ │ │ ○ Bilder            │ │ │
│ │ │ [Felt 5]                        │ │ │ │ ○ Kontakter         │ │ │
│ │ └─────────────────────────────────┘ │ │ └─────────────────────┘ │ │
│ │                                     │ │                         │ │
│ └─────────────────────────────────────┘ │ ┌─────────────────────┐ │ │
│                                         │ │ Oppsummering        │ │ │
│                                         │ │ Møterom Y           │ │ │
│                                         │ │ 500 kr/time         │ │ │
│                                         │ │ 30 personer         │ │ │
│                                         │ └─────────────────────┘ │ │
│                                         └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Footer                                                               │
│ [Avbryt] [Lagre utkast]                        [← Tilbake] [Neste →]│
└─────────────────────────────────────────────────────────────────────┘
```

### 8.3 Komponent-oversikt

| Komponent | Beskrivelse |
|-----------|-------------|
| `StepIndicator` | Viser fremdrift i wizard |
| `SidePanel` | Status, sjekkliste, oppsummering |
| `ValidationMessage` | Inline feilmeldinger |
| `MapPicker` | Velg lokasjon på kart |
| `OpeningHoursEditor` | Rediger åpningstider |
| `BlackoutPeriodEditor` | Legg til sperringer |
| `TargetGroupPricing` | Målgruppepriser |
| `PermitTracker` | Tillatelse-status |
| `DocumentUploader` | Last opp dokumenter |
| `ContactEditor` | Rediger kontakter |
| `GalleryManager` | Håndter bilder |

---

## 9. Validering og sjekklister

### 9.1 Valideringstyper

| Type | Beskrivelse | UI |
|------|-------------|-----|
| **Hard** | Blokkerer lagring/publisering | Rød kant, feilmelding |
| **Soft** | Advarsel, tillater fortsettelse | Gul kant, varsel |

### 9.2 Hard validering (alle kategorier)

| Felt | Regel |
|------|-------|
| `displayName` | Påkrevd, min 3 tegn |
| `address.street` | Påkrevd |
| `address.postalCode` | Påkrevd, 4 siffer |
| `address.postalArea` | Påkrevd |
| `accessType` | Påkrevd |
| `accessInstructions` | Påkrevd |
| `workflow.approvalMode` | Påkrevd |
| Hvis `isFree = false`: | |
| `basePrice` | Påkrevd, > 0 |
| `paymentMethods` | Minst 1 |

### 9.3 Kategori-spesifikk validering

#### Lokaler
| Felt | Type | Regel |
|------|------|-------|
| `venueCapacity.maxPersons` | Hard | Påkrevd, > 0 |
| `venueCapacity.fireCapacity` | Soft | Anbefalt hvis maxPersons > 50 |
| `venueAccess.keyType` | Hard | Påkrevd |
| `openingHours` | Hard | Minst 1 aktiv dag (eller presentationOnly) |

#### Arrangementer
| Felt | Type | Regel |
|------|------|-------|
| `organizer.responsiblePerson` | Hard | Alle felt påkrevd |
| `eventCapacity.totalCapacity` | Hard | Påkrevd, > 0 |
| `program.startTime` | Hard | Påkrevd |
| `program.endTime` | Hard | Påkrevd, etter startTime |
| `registration.deadline` | Hard | Før første eventDate |
| `documentRequirements.*` | Soft | Varsel hvis krav ikke oppfylt |

#### Sport
| Felt | Type | Regel |
|------|------|-------|
| `courtInfo.surface` | Hard | Påkrevd |
| `courtInfo.indoor` | Hard | Påkrevd |
| `openingHours` | Hard | Minst 1 aktiv dag |

#### Torg
| Felt | Type | Regel |
|------|------|-------|
| `inventory.totalUnits` | Hard | Påkrevd, > 0 |
| `loan.pickupLocation` | Hard | Påkrevd |
| `loan.maxLoanDurationDays` | Hard | Påkrevd, > 0 |

### 9.4 Publiserings-sjekkliste

#### Obligatoriske (blokkerer)
- [ ] Navn og adresse komplett
- [ ] Tilgjengelighet definert (eller "kun presentasjon")
- [ ] Godkjenningsmodus valgt
- [ ] Pris definert (hvis betalt)
- [ ] Betalingsmetode satt (hvis betalt)

#### Anbefalte (viser varsel)
- [ ] Bilder lastet opp (minst 1)
- [ ] Lang beskrivelse fylt ut
- [ ] Kontaktperson oppgitt
- [ ] Universell utforming dokumentert
- [ ] Vilkår-PDF lastet opp
- [ ] FAQ lagt til

#### Kategori-spesifikke
**Lokaler:**
- [ ] Kapasitet i flere dimensjoner
- [ ] Tilgangsinstrukser
- [ ] Branninstruks lastet opp

**Arrangementer:**
- [ ] Arrangør-info komplett
- [ ] Alle påkrevde tillatelser søkt/godkjent
- [ ] Avbestillingsregler definert

**Sport:**
- [ ] Bane-info komplett (underlag, dimensjoner)
- [ ] Alle baner/soner definert med egne tider
- [ ] Vedlikeholdsstatus oppdatert

**Torg:**
- [ ] Antall enheter definert
- [ ] Hentested oppgitt
- [ ] Utlånsregler definert

---

## 10. Statuser og livssyklus

### 10.1 Objekt-status

```
┌─────────┐
│  Draft  │◄──────────────────────────────────────┐
└────┬────┘                                       │
     │ Send til godkjenning                       │
     ▼                                            │
┌─────────────────┐                               │
│ Pending Review  │                               │
└────────┬────────┘                               │
         │                                        │
    ┌────┴────┐                                   │
    ▼         ▼                                   │
┌────────┐ ┌────────┐                             │
│Godkjent│ │Avslått │──────────────────────────────┘
└───┬────┘ └────────┘
    │ Publiser
    ▼
┌─────────────┐
│  Published  │
└──────┬──────┘
       │
  ┌────┴────┐
  ▼         ▼
┌─────────┐ ┌───────────┐
│Archived │ │ Suspended │
└─────────┘ └───────────┘
```

| Status | Beskrivelse | Synlig | Bookbar |
|--------|-------------|--------|---------|
| `draft` | Under arbeid | Nei | Nei |
| `pending_review` | Venter godkjenning | Nei | Nei |
| `published` | Aktiv og tilgjengelig | Ja | Ja |
| `archived` | Avsluttet/utgått | Nei | Nei |
| `suspended` | Midlertidig stoppet | Nei | Nei |

### 10.2 Booking-status (referanse)

| Status | Beskrivelse |
|--------|-------------|
| `pending` | Venter behandling |
| `confirmed` | Bekreftet |
| `rejected` | Avslått |
| `cancelled` | Avbestilt |
| `completed` | Gjennomført |
| `no_show` | Ikke møtt |

---

## 11. Tillatelses-system

### 11.1 Tillatelsestyper

| Type | Beskrivelse | Typisk frist |
|------|-------------|--------------|
| `policePermit` | Politigodkjenning | 14 dager |
| `alcoholPermit` | Skjenkebevilling | 30 dager |
| `noiseExemption` | Støydispensasjon | 7 dager |
| `roadClosure` | Veisperring | 21 dager |
| `firePermit` | Branntillatelse | 14 dager |
| `healthPermit` | Mattilsyn | 14 dager |
| `eventPermit` | Arrangementstillatelse | 14 dager |
| `publicGatheringPermit` | Offentlig samling | 14 dager |

### 11.2 Trigger-logikk

```typescript
function evaluatePermitTriggers(event: EventData, triggers: PermitTrigger[]) {
  const requiredPermits: string[] = []
  
  for (const trigger of triggers) {
    let triggered = false
    
    switch (trigger.condition) {
      case 'capacity':
        triggered = compareValue(event.capacity, trigger.threshold, trigger.operator)
        break
      case 'alcohol':
        triggered = event.servesAlcohol === trigger.threshold
        break
      case 'amplified_sound':
        triggered = compareValue(event.soundLevel, trigger.threshold, trigger.operator)
        break
      case 'road_use':
        triggered = event.usesPublicRoad === trigger.threshold
        break
      case 'food':
        triggered = event.servesFood === trigger.threshold
        break
    }
    
    if (triggered) {
      requiredPermits.push(trigger.requiredPermit)
    }
  }
  
  return requiredPermits
}
```

### 11.3 Tillatelses-status UI

```
┌────────────────────────────────────────────────────────┐
│ Tillatelser                                            │
├────────────────────────────────────────────────────────┤
│                                                        │
│ ✓ Politigodkjenning            Godkjent 15.01.2026    │
│ ○ Skjenkebevilling             Venter...              │
│ ✓ Støydispensasjon             Godkjent 10.01.2026    │
│ ─ Veisperring                  Ikke påkrevd           │
│ ✗ Brannvakt                    Mangler søknad!        │
│                                                        │
│ [Se detaljer] [Last opp dokumenter]                   │
└────────────────────────────────────────────────────────┘
```

---

## 12. Implementeringsguide

### 12.1 Tech stack-anbefalinger

| Komponent | Anbefaling | Alternativ |
|-----------|------------|------------|
| Frontend | React + TypeScript | Vue, Svelte |
| State management | Zustand / React Query | Redux, MobX |
| UI-bibliotek | shadcn/ui + Tailwind | Material UI, Chakra |
| Skjemavalidering | Zod + React Hook Form | Yup, Formik |
| Kart | Leaflet / Mapbox | Google Maps |
| Backend | Node.js + Express | .NET, Django |
| Database | PostgreSQL | MongoDB |
| Fillagring | S3 / Azure Blob | Cloudinary |
| Autentisering | Auth0 / BankID | Keycloak |

### 12.2 Database-skjema (PostgreSQL)

```sql
-- Base tabell
CREATE TABLE rental_objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL,
  subcategory VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  
  -- Identity
  slug VARCHAR(255) UNIQUE NOT NULL,
  internal_code VARCHAR(50),
  owner_unit VARCHAR(255) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  internal_name VARCHAR(255),
  
  -- Location (JSONB for fleksibilitet)
  location JSONB NOT NULL,
  
  -- Andre felt som JSONB
  audience JSONB,
  time_logic JSONB,
  pricing JSONB,
  workflow JSONB,
  content JSONB,
  
  -- Kategori-spesifikke felt
  category_data JSONB,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by VARCHAR(255),
  published_at TIMESTAMP WITH TIME ZONE,
  version INTEGER DEFAULT 1
);

-- Indekser
CREATE INDEX idx_rental_objects_category ON rental_objects(category);
CREATE INDEX idx_rental_objects_status ON rental_objects(status);
CREATE INDEX idx_rental_objects_owner ON rental_objects(owner_unit);
CREATE INDEX idx_rental_objects_slug ON rental_objects(slug);

-- Relaterte tabeller
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_object_id UUID REFERENCES rental_objects(id),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  is_primary BOOLEAN DEFAULT false,
  is_emergency BOOLEAN DEFAULT false
);

CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_object_id UUID REFERENCES rental_objects(id),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_object_id UUID REFERENCES rental_objects(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  category VARCHAR(50),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE blackout_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_object_id UUID REFERENCES rental_objects(id),
  name VARCHAR(255) NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  reason TEXT,
  recurring BOOLEAN DEFAULT false,
  visible BOOLEAN DEFAULT true
);
```

### 12.3 API-endepunkter

| Metode | Endepunkt | Beskrivelse |
|--------|-----------|-------------|
| GET | `/api/rental-objects` | Liste alle objekter |
| GET | `/api/rental-objects/:id` | Hent ett objekt |
| POST | `/api/rental-objects` | Opprett nytt |
| PUT | `/api/rental-objects/:id` | Oppdater objekt |
| PATCH | `/api/rental-objects/:id/status` | Endre status |
| DELETE | `/api/rental-objects/:id` | Slett objekt |
| POST | `/api/rental-objects/:id/publish` | Publiser |
| POST | `/api/rental-objects/:id/archive` | Arkiver |
| GET | `/api/rental-objects/:id/validate` | Valider objekt |
| POST | `/api/rental-objects/:id/duplicate` | Kopier objekt |

### 12.4 Migrasjonsplan

1. **Fase 1: Grunnleggende**
   - Implementer BaseResource
   - Wizard for Lokaler
   - Enkel validering

2. **Fase 2: Sport**
   - Sport-modul (baner)
   - Multi-bane kalender
   - Prioritetsregler

3. **Fase 3: Arrangementer**
   - Arrangement-modul
   - Billetter og påmelding
   - Dokumentkrav

4. **Fase 4: Torg**
   - Torg-modul (utstyr/objekter)
   - Utlånslogikk
   - Depositum og skadehåndtering

5. **Fase 5: Avansert**
   - Integrasjoner (BankID, EHF, Politi)
   - Rapportering
   - Multi-språk

---

## 13. API-spesifikasjon

### 13.1 Create Rental Object

```http
POST /api/rental-objects
Content-Type: application/json

{
  "category": "lokaler",
  "subcategory": "Møterom",
  "identity": {
    "slug": "moeterom-y-kragero",
    "internalCode": "MR-Y-001",
    "ownerUnit": "Kultur og idrett",
    "displayName": "Møterom Y - Kragerø"
  },
  "location": {
    "address": {
      "street": "Kulturveien 1",
      "postalCode": "3770",
      "postalArea": "Kragerø"
    },
    "map": { "lat": 58.8683, "lng": 9.4103 },
    "accessType": "code",
    "accessInstructions": "Kode sendes på SMS"
  },
  // ... resten av feltene
}
```

### 13.2 Response format

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "category": "lokaler",
    "status": "draft",
    "identity": { ... },
    "location": { ... },
    "metadata": {
      "createdAt": "2026-02-06T10:00:00Z",
      "createdBy": "admin@kommune.no",
      "version": 1
    }
  }
}
```

### 13.3 Validation Response

```json
{
  "isValid": false,
  "completionPercentage": 75,
  "errors": [
    {
      "field": "venueCapacity.maxPersons",
      "message": "Kapasitet må være større enn 0",
      "severity": "error",
      "category": "category_specific"
    }
  ],
  "warnings": [
    {
      "field": "content.gallery",
      "message": "Anbefalt å laste opp minst ett bilde",
      "severity": "warning",
      "category": "content"
    }
  ]
}
```

---

## 14. Referanser

### 14.1 Filer i dette prosjektet

| Fil | Beskrivelse |
|-----|-------------|
| `product/sections/offentlig-detaljside-for-utleieobjekt/types.ts` | Komplett TypeScript type-system |
| `product/sections/utleieobjekt-wizard-kommune/spec.md` | Wizard-spesifikasjon |
| `product/sections/utleieobjekt-wizard-kommune/data.json` | Eksempeldata for wizard |
| `src/sections/utleieobjekt-wizard-kommune/UtleieobjektWizardKommune.tsx` | React wizard-komponent |

### 14.2 Relaterte standarder

- **WCAG 2.1**: Universell utforming
- **NS-ISO 8601**: Dato/tid-format
- **EHF**: Elektronisk handelsformat (faktura)
- **GDPR**: Personvern

### 14.3 Kontakt

For spørsmål om denne dokumentasjonen, ta kontakt med utviklingsteamet.

---

*Denne dokumentasjonen er generert og vedlikeholdt som del av Design OS.*
