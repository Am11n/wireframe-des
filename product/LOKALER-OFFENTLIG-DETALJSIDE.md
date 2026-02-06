# Lokaler - Offentlig Detaljside Dokumentasjon

> **Versjon**: 1.0  
> **Sist oppdatert**: 2026-02-06  
> **Formål**: Komplett dokumentasjon for offentlig detaljside for lokaler (møterom, selskapslokaler, gymsaler, kulturarenaer)

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

### 1.1 Hva er Lokaler-detaljsiden?

Den offentlige detaljsiden for lokaler viser komplett informasjon om et utleibart lokale og lar brukere booke tid. Siden er standalone (ikke inne i shell) og er tilgjengelig for alle besøkende.

### 1.2 Underkategorier

| Underkategori | Beskrivelse | Typisk bookingmodell |
|---------------|-------------|---------------------|
| **Møterom** | Mindre rom for møter og presentasjoner | Tidsintervall (time) |
| **Selskapslokale** | Større lokaler for fester og arrangementer | Dag eller halvdag |
| **Gymsal** | Idrettshaller for fysisk aktivitet | Tidsintervall (time) |
| **Kulturarena** | Konsertsaler, teaterscener | Dag eller flere dager |
| **Klasserom** | Undervisningslokaler | Tidsintervall (time) |

### 1.3 Bookingmodeller

Lokaler støtter to hovedtyper av booking:

| Modell | Beskrivelse | Kalender-komponent |
|--------|-------------|-------------------|
| **Tidsintervall** | Booking per time (30/60 min intervaller) | `TimeIntervalCalendar` |
| **Dag** | Booking per hel- eller halvdag | `DayCalendar` |

### 1.4 Brukerroller

| Rolle | Beskrivelse | Tilganger på denne siden |
|-------|-------------|-------------------------|
| **Gjest** | Ikke innlogget bruker | Se informasjon, starte booking |
| **Innbygger** | Innlogget privatperson | Fullføre booking, se historikk |
| **Organisasjon** | Innlogget lag/forening | Booking med rabatt, faktura |

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
│  Ser bildegalleri,│
│  beskrivelse,    │
│  fasiliteter     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Velger tab:     │
│  Oversikt/       │
│  Kalender/FAQ    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Velger tidslot │
│  i kalender     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Fyller ut      │
│  booking-       │
│  detaljer       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Logger inn     │────►│  Fortsetter     │
│  (valgfritt)    │     │  som gjest      │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     ▼
┌─────────────────┐
│  Bekrefter      │
│  booking        │
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
| Klikk på bilde | Åpner fullskjerm galleri | Lightbox med navigasjon |
| Klikk på favoritt | Legger til/fjerner favoritt | Hjerte-ikon fylles/tømmes |
| Klikk på del | Åpner delingsvalg | Kopierer URL eller deler til sosiale medier |
| Klikk på tidslot | Velger/avvelger tidslot | Slot markeres, legges til i oppsummering |
| Klikk på tab | Bytter innhold | Viser relevant seksjon |
| Klikk "Neste" | Går til neste booking-steg | Validerer og navigerer |
| Klikk "Tilbake" | Går til forrige steg | Beholder utfylte data |

### 2.3 Tilstandshåndtering

| Tilstand | Lagring | Varighet |
|----------|---------|----------|
| Valgte tidslots | React state | Sesjonsbasert |
| Aktiv tab | React state | Sesjonsbasert |
| Booking-steg | React state | Sesjonsbasert |
| Favoritt-status | LocalStorage (demo) | Persistent |
| Innlogget bruker | Context/Session | Sesjonsbasert |

---

## 3. Datamodell

### 3.1 LokaleDetalj Interface

```typescript
interface LokaleDetalj {
  // Identitet
  id: string
  category: 'lokaler'
  subcategory?: string                    // "Møterom", "Selskapslokale", etc.
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
  
  // Kapasitet
  maxPersons: number
  size: string                            // "120 m²"
  
  // Fasiliteter og utstyr
  facilities: string[]                    // ["WiFi", "Projektor", "Whiteboard"]
  universalDesign: UniversalDesign
  addOnServices: AddOnService[]
  
  // Kontakt
  contacts: Contact[]
  
  // Åpningstider
  openingHours: OpeningHour[]
  
  // Booking-konfigurasjon
  rentalUnit: 'hour' | 'day' | 'half_day'
  interval: string                        // "30", "60" (minutter)
  
  // Pris
  pricing: Pricing
  
  // Retningslinjer
  guidelines: string
  faq: FAQItem[]
  
  // Kalender
  calendarData: CalendarData
}
```

