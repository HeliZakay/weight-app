/**
 * Date helpers. Entries are stored on a `@db.Date` column normalized to
 * UTC midnight of the local calendar day, so seed and app agree on "today".
 */

/** UTC-midnight Date for the given day (defaults to now). */
export function dayUTC(d: Date = new Date()): Date {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

/** ISO yyyy-mm-dd key for a day. */
export function dayKey(d: Date): string {
  return dayUTC(d).toISOString().slice(0, 10);
}

export function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setUTCDate(c.getUTCDate() + n);
  return c;
}

/** Monday (UTC midnight) of the week containing `d`. Weeks start Monday. */
export function startOfWeek(d: Date): Date {
  const day = dayUTC(d);
  const dow = (day.getUTCDay() + 6) % 7; // Mon=0 ... Sun=6
  return addDays(day, -dow);
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** e.g. "Thursday". Uses the machine's local day. */
export function dayName(d: Date = new Date()): string {
  return DAY_NAMES[d.getDay()];
}

/** e.g. "July 2". */
export function dateLabel(d: Date = new Date()): string {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/** Lowercased 12-hour time, e.g. "7:12 am". */
export function timeLabel(d: Date): string {
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
}
