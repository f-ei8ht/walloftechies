import { softwareList } from "@/data/software"

import { SoftwareLinkIcon, SoftwareMonogram } from "./software-ui"

export function SoftwareList({
  onOpen,
}: Readonly<{ onOpen: (slug: string) => void }>) {
  return (
    <ul className="divide-y divide-border">
      {softwareList.map((sw) => (
        <li key={sw.slug} className="group flex items-center gap-4 py-4">
          <SoftwareMonogram
            sw={sw}
            className="size-11 shrink-0 overflow-hidden border border-border"
          />

          <button
            type="button"
            onClick={() => onOpen(sw.slug)}
            className="flex min-w-0 flex-1 cursor-pointer items-baseline gap-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <span className="shrink-0 font-sans text-sm font-semibold text-foreground transition-colors group-hover:text-muted-foreground">
              {sw.name}
            </span>
            <span className="shrink-0 text-sm text-border">/</span>
            <span className="min-w-0 truncate text-sm text-muted-foreground">
              {sw.knownFor}
            </span>
          </button>

          <div className="flex shrink-0 items-center gap-0.5">
            {sw.links.map((link) => (
              <a
                key={`${sw.slug}-${link.href}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${sw.name} — ${link.label}`}
                className="flex size-8 items-center justify-center text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <SoftwareLinkIcon kind={link.kind} />
              </a>
            ))}
          </div>
        </li>
      ))}
    </ul>
  )
}
