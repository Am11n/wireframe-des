# Import utleieobjekt fra eksterne kilder

## Overview
En funksjon som lar admin importere utleieobjekter fra eksterne nettsider som finn.no, bookup.no og lignende. Systemet ekstraherer relevant informasjon fra URL-en og mapper den til wizarden, slik at admin kan raskt opprette nye utleieobjekter basert på eksisterende annonser.

## User Flows
- Admin starter import-funksjonen fra wizarden (som et alternativ til "Opprett nytt" eller "Kopier fra eksisterende")
- Admin limer inn URL fra ekstern kilde (f.eks. finn.no eller bookup.no)
- Systemet analyserer URL-en og identifiserer kildetype
- Systemet henter og ekstraherer data fra kilden (navn, adresse, beskrivelse, bilder, pris, fasiliteter, etc.)
- Admin får en forhåndsvisning av ekstrahert data med mapping til wizarden-felter
- Admin kan redigere og justere mappet data før import
- Admin bekrefter import, og dataene fylles automatisk inn i wizarden
- Admin fullfører resten av wizarden med de importerte dataene som utgangspunkt

## UI Requirements
- Import-knapp/alternativ i wizarden start-steg (ved siden av "Opprett nytt" og "Kopier fra eksisterende")
- URL-input-felt med validering og støtte for flere kilder
- Loading-state mens systemet henter og analyserer data
- Forhåndsvisning av ekstrahert data i et kortformat
- Mapping-visning som viser hvilke felt som er fylt ut og hvilke som mangler
- Redigeringsmulighet for å justere mappet data før import
- Bekreftelsesdialog før import starter
- Feilhåndtering hvis URL ikke kan importeres eller data mangler
- Støtte for flere kilder med forskjellige dataformater

## Tekniske krav
- Støtte for finn.no annonser (leieobjekter)
- Støtte for bookup.no annonser
- Utvidbar arkitektur for å legge til flere kilder senere
- Dataekstraksjon via scraping eller API (hvis tilgjengelig)
- Mapping av eksterne felter til interne wizarden-felter:
  - Navn → locationAndBasis.name
  - Adresse → locationAndBasis.address
  - Beskrivelse → locationAndBasis.longDescription
  - Bilder → locationAndBasis.images
  - Pris → pricing.basePrice
  - Fasiliteter → properties.facilities
  - Størrelse → properties.size
  - Kapasitet → properties.maxPersons
- Validering av ekstrahert data før import

## Scope boundaries
- Fokuserer på import-funksjonaliteten, ikke fullstendig scraping-infrastruktur
- Antar at backend/API håndterer faktisk datahenting
- Import fungerer som et utgangspunkt - admin må fortsatt fullføre wizarden
- Støtter ikke automatisk oppdatering av importerte objekter
- Fokuserer på norske kilder (finn.no, bookup.no) som første iterasjon
