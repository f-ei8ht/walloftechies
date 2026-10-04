import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react"
import { cn } from "cn"
import { RiBookmarkLine, RiStarFill } from "@remixicon/react"

export type QuoteCardProps = Readonly<
  {
    quote: string
    author: string
    featured?: boolean
    color?: string
    bookmarkIcon?: ReactNode
  } & ComponentPropsWithoutRef<"div">
>

export const QuoteCard = forwardRef<HTMLDivElement, QuoteCardProps>(
  (
    { className, style, quote, author, featured = false, color, bookmarkIcon, ...props },
    ref,
  ) => {
    // The JSON color applies if and only if the card is featured.
    // featured === false (or missing) → default styling, color ignored.
    const accent = featured ? color : undefined
    return (
      <div
        ref={ref}
        style={
          accent
            ? { borderColor: accent, boxShadow: `5px 5px 0px ${accent}`, ...style }
            : style
        }
        className={cn(
          "relative w-full border border-border bg-card p-5 font-sans",
          "shadow-[5px_5px_0px_var(--border)]",
          featured && "border-(--featured) shadow-[5px_5px_0px_var(--featured)]",
          className,
        )}
        {...props}
      >
        <div
          style={accent ? { color: accent } : undefined}
          className={cn(
            "absolute top-3 right-3",
            featured ? "text-(--featured)" : "text-muted-foreground",
          )}
        >
          {bookmarkIcon ??
            (featured ? <RiStarFill size={16} /> : <RiBookmarkLine size={16} />)}
        </div>

        <p className="pr-4 font-serif text-base leading-relaxed text-foreground italic">
          &quot;{quote}&quot;
        </p>

        <p className="mt-4 text-right text-xs text-muted-foreground">
          — {author}
        </p>
      </div>
    )
  },
)
QuoteCard.displayName = "QuoteCard"