import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Link, 
  Loader2, 
  Check, 
  AlertCircle, 
  ExternalLink,
  MapPin,
  DollarSign,
  Users,
  Image as ImageIcon
} from 'lucide-react'

interface ImportedData {
  source: 'finn' | 'bookup' | 'unknown'
  name: string
  address: string
  postalCode: string
  postalArea: string
  description: string
  shortDescription: string
  images: string[]
  price: number | null
  facilities: string[]
  size: string
  maxPersons: string
  contact?: {
    name: string
    email: string
    phone: string
  }
}

interface ImportUtleieobjektProps {
  onImport: (data: ImportedData) => void
  onCancel: () => void
}

// Simulerer dataekstraksjon fra URL
const extractDataFromUrl = async (url: string): Promise<ImportedData | null> => {
  // I produksjon ville dette være en API-kall til backend som håndterer scraping
  // Her simulerer vi med en delay og returnerer eksempeldata
  
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  if (url.includes('finn.no')) {
    return {
      source: 'finn',
      name: 'Moderne leilighet i sentrum',
      address: 'Storgata 15',
      postalCode: '0155',
      postalArea: 'Oslo',
      description: 'Lys og moderne leilighet med 3 soverom, stue, kjøkken og bad. Perfekt beliggenhet i hjertet av Oslo. Nær kollektivtransport og butikker.',
      shortDescription: 'Lys og moderne leilighet i sentrum',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
      ],
      price: 15000,
      facilities: ['WiFi', 'Oppvaskmaskin', 'Vaskemaskin', 'Balkong'],
      size: '85 m²',
      maxPersons: '4',
      contact: {
        name: 'Kari Nordmann',
        email: 'kari@example.com',
        phone: '+47 123 45 678'
      }
    }
  }
  
  if (url.includes('bookup.no')) {
    return {
      source: 'bookup',
      name: 'Konferansesal med moderne utstyr',
      address: 'Innovasjonsveien 10',
      postalCode: '0157',
      postalArea: 'Oslo',
      description: 'Stor konferansesal med plass til 50 personer. Inkluderer projektor, whiteboard, WiFi og kaffeservering. Perfekt for møter og presentasjoner.',
      shortDescription: 'Konferansesal for 50 personer',
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'
      ],
      price: 2500,
      facilities: ['Projektor', 'Whiteboard', 'WiFi', 'Kaffeservering', 'Mikrofon'],
      size: '120 m²',
      maxPersons: '50',
      contact: {
        name: 'Ola Hansen',
        email: 'ola@bookup.no',
        phone: '+47 987 65 432'
      }
    }
  }
  
  return null
}

const validateUrl = (url: string): { valid: boolean; source: 'finn' | 'bookup' | 'unknown' } => {
  if (!url.trim()) {
    return { valid: false, source: 'unknown' }
  }
  
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname.includes('finn.no')) {
      return { valid: true, source: 'finn' }
    }
    if (urlObj.hostname.includes('bookup.no')) {
      return { valid: true, source: 'bookup' }
    }
    return { valid: false, source: 'unknown' }
  } catch {
    return { valid: false, source: 'unknown' }
  }
}

