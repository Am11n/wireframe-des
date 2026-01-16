import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Plus, 
  Copy, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical
} from 'lucide-react'

type UtleieobjektCategory = 'lokaler' | 'utstyr' | 'opplevelser'
type UtleieobjektStatus = 'utkast' | 'publisert' | 'stengt' | 'arkivert'

interface Utleieobjekt {
  id: string
  name: string
  category: UtleieobjektCategory
  status: UtleieobjektStatus
  owner: string
  location: string
  createdAt: string
  updatedAt: string
}

interface UtleieobjektListeProps {
  onNewObject?: (category: UtleieobjektCategory | null) => void
  onCopy?: () => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
}

// Sample data for demonstration
const sampleData: Utleieobjekt[] = [
  {
    id: '1',
    name: 'Idrettshall A',
    category: 'lokaler',
    status: 'publisert',
    owner: 'Skien kommune',
    location: 'Skien',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Fotballutstyr sett',
    category: 'utstyr',
    status: 'utkast',
    owner: 'Skien kommune',
    location: 'Skien',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    name: 'Sommerfest 2024',
    category: 'opplevelser',
    status: 'publisert',
    owner: 'Skien kommune',
    location: 'Skien sentrum',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-22'
  }
]

const categoryLabels: Record<UtleieobjektCategory, string> = {
  lokaler: 'Lokaler og baner',
  utstyr: 'Utstyr og inventar',
  opplevelser: 'Opplevelser og arrangement'
}

const statusLabels: Record<UtleieobjektStatus, string> = {
  utkast: 'Utkast',
  publisert: 'Publisert',
  stengt: 'Midlertidig stengt',
  arkivert: 'Arkivert'
}

const statusColors: Record<UtleieobjektStatus, 'default' | 'secondary' | 'outline'> = {
  utkast: 'outline',
  publisert: 'default',
  stengt: 'secondary',
  arkivert: 'outline'
}

export default function UtleieobjektListe({
  onNewObject,
  onCopy,
  onEdit,
  onDelete,
  onView
}: UtleieobjektListeProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    status: '' as UtleieobjektStatus | '',
    owner: '',
    location: '',
    type: '' as UtleieobjektCategory | ''
  })
  const [utleieobjekter] = useState<Utleieobjekt[]>(sampleData)

  // Filter logic
  const filteredObjects = utleieobjekter.filter(obj => {
    const matchesSearch = !searchQuery || 
      obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = !filters.status || obj.status === filters.status
    const matchesType = !filters.type || obj.category === filters.type
    const matchesOwner = !filters.owner || obj.owner.toLowerCase().includes(filters.owner.toLowerCase())
    const matchesLocation = !filters.location || obj.location.toLowerCase().includes(filters.location.toLowerCase())

    return matchesSearch && matchesStatus && matchesType && matchesOwner && matchesLocation
  })

  const handleNewObject = (category: UtleieobjektCategory | null = null) => {
    onNewObject?.(category)
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Utleieobjekter
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Administrer alle utleieobjekter
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Search */}
              <div>
                <Label htmlFor="search" className="sr-only">Søk</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input
                    id="search"
                    placeholder="Søk i navn, beskrivelse, adresse..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="filter-status" className="text-xs text-stone-500 mb-1 block">
                    Status
                  </Label>
                  <select
                    id="filter-status"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value as UtleieobjektStatus | '' })}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  >
                    <option value="">Alle statuser</option>
                    <option value="utkast">Utkast</option>
                    <option value="publisert">Publisert</option>
                    <option value="stengt">Midlertidig stengt</option>
                    <option value="arkivert">Arkivert</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="filter-type" className="text-xs text-stone-500 mb-1 block">
                    Type
                  </Label>
                  <select
                    id="filter-type"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value as UtleieobjektCategory | '' })}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  >
                    <option value="">Alle typer</option>
                    <option value="lokaler">Lokaler og baner</option>
                    <option value="utstyr">Utstyr og inventar</option>
                    <option value="opplevelser">Opplevelser og arrangement</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="filter-owner" className="text-xs text-stone-500 mb-1 block">
                    Eier/enhet
                  </Label>
                  <Input
                    id="filter-owner"
                    placeholder="Søk eier..."
                    value={filters.owner}
                    onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="filter-location" className="text-xs text-stone-500 mb-1 block">
                    Sted
                  </Label>
                  <Input
                    id="filter-location"
                    placeholder="Søk sted..."
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button onClick={() => handleNewObject(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Nytt utleieobjekt
            </Button>
            <Button variant="outline" onClick={onCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Kopier fra eksisterende
            </Button>
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-400">
            {filteredObjects.length} {filteredObjects.length === 1 ? 'objekt' : 'objekter'}
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Navn</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Eier/enhet</TableHead>
                  <TableHead>Sted</TableHead>
                  <TableHead>Oppdatert</TableHead>
                  <TableHead className="text-right">Handlinger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredObjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-stone-500">
                      Ingen utleieobjekter funnet
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredObjects.map((obj) => (
                    <TableRow key={obj.id}>
                      <TableCell className="font-medium">{obj.name}</TableCell>
                      <TableCell>{categoryLabels[obj.category]}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[obj.status]}>
                          {statusLabels[obj.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{obj.owner}</TableCell>
                      <TableCell>{obj.location}</TableCell>
                      <TableCell className="text-stone-500">
                        {new Date(obj.updatedAt).toLocaleDateString('no-NO')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView?.(obj.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit?.(obj.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete?.(obj.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
