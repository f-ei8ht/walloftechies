import { HardShadowPolaroidFrame } from "@/components/frames/hard-shadow-polaroid-frame"
import type { Person } from "@/data/people"

import { PersonMonogram } from "./person-monogram"

export function PersonPolaroid({ person }: Readonly<{ person: Person }>) {
  return (
    <div className="relative w-full max-w-[300px]">
      <HardShadowPolaroidFrame
        caption={person.name}
        width="100%"
        shadowOffset={12}
        mediaClassName="aspect-4/5"
      >
        <PersonMonogram
          person={person}
          transitionName={`person-portrait-${person.slug}`}
        />
      </HardShadowPolaroidFrame>
    </div>
  )
}
