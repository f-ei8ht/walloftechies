"use client"

import { RiArrowLeftLine, RiCheckboxCircleLine } from "@remixicon/react"

import { ResourceLinksPanel } from "@/components/resources/resource-links-panel"
import { lifespan, type Person } from "@/data/people"

import { personResourceItems } from "./person-links"
import { PersonPolaroid } from "./person-polaroid"

export function PersonDetail({
  person,
  onBack,
}: Readonly<{ person: Person; onBack: () => void }>) {
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-16">
      <div className="flex justify-center lg:justify-start">
        <PersonPolaroid person={person} />
      </div>

      <div className="min-w-0">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <RiArrowLeftLine size={16} aria-hidden />
          People
        </button>

        <p className="mt-7 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
          {person.role} · {lifespan(person)}
        </p>
        <h2 className="mt-2 font-heading text-4xl leading-none font-semibold tracking-tight sm:text-5xl">
          {person.name}
        </h2>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-muted-foreground">
          {person.summary}
        </p>

        <section className="mt-9">
          <h3 className="text-sm font-semibold text-foreground">Known for</h3>
          <ul className="mt-3 space-y-2.5">
            {person.contributions.map((contribution) => (
              <li key={contribution} className="flex items-start gap-2.5">
                <RiCheckboxCircleLine
                  size={16}
                  aria-hidden
                  className="mt-0.5 shrink-0"
                  style={{ color: person.accent }}
                />
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {contribution}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <ResourceLinksPanel
          title="Links"
          items={personResourceItems(person)}
          className="mt-10"
        />
      </div>
    </div>
  )
}
