import softwareData from "./software.json"

export type SoftwareLinkKind = "website" | "github" | "wikipedia"

export type SoftwareLink = Readonly<{
  label: string
  href: string
  kind: SoftwareLinkKind
}>

export type Software = Readonly<{
  slug: string
  name: string
  monogram: string
  role: string
  initialRelease: number
  accent: string
  knownFor: string
  summary: string
  contributions: readonly string[]
  links: readonly SoftwareLink[]
}>

export const softwareList = softwareData as readonly Software[]

export const getSoftware = (slug: string): Software | undefined =>
  softwareList.find((s) => s.slug === slug)
