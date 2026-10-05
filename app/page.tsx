"use client"

import { useState } from "react"
import { QuoteCard } from "@/components/text/quote-card"
import { SuggestQuoteModal } from "@/components/folder/suggest-quote-modal"
import { PeopleList } from "@/components/people/people-list"
import { PersonDetail } from "@/components/people/person-detail"
import { ViewToggle, type ViewOption } from "@/components/ui/view-toggle"
import { getPerson } from "@/data/people"
import { runViewTransition } from "@/lib/view-transition"
import { cn } from "@/lib/utils"
import quotes from "@/data/quotes.json"

export default function Page() {
  // null = quotes wall (home). Clicking the active filter again clears it.
  const [activeView, setActiveView] = useState<ViewOption | null>(null)
  const [openSlug, setOpenSlug] = useState<string | null>(null)

  const goToWall = () => {
    if (activeView === null) return // already on the wall — don't fire
    runViewTransition(() => {
      setOpenSlug(null)
      setActiveView(null)
    })
  }

  const changeView = (next: ViewOption | null) => {
    runViewTransition(() => {
      setOpenSlug(null)
      setActiveView(next)
    })
  }

  const openPerson = (slug: string) => {
    runViewTransition(() => setOpenSlug(slug))
  }

  const closePerson = () => {
    runViewTransition(() => setOpenSlug(null))
  }

  const person = openSlug ? getPerson(openSlug) : undefined

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
      <div
        className="mb-12 flex items-end justify-between gap-6"
        style={{ viewTransitionName: "wall-header" }}
      >
        <h1 className="whitespace-nowrap">
          <button
            type="button"
            onClick={goToWall}
            aria-label="Back to quotes wall"
            aria-disabled={activeView === null}
            className={cn(
              "wall-title-btn cursor-pointer font-heading text-5xl leading-none font-semibold tracking-tight lowercase [text-box:trim-both_text_alphabetic] outline-none sm:text-6xl md:text-7xl",
              "focus-visible:ring-2 focus-visible:ring-ring/50",
            )}
          >
            <span className="fx-wall-paint inline-block">wall of techies</span>
          </button>
        </h1>
        <div className="shrink-0">
          <ViewToggle active={activeView} onChange={changeView} />
        </div>
      </div>

      {activeView === "People" ? (
        person ? (
          <PersonDetail person={person} onBack={closePerson} />
        ) : (
          <PeopleList onOpen={openPerson} />
        )
      ) : (
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-5">
          {quotes.map((q) => (
            <div key={q.id} className="mb-6 break-inside-avoid">
              <QuoteCard
                quote={q.quote}
                author={q.author}
                featured={q.featured}
                color={"color" in q ? (q as { color?: string }).color : undefined}
              />
            </div>
          ))}
        </div>
      )}

      <SuggestQuoteModal />
    </main>
  )
}
