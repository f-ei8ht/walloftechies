import { RiBookOpenLine, RiGithubFill, RiGlobalLine, RiLink } from "@remixicon/react"

import type { ResourceLinkItem } from "@/components/resources/resource-links-panel"
import type { Software, SoftwareLinkKind } from "@/data/software"
import { cn } from "@/lib/cn"

export function SoftwareLinkIcon({
  kind,
  size = 16,
}: Readonly<{ kind: SoftwareLinkKind; size?: number }>) {
  switch (kind) {
    case "github":
      return <RiGithubFill size={size} aria-hidden />
    case "wikipedia":
      return <RiBookOpenLine size={size} aria-hidden />
    case "website":
      return <RiGlobalLine size={size} aria-hidden />
    default:
      return <RiLink size={size} aria-hidden />
  }
}

const DESCRIPTIONS: Record<SoftwareLinkKind, string> = {
  website: "Official website",
  github: "Source on GitHub",
  wikipedia: "Article on Wikipedia",
}

export function softwareResourceItems(sw: Software): ResourceLinkItem[] {
  return sw.links.map((link) => ({
    name: link.label,
    description: DESCRIPTIONS[link.kind] ?? `On ${link.label}`,
    shortDescription: link.label,
    href: link.href,
    icon: <SoftwareLinkIcon kind={link.kind} />,
  }))
}

export function SoftwareMonogram({
  sw,
  className,
}: Readonly<{ sw: Software; className?: string }>) {
  return (
    <div
      className={cn(
        "flex size-full items-center justify-center",
        className,
      )}
      style={{ backgroundColor: sw.accent }}
    >
      <span
        aria-hidden
        className="font-heading text-sm leading-none font-semibold tracking-tight text-white/95 select-none"
      >
        {sw.monogram}
      </span>
    </div>
  )
}
