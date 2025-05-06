// Generate a unique ID with a given prefix
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `${prefix}-${timestamp}${randomStr}`.toUpperCase()
}

// Generate a work order ID
export function generateWorkOrderId(): string {
  // Get the current count of work orders from localStorage or start at 1001
  let counter = 1001
  if (typeof window !== "undefined") {
    const savedCounter = localStorage.getItem("gse-work-order-counter")
    if (savedCounter) {
      counter = Number.parseInt(savedCounter, 10) + 1
    }
    localStorage.setItem("gse-work-order-counter", counter.toString())
  }
  return `WO-${counter}`
}

// Generate an equipment ID based on type
export function generateEquipmentId(typeCode: string): string {
  // Extract first 3 letters of the type code and convert to uppercase
  const prefix = typeCode.substring(0, 3).toUpperCase()
  // Generate a random 4-digit number
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}-${randomNum}`
}

// Generate a user ID
export function generateUserId(): string {
  // Get the current count of users from localStorage or start at 1
  let counter = 1
  if (typeof window !== "undefined") {
    const savedCounter = localStorage.getItem("gse-user-counter")
    if (savedCounter) {
      counter = Number.parseInt(savedCounter, 10) + 1
    }
    localStorage.setItem("gse-user-counter", counter.toString())
  }
  return `U${counter.toString().padStart(3, "0")}`
}
