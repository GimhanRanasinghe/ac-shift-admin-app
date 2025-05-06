import { AArrowUpIcon as LetterA, BoxesIcon as LetterB, CogIcon as LetterC } from "lucide-react"

export type EquipmentClass = "A" | "B" | "C"

export function getEquipmentClass(category: string, powerType: string): EquipmentClass {
  if (category === "Non-Powered Equipment") {
    return "C"
  } else if (powerType.includes("Electric")) {
    return "B"
  } else {
    return "A"
  }
}

export function getEquipmentClassLabel(equipmentClass: EquipmentClass): string {
  return `${equipmentClass}`
}

export function getEquipmentClassIcon(equipmentClass: EquipmentClass) {
  switch (equipmentClass) {
    case "A":
      return LetterA
    case "B":
      return LetterB
    case "C":
      return LetterC
    default:
      return LetterA
  }
}

export function getEquipmentClassColor(equipmentClass: EquipmentClass): string {
  switch (equipmentClass) {
    case "A":
      return "equipment-class-a"
    case "B":
      return "equipment-class-b"
    case "C":
      return "equipment-class-c"
    default:
      return "equipment-class-a"
  }
}
