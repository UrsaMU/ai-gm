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
