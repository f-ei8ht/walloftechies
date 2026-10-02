import { QuoteCard } from "@/components/text/quote-card"
import { SuggestQuoteModal } from "@/components/folder/suggest-quote-modal"
import { ViewToggle } from "@/components/ui/view-toggle"
import quotes from "@/data/quotes.json"

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
      <div className="mb-12 flex items-end justify-between gap-6">
        <h1 className="font-heading text-5xl leading-none font-semibold tracking-tight lowercase whitespace-nowrap [text-box:trim-both_text_alphabetic] sm:text-6xl md:text-7xl">
          wall of techies
        </h1>
        <div className="shrink-0">
          <ViewToggle />
        </div>
      </div>

      <div className="columns-1 gap-6 sm:columns-2 lg:columns-5">
        {quotes.map((q) => (
          <div key={q.id} className="mb-6 break-inside-avoid">
            <QuoteCard quote={q.quote} author={q.author} featured={q.featured} />
          </div>
        ))}
      </div>

      <SuggestQuoteModal />
    </main>
  )
}