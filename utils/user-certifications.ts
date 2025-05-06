import userData from "@/data/user.json"

export function getUserCertifications(): string[] {
  return userData.certifications.map((cert) => cert.name)
}

export function hasCertification(certificationRequired: string): boolean {
  const userCertifications = getUserCertifications()
  return userCertifications.includes(certificationRequired)
}
