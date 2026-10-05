import { type CSSProperties } from "react";

import { cn } from "@/lib/cn";

const DEFAULT_NOTE_COLOR = "#d4f84c";
const HANDWRITING_FONT =
  '"Segoe Script", "Bradley Hand", "Snell Roundhand", "Apple Chalkboard", cursive';

export function PaperClip({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <svg
      viewBox="0 0 24 56"
      aria-hidden
      className={cn("pointer-events-none h-14 w-6 overflow-visible", className)}
      fill="none"
    >
      <path
        d="M17 5.25C17 2.35 14.65 0 11.75 0C7.85 0 5 3.15 5 7.5V43.5C5 47.15 7.85 50 11.25 50C14.65 50 17 47.15 17 43.5V17.25C17 14.65 15.2 12.75 13 12.75C11.2 12.75 9.75 14.1 9.75 16V37.5"
        stroke="#262626"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export type PinnedStickyNoteProps = Readonly<{
  header?: string;
  body?: string;
  footer?: string;
  color?: string;
  rotation?: number;
  className?: string;
}>

export function PinnedStickyNote({
  header,
  body,
  footer,
  color = DEFAULT_NOTE_COLOR,
  rotation = 3,
  className,
}: PinnedStickyNoteProps) {
  const style: CSSProperties = {
    transform: `rotate(${rotation}deg)`,
    transformOrigin: "top right",
  };

  return (
    <div className={cn("relative w-[42%]", className)} style={style}>
      <PaperClip className="absolute -top-3 left-[72%] z-30 -translate-x-1/2" />

      <div
        className="relative aspect-square overflow-hidden shadow-[1px_4px_12px_rgba(15,23,42,0.16)]"
        style={{ backgroundColor: color }}
      >
        <div className="flex h-full min-h-0 flex-col justify-between px-2 pt-11 pb-2 text-center text-neutral-900">
          {header ? (
            <p className="truncate text-[7px] leading-none lowercase">
              {header}
            </p>
          ) : (
            <span aria-hidden />
          )}

          {body ? (
            <p
              className="line-clamp-5 flex-1 px-0.5 text-[10px] leading-[1.18] font-medium"
              style={{ fontFamily: HANDWRITING_FONT }}
            >
              {body}
            </p>
          ) : (
            <span aria-hidden className="flex-1" />
          )}

          {footer ? (
            <p className="truncate text-[7px] leading-tight lowercase">
              {footer}
            </p>
          ) : (
            <span aria-hidden />
          )}
        </div>
      </div>
    </div>
  );
}
