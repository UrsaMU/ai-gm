# @ursamu/ai-gm

**Agentic AI Game Master for [UrsaMU](https://github.com/ursamu/ursamu).**

Drop a folder of game books in. The AI reads them, asks you a few questions in-game, and configures itself to run any tabletop RPG — no code required.

---

## Features

| Category | What you get |
|----------|-------------|
| **Game Book Ingestion** | Drop PDF, TXT, or Markdown files into a folder. A LangGraph agentic pipeline reads them, extracts game rules, and presents a guided review to your admin team in-game. |
| **Dynamic Game Systems** | Ingested systems are stored in DB and loaded at startup. Switch systems with `+gm/config/system <id>` — no restarts, no code changes. |
| **Agentic GM** | Powered by Google Gemini Flash via LangChain. Runs oracle queries, adjudicates moves, frames scenes, and narrates rounds using a full tool-calling agent graph. |
| **Monetization** | Optional Stripe integration. Players earn credits, subscribe to plans, and spend credits on oracle queries and move adjudication. Works free by default. |
| **Social Features** | AI-written campaign journal entries on session close, player spotlight tracking, multi-persona support, and Discord webhook mirroring. |
| **REST API** | Full JSON API for a future web UI: sessions, journal, spotlights, wallets, plans, and a Stripe webhook endpoint. |
| **Security Hardened** | All 19 findings from an OWASP Top 10 audit addressed: path traversal guards, prototype pollution prevention, prompt injection delimiters, secret redaction, and more. |

---

## Requirements

- [UrsaMU](https://github.com/ursamu/ursamu) `>=1.5.7`
- [Deno](https://deno.land) `>=1.41`
- Google AI API key ([Gemini Flash](https://ai.google.dev))
- *(Optional)* Stripe account for monetization
- *(Optional)* Discord webhook URL for channel mirroring

---

## Installation

### Via UrsaMU plugin system

```bash
ursamu plugin install jsr:@ursamu/ai-gm
```

### Manual

```bash
# In your UrsaMU project directory
git clone https://github.com/ursamu/ai-gm plugins/ai-gm
```

Then add to your plugin loader — UrsaMU auto-discovers `index.ts` in each plugin directory.

---

## Configuration

### Required

Set your Google AI API key in one of two ways:

**Environment variable (recommended):**
```bash
export GOOGLE_API_KEY=your-key-here
```

**In-game command (stored in DB):**
```
+gm/config/apikey your-key-here
```

### Optional environment variables

| Variable | Purpose |
|----------|---------|
| `GOOGLE_API_KEY` | Google Gemini API key |
| `STRIPE_SECRET_KEY` | Enable Stripe payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature secret |
| `DISCORD_WEBHOOK_URL` | Mirror GM output to Discord |
| `GM_API_SECRET` | Bearer token for REST API (open in dev if unset) |
| `GAME_URL` | Base URL for payment redirect links |
| `WIKI_BASE_URL` | Base URL for wiki lore tools (default: `http://localhost:4201`) |

---

## Quick Start

### 1. Set your API key

```
+gm/config/apikey AIza...
```

### 2. Add game books

Put PDF, TXT, or Markdown files in the books directory (default `./books/`):

```
+gm/config/booksdir /path/to/your/books
```

Files are watched automatically. Drop a book in and the AI starts reading.

### 3. Review and approve

The AI pages all admin-flagged players with a summary of what it found and any items that need your review:

```
[AI-GM] I have finished reading your game books: shadowrun-4e.pdf

  Game:       Shadowrun (4th Edition)
  Stats:      Body, Agility, Reaction, Strength, Willpower, Logic, Intuition, Charisma, Edge, Magic
  Full success:    5+
  Partial success: 1-4
  Miss:            below 1
  Hard moves: 12 found
  Soft moves: 8 found
  Tone:       gritty cyberpunk, morally grey, high lethality

I have 2 item(s) that need your review:

[1] moveThresholds.fullSuccess
    Found: 4 / 5 (from: core-rules.pdf, sr4-gm-screen.pdf)
    My recommendation: 5
    Resolve with: +gm/ingest/review abc123/item1=<value>
    Skip with:    +gm/ingest/review abc123/item1/skip
```

Resolve any flagged items, then approve:

```
+gm/ingest/approve abc123
```

### 4. Switch to the new system

```
+gm/config/system shadowrun-4th-edition
```

Or it activates automatically on the next `+gm/session/open`.

---

## Command Reference

### Configuration

| Command | Description |
|---------|-------------|
| `+gm` | Show GM status |
| `+gm/config` | Show full configuration |
| `+gm/config/model <model>` | Set Gemini model |
| `+gm/config/apikey <key>` | Set Google API key |
| `+gm/config/mode <auto\|hybrid>` | GM response mode |
| `+gm/config/chaos <1-9>` | Mythic GME chaos factor |
| `+gm/config/system <id>` | Switch active game system |
| `+gm/config/booksdir <path>` | Set books folder path |

### Session Management

| Command | Description |
|---------|-------------|
| `+gm/session/open <label>` | Open a new GM session |
| `+gm/session/close` | Close current session (auto-generates journal entry) |
| `+gm/reload` | Invalidate context cache |

### GM Actions *(staff only)*

| Command | Description |
|---------|-------------|
| `+gm/go` | Manually trigger round adjudication |
| `+gm/oracle[/<probability>] <question>` | Ask the GM oracle a yes/no question |
| `+gm/move <move>=<total>` | Submit a completed roll for adjudication |
| `+gm/scene/publish <text>` | Broadcast a narration to the current room |

Oracle probability switches: `certain`, `very-likely`, `likely`, `50-50`, `unlikely`, `very-unlikely`, `impossible`

### Game Book Ingestion *(staff only)*

| Command | Description |
|---------|-------------|
| `+gm/ingest` | Manually trigger ingestion |
| `+gm/ingest/status` | Show current job status |
| `+gm/ingest/transcript <jobId>` | View the full setup conversation |
| `+gm/ingest/review <jobId>/<itemId>=<value>` | Resolve an uncertain item |
| `+gm/ingest/review <jobId>/<itemId>/skip` | Accept AI suggestion |
| `+gm/ingest/approve <jobId>` | Activate the ingested system |
| `+gm/ingest/reject <jobId>` | Cancel ingestion |

### Monetization

| Command | Who | Description |
|---------|-----|-------------|
| `+gm/credits` | Anyone | Show balance + recent history |
| `+gm/credits/buy <n>` | Anyone | Purchase credits (generates Stripe link) |
| `+gm/credits/grant <pid> <n>` | Staff | Grant credits to a player |
| `+gm/sub` | Anyone | Show subscription status |
| `+gm/sub/plans` | Anyone | List available plans |
| `+gm/sub/start <planId>` | Anyone | Subscribe (free tier: instant; paid: Stripe link) |
| `+gm/sub/cancel` | Anyone | Cancel current subscription |

Default plans: **Observer** (free, 5 credits/mo), **Player** ($4.99, 50 credits/mo), **Patron** ($14.99, 200 credits/mo).

Default costs: oracle = 1 credit, move adjudication = 1 credit, everything else = free.

### Social Features

| Command | Description |
|---------|-------------|
| `+gm/journal` | List recent campaign journal entries |
| `+gm/journal/read <id>` | Display a journal entry |
| `+gm/spotlight [<playerId>]` | Show spotlight moments |
| `+gm/spotlight/mark <pid> <text>` | Staff: manually record a spotlight |
| `+gm/persona` | List your personas |
| `+gm/persona/new <name>[=<desc>]` | Create a persona |
| `+gm/persona/use <id>` | Activate a persona |
| `+gm/persona/clear` | Revert to player name |
| `+gm/persona/delete <id>` | Delete a persona |

---

## REST API

All routes are prefixed `/api/gm`. Authenticate with `Authorization: Bearer <GM_API_SECRET>`.
Leave `GM_API_SECRET` unset to run open in development.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/gm/status` | Health check + config summary |
| GET | `/api/gm/sessions` | List all sessions |
| GET | `/api/gm/sessions/:id` | Session + exchanges |
| GET | `/api/gm/journal` | Journal entries (`?limit=20`) |
| GET | `/api/gm/journal/:id` | Single journal entry |
| GET | `/api/gm/spotlights` | Spotlights (`?playerId=` `?sessionId=`) |
| GET | `/api/gm/wallets/:playerId` | Player wallet + balance |
| GET | `/api/gm/plans` | Subscription plan catalogue |
| POST | `/api/gm/webhook` | Stripe webhook (signature-verified, no bearer) |
| POST | `/api/gm/credits/grant` | Admin credit grant `{ playerId, amount }` |

### Mounting in a Deno.serve host

```typescript
import gmPlugin from "@ursamu/ai-gm";

await gmPlugin.init();

Deno.serve(async (req) => {
  // Let the GM plugin handle /api/gm/* routes
  const gmResponse = await gmPlugin.handleRequest?.(req);
  if (gmResponse) return gmResponse;

  // Your other routes...
  return new Response("Not found", { status: 404 });
});
```

---

## Stripe Webhook Setup

1. In your Stripe dashboard, add a webhook pointing to:
   ```
   https://yourgame.example.com/api/gm/webhook
   ```
2. Subscribe to events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_succeeded`, `invoice.payment_failed`
3. Copy the webhook signing secret and set `STRIPE_WEBHOOK_SECRET`

---

## Architecture

```
books/
  game-book.pdf        ← Drop files here
  supplement.txt

ingestion/
  watcher.ts           ← Deno.watchFs + debounce
  extractor.ts         ← PDF/TXT/MD → ITextChunk[]
  analyzer.ts          ← LangGraph agent: extract rules per chunk
  synthesizer.ts       ← Vote/merge extractions → IGameSystemDraft
  reviewer.ts          ← In-game admin review flow
  pipeline.ts          ← Orchestrates all phases with DB checkpoints

systems/
  interface.ts         ← IGameSystem extends IStatSystem
  store.ts             ← DB-backed registry (Zod-validated on load)
  urban-shadows.ts     ← Bundled default system

graphs/
  pose.ts              ← Round adjudication agent
  oracle.ts            ← Yes/No oracle agent
  move.ts              ← Move adjudication agent
  downtime.ts          ← Downtime action agent

monetization/
  interface.ts         ← IPaymentAdapter, IPlayerWallet, plans
  credits.ts           ← Immutable ledger + wallet mutations
  gates.ts             ← Feature cost checks
  stripe/adapter.ts    ← Stripe Checkout + webhook handler
  webhook.ts           ← Maps Stripe events → credit/sub mutations

social/
  discord.ts           ← Discord webhook bridge
  journal.ts           ← AI session recaps
  spotlight.ts         ← Player moment tracker
  persona.ts           ← Multi-persona support

api/
  routes.ts            ← REST JSON API dispatcher

context/
  loader.ts            ← Assembles room context (chars, NPCs, fronts, scenes)
  compressor.ts        ← Token-aware context compression
  cache.ts             ← Session snapshot cache
  injector.ts          ← Injects context into graph state
```

The LangGraph analyzer runs on every batch of chunks with structural `<book-text>` delimiters to prevent prompt injection from adversarial document content.

---

## Security

This plugin was developed with a full OWASP Top 10 security audit. Key mitigations:

- **Path traversal** — `booksDir` is resolved and validated against `Deno.cwd()`
- **Prototype pollution** — `ALLOWED_DRAFT_FIELDS` allowlist on all dynamic field writes
- **Prompt injection** — `<book-text>` XML structural delimiters; system prompt explicitly labels document content as untrusted
- **SSRF** — Wiki base URL sourced from environment only; never from LLM tool arguments
- **Secret exposure** — API key redacted in all command output; errors sanitized before display
- **Insecure randomness** — `crypto.getRandomValues()` with rejection sampling throughout
- **DoS** — Concurrent ingestion guard; `roundTimeoutSeconds` bounded 30–86400; staff-only LLM commands
- **Schema validation** — Zod validates all DB-loaded game system records before use

---

## Development

```bash
# Run tests
deno task test

# Type-check
deno task check

# Lint
deno task lint
```

Tests live in `tests/` and cover the ingestion pipeline, reviewer, synthesizer, and system store (112 tests).

---

## Contributing

Pull requests welcome. Please run `deno task check && deno task test` before submitting.

For security issues, open a GitHub issue marked **[SECURITY]** or contact the maintainer directly.

---

## License

MIT — Copyright (c) 2026 Lemuel Canady, Jr.

See [LICENSE](LICENSE) for full text.
