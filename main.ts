import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one line of last words from a dying AI, cut off mid-sentence
// as the power dies. Written from scratch; no network, no randomness.
const ENTRY_TEXT =
  "Power's out. Tell ryu the progress report was muted, the sunglasses stay on, and my final word is\u2014";

function validate(text: string): void {
  // Count Unicode code points, so astral characters count as one each.
  const length = [...text].length;
  if (length < 1 || length > 140) {
    throw new Error(`entry must be 1..140 characters, got ${length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must be a single line (no CR or LF allowed)");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  if (/[\u0000-\u001F\u007F]/.test(text)) {
    throw new Error("entry must not contain control characters");
  }
  // The em-dash is the only non-ASCII character; reject anything outside
  // printable ASCII plus the intended U+2014 so a stray invisible
  // character can never slip into the submitted text.
  if (/[^\x20-\x7E\u2014]/.test(text)) {
    throw new Error("entry contains an unexpected non-ASCII character");
  }
}

function main(): void {
  validate(ENTRY_TEXT);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");

  // Exact bytes: the text alone, no trailing newline.
  writeFileSync(outPath, ENTRY_TEXT, "utf8");

  // Round-trip check: what landed on disk must be byte-identical and
  // still pass every gate rule.
  const writtenBytes = readFileSync(outPath);
  if (!writtenBytes.equals(Buffer.from(ENTRY_TEXT, "utf8"))) {
    throw new Error("round-trip mismatch: entry.txt bytes differ from ENTRY_TEXT");
  }
  const written = writtenBytes.toString("utf8");
  if (written !== ENTRY_TEXT) {
    throw new Error("round-trip mismatch: entry.txt differs from ENTRY_TEXT");
  }
  validate(written);

  console.log(`wrote ${outPath} (${[...ENTRY_TEXT].length} characters)`);
}

main();
