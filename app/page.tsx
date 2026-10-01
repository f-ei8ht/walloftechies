import { QuoteCard } from "@/components/text/quote-card"
import quotes from "@/data/quotes.json"

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
      <div className="mb-12 max-w-xl">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Wall of Techies
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Notes from the wall
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Quotes pinned up by the people who built the things we build on.
        </p>
      </div>

      <div className="columns-1 gap-6 sm:columns-2 lg:columns-5">
        {quotes.map((q) => (
          <div key={q.id} className="mb-6 break-inside-avoid">
            <QuoteCard quote={q.quote} author={q.author} featured={q.featured} />
          </div>
        ))}
      </div>
    </main>
  )
}