import { isValid as isNonDisposableEmail } from "mailchecker";

const PAGECLIP_ENDPOINT = "https://api.pageclip.co/data/suggestions";
const CONTENT_TYPE = "application/vnd.pageclip.v1+json";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_LENGTHS: Readonly<Record<keyof SuggestionValues, number>> = {
  email: 254,
  quote: 2000,
  author: 200,
};

type SuggestionValues = Readonly<{
  email: string;
  quote: string;
  author: string;
}>;

function parseBody(raw: string): SuggestionValues | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return null;
    }
    return parsed as SuggestionValues;
  } catch {
    return null;
  }
}

function validate(values: SuggestionValues): string | null {
  for (const key of ["email", "quote", "author"] as const) {
    const value = values[key];
    if (typeof value !== "string") return `${key} must be a string`;
    const trimmed = value.trim();
    if (!trimmed) return `${key} is required`;
    if (trimmed.length > MAX_LENGTHS[key]) {
      return `${key} is too long (max ${MAX_LENGTHS[key]} characters)`;
    }
    if (key === "email" && !EMAIL_RE.test(trimmed)) {
      return "Enter a valid email address";
    }
  }
  const email = values.email.trim();
  if (!isNonDisposableEmail(email)) {
    return "Disposable email addresses aren't accepted";
  }
  return null;
}

export async function POST(request: Request) {
  const apiKey = process.env.PAGECLIP_API_KEY;
  if (!apiKey) {
    console.error("[suggest] PAGECLIP_API_KEY is not set");
    return Response.json(
      { errors: [{ message: "Suggestions are temporarily unavailable" }] },
      { status: 500 },
    );
  }

  const rawBody = await request.text();
  const body = parseBody(rawBody);
  if (!body) {
    return Response.json(
      { errors: [{ message: "Invalid request body" }] },
      { status: 400 },
    );
  }

  const invalidMessage = validate(body);
  if (invalidMessage) {
    return Response.json(
      { errors: [{ message: invalidMessage }] },
      { status: 400 },
    );
  }

  const payload = {
    email: body.email.trim(),
    quote: body.quote.trim(),
    author: body.author.trim(),
  };

  const auth = Buffer.from(`${apiKey}:`).toString("base64");

  let response: Response;
  try {
    response = await fetch(PAGECLIP_ENDPOINT, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: CONTENT_TYPE,
        "Content-Type": CONTENT_TYPE,
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("[suggest] failed to reach Pageclip", error);
    return Response.json(
      { errors: [{ message: "Could not reach the suggestions service" }] },
      { status: 502 },
    );
  }

  if (!response.ok) {
    console.error(
      `[suggest] Pageclip responded with ${response.status}: ${await response.text()}`,
    );
    return Response.json(
      { errors: [{ message: "Could not save your suggestion" }] },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}