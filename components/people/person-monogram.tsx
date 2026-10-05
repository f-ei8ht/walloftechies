import Image from "next/image"

import type { Person } from "@/data/people"
import { cn } from "@/lib/cn"

export function PersonMonogram({
  person,
  compact = false,
  transitionName,
  className,
}: Readonly<{
  person: Person
  compact?: boolean
  transitionName?: string
  className?: string
}>) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center",
        className,
      )}
      style={{
        ...(person.image ? {} : { backgroundColor: person.accent }),
        ...(transitionName ? { viewTransitionName: transitionName } : {}),
      }}
    >
      {person.image ? (
        <Image
          src={person.image}
          alt={person.name}
          fill
          sizes={compact ? "44px" : "300px"}
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden
          className={cn(
            "font-heading leading-none font-semibold tracking-tight text-white/95 select-none",
            compact ? "text-sm" : "text-6xl",
          )}
        >
          {person.monogram}
        </span>
      )}
    </div>
  )
}
