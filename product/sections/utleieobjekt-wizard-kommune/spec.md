# Utleieobjekt-wizard (kommuneversjon)

## Overview

En stegvis wizard for kommuner til å opprette og publisere et utleieobjekt (lokale/område/ressurs) med korrekt grunninfo, tilgjengelighet, regler, pris, betaling, vilkår og synlighet, på en måte som passer kommunal drift og saksbehandling.

Wizarden støtter fire hovedkategorier:
- **Lokaler**: Selskapslokale, møterom, gymsal, kulturarena, konferanserom
- **Sport**: Baner (padel, tennis, squash) og utstyr (ballsett, nett, etc.)
- **Arrangementer**: Kurs, foredrag, konserter, workshops, seminarer
- **Torg/Uteområder**: Telt, lydanlegg, bord/stoler, torg, parker

## User Flows

### Hovedflyt
1. Admin starter wizarden og velger kategori (Lokaler/Sport/Arrangementer/Torg)
2. Admin velger opprettelsesmetode (nytt, kopier eksisterende, eller importer)
3. Admin fyller ut kategori-spesifikke steg
4. Admin validerer og publiserer objektet

### Steg per kategori

#### Lokaler (5 steg)
1. **Lokasjon** - Identitet, adresse, kart, beskrivelse, kontakter, media, egenskaper, fasiliteter, universell utforming, tilleggstjenester
2. **Tilgjengelighet** - Type (tidsintervall/dag), intervall, åpningstider, unntak, blackout-perioder
3. **Regler** - Godkjenningsmodus, begrensninger, paraplydisponering, tidslogikk
4. **Pris og betaling** - Prismodell, målgrupper, betalingsmetoder, depositum, avgifter, vilkår
5. **Publisering** - Synlighet, målgrupper, sjekkliste, oppsummering

#### Sport (5 steg)
1. **Lokasjon** - Identitet, adresse, bane/utstyr-info, egenskaper
2. **Tilgjengelighet** - Tidsintervaller, sesongbooking, rammetider
3. **Regler** - Godkjenning, prioritetsregler, vedlikeholdsstatus
4. **Pris/Depositum** - Priser, depositum, skadeavgift, betalingsmetoder
5. **Publisering** - Synlighet, sjekkliste

#### Arrangementer (5 steg)
1. **Tidspunkter** - Eventdatoer, program, varighet, gjentagelse
2. **Kapasitet** - Billettyper, soner, venteliste
3. **Pris** - Billettpriser, målgrupper, betalingsmetoder
4. **Vilkår** - Avbestilling, refusjon, dokumentkrav, tillatelser
5. **Publisering** - Synlighet, arrangørinfo, sjekkliste

#### Torg (6 steg)
1. **Hentested/Logistikk** - Identitet, plassering, soner, infrastruktur
2. **Antall/Lager** - Tilgjengelig mengde, enheter, utstyr
3. **Tilgjengelighet** - Dag/antall, leveringsvinduer, rigg/rydd
4. **Regler** - Godkjenning, sikkerhetskrav, støybegrensninger
5. **Pris/Depositum** - Priser, depositum, avgifter, skadehåndtering
6. **Publisering** - Tillatelser, sjekkliste, synlighet

---

## Datamodell

### BaseResource (Felles for alle kategorier)

#### Identitet og struktur
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `objectId` | string | Auto | UUID, auto-generert |
| `slug` | string | Ja | URL-vennlig identifikator |
| `internalCode` | string | Nei | Kortkode for drift (f.eks. "MR-001") |
| `ownerUnit` | string | Ja | Avdeling/virksomhet som eier objektet |
| `displayName` | string | Ja | Synlig navn for publikum |
| `internalName` | string | Nei | Internt navn for admin |

#### Lokasjon og tilgang
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `address` | Address | Ja | Gate, postnummer, poststed |
| `map` | MapCoordinates | Ja | Lat/lng koordinater |
| `building` | string | Nei | Bygg/anlegg navn |
| `roomNumber` | string | Nei | Romnummer/sone |
| `meetingPoint` | string | Nei | "Møt opp her"-tekst |
| `accessType` | AccessType | Ja | code/reception/janitor/digital/physical_key |
| `accessInstructions` | string | Ja | Detaljerte tilgangsinstrukser |
| `keyPickupLocation` | string | Betinget | Hvor hentes nøkkel |
| `parkingInfo` | string | Nei | Parkering/innlasting |
| `loadingZone` | boolean | Nei | Har lastesone |

