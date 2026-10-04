# View Transitions — reference notes (walloftechies)

> Collected from MDN View Transition API docs + Next.js "View transitions" guide.
> For future use. **Not implemented yet** — look things up here when adding it.

Sources:
- https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/view-transition-name
- Next.js docs → Guides → View transitions (pasted in chat, Oct 2026)

---

## 1. What it is

The View Transition API animates between two visual states (old DOM → new DOM)
instead of swapping them instantly. Two flavors:

| Flavor | Trigger | Opt-in |
|---|---|---|
| Same-document (SPA) | `document.startViewTransition(updateFn)` or React `<ViewTransition>` | per-element via `view-transition-name` / `<ViewTransition name>` |
| Cross-document (MPA) | navigation between pages | `@view-transition { navigation: auto; }` in **both** documents |

Default animation with zero CSS: a smooth cross-fade of the whole page (`root` snapshot).

## 2. Browser support

- Baseline 2025 (Chromium 125+, recent Safari + Firefox). No support → app works
  normally, just swaps instantly. **Always feature-detect:**
  `if (!document.startViewTransition) { update(); return; }`
- In Next.js App Router nothing needs installing — the bundled React canary
  already includes `<ViewTransition>`.
- React `<ViewTransition>` animates only on **Transitions, `<Suspense>` reveals,
  `useDeferredValue`, and route navigations** — plain `setState` does NOT trigger it.
  (Our People/Software toggle is plain `setState` today → will need wrapping, see §8.)

## 3. React `<ViewTransition>` (Next.js way — preferred over manual API)

```tsx
import { ViewTransition } from 'react'

<ViewTransition
  name="quotes-wall"   // identity: same name on old + new = morph pair
  share="morph"        // assign morph class to the pair (customize via CSS)
  enter="slide-up"     // enter animation class
  exit="slide-down"    // exit animation class
  default="none"       // suppress animation on unrelated transitions (important!)
/>
```

- `name` creates identity — browser morphs between old/new size + position.
- `default="none"` stops a named element from cross-fading on *every* unrelated
  transition. When using it on a morph pair, keep an explicit `share` prop or the
  morph silently stops.
- `enter` / `exit` accept a string OR an object keyed by transition type:
  `enter={{ 'nav-forward': 'nav-forward', default: 'none' }}`.
- `<Link href="..." transitionTypes={['nav-forward']}>` tags a navigation;
  `router.push/replace` also accept `transitionTypes`.

## 4. The four patterns (Next.js guide)

1. **Morph shared element** — same `name` on both sides (e.g. thumbnail → hero).
   "Same thing, going deeper." Needs destination rendered in the same commit
   (prefetched page); if it suspends first, falls back to enter animation.
2. **Suspense reveal** — `exit="slide-down"` on fallback, `enter="slide-up"` on
   content. Exit fast (150ms), enter slower (210ms + delay) so arrival registers.
3. **Directional nav slides** — `transitionTypes` (`nav-forward` / `nav-back`) on
   links + enter/exit objects on each `page.tsx` (NOT layout — layouts persist,
   so enter/exit never fire there). ±60px offset is enough to signal direction.
4. **Same-route crossfade** — `<ViewTransition key={slug} name="..." share="auto"
   enter="auto" default="none">`. Key change turns content swap into exit/enter
   pair. "Same place, different content." ← **This is our wall-toggle pattern.**

## 5. CSS pieces (MDN)

Properties:
- `view-transition-name: <custom-ident> | match-element | none` — puts element in
  its own snapshot. Must be **unique per rendered element** or the transition is
  skipped (`ViewTransition.ready` rejects). `match-element` = browser auto-names
  each (lists!) — same-document only.
- `view-transition-class` — extra styling hook alongside the name.
- `view-transition-scope` — isolate snapshot discovery to a subtree (Level 2).

