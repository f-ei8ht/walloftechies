"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { X } from "lucide-react";

import { NewsletterForm } from "@/components/forms/newsletter-form";
import { OpensourceFolderTabCard } from "@/components/folder/opensource-folder-tab-card";

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
        className="fixed right-6 bottom-6 z-50 hidden cursor-pointer rounded-[3rem] outline-none focus:outline-none md:block"
      >
        <OpensourceFolderTabCard
          size="sm"
          className="cursor-pointer"
          appName="Wall of Techies"
          imageSrc="/folder.jpg"
          imageAlt="Card preview"
        />
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
              <NewsletterForm
                title="Add a thought to the wall"
                subtitle="Know a quote worth pinning? Leave your email and we'll review your suggestion."
                submitLabel="Send suggestion"
                successMessage="Thanks — we'll get back to you if it makes the wall."
                privacyNote="We'll only reach out about your submission."
                onSubmit={async (values) => {
                  // TODO: wire this up to your backend / request endpoint.
                  console.log("suggestion request", values)
                }}
              />
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="absolute top-5 right-5 flex size-8 cursor-pointer items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:text-foreground"
              >
                <X size={16} aria-hidden />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}