### 3.2 Støttetyper

```typescript
interface UniversalDesign {
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

interface AddOnService {
  id: string
  name: string
  description: string
  price: number
  required: boolean
  needsApproval: boolean
}

interface Contact {
  name: string
  role: string
  email: string
  phone: string
}

interface OpeningHour {
  day: string                             // "Mandag", "Tirsdag", etc.
  from: string                            // "08:00"
  to: string                              // "22:00"
  active: boolean
}

interface Pricing {
  isFree: boolean
  basePrice?: number
  priceModel: string                      // "per time", "per dag"
  targetGroups?: TargetGroup[]
  timeBasedPricing?: {
    weekdays?: number
    weekend?: number
  }
  paymentMethods?: string[]
}

interface TargetGroup {
  id: string
  group: string                           // "Standard", "Organisasjoner"
  price: number
  free: boolean
  discountPercent?: number
}

interface FAQItem {
  question: string
  answer: string
}

interface CalendarData {
  weekStart: string                       // ISO-dato
  availabilityType: 'timeInterval' | 'day'
  interval?: string                       // "30", "60"
  slots: KalenderSlot[]
}

interface KalenderSlot {
  date: string                            // ISO-dato
  time?: string                           // "10:00" (for tidsintervall)
  status: 'ledig' | 'reservert' | 'booket' | 'blokkert' | 'utilgjengelig' | 'stengt'
  fromTime?: string                       // For dag-booking med tidsvindu
  toTime?: string
}
```

### 3.3 Utvidet datamodell (fra BaseResource)

For fullstendig datamodell med alle felt, se `LokaleDetalj` i `types.ts` som inkluderer:

- `venueCapacity` - Kapasitet med bordoppsett
- `roomStructure` - Rom-struktur (delbare rom, underrom)
- `venueAccess` - Tilgangsinformasjon (nøkkel, kode)
- `venueEquipment` - Inkludert og leiebart utstyr
- `noiseRules` - Støyregler
- `seasonPricing` - Sesong- og tidbasert prising

---

## 4. UI-komponenter og layout

### 4.1 Sidelayout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Header                                                              │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Logo: Digilist ENKEL BOOKING                                    │ │
│ │ Breadcrumbs: Hjem > Lokaler > [Navn]                            │ │
│ │ [Søkefelt]                                    [Logg inn]        │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │                        Bildegalleri                             │ │
│ │  ┌───────────────────────────────────────────────────────────┐  │ │
│ │  │                                                           │  │ │
│ │  │                    Hovedbilde                             │  │ │
│ │  │                                                           │  │ │
│ │  │  [<]                                              [>]     │  │ │
│ │  │                                              1/3          │  │ │
│ │  └───────────────────────────────────────────────────────────┘  │ │
│ │  [thumb1] [thumb2] [thumb3]                                     │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Tittel og metadata                                              │ │
│ │ ┌───────────────────────────────────────────┐ ┌───────────────┐ │ │
│ │ │ Møterom Y - Kragerø                       │ │ [♡] [↗]       │ │ │
│ │ │ 📍 Møterom Yveien 51, 3770 Kragerø        │ │               │ │ │
│ │ └───────────────────────────────────────────┘ └───────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ ┌─────────────────────────────────────────┐ ┌─────────────────────┐ │
│ │ Hovedinnhold (2/3)                      │ │ Sidebar (1/3)       │ │
│ │                                         │ │                     │ │
│ │ [Oversikt][Kalender][Regler][FAQ]       │ │ Kontaktinfo         │ │
│ │ ─────────────────────────────────       │ │ ┌─────────────────┐ │ │
│ │                                         │ │ │ 📧 email        │ │ │
│ │ Beskrivelse                             │ │ │ 📞 telefon      │ │ │
│ │ ─────────────────────────────────       │ │ └─────────────────┘ │ │
│ │ Moderne møterom y i Kragerø...          │ │                     │ │
│ │                                         │ │ Kart                │ │
│ │ Kapasitet: 30 personer | 120 m²         │ │ ┌─────────────────┐ │ │
│ │                                         │ │ │    [MAP]        │ │ │
│ │ Fasiliteter                             │ │ │                 │ │ │
│ │ ─────────────────────────────────       │ │ └─────────────────┘ │ │
│ │ ✓ WiFi  ✓ Projektor  ✓ Whiteboard       │ │ [Åpne i kart]       │ │
│ │                                         │ │                     │ │
│ │ Tilleggstjenester                       │ │ Åpningstider        │ │
│ │ ─────────────────────────────────       │ │ ┌─────────────────┐ │ │
│ │ □ Ekstra tid (+200 kr)                  │ │ │ Man: 07-23      │ │ │
│ │ □ Utstyr (+150 kr)                      │ │ │ Tir: 07-23      │ │ │
│ │                                         │ │ │ ...             │ │ │
│ │                                         │ │ └─────────────────┘ │ │
│ └─────────────────────────────────────────┘ └─────────────────────┘ │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Booking-seksjon                                                 │ │
│ │                                                                 │ │
│ │ Book tidspunkt                                                  │ │
│ │ ───────────────                                                 │ │
│ │                                                                 │ │
│ │ Stegindikator:                                                  │ │
│ │ (●)Velg tid ──(○)Detaljer ──(○)Logg inn ──(○)Bekreft ──(○)Ferdig│ │
│ │                                                                 │ │
│ │ ┌───────────────────────────────────────────────────────────┐   │ │
│ │ │                    Kalender                               │   │ │
│ │ │  (Se kalender-komponent i seksjon 6)                      │   │ │
│ │ └───────────────────────────────────────────────────────────┘   │ │
│ │                                                                 │ │
│ │ [Tilbake]                                           [Neste →]   │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Tabs-struktur

