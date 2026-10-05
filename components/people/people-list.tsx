import { people } from "@/data/people"

import { LinkIcon } from "./person-links"
import { PersonMonogram } from "./person-monogram"

export function PeopleList({
  onOpen,
}: Readonly<{ onOpen: (slug: string) => void }>) {
  return (
    <ul className="divide-y divide-border">
      {people.map((person) => (
        <li key={person.slug} className="group flex items-center gap-4 py-4">
          <PersonMonogram
            person={person}
            compact
            transitionName={`person-portrait-${person.slug}`}
            className="size-11 shrink-0 overflow-hidden border border-border"
          />

          <button
            type="button"
            onClick={() => onOpen(person.slug)}
            className="flex min-w-0 flex-1 cursor-pointer items-baseline gap-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <span className="shrink-0 font-sans text-sm font-semibold text-foreground transition-colors group-hover:text-muted-foreground">
              {person.name}
            </span>
            <span className="shrink-0 text-sm text-border">/</span>
            <span className="min-w-0 truncate text-sm text-muted-foreground">
              {person.knownFor}
            </span>
          </button>

          <div className="flex shrink-0 items-center gap-0.5">
            {person.links.map((link) => (
              <a
                key={`${person.slug}-${link.href}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${person.name} — ${link.label}`}
                className="flex size-8 items-center justify-center text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <LinkIcon kind={link.kind} />
              </a>
            ))}
          </div>
        </li>
      ))}
    </ul>
  )
}
