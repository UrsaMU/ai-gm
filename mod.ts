/**
 * @ursamu/ai-gm
 *
 * Agentic AI Game Master for UrsaMU.
 * Install via: ursamu plugin install https://github.com/ursamu/ai-gm
 */

export { default } from "./index.ts";
export type { IGMConfig, IGMSession, IGMExchange, IGMMemory, IGMReveal, IGMRound } from "./schema.ts";
export type { IGameSystem } from "./systems/interface.ts";
export { getGameSystem, registerGameSystem, getGameSystemNames } from "./systems/store.ts";
// Monetization
export type {
  IPaymentAdapter,
  IPlayerWallet,
  ILedgerEntry,
  ISubscriptionPlan,
  IFeatureCosts,
} from "./monetization/interface.ts";
export { getWallet, creditPlayer, spendCredits, canAfford } from "./monetization/credits.ts";
export { getPlans, getPlan, setPlans } from "./monetization/plans.ts";
export { checkGate, chargeGate, setFeatureCosts } from "./monetization/gates.ts";
export { nullPaymentAdapter } from "./monetization/null-adapter.ts";
export { createStripeAdapter, createStripeAdapterFromEnv } from "./monetization/stripe/adapter.ts";
// Social
export type { IJournalEntry } from "./social/journal.ts";
export { getJournalEntries, getJournalEntry, formatJournalEntry } from "./social/journal.ts";
export type { ISpotlightEntry } from "./social/spotlight.ts";
export { getSpotlights, recordSpotlight } from "./social/spotlight.ts";
export type { IPersona } from "./social/persona.ts";
export {
  createPersona,
  activatePersona,
  getPersonasForPlayer,
  resolveDisplayName,
} from "./social/persona.ts";
export { sendToDiscord, discordEnabled } from "./social/discord.ts";
// REST API
export { handleGmRequest } from "./api/routes.ts";
