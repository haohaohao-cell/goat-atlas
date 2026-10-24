import compareJson from "@/data/compare.json";
import { compareSchema } from "./schemas";
import type { CompareData } from "./types";

export const compare = compareSchema.parse(compareJson) as CompareData;
