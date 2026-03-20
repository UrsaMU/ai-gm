// Transitional registry — code-only systems.
// Phase 2 will add DB-stored systems via store.ts.

import type { IGameSystem } from "./interface.ts";
import { urbanShadowsSystem } from "./urban-shadows.ts";

const BUNDLED: ReadonlyMap<string, IGameSystem> = new Map([
  ["urban-shadows", urbanShadowsSystem],
]);

export function getSystem(id: string): IGameSystem {
  return BUNDLED.get(id) ?? urbanShadowsSystem;
}

export function listSystemIds(): string[] {
  return [...BUNDLED.keys()];
}

export type { IGameSystem };
