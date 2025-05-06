"use client"

import { useState, useEffect } from 'react'
import { useApi } from '@/hooks/use-api'
import { equipmentService, Equipment } from '@/lib/services/equipment-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, RefreshCw } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function ApiEquipmentSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: equipment, loading, error, execute: fetchEquipment } = useApi<Equipment[]>(
    () => equipmentService.getAll(),
    [],
    false // Don't fetch immediately
  )

  const handleSearch = () => {
    fetchEquipment().catch(console.error)
    console.log('Fetching equipment...')
    console.log('Search term:', equipment)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Search (API Example)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search equipment..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              Error: {error.message || 'Failed to fetch equipment data'}
            </div>
          )}

          <div className="space-y-2">
            {loading ? (
              // Loading skeletons
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 rounded-md border p-4">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))
            ) : equipment && equipment.length > 0 ? (
              // Equipment results
              equipment.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 rounded-md border p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                    {item.serial_number.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-medium">{item.model}</h4>
                    <p className="text-sm text-muted-foreground">
                      ID: {item.id} • Status: {item.manufacturer}
                    </p>
                  </div>
                </div>
              ))
            ) : equipment && equipment.length === 0 ? (
              // No results
              <div className="rounded-md bg-muted p-8 text-center">
                <p className="text-muted-foreground">No equipment found matching your search criteria.</p>
              </div>
            ) : (
              // Initial state
              <div className="rounded-md bg-muted p-8 text-center">
                <p className="text-muted-foreground">Enter a search term and click Search to find equipment.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
