/**
 *
 * @param date An instance of Date
 * @returns Mon, Tue
 */
export function getDayStr(date: Date) {
  return date.toLocaleString("en-us", { weekday: "short" });
}

export function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// format date as m-day-year
export function formatDate(date: Date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return `${month}-${day}-${year}`;
}

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
export function dateDiffInDays(a: Date, b: Date) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

// @ts-ignore
window.dateDiffInDays = dateDiffInDays;
