import {
  RiBookOpenLine,
  RiGithubFill,
  RiGlobalLine,
  RiLink,
  RiLinkedinBoxFill,
  RiTwitterXFill,
} from "@remixicon/react"

import type { ResourceLinkItem } from "@/components/resources/resource-links-panel"
import type { Person, PersonLinkKind } from "@/data/people"

const DESCRIPTIONS: Record<PersonLinkKind, string> = {
  website: "Personal website",
  github: "Projects on GitHub",
  x: "Posts on X",
  linkedin: "Profile on LinkedIn",
  wikipedia: "Biography on Wikipedia",
}

export function LinkIcon({
  kind,
  size = 16,
}: Readonly<{ kind: PersonLinkKind; size?: number }>) {
  switch (kind) {
    case "github":
      return <RiGithubFill size={size} aria-hidden />
    case "x":
      return <RiTwitterXFill size={size} aria-hidden />
    case "linkedin":
      return <RiLinkedinBoxFill size={size} aria-hidden />
    case "wikipedia":
      return <RiBookOpenLine size={size} aria-hidden />
    case "website":
      return <RiGlobalLine size={size} aria-hidden />
    default:
      return <RiLink size={size} aria-hidden />
  }
}

export function personResourceItems(person: Person): ResourceLinkItem[] {
  return person.links.map((link) => ({
    name: link.label,
    description: DESCRIPTIONS[link.kind] ?? `On ${link.label}`,
    shortDescription: link.label,
    href: link.href,
    icon: <LinkIcon kind={link.kind} />,
  }))
}