#### Målgruppe og synlighet
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `visibility` | VisibilityType[] | Ja | public/organization/internal/admin_only |
| `bookableBy` | VisibilityType[] | Ja | Hvem kan booke |
| `priorityRules` | PriorityRule[] | Nei | Prioriteringsregler |
| `requireOrgNumber` | boolean | Nei | Krever org.nummer |
| `requireResponsibleAdult` | boolean | Nei | Krever ansvarlig voksen |
| `minAge` | number | Nei | Minimum alder |
| `verificationLevel` | string | Nei | none/email/phone/bankid |

#### Tidslogikk
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `defaultBookingLength` | number | Ja | Standard lengde (minutter) |
| `minDuration` | number | Ja | Minimum varighet |
| `maxDuration` | number | Ja | Maksimum varighet |
| `bufferBefore` | number | Nei | Rigg-tid før (minutter) |
| `bufferAfter` | number | Nei | Rydd-tid etter (minutter) |
| `minLeadTime` | number | Nei | Minste tid før booking (timer) |
| `maxLeadTime` | number | Nei | Maks tid før booking (dager) |
| `blackoutPeriods` | BlackoutPeriod[] | Nei | Sperrede perioder |
| `cancellationCutoff` | number | Ja | Timer før booking for avbestilling |
| `noShowFee` | number | Nei | Gebyr for no-show |

#### Pris og økonomi
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `isFree` | boolean | Ja | Gratis eller betalt |
| `basePrice` | number | Betinget | Grunnpris (hvis betalt) |
| `priceModel` | string | Betinget | "per time", "per dag", etc. |
| `vatRate` | number | Betinget | MVA-sats (0, 12, 25) |
| `targetGroups` | TargetGroup[] | Nei | Målgruppepriser |
| `pricePlans` | PricePlan[] | Nei | Sesong/tidsbasert prising |
| `deposit` | DepositConfig | Nei | Depositum-konfigurasjon |
| `fees` | Fee[] | Nei | Tilleggsavgifter |
| `paymentMethods` | PaymentMethod[] | Betinget | Betalingsmetoder |

#### Arbeidsflyt
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `approvalMode` | ApprovalMode | Ja | automatic/manual/conditional |
| `approvalSteps` | ApprovalStep[] | Nei | Godkjenningstrinn |
| `prePublishChecklist` | ChecklistItem[] | Auto | Sjekkliste før publisering |
| `documentRequirements` | DocumentRequirement[] | Nei | Påkrevde dokumenter |
| `termsRequired` | boolean | Nei | Krever aksept av vilkår |

#### Innhold
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `shortDescription` | string | Ja | Kort beskrivelse (maks 200 tegn) |
| `longDescription` | string | Nei | Lang beskrivelse |
| `gallery` | GalleryImage[] | Nei | Bilder |
| `attachments` | Attachment[] | Nei | Vedlegg (PDF, etc.) |
| `faq` | FAQItem[] | Nei | Ofte stilte spørsmål |
| `guidelines` | string | Nei | Retningslinjer |
| `languages` | string[] | Nei | Støttede språk (no/en/ar) |

---

### Lokaler - Kategori-spesifikke felt

#### Kapasitet
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `maxPersons` | number | Ja | Maks antall personer |
| `seatedCapacity` | number | Nei | Sittende kapasitet |
| `standingCapacity` | number | Nei | Stående kapasitet |
| `fireCapacity` | number | Soft | Brannforskrift maks |
| `tableLayouts` | TableLayout[] | Nei | Bordoppsett (U-form, etc.) |

#### Rom-struktur
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `isDivisible` | boolean | Nei | Kan deles i underrom |
| `subRooms` | SubRoom[] | Nei | Underrom/soner |
| `canBookSimultaneously` | boolean | Nei | Flere samtidige bookinger |
| `adjacentRooms` | string[] | Nei | Tilstøtende rom |

