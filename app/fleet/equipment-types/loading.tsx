import { DesktopLayout } from "@/components/desktop-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <DesktopLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-40" />
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-[300px]" />
              </div>

              <div className="rounded-md border">
                <div className="h-10 border-b px-4 py-2 flex items-center">
                  <Skeleton className="h-4 w-full" />
                </div>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="px-4 py-3 border-b last:border-0 flex justify-between items-center">
                    <div className="flex flex-1 gap-4">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DesktopLayout>
  )
}
