import type { Units } from "@prisma/client";

const LB_PER_KG = 2.2046226218;

export function lbToKg(lb: number): number {
  return lb / LB_PER_KG;
}
export function kgToLb(kg: number): number {
  return kg * LB_PER_KG;
}

/** Convert a canonical (lb) weight into the user's display units. */
export function toDisplay(lb: number, units: Units): number {
  return units === "KG" ? lbToKg(lb) : lb;
}

/** Convert a value the user typed (in their units) back to canonical lb. */
export function fromInput(value: number, units: Units): number {
  return units === "KG" ? kgToLb(value) : value;
}

/** Formatted display string, one decimal, in the user's units. */
export function formatWeight(lb: number, units: Units): string {
  return toDisplay(lb, units).toFixed(1);
}

/** The unit label, lowercased. */
export function unitLabel(units: Units): string {
  return units === "KG" ? "kg" : "lb";
}

/** Goal-weight step (±1) expressed in canonical lb for the current units. */
export function goalStepLb(units: Units): number {
  return units === "KG" ? kgToLb(1) : 1;
}