#### Tilgang
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `keyType` | AccessType | Ja | Nøkkeltype |
| `keyPickupLocation` | string | Betinget | Hentested for nøkkel |
| `setupTimeMinutes` | number | Nei | Riggetid (minutter) |
| `teardownTimeMinutes` | number | Nei | Ryddetid (minutter) |
| `cleaningIncluded` | boolean | Nei | Renhold inkludert |
| `cleaningFee` | number | Nei | Renholdskostnad |

#### Støyregler
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `maxDecibelLevel` | number | Nei | Maks desibel |
| `quietHoursFrom` | string | Nei | Stille timer fra |
| `quietHoursTo` | string | Nei | Stille timer til |
| `musicAllowed` | boolean | Nei | Musikk tillatt |
| `amplifiedSoundAllowed` | boolean | Nei | Forsterket lyd tillatt |

---

### Arrangementer - Kategori-spesifikke felt

#### Arrangør
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `organizationType` | string | Ja | person/organization/municipality |
| `name` | string | Ja | Arrangørnavn |
| `orgNumber` | string | Betinget | Org.nummer (hvis organisasjon) |
| `responsiblePerson` | Contact | Ja | Ansvarlig person |
| `emergencyContact` | Contact | Ja | Nødkontakt |

#### Program
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `checkInTime` | string | Nei | Innsjekk-tidspunkt |
| `doorsOpenTime` | string | Nei | Dører åpner |
| `startTime` | string | Ja | Starttidspunkt |
| `endTime` | string | Ja | Sluttidspunkt |
| `breaks` | EventBreak[] | Nei | Pauser |
| `programItems` | ProgramItem[] | Nei | Programposter |

#### Kapasitet og billettyper
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `totalCapacity` | number | Ja | Total kapasitet |
| `ticketTypes` | TicketType[] | Betinget | Billettyper (hvis betalt) |
| `sections` | EventSection[] | Nei | Soner med egen kapasitet |
| `waitlistCapacity` | number | Nei | Venteliste-kapasitet |

#### Påmelding
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `type` | string | Ja | tickets/registration/free/lottery |
| `deadline` | DateTime | Ja | Påmeldingsfrist |
| `waitlistEnabled` | boolean | Nei | Venteliste aktivert |
| `autoPromoteFromWaitlist` | boolean | Nei | Auto-opprykk fra venteliste |
| `confirmationRequired` | boolean | Nei | Krever bekreftelse |

#### Avlysning og refusjon
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `cancellationDeadlineHours` | number | Ja | Timer før for avbestilling |
| `refundPolicy` | RefundPolicy | Ja | full/partial/none |
| `partialRefundPercentage` | number | Betinget | Prosent refusjon |
| `weatherCancellation` | boolean | Nei | Kan avlyses pga. vær |
| `minParticipantsRequired` | number | Nei | Minimum deltakere |

#### Dokumentkrav
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `alcoholPermit` | PermitRequirement | Auto | Skjenkebevilling |
| `fireWatch` | FireWatchRequirement | Auto | Brannvakt |
| `policePermit` | PermitRequirement | Auto | Politigodkjenning |
| `eventPermit` | PermitRequirement | Auto | Arrangementstillatelse |
| `noisePermit` | PermitRequirement | Auto | Støydispensasjon |

---

### Sport - Kategori-spesifikke felt

#### Sport-Bane (resourceType: 'court')
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `surface` | string | Ja | Underlag (grus, parkett, etc.) |
| `dimensions` | Dimensions | Nei | Lengde x bredde |
| `indoor` | boolean | Ja | Innendørs/utendørs |
| `lighting` | boolean | Nei | Belysning tilgjengelig |
| `heatingAvailable` | boolean | Nei | Oppvarming tilgjengelig |

#### Sesongbooking
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `seasonBookingEnabled` | boolean | Nei | Sesongbooking aktivert |
| `seasonStart` | string | Betinget | Sesongstart |
| `seasonEnd` | string | Betinget | Sesongslutt |
| `frameTimeSlots` | FrameTimeSlot[] | Nei | Faste rammetider |
| `allocationMethod` | string | Nei | first_come/lottery/priority |

#### Prioritetsregler
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `levels` | string[] | Nei | training/match/tournament/event |
| `trainingPriority` | string[] | Nei | Org-IDer med treningsprioritet |
| `matchPriority` | string[] | Nei | Org-IDer med kampprioritet |
| `localClubPriority` | boolean | Nei | Lokale klubber har prioritet |