| Tab | Innhold |
|-----|---------|
| **Oversikt** | Beskrivelse, kapasitet, fasiliteter, tilleggstjenester, universell utforming |
| **Aktivitetskalender** | Fullskjerm kalender for oversikt over tilgjengelighet |
| **Retningslinjer** | Husregler, bruksvilkår |
| **Ofte stilte spørsmål** | FAQ-liste med spørsmål og svar |

### 4.3 Fasiliteter-visning

Standard fasiliteter for lokaler:

| Ikon | Fasilitet |
|------|-----------|
| 📶 | WiFi |
| 📽️ | Projektor/TV |
| 📋 | Whiteboard |
| ☕ | Kaffe/te |
| ❄️ | Aircondition |
| 🅿️ | Parkering |
| 🚻 | Toalett |
| ♿ | HC-toalett |
| 🔊 | Lydanlegg |
| 🎤 | Mikrofon |

### 4.4 Universell utforming-visning

```
┌─────────────────────────────────────────────────────────────────┐
│ Universell utforming                                            │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Trinnfri adkomst                                              │
│ ✓ HC-toalett                                                    │
│ ✓ HC-parkering                                                  │
│ ✗ Heis (ikke relevant - 1. etasje)                              │
│ ✗ Teleslynge                                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Booking-flyt

### 5.1 Steg-oversikt

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Steg 1 │───►│  Steg 2 │───►│  Steg 3 │───►│  Steg 4 │───►│  Steg 5 │
│ Velg tid│    │Detaljer │    │Logg inn │    │ Bekreft │    │  Ferdig │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
```

### 5.2 Steg 1: Velg tid

**Formål**: Bruker velger ønsket tidspunkt fra kalenderen.

**UI-elementer**:
- Kalender-komponent (TimeIntervalCalendar eller DayCalendar)
- Legend/forklaring for fargekoder
- Valgte tidslots vises i sidepanel

**Validering**:
- Minst én tidslot må være valgt
- Kan ikke velge bookede/blokkerte slots

**Handlinger**:
- Klikk på ledig slot → Legger til/fjerner fra valg
- "Neste" → Går til Detaljer (kun hvis validering passerer)

### 5.3 Steg 2: Detaljer

**Formål**: Bruker fyller ut kontaktinformasjon og eventuelle tilleggsopplysninger.

**Skjemafelt**:

