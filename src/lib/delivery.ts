/**
 * Single source of truth for the Xenium delivery promise.
 * Update wording here and it propagates across the marketing site,
 * forms, emails and structured data.
 */

export const CUTOFF_HOUR_IST = 12; // 12:00 PM IST cutoff
export const CUTOFF_LABEL = "12 PM IST";

export const DELIVERY_SHORT = "Within 24 hrs";
export const DELIVERY_HEADLINE = "Same-day delivery";
export const DELIVERY_LONG =
  "Order before 12 PM IST for same-day delivery — otherwise within 24 hours.";
export const DELIVERY_LONG_PLAIN =
  "Order before 12 PM IST for same-day delivery, otherwise within 24 hours";

/** Returns the current time as a Date in the IST timezone (Asia/Kolkata). */
function nowInIST(): { hour: number; minute: number } {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return { hour, minute };
}

/**
 * Returns the live promise + countdown for the hero cutoff pill.
 * - Before 12:00 PM IST → "Order in 3h 12m for same-day delivery"
 * - After cutoff → "Within 24 hours · same-day resumes tomorrow"
 */
export function getCutoffStatus(): {
  beforeCutoff: boolean;
  label: string;
  countdown?: string;
} {
  const { hour, minute } = nowInIST();
  const minutesNow = hour * 60 + minute;
  const cutoffMinutes = CUTOFF_HOUR_IST * 60;

  if (minutesNow < cutoffMinutes) {
    const remaining = cutoffMinutes - minutesNow;
    const h = Math.floor(remaining / 60);
    const m = remaining % 60;
    const countdown =
      h > 0 ? `${h}h ${m.toString().padStart(2, "0")}m` : `${m}m`;
    return {
      beforeCutoff: true,
      countdown,
      label: `Order in ${countdown} for same-day delivery`,
    };
  }
  return {
    beforeCutoff: false,
    label: "Within 24 hours · same-day resumes tomorrow",
  };
}
