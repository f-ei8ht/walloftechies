"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { RiAddLine, RiCloseLine } from "@remixicon/react";

import { SuggestQuoteForm } from "@/components/forms/suggest-quote-form";

export function SuggestQuoteModal() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, closeModal]);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openModal}
        aria-label="Suggest a quote"
        className="fixed right-6 bottom-6 z-50 flex size-14 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors outline-none hover:bg-primary/80 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <RiAddLine size={24} aria-hidden />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            aria-hidden
            onClick={closeModal}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Suggest a quote"
            tabIndex={-1}
            className="relative z-10 w-full max-w-md outline-none"
          >
            <div className="relative">
              <SuggestQuoteForm
                title="Add a thought to the wall"
                subtitle="Know a quote that deserves a spot on the wall? Drop it below."
                submitLabel="Pin it to the wall"
                successMessage="Thanks — we'll get back to you if it makes the wall."
                privacyNote=""
                onSubmit={async (values) => {
                  const response = await fetch("/api/suggest", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                  });
                  if (!response.ok) {
                    let message = "suggestion failed";
                    try {
                      const body: { errors?: { message?: string }[] } =
                        await response.json();
                      if (body.errors?.[0]?.message) message = body.errors[0].message;
                    } catch {
                      // keep fallback message
                    }
                    throw new Error(message);
                  }
                }}
              />
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="absolute top-5 right-5 flex size-8 cursor-pointer items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:text-foreground"
              >
                <RiCloseLine size={16} aria-hidden />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}