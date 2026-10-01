"use client";

import Image from "next/image";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type OpensourceFolderTabCardProps = Readonly<
  {
    appName?: string;
    cardLabel?: string;
    title?: string;
    subtitle?: string;
    primaryValue?: string;
    primaryLabel?: string;
    imageSrc?: string;
    imageAlt?: string;
    size?: "sm" | "md";
  } & ComponentPropsWithoutRef<"div">
>;

export const OpensourceFolderTabCard = forwardRef<
  HTMLDivElement,
  OpensourceFolderTabCardProps
>(function OpensourceFolderTabCard(
  {
    className,
    appName = "Wall of Techies",
    cardLabel = "Card Design",
    title = "Suggest a thought",
    subtitle = "Pin it to the wall",
    primaryValue = "100",
    primaryLabel = "Thoughts",
    imageSrc = "/background1.webp",
    imageAlt = "Card preview",
    size = "md",
    ...props
  },
  ref,
) {
  const compact = size === "sm";

  // Corner radii scale with the card size so the shape stays proportional.
  const radius = compact
    ? { outer: "1.75rem", inner: "1.5rem", topRight: "0.9rem", tabTl: "0.85rem", tabTr: "0.75rem" }
    : { outer: "3rem", inner: "2.35rem", topRight: "1.35rem", tabTl: "1.35rem", tabTr: "1.15rem" };

  return (
    <div
      ref={ref}
      data-slot="opensource-folder-tab-card"
      style={{ borderRadius: radius.outer }}
      className={cn(
        "relative overflow-hidden border-border bg-border font-sans dark:border-muted dark:bg-muted",
        compact ? "size-[15rem] border-[6px]" : "size-[22rem] border-[8px]",
        className,
      )}
      {...props}
    >
      <div
        className="absolute inset-x-1 top-1 h-[42%] overflow-hidden"
        style={{
          borderTopLeftRadius: radius.inner,
          borderTopRightRadius: radius.inner,
        }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="300px"
          className="object-cover object-top"
        />

        <div className="absolute top-3 right-4 z-20 text-right leading-snug">
          <p className={cn("font-medium text-muted-foreground", compact ? "text-[11px]" : "text-xs")}>
            {appName}
          </p>
          <p className="sr-only">{cardLabel}</p>
        </div>
      </div>

      <div
        className="absolute inset-x-1 top-[28%] bottom-1 z-10 overflow-hidden"
        style={{
          borderBottomLeftRadius: radius.inner,
          borderBottomRightRadius: radius.inner,
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-x-0 top-[10%] bottom-0 bg-card"
            style={{
              borderBottomLeftRadius: radius.inner,
              borderBottomRightRadius: radius.inner,
              borderTopRightRadius: radius.topRight,
            }}
          />
          <div
            className="absolute top-0 left-0 h-[22%] w-[42%] bg-card"
            style={{
              borderTopLeftRadius: radius.tabTl,
              borderTopRightRadius: radius.tabTr,
            }}
          />
          <svg
            className="absolute top-0 left-[36%] h-[22%] w-[22%] text-card"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M0 0H20C30 0 36 6 42 18L80 82C86 94 92 100 100 100V100H0Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className={cn("relative z-30 flex h-full flex-col justify-between text-left", compact ? "px-4 pt-[16%] pb-4" : "px-6 pt-[18%] pb-7")}>
          <div>
            <h2 className={cn("leading-tight font-medium text-card-foreground", compact ? "text-base" : "text-lg")}>
              {title}
            </h2>
            <p className={cn("mt-1 text-muted-foreground", compact ? "text-xs" : "text-sm")}>{subtitle}</p>
          </div>

          <div className="flex items-end">
            <p className="flex items-baseline gap-2 text-card-foreground">
              <span className={cn("leading-none font-bold", compact ? "text-lg" : "text-xl")}>
                {primaryValue}
              </span>
              <span className={cn("font-normal", compact ? "text-xs" : "text-sm")}>{primaryLabel}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

OpensourceFolderTabCard.displayName = "OpensourceFolderTabCard";