#### Sport-Utstyr (resourceType: 'equipment')
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `totalUnits` | number | Ja | Totalt antall enheter |
| `availableUnits` | number | Auto | Tilgjengelige enheter |
| `unitDescription` | string | Ja | Beskrivelse av én enhet |
| `setContents` | string[] | Nei | Innhold i ett sett |

#### Utlån
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `maxLoanDurationDays` | number | Ja | Maks utlånsperiode (dager) |
| `pickupRequired` | boolean | Ja | Må hentes |
| `deliveryAvailable` | boolean | Nei | Levering tilgjengelig |
| `pickupLocation` | string | Ja | Hentested |
| `lateReturnFeePerDay` | number | Nei | Gebyr per dag for sen retur |

#### Brukerkrav
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `minAge` | number | Nei | Minimum alder |
| `certificationRequired` | boolean | Nei | Krever sertifisering |
| `responsibleAdultRequired` | boolean | Nei | Krever ansvarlig voksen |
| `trainingRequired` | boolean | Nei | Krever opplæring |

---

### Torg/Uteområde - Kategori-spesifikke felt

#### Areal og soner
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `totalArea` | number | Ja | Totalt areal (m²) |
| `usableArea` | number | Ja | Brukbart areal (m²) |
| `zones` | OutdoorZone[] | Nei | Definerte soner |
| `powerOutlets` | PowerOutlet[] | Nei | Strømuttak |
| `waterConnections` | WaterConnection[] | Nei | Vanntilkoblinger |

#### Logistikk
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `setupTimeHours` | number | Ja | Riggetid (timer) |
| `teardownTimeHours` | number | Ja | Ryddetid (timer) |
| `lateTeardownFeePerHour` | number | Nei | Gebyr for sen rydding |
| `deliveryWindows` | DeliveryWindow[] | Nei | Leveringsvinduer |
| `maxVehicleWeight` | number | Nei | Maks kjøretøyvekt (tonn) |
| `loadingZone` | boolean | Nei | Har lastesone |

#### Sikkerhet
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `maxDecibels` | number | Ja | Maks desibel |
| `musicCurfew` | string | Ja | Musikkforbud fra kl. |
| `securityRequired` | boolean | Auto | Vakthold påkrevd |
| `securityThreshold` | number | Ja | Antall for vakt-krav |
| `firstAidRequired` | boolean | Auto | Førstehjelp påkrevd |
| `fireWatchRequired` | boolean | Auto | Brannvakt påkrevd |
| `evacuationPlanRequired` | boolean | Auto | Rømningsplan påkrevd |

#### Tillatelser (triggers)
| Betingelse | Terskel | Påkrevd tillatelse | Frist (dager) |
|------------|---------|-------------------|---------------|
| Kapasitet | > 500 | Politigodkjenning | 14 |
| Alkohol | true | Skjenkebevilling | 30 |
| Forsterket lyd | > 85 dB | Støydispensasjon | 7 |
| Veisperring | true | Veiarbeid-tillatelse | 21 |
| Matservering | true | Mattilsyn-godkjenning | 14 |

#### Depositum
| Felt | Type | Påkrevd | Beskrivelse |
|------|------|---------|-------------|
| `baseAmount` | number | Ja | Grunnbeløp |
| `additionalPerZone` | number | Nei | Tillegg per sone |
| `additionalForInfrastructure` | boolean | Nei | Tillegg for strøm/vann |
| `preInspectionRequired` | boolean | Ja | Forhåndsbefaring |
| `postInspectionRequired` | boolean | Ja | Etterbefaring |
| `damageReportingDeadlineHours` | number | Ja | Frist for skademelding |

---

## Valideringsregler

### Hard validering (blokkerer)
- **Alle kategorier**:
  - Navn må være fylt ut
  - Adresse må være komplett (gate, postnummer, poststed)
  - Minst én tilgjengelighetstype må være valgt (eller "kun presentasjon")
  - Godkjenningsmodus må være valgt
  - Hvis betalt: Minst én pris og betalingsmetode må være definert

- **Lokaler**:
  - Kapasitet (max personer) må være satt
  - Tilgangstype må være valgt

- **Arrangementer**:
  - Ansvarlig person med kontaktinfo er obligatorisk
  - Start- og sluttidspunkt må være satt
  - Kapasitet må være definert
  - Påmeldingsfrist må være før arrangement