| Felt | Type | Påkrevd | Validering |
|------|------|---------|------------|
| Navn | text | Ja | Min 2 tegn |
| E-post | email | Ja | Gyldig e-postformat |
| Telefon | tel | Ja | Norsk telefonnummer |
| Organisasjon | text | Nei | - |
| Org.nummer | text | Betinget | 9 siffer |
| Melding | textarea | Nei | Maks 500 tegn |
| Tilleggstjenester | checkbox | Nei | - |
| Akseptert vilkår | checkbox | Ja | Må være avkrysset |

### 5.4 Steg 3: Logg inn

**Formål**: Autentisering av bruker (valgfritt).

**Alternativer**:
1. **Logg inn med BankID** - Sterk autentisering
2. **Logg inn med e-post** - Standard innlogging
3. **Fortsett som gjest** - Ingen innlogging

**Betinget logikk**:
- Hvis lokalet krever innlogging → Kan ikke velge gjest
- Hvis bruker er organisasjon → Anbefaler innlogging for rabatt

### 5.5 Steg 4: Bekreft

**Formål**: Vise oppsummering og bekrefte booking.

**Oppsummering inkluderer**:
- Lokale-navn og adresse
- Valgte tidspunkter
- Pris (med eventuell rabatt)
- Tilleggstjenester
- Kontaktinformasjon
- Vilkår og betingelser

**Betalingsinfo** (hvis ikke gratis):
- Valgt betalingsmetode
- Totalpris inkl. mva
- Depositum (hvis relevant)

### 5.6 Steg 5: Ferdig

**Formål**: Bekreftelse på gjennomført booking.

**Viser**:
- Booking-referansenummer
- Bekreftelses-e-post sendt til
- Oppsummering av booking
- Lenke til "Mine bookinger" (hvis innlogget)
- Knapp for å legge til i kalender (iCal/Google)

---

## 6. Kalender-typer og visning

### 6.1 TimeIntervalCalendar

Brukes for timebasert booking (typisk for møterom).

**Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│ ◀ Uke 4, 2026 ▶                                                 │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────┤
│         │  Man    │  Tir    │  Ons    │  Tor    │  Fre    │ Lør │
│         │  19/1   │  20/1   │  21/1   │  22/1   │  23/1   │24/1 │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────┤
│  08:00  │  🟢     │  🟢     │  🟡     │  🟢     │  🟢     │ ⬛  │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────┤
│  09:00  │  🟢     │  🟡     │  🔴     │  🟢     │  🟢     │ ⬛  │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────┤
│  10:00  │  🟢     │  🟢     │  🔴     │  🟢     │  🟢     │ 🟢  │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────┤
│  11:00  │  🔴     │  🟢     │  🟢     │  🟡     │  🟢     │ 🟢  │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────┤
│  ...    │  ...    │  ...    │  ...    │  ...    │  ...    │ ... │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────┘

Legend:
🟢 Ledig    🟡 Reservert    🔴 Booket    ⬛ Stengt
```

**Intervall-valg**:
- 30 minutter
- 60 minutter (standard for møterom)
- 90 minutter
- 120 minutter

**Props**:
```typescript
interface TimeIntervalCalendarProps {
  calendarData: CalendarData
  selectedSlots: KalenderSlot[]
  onSlotSelect: (slot: KalenderSlot) => void
  onSlotDeselect: (slot: KalenderSlot) => void
  interval: string                        // "30", "60", etc.
}
```

### 6.2 DayCalendar

Brukes for heldagsbooking (typisk for selskapslokaler).

**Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│ ◀ Januar 2026 ▶                                                 │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────┤
│   Man   │   Tir   │   Ons   │   Tor   │   Fre   │   Lør   │ Søn │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────┤
│         │         │    1    │    2    │    3    │    4    │   5 │
│         │         │   🟢    │   🟢    │   🟢    │   🟢    │  🟢 │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────┤
│    6    │    7    │    8    │    9    │   10    │   11    │  12 │
│   🟢    │   🟢    │   🔴    │   🟢    │   🟡    │   🟢    │  🟢 │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────┤
│   13    │   14    │   15    │   16    │   17    │   18    │  19 │
│   🟢    │   🟢    │   🟢    │   🟢    │   🔴    │   🔴    │  🟢 │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────┘
```

