import { flushSync } from "react-dom"

export function runViewTransition(update: () => void) {
  if (
    typeof document === "undefined" ||
    typeof document.startViewTransition !== "function" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    update()
    return
  }

  document.startViewTransition(() => {
    flushSync(update)
  })
}
