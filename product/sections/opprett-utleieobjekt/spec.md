# Opprett utleieobjekt Wizard

## Overview
En stegvis wizard for admin til å opprette og publisere et utleieobjekt (lokale/ressurs) med regler, tilgjengelighet, skjema og prising. Wizarden har 6 steg: Start, Grunninfo, Tilgjengelighet, Regler og godkjenning, Pris og tillegg, og Bestillingsskjema og publisering.

## User Flows
- Admin starter wizarden og velger å opprette nytt objekt eller kopiere eksisterende
- Admin fyller ut grunninfo (navn, kategori, lokasjon, beskrivelse, kapasitet, bilder, dokumenter)
- Admin definerer tilgjengelighet med standard åpningstider og unntak/sperringer
- Admin setter opp regler for godkjenning, begrensninger og prioritet
- Admin konfigurerer prising og tilleggstjenester
- Admin setter opp bestillingsskjema og publiserer objektet

## UI Requirements
- Stegindikator viser fremdrift (1-5)
- Sidepanel til høyre viser status, valideringsliste og hurtigvisning
- Primærknapp "Neste" for å gå videre
- Sekundærknapp "Tilbake" for å gå tilbake
- Tertiærknapp "Lagre utkast" for å lagre uten å publisere
- Exit-knapp "Avbryt" for å avslutte
- Validering på hvert steg før man kan gå videre
- Preview-funksjonalitet hvor relevant