**Props**:
```typescript
interface DayCalendarProps {
  calendarData: CalendarData
  selectedSlots: KalenderSlot[]
  onSlotSelect: (slot: KalenderSlot) => void
  onSlotDeselect: (slot: KalenderSlot) => void
}
```

### 6.3 Status-fargekoder

| Status | Farge | Hex | Betydning |
|--------|-------|-----|-----------|
| `ledig` | Grønn | `#22c55e` | Kan bookes |
| `reservert` | Lys grønn | `#86efac` | Reservert, avventer bekreftelse |
| `booket` | Rød | `#ef4444` | Bekreftet booking |
| `blokkert` | Mørk rød | `#991b1b` | Blokkert av admin |
| `utilgjengelig` | Grå | `#9ca3af` | Utenfor åpningstid |
| `stengt` | Svart | `#1f2937` | Stengt dag |

---

## 7. Pris- og betalingsvisning

### 7.1 Prisvisning

**Standard pris**:
```
┌─────────────────────────────────────────────────────────────────┐
│ Pris                                                            │
├─────────────────────────────────────────────────────────────────┤
│ 500 kr/time                                                     │
│                                                                 │
│ Målgruppepriser:                                                │
│ ├── Standard: 500 kr/time                                       │
│ └── Organisasjoner: 400 kr/time (-20%)                          │
│                                                                 │
│ Helgepris: 600 kr/time                                          │
└─────────────────────────────────────────────────────────────────┘
```

**Gratis lokale**:
```
┌─────────────────────────────────────────────────────────────────┐
│ Pris                                                            │
├─────────────────────────────────────────────────────────────────┤
│ Gratis                                                          │
│                                                                 │
│ Dette lokalet er gratis å bruke for alle.                       │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Prisberegning i oppsummering

```
┌─────────────────────────────────────────────────────────────────┐
│ Prisoppsummering                                                │
├─────────────────────────────────────────────────────────────────┤
│ Lokale: Møterom Y - Kragerø                                     │
│ Tidspunkt: 19. jan 2026, 10:00-14:00 (4 timer)                  │
│                                                                 │
│ Basispris (4 timer × 500 kr)                          2 000 kr  │
│ Tilleggstjeneste: Utstyr                                150 kr  │
│ ────────────────────────────────────────────────────────────    │
│ Sum eks. mva                                          2 150 kr  │
│ MVA (25%)                                               537 kr  │
│ ────────────────────────────────────────────────────────────    │
│ Totalt                                                2 687 kr  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Betalingsmetoder

| Metode | Ikon | Beskrivelse |
|--------|------|-------------|
| Kort | 💳 | Visa, Mastercard |
| Vipps | 📱 | Vipps-betaling |
| Faktura (EHF) | 📄 | For organisasjoner |

---

## 8. Tilgjengelighet og responsivt design

### 8.1 Breakpoints

| Breakpoint | Bredde | Layout-endringer |
|------------|--------|------------------|
| Mobile | < 640px | Sidebar under hovedinnhold, stacked layout |
| Tablet | 640-1024px | 2-kolonne grid |
| Desktop | > 1024px | 3-kolonne grid (2/3 + 1/3) |

### 8.2 Mobile-tilpasninger

**Bildegalleri**:
- Fullbredde carousel
- Swipe-navigasjon
- Thumbnails skjult (kun prikker)

**Tabs**:
- Horisontal scrollbar
- Sticky ved scroll

**Kalender**:
- Forenklet visning (3 dager om gangen)
- Swipe for å navigere

**Sidebar**:
- Kollapset til accordion
- Kontaktinfo alltid synlig

### 8.3 Tilgjengelighet (a11y)

| Krav | Implementering |
|------|----------------|
| Tastaturnavigasjon | Alle interaktive elementer nåbare med Tab |
| Skjermleser | ARIA-labels på alle knapper og interaktive elementer |
| Fargekontrast | WCAG AA-krav (4.5:1 for tekst) |
| Fokusindikatorer | Synlig fokusring på alle interaktive elementer |
| Alternativ tekst | Alt-tekst på alle bilder |

---

## 9. Komponent-spesifikasjon

### 9.1 Komponent-hierarki

