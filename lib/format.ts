export function getYear(date: string): string {
  return date.slice(0, 4);
}

export function formatDate(date: string): string {
  return date.replaceAll("-", ".");
}

export function formatDateLong(date: string): string {
  const [year, month, day] = date.split("-");
  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
}

export function formatDateEn(date: string): string {
  const parsed = new Date(`${date}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}
