# Sport - Offentlig Detaljside Dokumentasjon

> **Versjon**: 1.0  
> **Sist oppdatert**: 2026-02-06  
> **Formål**: Komplett dokumentasjon for offentlig detaljside for sportsfasiliteter (padelbaner, fotballbaner, tennisbaner, squashbaner)

---

## Innholdsfortegnelse

1. [Systemoversikt](#1-systemoversikt)
2. [Brukerflyt og interaksjoner](#2-brukerflyt-og-interaksjoner)
3. [Datamodell](#3-datamodell)
4. [UI-komponenter og layout](#4-ui-komponenter-og-layout)
5. [Booking-flyt](#5-booking-flyt)
6. [Kalender-typer og visning](#6-kalender-typer-og-visning)
7. [Pris- og betalingsvisning](#7-pris--og-betalingsvisning)
8. [Tilgjengelighet og responsivt design](#8-tilgjengelighet-og-responsivt-design)
9. [Komponent-spesifikasjon](#9-komponent-spesifikasjon)
10. [Referanser](#10-referanser)

---

## 1. Systemoversikt

### 1.1 Hva er Sport-detaljsiden?

Den offentlige detaljsiden for sport viser komplett informasjon om en idrettsbane eller sportsfasilitet og lar brukere booke tid. Sport-kategorien kjennetegnes av kortere tidsintervaller (typisk 30-60 minutter) og kan inkludere multi-bane visning.

### 1.2 Underkategorier

| Underkategori | Beskrivelse | Typisk intervall |
|---------------|-------------|-----------------|
| **Padelbane** | Innendørs/utendørs padelbaner | 30/60 min |
| **Tennisbane** | Grus, hardcourt eller innendørs | 60 min |
| **Fotballbane** | 5-er, 7-er eller 11-er baner | 60/90 min |
| **Squashbane** | Innendørs squashbaner | 30/45 min |
| **Badmintonbane** | Innendørs badmintonhaller | 30/60 min |
| **Basketbane** | Innendørs basketbaner | 60 min |
| **Svømmehall** | Baneleie i svømmehall | 60 min |
| **Ishall** | Isflate-booking | 60/90 min |

### 1.3 Bookingmodell

Sport-kategorien bruker tidsbasert booking:

| Modell | Beskrivelse | Kalender-komponent |
|--------|-------------|-------------------|
| **Tidsintervall** | Booking per tidsluke (30/45/60 min) | `TimeIntervalCalendar` |

### 1.4 Spesielle funksjoner

- **Multi-bane visning**: Flere baner vises som rader i kalender-matrise
- **Kortere intervaller**: Standard 30 min for padel, 60 min for tennis
- **Prioritetsregler**: Lag/foreninger kan ha prioritet på visse tider
- **Sesongbooking**: Faste tider for organisasjoner

---

## 2. Brukerflyt og interaksjoner

### 2.1 Hovedbrukerflyt

```
┌─────────────────┐
│  Bruker kommer  │
│  til detaljside │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Ser bane-info: │
│  underlag,      │
│  dimensjoner,   │
│  fasiliteter    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Velger bane    │
│  (hvis multi-   │
│  bane anlegg)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Velger         │
│  tidsluke(r)    │
│  fra kalender   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Fyller ut      │
│  detaljer og    │
│  betaler        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Mottar         │
│  bekreftelse    │
└─────────────────┘
```

### 2.2 Interaksjoner

| Handling | Beskrivelse | Resultat |
|----------|-------------|----------|
| Velg bane | Klikk på bane-rad i multi-bane visning | Filtrerer tilgjengelige tider |
| Velg tidsluke | Klikk på ledig celle | Markerer som valgt |
| Velg flere tider | Klikk og dra, eller klikk flere | Sammenhengende booking |
| Endre uke | Klikk piler i kalender | Navigerer til ny uke |

### 2.3 Spesielle interaksjoner for sport

| Scenario | Håndtering |
|----------|------------|
| **Booking over midnatt** | Viser begge dager, teller som sammenhengende |
| **Minimum varighet** | Krever f.eks. minst 60 min (2 × 30 min slots) |
| **Maksimum varighet** | Begrenser f.eks. til 120 min per booking |
| **Buffer mellom bookinger** | Automatisk 5-15 min pause mellom |

---

## 3. Datamodell

### 3.1 SportCourtDetalj Interface

```typescript
interface SportCourtDetalj {
  // Identitet
  id: string
  category: 'sport'
  subcategory?: string                    // "Padel", "Tennis", etc.
  resourceType: 'court'
  name: string
  
  // Lokasjon
  address: string
  postalCode: string
  postalArea: string
  map: { lat: number; lng: number }
  
  // Beskrivelser
  shortDescription: string
  longDescription: string
  
  // Media
  images: string[]
  
  // Bane-spesifikk info
  courtInfo: SportCourtInfo
  maxPersons: number                      // Maks spillere på banen
  size?: string                           // "200 m²"
  
  // Fasiliteter
  facilities: string[]                    // ["Parkering", "Garderobe", "Dusj"]
  universalDesign: UniversalDesign
  
  // Kontakt
  contacts: Contact[]
  
  // Åpningstider
  openingHours: OpeningHour[]
  
  // Booking-konfigurasjon
  rentalUnit: 'hour' | 'day'
  interval: string                        // "30", "45", "60"
  
  // Pris
  pricing: Pricing
  
  // Retningslinjer
  guidelines: string
  faq: FAQItem[]
  
  // Kalender
  calendarData: CalendarData
  
  // Sport-spesifikke felt
  seasonBooking?: SeasonBooking
  priorityRules?: CourtPriorityRules
  maintenance?: CourtMaintenance
}
```

### 3.2 Bane-spesifikke typer

```typescript
interface SportCourtInfo {
  surface: string                         // "Kunstgress", "Grus", "Parkett"
  dimensions: {
    length: number                        // Meter
    width: number                         // Meter
  }
  indoor: boolean
  lighting: boolean
  lightingHours?: string                  // "16:00-23:00"
  heatingAvailable: boolean
  heatingIncluded: boolean
  heatingFee?: number
  markings: string[]                      // ["Padel", "Tennis"]
}

interface SeasonBooking {
  enabled: boolean
  seasonStart: string                     // "2026-08-01"
  seasonEnd: string                       // "2027-05-31"
  frameTimeSlots: FrameTimeSlot[]
  applicationDeadline: string
  allocationMethod: 'first_come' | 'lottery' | 'priority'
}

interface FrameTimeSlot {
  id: string
  dayOfWeek: string                       // "Mandag"
  timeFrom: string                        // "18:00"
  timeTo: string                          // "20:00"
  allocatedTo?: string                    // Lag/forening som har tiden
  type: 'training' | 'match' | 'tournament' | 'open'
}

interface CourtPriorityRules {
  levels: ('training' | 'match' | 'tournament' | 'event')[]
  trainingPriority: string[]              // Org-IDer
  matchPriority: string[]                 // Org-IDer
  tournamentRequiresApproval: boolean
  eventRequiresApproval: boolean
  localClubPriority: boolean
  localClubIds: string[]
}

interface CourtMaintenance {
  status: 'available' | 'limited' | 'maintenance' | 'closed'
  nextMaintenance?: string
  maintenanceSchedule: MaintenanceEntry[]
  lastInspection?: string
  inspectionFrequency: number             // Dager
}

interface MaintenanceEntry {
  id: string
  date: string
  type: string                            // "Banestell", "Reparasjon"
  description: string
  performedBy?: string
  nextScheduled?: string
}
```

### 3.3 Multi-bane struktur

```typescript
interface MultiCourtFacility {
  facilityId: string
  facilityName: string                    // "Drammen Padel"
  courts: Court[]
  sharedFacilities: string[]              // Garderobe, dusj, klubbhus
  commonRules: string
  bookingRules: CourtBookingRules
}

interface Court {
  id: string
  name: string                            // "Bane 1", "Bane 2"
  courtInfo: SportCourtInfo
  status: 'available' | 'maintenance' | 'closed'
  priceAdjustment?: number                // +/- i forhold til basispris
  bookingSlots: BookingSlot[]
  bookingRulesOverride?: Partial<CourtBookingRules>
}

interface CourtBookingRules {
  slotDurationMinutes: 30 | 45 | 60       // Admin velger
  minDurationMinutes: number              // Minimum booking
  maxDurationMinutes: number              // Maksimum booking
  bufferMinutes: number                   // Pause mellom bookinger
  advanceBookingDays: number              // Hvor langt frem
  cancellationHours: number               // Avbestillingsfrist
}

interface BookingSlot {
  id: string
  courtId: string
  dayOfWeek: string
  timeFrom: string
  timeTo: string
  status: 'available' | 'booked' | 'blocked'
  bookedBy?: string
  bookingId?: string
}
```

---

## 4. UI-komponenter og layout

### 4.1 Sidelayout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Header                                                               │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Logo: Digilist ENKEL BOOKING                                    │ │
│ │ Breadcrumbs: Hjem > Sport > Padel > [Navn]                      │ │
│ │ [Søkefelt]                                    [Logg inn]        │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │                        Bildegalleri                              │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Padelbane - Kragerø                                  [♡] [↗]   │ │
│ │ 📍 Idrettsveien 5, 3770 Kragerø                                 │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ ┌─────────────────────────────────────────┐ ┌─────────────────────┐ │
│ │ Hovedinnhold (2/3)                      │ │ Sidebar (1/3)       │ │
│ │                                         │ │                     │ │
│ │ [Oversikt][Kalender][Regler][FAQ]       │ │ Kontaktinfo         │ │
│ │ ─────────────────────────────────       │ │ ─────────────────── │ │
│ │                                         │ │ 📧 padel@kommune.no │ │
│ │ Baneinformasjon                         │ │ 📞 +47 35 58 50 00  │ │
│ │ ─────────────────────────────────       │ │                     │ │
│ │ ┌─────────────────────────────────────┐ │ │ Kart                │ │
│ │ │ Underlag: Kunstgress                │ │ │ ┌─────────────────┐ │ │
│ │ │ Dimensjoner: 20m × 10m              │ │ │ │    [MAP]        │ │ │
│ │ │ Innendørs: Ja                       │ │ │ └─────────────────┘ │ │
│ │ │ Belysning: Ja                       │ │ │                     │ │
│ │ │ Oppvarming: Ja (inkludert)          │ │ │ Åpningstider        │ │
│ │ └─────────────────────────────────────┘ │ │ ─────────────────── │ │
│ │                                         │ │ Man-Fre: 07-22      │ │
│ │ Maks spillere: 4                        │ │ Lør-Søn: 08-20      │ │
│ │                                         │ │                     │ │
│ │ Fasiliteter                             │ │ Vedlikeholdsstatus  │ │
│ │ ─────────────────────────────────       │ │ ─────────────────── │ │
│ │ ✓ Parkering  ✓ Garderobe  ✓ Dusj       │ │ ✓ Tilgjengelig      │ │
│ │                                         │ │ Neste vedlikehold:  │ │
│ │                                         │ │ 15. feb 2026        │ │
│ └─────────────────────────────────────────┘ └─────────────────────┘ │
│                                                                      │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Booking-seksjon                                                  │ │
│ │                                                                  │ │
│ │ Book tidspunkt (30 min intervaller)                              │ │
│ │ ───────────────────────────────────                              │ │
│ │                                                                  │ │
│ │ (●)Velg tid ──(○)Detaljer ──(○)Logg inn ──(○)Bekreft ──(○)Ferdig│ │
│ │                                                                  │ │
│ │ ┌───────────────────────────────────────────────────────────┐   │ │
│ │ │                 TimeIntervalCalendar                       │   │ │
│ │ │   (30 min slots - se seksjon 6)                           │   │ │
│ │ └───────────────────────────────────────────────────────────┘   │ │
│ │                                                                  │ │
│ │ [Tilbake]                                           [Neste →]   │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Baneinformasjon-kort

```
┌─────────────────────────────────────────────────────────────────┐
│ Baneinformasjon                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🏟️ Underlag                    📐 Dimensjoner                  │
│     Kunstgress                      20m × 10m                   │
│                                                                 │
│  🏠 Innendørs/Utendørs          💡 Belysning                    │
│     Innendørs                       Ja (16:00-23:00)            │
│                                                                 │
│  🔥 Oppvarming                  🏷️ Linjer                       │
│     Ja (inkludert)                  Padel, Tennis               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Fasiliteter for sport

| Ikon | Fasilitet |
|------|-----------|
| 🅿️ | Parkering |
| 🚿 | Dusj |
| 🚪 | Garderobe |
| 🏪 | Kiosk |
| 🏠 | Klubbhus |
| 🔒 | Skap |
| 💺 | Tilskuerplass |

### 4.4 Vedlikeholdsstatus-visning

```
┌─────────────────────────────────────────────────────────────────┐
│ Vedlikeholdsstatus                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Status: ✓ Tilgjengelig                                          │
│                                                                 │
│ Siste inspeksjon: 1. feb 2026                                   │
│ Neste vedlikehold: 15. feb 2026                                 │
│                                                                 │
│ ⚠️ Merknad: Banestell planlagt 15. feb, stengt 08:00-12:00     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Booking-flyt

### 5.1 Steg-oversikt (samme som lokaler)

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Steg 1 │───►│  Steg 2 │───►│  Steg 3 │───►│  Steg 4 │───►│  Steg 5 │
│ Velg tid│    │Detaljer │    │Logg inn │    │ Bekreft │    │  Ferdig │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
```

### 5.2 Steg 1: Velg tid (Sport-spesifikt)

**Formål**: Bruker velger tidsluke(r) fra kalenderen.

**Sport-spesifikke krav**:
- Minimum booking kan være 30, 45 eller 60 minutter
- Maksimum booking typisk 120 minutter
- Sammenhengende tider må velges

**Validering**:
```typescript
interface SportBookingValidation {
  minDuration: number                     // 30, 60
  maxDuration: number                     // 120, 180
  mustBeContiguous: boolean               // true
  maxAdvanceBookingDays: number           // 14, 30
  cancellationDeadlineHours: number       // 2, 24
}
```

**Eksempel validering**:
- ✅ 08:00-09:00 (60 min) - OK
- ✅ 08:00-09:30 (90 min) - OK
- ❌ 08:00 + 09:30 (ikke sammenhengende) - Feil
- ❌ 08:00-11:00 (180 min > maks 120) - Feil

### 5.3 Steg 2: Detaljer (Sport-spesifikt)

**Ekstra felt for sport**:

| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| Antall spillere | number | Nei | For statistikk |
| Type aktivitet | select | Nei | Trening/kamp/turnering |

### 5.4 Bekreftelse med depositum

For sportsfasiliteter kan det kreves depositum:

```
┌─────────────────────────────────────────────────────────────────┐
│ Prisoppsummering                                                │
├─────────────────────────────────────────────────────────────────┤
│ Bane: Padelbane - Kragerø                                       │
│ Tidspunkt: 19. jan 2026, 08:00-09:00 (60 min)                   │
│                                                                 │
│ Baneleie (2 × 30 min × 300 kr)                          600 kr  │
│ ────────────────────────────────────────────────────────────    │
│ Sum                                                     600 kr  │
│                                                                 │
│ Depositum (refunderes ved oppmøte)                      500 kr  │
│ ────────────────────────────────────────────────────────────    │
│ Totalt å betale nå                                    1 100 kr  │
│                                                                 │
│ ℹ️ Depositum refunderes automatisk hvis du møter opp.          │
│    Ved no-show beholdes depositumet.                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Kalender-typer og visning

### 6.1 TimeIntervalCalendar (30 min)

Standard for padel og squash:

```
┌─────────────────────────────────────────────────────────────────┐
│ ◀ Uke 4, 2026 ▶                                                 │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────┤
│         │  Man    │  Tir    │  Ons    │  Tor    │  Fre    │ Lør │
│         │  19/1   │  20/1   │  21/1   │  22/1   │  23/1   │24/1 │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────┤
│  08:00  │  🟢     │  🟢     │  🟡     │  🟢     │  🟢     │ 🟢  │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────┤
│  08:30  │  🟢     │  🟢     │  🟡     │  🟢     │  🟢     │ 🟢  │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────┤
│  09:00  │  🟡     │  🟢     │  🔴     │  🟢     │  🟢     │ 🟢  │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────┤
│  09:30  │  🔴     │  🟢     │  🔴     │  🟢     │  🟢     │ 🟢  │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────┤
│  10:00  │  🟢     │  🟢     │  🟢     │  🟢     │  🟢     │ 🟢  │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────┤
│  10:30  │  🟢     │  🟢     │  🟢     │  🟡     │  🟢     │ 🟢  │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────┤
│  ...    │  ...    │  ...    │  ...    │  ...    │  ...    │ ... │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────┘

Valgte tider: Man 19/1 08:00-09:00 (60 min)                 600 kr
```

### 6.2 Multi-bane kalender (fremtidig)

For anlegg med flere baner:

```
┌─────────────────────────────────────────────────────────────────┐
│ Drammen Padel - Mandag 19. januar 2026                          │
├─────────────────────────────────────────────────────────────────┤
│           │ 08:00 │ 08:30 │ 09:00 │ 09:30 │ 10:00 │ 10:30 │ ... │
├───────────┼───────┼───────┼───────┼───────┼───────┼───────┼─────┤
│ Bane 1    │  🟢   │  🟢   │  🔴   │  🔴   │  🟢   │  🟢   │     │
├───────────┼───────┼───────┼───────┼───────┼───────┼───────┼─────┤
│ Bane 2    │  🟡   │  🟡   │  🟢   │  🟢   │  🔴   │  🔴   │     │
├───────────┼───────┼───────┼───────┼───────┼───────┼───────┼─────┤
│ Bane 3    │  🟢   │  🟢   │  🟢   │  🟢   │  🟢   │  🟢   │     │
├───────────┼───────┼───────┼───────┼───────┼───────┼───────┼─────┤
│ Bane 4    │  🟢   │  🔴   │  🔴   │  🟢   │  🟢   │  🟢   │     │
└───────────┴───────┴───────┴───────┴───────┴───────┴───────┴─────┘
```

### 6.3 Intervall-valg for admin

| Intervall | Typisk bruk | Min/Max kombinasjoner |
|-----------|-------------|----------------------|
| 30 min | Padel, squash | Min: 30/60, Max: 60/90/120 |
| 45 min | Spesielle baner | Min: 45/90, Max: 90/135 |
| 60 min | Tennis, fotball | Min: 60/120, Max: 120/180 |

### 6.4 Props for kalender

```typescript
interface TimeIntervalCalendarProps {
  calendarData: CalendarData
  selectedSlots: KalenderSlot[]
  onSlotSelect: (slot: KalenderSlot) => void
  onSlotDeselect: (slot: KalenderSlot) => void
  interval: string                        // "30", "45", "60"
  minDuration?: number                    // Minimum minutter
  maxDuration?: number                    // Maksimum minutter
  multiCourt?: boolean                    // Viser multi-bane grid
  courts?: Court[]                        // Liste over baner
}
```

---

## 7. Pris- og betalingsvisning

### 7.1 Prismodeller for sport

**Per tidsluke**:
```
300 kr per 30 min
(= 600 kr per time)
```

**Målgruppepriser**:
```
┌─────────────────────────────────────────────────────────────────┐
│ Priser                                                          │
├─────────────────────────────────────────────────────────────────┤
│ Standard                               300 kr / 30 min          │
│ Organisasjoner                         250 kr / 30 min (-17%)   │
│ Junior (under 18)                      200 kr / 30 min (-33%)   │
│ Senior (over 65)                       200 kr / 30 min (-33%)   │
└─────────────────────────────────────────────────────────────────┘
```

**Tidbasert prising**:
```
┌─────────────────────────────────────────────────────────────────┐
│ Tidbasert prising                                               │
├─────────────────────────────────────────────────────────────────┤
│ Formiddag (08:00-12:00)                250 kr / 30 min          │
│ Ettermiddag (12:00-16:00)              300 kr / 30 min          │
│ Kveld (16:00-22:00)                    350 kr / 30 min          │
│ Helg                                   400 kr / 30 min          │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Depositum

| Scenario | Depositum | Refusjon |
|----------|-----------|----------|
| Standard booking | 500 kr | Ved oppmøte |
| Booking > 2 timer | 1000 kr | Ved oppmøte |
| Turneringsbooking | 2000 kr | Etter inspeksjon |
| No-show | - | Ingen refusjon |

---

## 8. Tilgjengelighet og responsivt design

### 8.1 Mobile-tilpasninger for sport

**Kalender på mobil**:
- Viser én dag om gangen
- Swipe for å bytte dag
- Kompakt tidsluke-visning

**Multi-bane på mobil**:
- Velg bane først (dropdown)
- Deretter se kalender for valgt bane

### 8.2 Touch-interaksjoner

| Gesture | Handling |
|---------|----------|
| Tap | Velg/avvelg tidsluke |
| Tap and hold | Vis detaljer om tidsluke |
| Swipe left/right | Navigér mellom dager |
| Pinch | Zoom kalender (hvis støttet) |

---

## 9. Komponent-spesifikasjon

### 9.1 Komponent-hierarki for sport

```
UtleieobjektDetaljSide (category='sport')
├── Header
├── Bildegalleri
├── TitleSection
├── MainContent
│   └── Tabs
│       ├── OversiktTab
│       │   ├── BaneinformasjonKort
│       │   │   ├── Surface
│       │   │   ├── Dimensions
│       │   │   ├── IndoorOutdoor
│       │   │   ├── Lighting
│       │   │   └── Heating
│       │   ├── CapacityInfo
│       │   ├── Fasiliteter
│       │   └── VedlikeholdsstatusKort
│       ├── AktivitetskalenderTab
│       ├── RetningslinjerTab
│       └── FAQTab
├── Sidebar
│   └── KontaktSidebar
│       ├── ContactInfo
│       ├── MapView
│       ├── OpeningHours
│       └── MaintenanceStatus
└── BookingSection
    ├── BookingStegIndikator
    ├── TimeIntervalCalendar (interval="30")
    │   └── (MultiCourtCalendar - fremtidig)
    └── BookingNavigation
```

### 9.2 BaneinformasjonKort

```typescript
interface BaneinformasjonKortProps {
  courtInfo: SportCourtInfo
}

function BaneinformasjonKort({ courtInfo }: BaneinformasjonKortProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <InfoItem icon="🏟️" label="Underlag" value={courtInfo.surface} />
      <InfoItem 
        icon="📐" 
        label="Dimensjoner" 
        value={`${courtInfo.dimensions.length}m × ${courtInfo.dimensions.width}m`} 
      />
      <InfoItem 
        icon="🏠" 
        label="Type" 
        value={courtInfo.indoor ? 'Innendørs' : 'Utendørs'} 
      />
      <InfoItem 
        icon="💡" 
        label="Belysning" 
        value={courtInfo.lighting ? `Ja (${courtInfo.lightingHours})` : 'Nei'} 
      />
      {courtInfo.heatingAvailable && (
        <InfoItem 
          icon="🔥" 
          label="Oppvarming" 
          value={courtInfo.heatingIncluded 
            ? 'Ja (inkludert)' 
            : `Ja (+${courtInfo.heatingFee} kr)`
          } 
        />
      )}
    </div>
  )
}
```

### 9.3 VedlikeholdsstatusKort

```typescript
interface VedlikeholdsstatusKortProps {
  maintenance: CourtMaintenance
}

function VedlikeholdsstatusKort({ maintenance }: VedlikeholdsstatusKortProps) {
  const statusColors = {
    available: 'text-green-600',
    limited: 'text-yellow-600',
    maintenance: 'text-orange-600',
    closed: 'text-red-600'
  }
  
  const statusLabels = {
    available: '✓ Tilgjengelig',
    limited: '⚠️ Begrenset tilgang',
    maintenance: '🔧 Under vedlikehold',
    closed: '❌ Stengt'
  }
  
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Vedlikeholdsstatus</h3>
      <p className={statusColors[maintenance.status]}>
        {statusLabels[maintenance.status]}
      </p>
      {maintenance.lastInspection && (
        <p className="text-sm text-stone-500">
          Siste inspeksjon: {formatDate(maintenance.lastInspection)}
        </p>
      )}
      {maintenance.nextMaintenance && (
        <p className="text-sm text-stone-500">
          Neste vedlikehold: {formatDate(maintenance.nextMaintenance)}
        </p>
      )}
    </div>
  )
}
```

---

## 10. Referanser

### 10.1 Filer

| Fil | Beskrivelse |
|-----|-------------|
| `src/sections/offentlig-detaljside-for-utleieobjekt/UtleieobjektDetaljSide.tsx` | Hovedkomponent |
| `src/sections/offentlig-detaljside-for-utleieobjekt/UtleieobjektDetaljSidePreviewSport.tsx` | Preview med eksempeldata |
| `src/sections/offentlig-detaljside-for-utleieobjekt/components/TimeIntervalCalendar.tsx` | Tidsintervall-kalender |
| `product/sections/offentlig-detaljside-for-utleieobjekt/types.ts` | TypeScript-typer |

### 10.2 Admin-dokumentasjon

Se `UTLEIEOBJEKT-ADMIN-DOKUMENTASJON.md` seksjon 6 for komplett datamodell for sport, inkludert:
- Multi-bane struktur
- Sesongbooking
- Prioritetsregler
- Vedlikeholdslogg

---

*Denne dokumentasjonen er generert og vedlikeholdt som del av Design OS.*