```
UtleieobjektDetaljSide
├── Header
│   ├── Logo
│   ├── Breadcrumbs
│   ├── SearchInput
│   └── LoginButton
├── Bildegalleri
│   ├── MainImage
│   ├── NavigationArrows
│   ├── ImageCounter
│   └── Thumbnails
├── TitleSection
│   ├── Title
│   ├── Address
│   ├── FavoriteButton
│   └── ShareButton
├── MainContent (2/3)
│   └── Tabs
│       ├── OversiktTab
│       │   ├── Description
│       │   ├── CapacityInfo
│       │   ├── Fasiliteter
│       │   ├── Tilleggstjenester
│       │   └── UniversellUtforming
│       ├── AktivitetskalenderTab
│       │   └── FullCalendar
│       ├── RetningslinjerTab
│       │   └── GuidelinesContent
│       └── FAQTab
│           └── FAQAccordion
├── Sidebar (1/3)
│   └── KontaktSidebar
│       ├── ContactInfo
│       ├── MapView
│       └── OpeningHours
└── BookingSection
    ├── BookingStegIndikator
    ├── CalendarComponent
    │   ├── TimeIntervalCalendar
    │   └── DayCalendar
    └── BookingNavigation
```

### 9.2 Props-spesifikasjon

**UtleieobjektDetaljSide**:
```typescript
interface UtleieobjektDetaljSideProps {
  utleieobjektId: string
  category: 'lokaler'
  data?: LokaleDetalj
  onFavorite?: (id: string) => void
  onShare?: (id: string) => void
  onBookingComplete?: (bookingData: BookingState) => void
}
```

**Bildegalleri**:
```typescript
interface BildegalleriProps {
  images: string[]
  currentIndex?: number
  onImageChange?: (index: number) => void
}
```

**KontaktSidebar**:
```typescript
interface KontaktSidebarProps {
  contacts: Contact[]
  map: { lat: number; lng: number }
  address: string
  postalCode: string
  postalArea: string
  openingHours?: OpeningHour[]
  category: 'lokaler'
}
```

**BookingStegIndikator**:
```typescript
interface BookingStegIndikatorProps {
  currentStep: BookingSteg
  steps: Array<{ id: BookingSteg; label: string }>
}
```

### 9.3 Hooks

**useBookingState**:
```typescript
function useBookingState() {
  const [currentStep, setCurrentStep] = useState<BookingSteg>('velg-tid')
  const [selectedSlots, setSelectedSlots] = useState<KalenderSlot[]>([])
  const [selectedAddOnServices, setSelectedAddOnServices] = useState<string[]>([])
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({})
  
  const goToNextStep = () => { /* ... */ }
  const goToPreviousStep = () => { /* ... */ }
  const resetBooking = () => { /* ... */ }
  
  return {
    currentStep,
    selectedSlots,
    selectedAddOnServices,
    bookingDetails,
    setSelectedSlots,
    goToNextStep,
    goToPreviousStep,
    // ...
  }
}
```

---

## 10. Referanser

### 10.1 Filer

| Fil | Beskrivelse |
|-----|-------------|
| `src/sections/offentlig-detaljside-for-utleieobjekt/UtleieobjektDetaljSide.tsx` | Hovedkomponent |
| `src/sections/offentlig-detaljside-for-utleieobjekt/UtleieobjektDetaljSidePreviewLokalerTimeInterval.tsx` | Preview med eksempeldata (tidsintervall) |
| `src/sections/offentlig-detaljside-for-utleieobjekt/UtleieobjektDetaljSidePreviewLokalerDay.tsx` | Preview med eksempeldata (dag) |
| `src/sections/offentlig-detaljside-for-utleieobjekt/components/TimeIntervalCalendar.tsx` | Tidsintervall-kalender |
| `src/sections/offentlig-detaljside-for-utleieobjekt/components/DayCalendar.tsx` | Dag-kalender |
| `product/sections/offentlig-detaljside-for-utleieobjekt/types.ts` | TypeScript-typer |
| `product/UTLEIEOBJEKT-ADMIN-DOKUMENTASJON.md` | Admin-dokumentasjon |

### 10.2 Relaterte dokumenter

- UTLEIEOBJEKT-ADMIN-DOKUMENTASJON.md - Komplett admin-dokumentasjon
- product/sections/offentlig-detaljside-for-utleieobjekt/spec.md - Kort spesifikasjon

---

*Denne dokumentasjonen er generert og vedlikeholdt som del av Design OS.*
