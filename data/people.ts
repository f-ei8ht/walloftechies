import peopleData from "./people.json"

export type PersonLinkKind =
  | "website"
  | "github"
  | "x"
  | "linkedin"
  | "wikipedia"

export type PersonLink = Readonly<{
  label: string
  href: string
  kind: PersonLinkKind
}>

export type PersonNote = Readonly<{
  header: string
  body: string
  footer: string
  color: string
  rotation: number
}>

export type Person = Readonly<{
  slug: string
  name: string
  monogram: string
  image?: string
  blackAndWhite?: boolean
  role: string
  born: number
  died: number | null
  accent: string
  knownFor: string
  summary: string
  contributions: readonly string[]
  note: PersonNote
  links: readonly PersonLink[]
}>

export const people = peopleData as readonly Person[]

export const getPerson = (slug: string): Person | undefined =>
  people.find((person) => person.slug === slug)

export function lifespan(person: Person): string {
  return person.died === null
    ? `b. ${person.born} · alive`
    : `${person.born} – ${person.died}`
}