- **Sport (Bane)**:
  - Tidsintervall må være valgt
  - Åpningstider må være definert

- **Sport (Utstyr)**:
  - Antall enheter må være satt
  - Hentested må være definert

- **Torg**:
  - Totalt areal må være satt
  - Rigge- og ryddetider må være definert

### Soft validering (advarsler)
- Bilder anbefales (minst 1)
- Lang beskrivelse anbefales
- Kontaktperson anbefales
- Universell utforming bør fylles ut
- Vilkår-PDF anbefales for betalte objekter
- Brannkapasitet bør settes hvis > 50 personer

---

## Sjekkliste før publisering

### Obligatoriske (blokkerer publisering)
- [ ] Navn og adresse komplett
- [ ] Tilgjengelighet definert (eller "kun presentasjon")
- [ ] Godkjenningsmodus valgt
- [ ] Pris definert (hvis betalt)
- [ ] Betalingsmetode satt (hvis betalt)

### Anbefalte (viser varsel)
- [ ] Bilder lastet opp
- [ ] Lang beskrivelse fylt ut
- [ ] Kontaktperson oppgitt
- [ ] Universell utforming dokumentert
- [ ] Vilkår-PDF lastet opp
- [ ] FAQ lagt til

### Kategori-spesifikke
**Lokaler**:
- [ ] Kapasitet i flere dimensjoner
- [ ] Tilgangsinstrukser
- [ ] Branninstruks lastet opp

**Arrangementer**:
- [ ] Arrangør-info komplett
- [ ] Alle påkrevde tillatelser søkt/godkjent
- [ ] Avbestillingsregler definert

**Sport**:
- [ ] Vedlikeholdsstatus oppdatert
- [ ] Prioritetsregler definert (hvis sesongbooking)

**Torg**:
- [ ] Soner definert
- [ ] Infrastruktur dokumentert
- [ ] Tillatelses-krav gjennomgått

---

## UI Requirements

### Generelt
- Stegindikator viser fremdrift
- Sidepanel til høyre med status, sjekkliste og kort oppsummering
- Navigasjonsknapper: Tilbake, Neste, Lagre utkast, Avbryt
- Validering på hvert steg med tydelige feilmeldinger
- Kart-integrasjon for lokasjon
- Kollapsible seksjoner for lange skjemaer

### Nye seksjoner
1. **Identitet og struktur** - Objekt-ID, slug, intern kode, eier-enhet
2. **Tilgang og logistikk** - Nøkkeltype, møtepunkt, parkering, rigg/rydd
3. **Tillatelses-tracker** - Visuell oversikt over påkrevde tillatelser (arrangementer/torg)
4. **Dokumentkrav-panel** - Status på påkrevde dokumenter

### Validering UI
- Feilmeldinger vises inline ved relevante felt
- Hard errors = rød kant og ikon
- Soft warnings = gul kant og ikon
- Sjekkliste i sidepanel oppdateres i sanntid
- Completion-prosent vises i header

---

## Statuser

### Objekt-status
- `draft` - Utkast, ikke synlig
- `pending_review` - Venter på godkjenning
- `published` - Publisert og synlig
- `archived` - Arkivert
- `suspended` - Midlertidig suspendert

### Tillatelses-status
- `not_required` - Ikke påkrevd
- `pending` - Venter på behandling
- `approved` - Godkjent
- `rejected` - Avslått
- `expired` - Utløpt

### Vedlikeholds-status (Sport)
- `available` - Tilgjengelig
- `limited` - Begrenset tilgjengelighet
- `maintenance` - Under vedlikehold
- `closed` - Stengt

### Utlåns-status (Sport-utstyr)
- `available` - Tilgjengelig
- `reserved` - Reservert
- `checked_out` - Utlevert
- `returning` - Under innlevering
- `inspecting` - Under inspeksjon
- `maintenance` - Under vedlikehold
- `overdue` - Forsinket retur

---

## Scope boundaries

- Fokuserer på admin-opprettelse og -redigering
- Inkluderer validering og sjekklister
- Inkluderer tillatelses-håndtering UI (ikke backend-integrasjon)
- Kalender-visning er mock (ikke faktisk bookingsystem)
- Betalingsintegrasjon er konfigurasjon (ikke faktisk betaling)
