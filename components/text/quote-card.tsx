import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react"
import { cn } from "cn"
import { RiBookmarkLine, RiStarFill } from "@remixicon/react"

export type QuoteCardProps = Readonly<
  {
    quote: string
    author: string
    featured?: boolean
    bookmarkIcon?: ReactNode
  } & ComponentPropsWithoutRef<"div">
>

export const QuoteCard = forwardRef<HTMLDivElement, QuoteCardProps>(
  ({ className, quote, author, featured = false, bookmarkIcon, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative w-full border border-border bg-card p-5 font-sans",
        "shadow-[5px_5px_0px_var(--border)]",
        featured && "border-(--featured) shadow-[5px_5px_0px_var(--featured)]",
        className,
      )}
      {...props}
    >
      <div
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
  ),
)
QuoteCard.displayName = "QuoteCard"