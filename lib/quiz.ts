import quizJson from "@/data/quiz.json";
import { quizQuestionsSchema } from "./schemas";
import type { QuizQuestion } from "./types";

export const quizQuestions: QuizQuestion[] = quizQuestionsSchema.parse(
  quizJson,
) as QuizQuestion[];

export function getQuizDateKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function getQuizDateLabel(dateKey: string): string {
  const [year, month, day] = dateKey.split("-");
  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let value = seed;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export function getDailyQuestions(
  dateKey: string,
  count = 5,
): QuizQuestion[] {
  const pool = [...quizQuestions];
  const random = mulberry32(hashString(dateKey));

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [pool[index], pool[target]] = [pool[target], pool[index]];
  }

  return pool.slice(0, Math.min(count, pool.length));
}
