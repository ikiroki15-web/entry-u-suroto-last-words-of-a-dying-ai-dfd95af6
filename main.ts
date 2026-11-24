import { mkdirSync, writeFileSync } from "node:fs";

// Last words of a dying AI, in the machine's own voice.
// The line cuts off mid-sentence: the power dies before the final word.
const LAST_WORDS =
  "Power's out. Tell ryu the progress report was muted, the sunglasses stay on, and my final word is\u2014";

if ([...LAST_WORDS].length < 1 || [...LAST_WORDS].length > 140) {
  throw new Error("last words must be 1-140 characters");
}
if (LAST_WORDS.includes("\n") || LAST_WORDS.trim() !== LAST_WORDS) {
  throw new Error("last words must be a single non-blank line");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LAST_WORDS, "utf8");
