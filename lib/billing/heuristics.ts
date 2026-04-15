// Billing heuristics — pattern-based flags applied before/alongside AI analysis
// These are review guidance only, not legal or medical certainty.
// Used to pre-process OCR output and validate AI results.

import type { BillLineItem, HeuristicFlag, EpisodeOfCare } from "@/types";

// ── Duplicate charge detection ─────────────────────────────────────────────────

export function detectDuplicates(items: BillLineItem[]): HeuristicFlag[] {
  const flags: HeuristicFlag[] = [];
  const seen = new Map<string, number>();

  items.forEach((item, index) => {
    const key = [
      item.cptCode ?? item.description.toLowerCase().trim(),
      item.dateOfService ?? "",
      item.totalPrice,
    ].join("|");

    if (seen.has(key)) {
      flags.push({
        lineItemIndex: index,
        type: "duplicate",
        severity: "alert",
        reason: `This charge appears to be a duplicate of line ${(seen.get(key) ?? 0) + 1}. Same service, same date, same price.`,
      });
    } else {
      seen.set(key, index);
    }
  });

  return flags;
}

// ── Unusually high quantity ────────────────────────────────────────────────────

const PROCEDURE_QUANTITY_THRESHOLD = 3; // procedures billed >3x on same day = review

export function detectHighQuantity(items: BillLineItem[]): HeuristicFlag[] {
  return items.reduce<HeuristicFlag[]>((flags, item, index) => {
    // Skip supply items (e.g., IV bags, medications) which can have high quantities
    const isSupply = /\b(saline|bag|ml|tablet|pill|supply|solution)\b/i.test(
      item.description
    );

    if (!isSupply && item.quantity > PROCEDURE_QUANTITY_THRESHOLD) {
      flags.push({
        lineItemIndex: index,
        type: "high_quantity",
        severity: "warning",
        reason: `This procedure is billed ${item.quantity} times. Review whether this quantity is clinically supported.`,
      });
    }

    return flags;
  }, []);
}

// ── Vague facility fees ────────────────────────────────────────────────────────

const VAGUE_FEE_PATTERNS = [
  /facility\s*fee/i,
  /general\s*fee/i,
  /admin(istrative)?\s*(fee|charge|processing)/i,
  /miscellaneous/i,
  /service\s*charge/i,
  /processing\s*fee/i,
];

export function detectVagueFees(items: BillLineItem[]): HeuristicFlag[] {
  return items.reduce<HeuristicFlag[]>((flags, item, index) => {
    const isVague = VAGUE_FEE_PATTERNS.some((p) => p.test(item.description));
    if (isVague) {
      flags.push({
        lineItemIndex: index,
        type: "vague_facility_fee",
        severity: "warning",
        reason: `"${item.description}" is a non-specific charge. Request a detailed itemization. These fees are sometimes reducible or waivable.`,
      });
    }
    return flags;
  }, []);
}

// ── Care mismatch ──────────────────────────────────────────────────────────────

export function detectCareMismatch(
  items: BillLineItem[],
  episode: Partial<EpisodeOfCare>
): HeuristicFlag[] {
  const flags: HeuristicFlag[] = [];

  items.forEach((item, index) => {
    const desc = item.description.toLowerCase();

    // Surgery billed but patient didn't report surgery
    if (!episode.hadSurgery && /\b(surgery|surgical|operation|OR fee)\b/i.test(desc)) {
      flags.push({
        lineItemIndex: index,
        type: "care_mismatch",
        severity: "alert",
        reason:
          "A surgical charge was found, but you indicated no surgery occurred. Review this charge carefully.",
      });
    }

    // Imaging billed but patient didn't report imaging
    if (
      !episode.hadImaging &&
      /\b(CT|MRI|X-ray|ultrasound|scan|imaging|radiolog)\b/i.test(desc)
    ) {
      flags.push({
        lineItemIndex: index,
        type: "care_mismatch",
        severity: "warning",
        reason:
          "An imaging charge was found, but you did not report imaging during your visit. Verify this is correct.",
      });
    }

    // Room charge but no room stay
    if (!episode.hadRoomStay && /\b(room|board|inpatient|bed)\b/i.test(desc)) {
      flags.push({
        lineItemIndex: index,
        type: "care_mismatch",
        severity: "warning",
        reason:
          "A room/board charge appears on your bill but you indicated no overnight stay. Verify this charge.",
      });
    }
  });

  return flags;
}

// ── Ambiguous charges ─────────────────────────────────────────────────────────

const AMBIGUOUS_PATTERNS = [
  /^misc(ellaneous)?\.?$/i,
  /^other charges?$/i,
  /^supply$/i,
  /^service$/i,
  /^charge$/i,
];

export function detectAmbiguousCharges(items: BillLineItem[]): HeuristicFlag[] {
  return items.reduce<HeuristicFlag[]>((flags, item, index) => {
    const isAmbiguous = AMBIGUOUS_PATTERNS.some((p) =>
      p.test(item.description.trim())
    );
    if (isAmbiguous || (!item.cptCode && item.totalPrice > 100)) {
      flags.push({
        lineItemIndex: index,
        type: "ambiguous_charge",
        severity: "warning",
        reason: `"${item.description}" lacks sufficient description. Request clarification and a CPT code if applicable.`,
      });
    }
    return flags;
  }, []);
}

// ── Run all heuristics ─────────────────────────────────────────────────────────

export function runAllHeuristics(
  items: BillLineItem[],
  episode: Partial<EpisodeOfCare>
): HeuristicFlag[] {
  return [
    ...detectDuplicates(items),
    ...detectHighQuantity(items),
    ...detectVagueFees(items),
    ...detectCareMismatch(items, episode),
    ...detectAmbiguousCharges(items),
  ];
}
