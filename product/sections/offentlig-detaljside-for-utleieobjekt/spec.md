# Offentlig detaljside for utleieobjekt

## Overview
En offentlig detaljside som viser full informasjon om et utleieobjekt med kategori-spesifikke seksjoner, interaktiv booking-flyt, og alle UI-elementer. Siden støtter alle tre kategorier: lokaler, utstyr, og opplevelser. Siden er standalone (ikke inne i shell) og kan vises offentlig.

## User Flows
- Bruker navigerer til detaljsiden via søk, kategori-liste, eller direkte lenke
- Bruker ser bildegalleri, beskrivelse, fasiliteter, og kontaktinfo
- Bruker velger tidslot i booking-kalenderen
- Bruker fyller ut booking-detaljer (navn, e-post, etc.)
- Bruker logger inn eller fortsetter som gjest
- Bruker bekrefter booking med oppsummering
- Bruker mottar bekreftelse
- Bruker kan legge til favoritt
- Bruker kan dele objektet
- Bruker kan se aktivitetskalender, retningslinjer, og FAQ i tabs

## UI Requirements

### Header
- Logo: "Digilist ENKEL BOOKING"
- Breadcrumbs: "Hjem > [Kategori] > [Navn]"
- Søkefelt med "Søk"-knapp
- "Logg inn"-knapp

### Bildegalleri
- Carousel med hovedbilde
- Navigasjonspiler (venstre/høyre)
- Bildeindikator (f.eks. "1/3")
- Thumbnail-bilder under hovedbildet
- Klikk på thumbnail bytter hovedbilde

### Tittel og metadata
- Navn på utleieobjekt (stor heading)
- Adresse (eller hentested for utstyr)
- Favoritt-knapp (hjerte-ikon)
- Del-knapp (share-ikon)

### Tabs
- Oversikt (default aktiv)
- Aktivitetskalender
- Retningslinjer
- Ofte stilte spørsmål
- Aktiv tab er tydelig markert

### Oversikt-tab
- Beskrivelse (kort og lang)
- Kapasitet (max personer/deltakere)
- Fasiliteter (ikon-basert liste)
- Tilleggstjenester (med priser og checkboxes)
- Kategori-spesifikke seksjoner (se nedenfor)

### Sidebar
- Kontaktinformasjon (e-post, telefon)
- Kart-visning med pin
- Adresse/hentested
- "Åpne i kart"-knapp
- Åpningstider (eller datoer/tidspunkter for opplevelser)

### Booking-seksjon
- Stegindikator (5 steg: Velg tid, Detaljer, Logg inn, Bekreft, Ferdig)
- Booking-kalender:
  - Ukevisning med dager
  - Tidslots vertikalt (f.eks. 08:00-17:00)
  - Fargekodet slots:
    - Ledig (grønn)
    - Reservert (lys grønn)
    - Booket (rød)
    - Blokkert (mørk rød)
    - Utilgjengelig (grå)
    - Stengt (svart)
  - Forklaring/legend for farger
  - Valgte tidslots vises i sidebar
- Booking-steg:
  - Steg 1: Velg tid (kalender)
  - Steg 2: Detaljer (skjema)
  - Steg 3: Logg inn (login eller fortsett som gjest)
  - Steg 4: Bekreft (oppsummering)
  - Steg 5: Ferdig (bekreftelse)

## Kategori-spesifikke krav

### Lokaler
- Åpningstider i sidebar
- Booking-kalender med tidsvalg (time/dag)
- Tilleggstjenester med priser
- Kapasitet (max personer)
- Fasiliteter (WiFi, Projektor, Whiteboard, etc.)
- Universell utforming (hvis relevant)

### Utstyr
- Hentested i stedet for adresse
- Antall enheter/lagerstatus
- Booking-kalender for utleieperioder (datoer)
- Depositum og leiepris
- Logistikk-informasjon
- Utstyr-spesifikke detaljer

### Opplevelser
- Datoer/tidspunkter i stedet for åpningstider
- Billetter eller påmelding
- Kapasitet (max deltakere)
- Arrangement-spesifikke detaljer
- Pris per billett/deltaker
- Tidspunkt for arrangementer

## Responsiv design
- Mobile-first tilnærming
- Sidebar blir full-width på mobile (eller accordion)
- Kalender tilpasser seg skjermstørrelse
- Tabs blir scrollbar på mobile
- Bildegalleri tilpasser seg mobile

## Scope boundaries
- Fokuserer på visning og booking-flyt (interaktiv, men uten backend-kobling)
- Favoritt og del er visuelle (ikke faktisk lagring/deling)
- Kart er statisk visning (ikke interaktiv kart-integrasjon)
- Booking er simulerte data (ikke faktisk booking-backend)
- Login er mock (ikke faktisk autentisering)
