import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { bestPractices } from '@/lib/data'
import { BestPractice } from '@/lib/types'
import { getCategoryInfo } from '@/lib/data'
import { MagnifyingGlass, CheckCircle, Circle } from '@phosphor-icons/react'

export function BestPracticesPanel() {
  const [implementedPractices, setImplementedPractices] = useKV<string[]>('implemented-practices', [])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPractices = bestPractices.filter((practice) => {
    const query = searchQuery.toLowerCase()
    return (
      practice.title.toLowerCase().includes(query) ||
      practice.description.toLowerCase().includes(query) ||
      practice.category.toLowerCase().includes(query)
    )
  })

  const toggleImplemented = (practiceId: string) => {
    setImplementedPractices((current) => {
      const practices = current || []
      if (practices.includes(practiceId)) {
        return practices.filter((id) => id !== practiceId)
      }
      return [...practices, practiceId]
    })
  }

  const isImplemented = (practiceId: string) => (implementedPractices || []).includes(practiceId)

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search best practices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <div className="grid gap-4">
        {filteredPractices.length > 0 ? (
          filteredPractices.map((practice) => {
            const categoryInfo = getCategoryInfo(practice.category)
            const implemented = isImplemented(practice.id)

            return (
              <Card key={practice.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{practice.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {categoryInfo.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{practice.description}</p>
                  </div>
                  <Button
                    onClick={() => toggleImplemented(practice.id)}
                    variant={implemented ? 'default' : 'outline'}
                    size="sm"
                    className="ml-4 flex items-center gap-2"
                  >
                    {implemented ? (
                      <>
                        <CheckCircle size={16} />
                        Implemented
                      </>
                    ) : (
                      <>
                        <Circle size={16} />
                        Mark Complete
                      </>
                    )}
                  </Button>
                </div>

                <Accordion type="single" collapsible>
                  <AccordionItem value="steps" className="border-0">
                    <AccordionTrigger className="text-sm hover:no-underline py-3">
                      Implementation Steps ({practice.steps.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {practice.steps.map((step, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                              {index + 1}
                            </div>
                            <p className="text-sm pt-0.5">{step}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {practice.relatedRisks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">Mitigates Risks:</p>
                    <div className="flex flex-wrap gap-2">
                      {practice.relatedRisks.map((riskId) => (
                        <Badge key={riskId} variant="secondary" className="text-xs">
                          {riskId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )
          })
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No best practices found matching your search.</p>
          </Card>
        )}
      </div>

      <Card className="p-4 bg-primary/5 border-primary/20">
        <p className="text-sm">
          <strong className="text-primary">
            {(implementedPractices || []).length} of {bestPractices.length}
          </strong>{' '}
          best practices implemented
        </p>
      </Card>
    </div>
  )
}