Pseudo-element tree (style animations here):
`::view-transition` (overlay root, sits over everything)
└─ `::view-transition-group(name)` (one per named snapshot + `root`)
   └─ `::view-transition-image-pair(name)`
      ├─ `::view-transition-old(name)` (static snapshot of before)
      └─ `::view-transition-new(name)` (live view of after)

Pseudo-classes: `:active-view-transition`, `:active-view-transition-type(name)`.
At-rule (MPA only): `@view-transition { navigation: auto; }`.
Events (MPA): `pageswap` (leaving doc) / `pagereveal` (entering doc).

## 6. Copy-paste CSS recipes

```css
/* Let clicks pass through during transitions */
::view-transition { pointer-events: none; }

/* Anchor: keep fixed, never animate (e.g. site header) */
.site-header { view-transition-name: site-header; }
::view-transition-group(site-header) { animation: none; z-index: 100; }
::view-transition-old(site-header) { display: none; }
::view-transition-new(site-header) { animation: none; }

/* Custom morph softening */
::view-transition-group(.morph) { animation-duration: 400ms; }
::view-transition-image-pair(.morph) { animation-name: via-blur; }
@keyframes via-blur { 30% { filter: blur(3px); } }

/* Directional slides */
::view-transition-old(.nav-forward) {
  --slide-offset: -60px;
  animation: 150ms ease-in both fade reverse, 400ms ease-in-out both slide reverse;
}
::view-transition-new(.nav-forward) {
  --slide-offset: 60px;
  animation: 210ms ease-out 150ms both fade, 400ms ease-in-out both slide;
}
/* .nav-back = mirrored offsets */
@keyframes fade { from { filter: blur(3px); opacity: 0; } to { filter: blur(0); opacity: 1; } }
@keyframes slide { from { translate: var(--slide-offset); } to { translate: 0; } }

/* Motion sensitivity — always include */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*), ::view-transition-new(*), ::view-transition-group(*) {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
  }
}
```

## 7. Manual API (when React wrapper isn't enough)

```js
const transition = document.startViewTransition(() => updateTheDOM());
// or: document.startViewTransition({ update: fn, types: ['my-type'] });
transition.ready.then(() => …);             // animation ready to run
transition.finished.then(() => …);          // animation done
transition.skipTransition();                // bail out to instant swap
transition.types;                           // ViewTransitionTypeSet (query/mutate live)
```

Element-scoped (Level 2, concurrent/nested): `element.startViewTransition(...)` —
see MDN "Using element-scoped view transitions".

## 8. When we implement it on walloftechies (plan, not done)

Status: **nothing implemented** — the modal attempt was reverted (looked bad);
reference only. Wall toggle still pending.

- **Anchor the title**: `wall of techies` header gets a `view-transition-name` +
  `animation: none` so it never moves (like the guide's site-header). *(not done)*
- **Wall crossfade**: wrap the quotes grid in
  `<ViewTransition key={activeView ?? 'wall'} name="quotes-wall" share="auto" enter="auto" default="none">`
  so switching wall ↔ People ↔ Software crossfades the grid only. *(not done)*
- **Toggle is plain `setState`** → wrap `setActiveView` in `document.startViewTransition`
  (with no-API fallback) or convert to `useTransition`, otherwise React won't animate it.
- **Keep it subtle**: crossfade only; no directional slides (single page, no nav hierarchy).
- **Always ship** the `pointer-events: none` + `prefers-reduced-motion` rules.
- Gotcha: `ViewToggle` buttons stay interactive mid-transition thanks to
  `::view-transition { pointer-events: none; }`; keep durations short (≤400ms).

### Reverted — suggest-quote modal (plus button)

- Tried: `document.startViewTransition(() => flushSync(() => setOpen(...)))` +
  named `.suggest-modal` / `.suggest-modal-backdrop` snapshots, card slide-up/slide-
  down, backdrop fade. Removed — user found it looked bad.
- Learning kept: `react@19.2.8` does NOT export `<ViewTransition>` (canary only),
  so manual API is the only option; and `flushSync` is required inside
  `startViewTransition` or React batches and the "new" snapshot may capture old DOM.
