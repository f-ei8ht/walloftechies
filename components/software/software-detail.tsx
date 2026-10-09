"use client"

import { RiArrowLeftLine, RiCheckboxCircleLine } from "@remixicon/react"

import { HardShadowPolaroidFrame } from "@/components/frames/hard-shadow-polaroid-frame"
import { ResourceLinksPanel } from "@/components/resources/resource-links-panel"
import type { Software } from "@/data/software"

import { softwareResourceItems, SoftwareMonogram } from "./software-ui"

export function SoftwareDetail({
  sw,
  onBack,
}: Readonly<{ sw: Software; onBack: () => void }>) {
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-16">
      <div className="flex justify-center lg:justify-start">
        <div className="relative w-full max-w-[300px]">
          <HardShadowPolaroidFrame
            caption={sw.name}
            width="100%"
            shadowOffset={12}
            mediaClassName="aspect-4/5"
          >
            <SoftwareMonogram
              sw={sw}
              large
              transitionName={`software-portrait-${sw.slug}`}
            />
          </HardShadowPolaroidFrame>
        </div>
      </div>

      <div className="min-w-0">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <RiArrowLeftLine size={16} aria-hidden />
          Software
        </button>

        <p className="mt-7 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
          {sw.role} · since {sw.initialRelease}
        </p>
        <h2 className="mt-2 font-heading text-4xl leading-none font-semibold tracking-tight sm:text-5xl">
          {sw.name}
        </h2>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-muted-foreground">
          {sw.summary}
        </p>

        <section className="mt-9">
          <h3 className="text-sm font-semibold text-foreground">Known for</h3>
          <ul className="mt-3 space-y-2.5">
            {sw.contributions.map((c) => (
              <li key={c} className="flex items-start gap-2.5">
                <RiCheckboxCircleLine
                  size={16}
                  aria-hidden
                  className="mt-0.5 shrink-0"
                  style={{ color: sw.accent }}
                />
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {c}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <ResourceLinksPanel
          title="Links"
          items={softwareResourceItems(sw)}
          className="mt-10"
        />
      </div>
    </div>
  )
}