export default function ImportUtleieobjekt({ onImport, onCancel }: ImportUtleieobjektProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [importedData, setImportedData] = useState<ImportedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mapping, setMapping] = useState<Record<string, boolean>>({})

  const urlValidation = validateUrl(url)

  const handleImport = async () => {
    if (!urlValidation.valid) {
      setError('Ugyldig URL. Støttede kilder: finn.no, bookup.no')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const data = await extractDataFromUrl(url)
      if (!data) {
        setError('Kunne ikke hente data fra URL. Sjekk at URL-en er korrekt og tilgjengelig.')
        setIsLoading(false)
        return
      }
      
      setImportedData(data)
      // Auto-select alle mapping-innstillinger
      setMapping({
        name: true,
        address: true,
        description: true,
        images: true,
        price: true,
        facilities: true,
        size: true,
        maxPersons: true,
        contact: true
      })
    } catch (err) {
      setError('En feil oppstod under import. Prøv igjen.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmImport = () => {
    if (!importedData) return
    
    // Filtrer data basert på mapping-innstillinger
    const dataToImport: ImportedData = {
      ...importedData,
      name: mapping.name ? importedData.name : '',
      address: mapping.address ? importedData.address : '',
      postalCode: mapping.address ? importedData.postalCode : '',
      postalArea: mapping.address ? importedData.postalArea : '',
      description: mapping.description ? importedData.description : '',
      shortDescription: mapping.description ? importedData.shortDescription : '',
      images: mapping.images ? importedData.images : [],
      price: mapping.price ? importedData.price : null,
      facilities: mapping.facilities ? importedData.facilities : [],
      size: mapping.size ? importedData.size : '',
      maxPersons: mapping.maxPersons ? importedData.maxPersons : '',
      contact: mapping.contact ? importedData.contact : undefined
    }
    
    onImport(dataToImport)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Importer fra ekstern kilde</CardTitle>
          <CardDescription>
            Lim inn URL fra finn.no, bookup.no eller lignende for å automatisk fylle ut grunnleggende informasjon
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="import-url">URL til annonse</Label>
            <div className="mt-2 flex gap-2">
              <Input
                id="import-url"
                type="url"
                placeholder="https://finn.no/leie/..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  setError(null)
                  setImportedData(null)
                }}
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleImport}
                disabled={!urlValidation.valid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Henter...
                  </>
                ) : (
                  <>
                    <Link className="w-4 h-4 mr-2" />
                    Importer
                  </>
                )}
              </Button>
            </div>
            {url && !urlValidation.valid && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                Støttede kilder: finn.no, bookup.no
              </p>
            )}
            {error && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
          </div>

          {importedData && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-stone-900 dark:text-stone-100">
                  Forhåndsvisning av importert data
                </h3>
                <Badge variant="outline">
                  {importedData.source === 'finn' ? 'Finn.no' : importedData.source === 'bookup' ? 'Bookup.no' : 'Ukjent kilde'}
                </Badge>
              </div>

              <div className="border rounded-lg p-4 space-y-4 bg-stone-50 dark:bg-stone-800">
                {/* Navn */}
                <div>
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={mapping.name}
                      onChange={(e) => setMapping({ ...mapping, name: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">Navn</span>
                  </label>
                  <p className="text-sm text-stone-700 dark:text-stone-300 ml-6">
                    {importedData.name}
                  </p>
                </div>

                {/* Adresse */}
                <div>
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={mapping.address}
                      onChange={(e) => setMapping({ ...mapping, address: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">Adresse</span>
                  </label>
                  <div className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300 ml-6">
                    <MapPin className="w-4 h-4" />
                    {importedData.address}, {importedData.postalCode} {importedData.postalArea}
                  </div>
                </div>

                {/* Beskrivelse */}
                <div>
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={mapping.description}
                      onChange={(e) => setMapping({ ...mapping, description: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">Beskrivelse</span>
                  </label>
                  <p className="text-sm text-stone-700 dark:text-stone-300 ml-6">
                    {importedData.shortDescription}
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-400 ml-6 mt-1 line-clamp-2">
                    {importedData.description}
                  </p>
                </div>

                {/* Bilder */}
                {importedData.images.length > 0 && (
                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={mapping.images}
                        onChange={(e) => setMapping({ ...mapping, images: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Bilder</span>
                    </label>
                    <div className="flex gap-2 ml-6">
                      {importedData.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="w-20 h-20 rounded border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-900 flex items-center justify-center"
                        >
                          <ImageIcon className="w-6 h-6 text-stone-400" />
                        </div>
                      ))}
                      <Badge variant="secondary" className="self-center">
                        {importedData.images.length} bilder
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Pris */}
                {importedData.price && (
                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={mapping.price}
                        onChange={(e) => setMapping({ ...mapping, price: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Pris</span>
                    </label>
                    <div className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300 ml-6">
                      <DollarSign className="w-4 h-4" />
                      {importedData.price.toLocaleString('no-NO')} kr
                    </div>
                  </div>
                )}

                {/* Størrelse og kapasitet */}
                <div className="grid grid-cols-2 gap-4">
                  {importedData.size && (
                    <div>
                      <label className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={mapping.size}
                          onChange={(e) => setMapping({ ...mapping, size: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm font-medium">Størrelse</span>
                      </label>
                      <p className="text-sm text-stone-700 dark:text-stone-300 ml-6">
                        {importedData.size}
                      </p>
                    </div>
                  )}
                  {importedData.maxPersons && (
                    <div>
                      <label className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={mapping.maxPersons}
                          onChange={(e) => setMapping({ ...mapping, maxPersons: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm font-medium">Kapasitet</span>
                      </label>
                      <div className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300 ml-6">
                        <Users className="w-4 h-4" />
                        {importedData.maxPersons} personer
                      </div>
                    </div>
                  )}
                </div>

                {/* Fasiliteter */}
                {importedData.facilities.length > 0 && (
                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={mapping.facilities}
                        onChange={(e) => setMapping({ ...mapping, facilities: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Fasiliteter</span>
                    </label>
                    <div className="flex flex-wrap gap-2 ml-6">
                      {importedData.facilities.map((facility, idx) => (
                        <Badge key={idx} variant="secondary">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Kontakt */}
                {importedData.contact && (
                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={mapping.contact}
                        onChange={(e) => setMapping({ ...mapping, contact: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Kontaktperson</span>
                    </label>
                    <div className="text-sm text-stone-700 dark:text-stone-300 ml-6 space-y-1">
                      <p>{importedData.contact.name}</p>
                      <p className="text-xs text-stone-600 dark:text-stone-400">
                        {importedData.contact.email} • {importedData.contact.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleConfirmImport} className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Bekreft import og fortsett
                </Button>
                <Button variant="outline" onClick={onCancel}>
                  Avbryt
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
