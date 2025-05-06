import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface SearchHeaderProps {
  showInUse: boolean
  setShowInUse: (value: boolean) => void
}

export function SearchHeader({ showInUse, setShowInUse }: SearchHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-white">Equipment Search</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            id="show-in-use"
            checked={showInUse}
            onCheckedChange={setShowInUse}
            className="data-[state=checked]:bg-aircanada-blue data-[state=checked]:border-aircanada-blue"
          />
          <Label htmlFor="show-in-use" className="text-sm text-white">
            Show In Use
          </Label>
        </div>
      </div>
    </div>
  )
}
