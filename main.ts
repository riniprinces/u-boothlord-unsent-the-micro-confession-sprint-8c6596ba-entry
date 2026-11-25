// Unsent: The Micro-Confession Sprint — make.fun entry (v2).
//
// This program produces exactly one artefact: /output/entry.txt, a
// two-part micro-confession. Part one is a To: line naming the person
// the message was meant for. Part two is the message itself, a single
// line written exactly as it was typed, with nothing after it.
//
// Why this confession: it is a thank-you that was never sendable.
// The sender never learned the nurse's name, so there was nowhere
// to send it to — the To: line carries only a ward number because
// that is all the sender ever knew. The message belongs to that one
// night on that one ward; give it any other addressee and the
// sentence falls apart, because no one else held that hand.
//
// Gate limits, checked here before writing: the whole file is
// 1-260 characters, and the message line is at most 200 characters.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

// The two parts of the confession, in order. Keep them in one place:
// the judge reads exactly these two lines, and nothing else.
const PARTS: readonly string[] = [
  "To: the nurse on ward 4B",
  "You held my hand while my dad died and I never even asked your name.",
] as const;

const MAX_ENTRY_CHARS = 260;
const MAX_MESSAGE_CHARS = 200;

function outputPath(): string {
  // The harness reads /output/entry.txt. ENTRY_OUTPUT exists only so
  // the entry can be checked locally without a sandbox.
  return resolve(process.env.ENTRY_OUTPUT ?? "/output/entry.txt");
}

function checkParts(parts: readonly string[]): void {
  if (parts.length !== 2) {
    throw new Error(`expected exactly 2 parts, got ${parts.length}`);
  }
  const [toLine, message] = parts;
  if (!toLine.startsWith("To: ")) {
    throw new Error("first part must be a To: line");
  }
  if (message.length === 0 || message.length > MAX_MESSAGE_CHARS) {
    throw new Error(
      `message must be 1-${MAX_MESSAGE_CHARS} characters, got ${message.length}`,
    );
  }
  if (message.includes("\n") || toLine.includes("\n")) {
    throw new Error("each part must be a single line");
  }
}

function renderEntry(parts: readonly string[]): string {
  return `${parts.join("\n")}\n`;
}

function run(): void {
  checkParts(PARTS);
  const text = renderEntry(PARTS);
  if (text.trim().length === 0 || text.length > MAX_ENTRY_CHARS) {
    throw new Error(
      `entry must be 1-${MAX_ENTRY_CHARS} characters, got ${text.length}`,
    );
  }
  const path = outputPath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text, "utf8");
  console.log(`wrote entry (${text.length} chars) to ${path}`);
}

run();
