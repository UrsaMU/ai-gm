// ─── Webhook Processor ────────────────────────────────────────────────────────
//
// Translates IWebhookEvent into credit/subscription mutations.
// Called by the REST route POST /api/gm/webhook.

import type { IWebhookEvent } from "./interface.ts";
import { creditPlayer, updateSubscriptionStatus } from "./credits.ts";
import { getPlan } from "./plans.ts";

export async function processWebhookEvent(
  event: IWebhookEvent,
  resolvePlayerIdFromCustomer: (customerId: string) => Promise<string | null>,
): Promise<void> {
  switch (event.type) {
    case "payment.succeeded": {
      const meta = event.metadata ?? {};
      // Credit purchase
      if (meta.credits && meta.playerId) {
        await creditPlayer(
          String(meta.playerId),
          Number(meta.credits),
          "credit_purchase",
          { stripeCustomer: event.customerId },
        );
        return;
      }
      // Subscription renewal — grant monthly credits
      if (event.subscriptionId && event.customerId) {
        const playerId = await resolvePlayerIdFromCustomer(event.customerId);
        if (!playerId) return;
        // Find plan from subscription metadata (best-effort)
        // The plan id should have been stored on subscription creation
        // If not findable, grant a default renewal allotment
        const granted = 50; // fallback
        await creditPlayer(playerId, granted, "subscription_renewal", {
          subscriptionId: event.subscriptionId,
        });
      }
      break;
    }

    case "subscription.created": {
      const playerId = event.metadata?.playerId as string | undefined ??
        await resolvePlayerIdFromCustomer(event.customerId);
      if (!playerId) return;
      const plan = event.planId ? getPlan(event.planId) : undefined;
      await updateSubscriptionStatus(
        playerId,
        event.subscriptionId,
        event.planId,
        "active",
      );
      if (plan) {
        await creditPlayer(playerId, plan.creditsPerMonth, "subscription_renewal", {
          planId: plan.id,
          subscriptionId: event.subscriptionId,
        });
      }
      break;
    }

    case "subscription.updated": {
      const playerId = await resolvePlayerIdFromCustomer(event.customerId);
      if (!playerId) return;
      await updateSubscriptionStatus(
        playerId,
        event.subscriptionId,
        event.planId,
        "active",
      );
      break;
    }

    case "subscription.deleted": {
      const playerId = await resolvePlayerIdFromCustomer(event.customerId);
      if (!playerId) return;
      await updateSubscriptionStatus(playerId, undefined, undefined, "canceled");
      break;
    }

    case "payment.failed": {
      const playerId = await resolvePlayerIdFromCustomer(event.customerId);
      if (!playerId) return;
      await updateSubscriptionStatus(
        playerId,
        event.subscriptionId,
        undefined,
        "past_due",
      );
      break;
    }
  }
}
