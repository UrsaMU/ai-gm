# ai-gm — Configuration

All secrets live in a `.env` file. Copy the example and fill in your values:

```bash
cp .env.example .env
```

`.env` is gitignored — secrets never touch the database or in-game commands.

## Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `GOOGLE_API_KEY` | **Yes** | — | Google Gemini API key |
| `STRIPE_SECRET_KEY` | No | — | Enables Stripe payments |
| `STRIPE_WEBHOOK_SECRET` | No | — | Stripe webhook signature secret |
| `DISCORD_WEBHOOK_URL` | No | — | Mirror GM output to a Discord channel |
| `GM_API_SECRET` | No | *(open)* | Bearer token for the REST API; leave unset in dev |
| `GAME_URL` | No | — | Base URL for Stripe payment redirect links |
| `WIKI_BASE_URL` | No | `http://localhost:4201` | Base URL for wiki lore tools |

## In-Game Configuration

Runtime settings are stored in the DB and changed via in-game commands:

```
+gm/config                          — show all current settings
+gm/config/model <model>            — e.g. gemini-1.5-flash-latest
+gm/config/mode <auto|hybrid>       — auto: responds every round; hybrid: staff-triggered
+gm/config/chaos <1–9>              — Mythic GME chaos factor
+gm/config/system <id>              — active game system (see game-systems.md)
+gm/config/booksdir <path>          — folder the watcher monitors for game books
```

Changes take effect immediately without a restart.

## Watched Rooms

The GM only responds to activity in rooms on the watch list:

```
+gm/watch       — add current room
+gm/unwatch     — remove current room
```

Rooms not on the watch list receive no GM attention, allowing you to have OOC spaces.
