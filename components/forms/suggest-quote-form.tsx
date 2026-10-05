"use client";

import {
  forwardRef,
  useCallback,
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type FormEvent,
} from "react";

import {
  RiArrowRightSLine,
  RiCheckLine,
  RiLoader4Line,
} from "@remixicon/react";

import { cn } from "@/lib/cn";
import { toast } from "sonner";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SuggestQuoteFormValues = Readonly<{
  email: string;
  quote: string;
  author: string;
}>;

type SuggestQuoteFormErrors = Partial<Record<keyof SuggestQuoteFormValues, string>>;

export type SuggestQuoteFormProps = Readonly<
  {
    title?: string;
    subtitle?: string;
    submitLabel?: string;
    successMessage?: string;
    privacyNote?: string;
    submitErrorMessage?: string;
    loading?: boolean;
    onSubmit?: (values: SuggestQuoteFormValues) => void | Promise<void>;
  } & Omit<ComponentPropsWithoutRef<"form">, "onSubmit">
>;

function validate(values: SuggestQuoteFormValues): SuggestQuoteFormErrors {
  const errors: SuggestQuoteFormErrors = {};
  const email = values.email.trim();
  const quote = values.quote.trim();
  const author = values.author.trim();

  if (!email) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  if (!quote) errors.quote = "Quote is required.";

  if (!author) errors.author = "Author is required.";

  return errors;
}

export const SuggestQuoteForm = forwardRef<HTMLFormElement, SuggestQuoteFormProps>(
  function SuggestQuoteForm(
    {
      className,
      title = "Add a thought to the wall",
      subtitle = "Know a quote worth pinning? Leave your email and we'll review your suggestion.",
      submitLabel = "Send suggestion",
      successMessage = "Thanks — we'll get back to you if it makes the wall.",
      privacyNote = "We'll only reach out about your submission.",
      submitErrorMessage = "We couldn't submit your suggestion. Please try again.",
      loading = false,
      onSubmit,
      onReset,
      ...props
    },
    ref,
  ) {
    const formId = useId();
    const [email, setEmail] = useState("");
    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");
    const [errors, setErrors] = useState<SuggestQuoteFormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const busy = loading || submitting;

    const handleSubmit = useCallback(
      async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (busy || success) return;

        const values: SuggestQuoteFormValues = { email, quote, author };
        const nextErrors = validate(values);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setSubmitting(true);
        try {
          const { isValid: isNonDisposableEmail } = await import("mailchecker");
          if (!isNonDisposableEmail(email.trim())) {
            setErrors((prev) => ({
              ...prev,
              email: "Disposable email addresses aren't accepted",
            }));
            return;
          }
          await onSubmit?.({
            email: email.trim(),
            quote: quote.trim(),
            author: author.trim(),
          });
          setSuccess(true);
        } catch (error) {
          const message =
            error instanceof Error && error.message
              ? error.message
              : submitErrorMessage;
          toast.error(message, { position: "top-center" });
        } finally {
          setSubmitting(false);
        }
      },
      [author, busy, email, onSubmit, quote, submitErrorMessage, success],
    );

    const handleReset = useCallback(
      (event: FormEvent<HTMLFormElement>) => {
        onReset?.(event);
        if (event.defaultPrevented) return;
        setEmail("");
        setQuote("");
        setAuthor("");
        setErrors({});
        setSuccess(false);
      },
      [onReset],
    );

    const inputClass = (hasError: boolean) =>
      cn(
        "w-full rounded-md border bg-background px-3.5 py-2.5 text-sm text-foreground ring-0 transition-[border-color,background-color] duration-200 outline-none placeholder:text-muted-foreground focus:ring-0 disabled:cursor-not-allowed disabled:bg-muted",
        hasError
          ? "border-destructive focus:border-destructive"
          : "border-border focus:border-ring",
      );

    return (
      <form
        ref={ref}
        data-slot="suggest-quote-form"
        data-success={success || undefined}
        aria-busy={busy}
        noValidate
        onSubmit={handleSubmit}
        onReset={handleReset}
        className={cn(
          "w-full max-w-md rounded-3xl border border-border bg-card p-6 font-sans md:p-8",
          className,
        )}
        {...props}
      >
        <div className="mb-7">
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {success ? (
          <div
            role="status"
            aria-live="polite"
            className="flex items-start gap-2 border-l-2 border-emerald-500 bg-emerald-500/10 px-3.5 py-3"
          >
            <RiCheckLine
              size={16}
              className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
              aria-hidden
            />
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              {successMessage}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor={`${formId}-email`}
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  disabled={busy}
                  value={email}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? `${formId}-email-error` : undefined
                  }
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={inputClass(Boolean(errors.email))}
                  placeholder="you@example.com"
                />
                {errors.email ? (
                  <p
                    id={`${formId}-email-error`}
                    role="alert"
                    className="mt-1.5 text-xs text-destructive"
                  >
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor={`${formId}-quote`}
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Quote
                </label>
                <textarea
                  id={`${formId}-quote`}
                  name="quote"
                  disabled={busy}
                  value={quote}
                  aria-invalid={Boolean(errors.quote)}
                  aria-describedby={
                    errors.quote ? `${formId}-quote-error` : undefined
                  }
                  onChange={(event) => {
                    setQuote(event.target.value);
                    if (errors.quote)
                      setErrors((prev) => ({ ...prev, quote: undefined }));
                  }}
                  className={cn(
                    "w-full rounded-md border bg-background px-3.5 py-2.5 text-sm text-foreground ring-0 transition-[border-color,background-color] duration-200 outline-none placeholder:text-muted-foreground focus:ring-0 disabled:cursor-not-allowed disabled:bg-muted",
                    errors.quote
                      ? "border-destructive focus:border-destructive"
                      : "border-border focus:border-ring",
                  )}
                  placeholder="Talk is cheap. Show me the code."
                  rows={4}
                />
                {errors.quote ? (
                  <p
                    id={`${formId}-quote-error`}
                    role="alert"
                    className="mt-1.5 text-xs text-destructive"
                  >
                    {errors.quote}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor={`${formId}-author`}
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Author
                </label>
                <input
                  id={`${formId}-author`}
                  name="author"
                  autoComplete="name"
                  disabled={busy}
                  value={author}
                  aria-invalid={Boolean(errors.author)}
                  aria-describedby={
                    errors.author ? `${formId}-author-error` : undefined
                  }
                  onChange={(event) => {
                    setAuthor(event.target.value);
                    if (errors.author)
                      setErrors((prev) => ({ ...prev, author: undefined }));
                  }}
                  className={inputClass(Boolean(errors.author))}
                  placeholder="Linus Torvalds"
                />
                {errors.author ? (
                  <p
                    id={`${formId}-author-error`}
                    role="alert"
                    className="mt-1.5 text-xs text-destructive"
                  >
                    {errors.author}
                  </p>
                ) : null}
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-6 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? (
                <RiLoader4Line size={16} className="animate-spin" aria-hidden />
              ) : null}
              {busy ? "Submitting…" : submitLabel}
              {!busy ? <RiArrowRightSLine size={15} aria-hidden /> : null}
            </button>

            {privacyNote ? (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                {privacyNote}
              </p>
            ) : null}
          </>
        )}
      </form>
    );
  },
);

SuggestQuoteForm.displayName = "SuggestQuoteForm";