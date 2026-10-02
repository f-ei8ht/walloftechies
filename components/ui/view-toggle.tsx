"use client";

import { useState } from "react";
import { cn } from "cn";

export const viewOptions = ["People", "Software"] as const;

export type ViewOption = (typeof viewOptions)[number];

export function ViewToggle() {
  const [active, setActive] = useState<ViewOption>("People");

  return (
    <div role="group" aria-label="Filter wall by view" className="flex items-center gap-2">
      {viewOptions.map((view) => (
        <button
          key={view}
          type="button"
          aria-pressed={active === view}
          onClick={() => setActive(view)}
          className={cn(
            "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors outline-none",
            "focus-visible:ring-3 focus-visible:ring-ring/50",
            active === view
              ? "bg-muted text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
          )}
        >
          {view}
        </button>
      ))}
    </div>
  );
}