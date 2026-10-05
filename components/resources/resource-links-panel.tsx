import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

export type ResourceLinkItem = Readonly<{
  name: string;
  description: string;
  shortDescription?: string;
  href: string;
  domain?: string;
  icon?: ReactNode;
  letter?: string;
  color?: string;
}>;

export type ResourceLinksPanelProps = Readonly<
  {
    title?: string;
    items?: readonly ResourceLinkItem[];
    sortItems?: boolean;
  } & ComponentPropsWithoutRef<"div">
>;

function getDomain(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

function ListIcon({ item }: { item: ResourceLinkItem }) {
  const { icon, letter, color } = item;

  return (
    <div
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden",
        color ?? "text-foreground",
      )}
    >
      {icon ?? (
        <span className="font-sans text-[16px] font-semibold text-muted-foreground">
          {letter}
        </span>
      )}
    </div>
  );
}

function ListRow({ item }: { item: ResourceLinkItem }) {
  const domain = item.domain ?? getDomain(item.href);
  const mobileDescription = item.shortDescription ?? item.description;

  return (
    <li className="min-w-0">
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex min-w-0 items-center gap-2.5 py-0.5 max-[499px]:gap-2"
      >
        <ListIcon item={item} />
        <div className="flex min-w-0 flex-1 items-center gap-3 max-[499px]:gap-2">
          <p className="hidden min-w-0 flex-1 truncate font-sans text-sm leading-snug min-[500px]:block">
            <span className="font-semibold text-foreground group-hover:text-muted-foreground">
              {item.name}
            </span>
            <span className="text-border"> / </span>
            <span className="text-muted-foreground">{item.description}</span>
          </p>

          <div className="flex min-w-0 flex-1 items-baseline overflow-hidden min-[500px]:hidden">
            <span className="shrink-0 font-sans text-xs leading-snug font-semibold text-foreground group-hover:text-muted-foreground">
              {item.name}
            </span>
            <span className="shrink-0 px-1 font-sans text-xs text-border">
              /
            </span>
            <span className="min-w-0 truncate font-sans text-xs leading-snug text-muted-foreground">
              {mobileDescription}
            </span>
          </div>

          <span className="shrink-0 font-mono text-sm text-muted-foreground/70 group-hover:text-muted-foreground max-[499px]:text-[11px]">
            {domain}
          </span>
        </div>
      </a>
    </li>
  );
}

export const ResourceLinksPanel = forwardRef<
  HTMLDivElement,
  ResourceLinksPanelProps
>(function ResourceLinksPanel(
  { title = "Resources", items = [], sortItems = false, className, ...props },
  ref,
) {
  const rows = sortItems
    ? [...items].sort((a, b) => a.name.localeCompare(b.name))
    : items;

  return (
    <div
      ref={ref}
      className={cn("min-w-0 max-[499px]:overflow-hidden", className)}
      {...props}
    >
      <section>
        <h3 className="font-sans text-sm font-semibold text-foreground">
          {title}
        </h3>
        <ul className="mt-4 flex flex-col gap-2.5">
          {rows.map((item) => (
            <ListRow key={`${item.name}-${item.href}`} item={item} />
          ))}
        </ul>
      </section>
    </div>
  );
});

ResourceLinksPanel.displayName = "ResourceLinksPanel";
