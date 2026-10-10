import Image from "next/image"
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
  large = false,
  transitionName,
  className,
}: Readonly<{
  sw: Software
  large?: boolean
  transitionName?: string
  className?: string
}>) {
  // Vector logos (SVGs) must fit inside the frame, not crop to fill it.
  const isVector = sw.image?.endsWith(".svg") ?? false
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center",
        className,
      )}
      style={{
        ...(sw.image ? {} : { backgroundColor: sw.accent }),
        ...(transitionName ? { viewTransitionName: transitionName } : {}),
      }}
    >
      {sw.image ? (
        <Image
          src={sw.image}
          alt={sw.name}
          fill
          sizes={large ? "300px" : "44px"}
          className={isVector ? (large ? "p-8" : "p-1") : ""}
          style={{ objectFit: isVector ? "contain" : "cover" }}
        />
      ) : (
        <span
          aria-hidden
          className={cn(
            "font-heading leading-none font-semibold tracking-tight text-white/95 select-none",
            large ? "text-6xl" : "text-sm",
          )}
        >
          {sw.monogram}
        </span>
      )}
    </div>
  )
}
