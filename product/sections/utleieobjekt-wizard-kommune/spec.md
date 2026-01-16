# Utleieobjekt-wizard (kommuneversjon)

## Overview
En stegvis wizard for kommuner til å opprette og publisere et utleieobjekt (lokale/område/ressurs) med korrekt grunninfo, tilgjengelighet, regler, pris, betaling, vilkår og synlighet, på en måte som passer kommunal drift og saksbehandling.

## User Flows
- Admin starter wizarden og velger opprettelsesmetode (nytt eller kopier)
- Admin fyller ut lokasjon og basis (navn, adresse, kart, beskrivelse, kontakt, media)
- Admin definerer egenskaper (kategori, kapasitet, fasiliteter, universell utforming, tilleggstjenester)
- Admin setter opp tilgjengelighet (leies ut per, intervall, åpningstider, unntak)
- Admin konfigurerer regler og godkjenning (automatisk/manuell/regelstyrt, begrensninger, paraplyorganisasjon)
- Admin setter pris og målgrupper (gratis/betalt, MVA, målgrupper, tilleggstjenester)
- Admin konfigurerer betaling og vilkår (betalingsmetoder, konto-oppsett, leiebetingelser, identitetsnivå)
- Admin publiserer objektet med sjekkliste og oppsummering

## UI Requirements
- Stegindikator viser 7 steg (Lokasjon og basis → Egenskaper → Tilgjengelighet → Regler → Pris → Betaling → Publisering)
- Sidepanel til høyre med status, sjekkliste og kort oppsummering
- Navigasjonsknapper: Tilbake, Neste, Lagre utkast, Avbryt
- Validering på hvert steg med tydelige feilmeldinger
- Kart-integrasjon for lokasjon
- Målgruppe-styring for kommunal prisstyring
- Leiebetingelser med PDF-opplasting
- Sjekkliste før publisering med automatisk validering
