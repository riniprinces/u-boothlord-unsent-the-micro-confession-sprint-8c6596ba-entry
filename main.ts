// Unsent: The Micro-Confession Sprint — make.fun bounty entry.
//
// main.ts writes exactly two lines to /output/entry.txt and nothing else:
//   line 1: "To: <who it was meant for>" — a role, a first name, or a
//           relationship. No real full names. No handles.
//   line 2: the unsent message itself, one line, exactly as it was typed.
//           No explanation after it.
//
// The entry is a real unsent confession: specific, honest, and it carries
// the reason it stayed in drafts inside the message itself.
//
// Deterministic by construction: the text below is a literal, there is no
// randomness, no clock, no environment input, no file input. Two runs
// produce byte-identical output.

import * as fs from "node:fs";
import * as path from "node:path";

const OUT = "/output/entry.txt";

const LINE_ONE = "To: my little sister";

const LINE_TWO =
  "I was the one who broke your camera the morning of your graduation trip, and I let you blame the airline, because saying sorry would have meant admitting I was jealous you were leaving and I wasn't ready to be the only one left at home.";

const lines = [LINE_ONE, LINE_TWO] as const;

type Check = { ok: boolean; problem: string };

const checks: Check[] = [
  { ok: lines.length === 2, problem: "entry must be exactly two lines" },
  {
    ok: lines[0].startsWith("To: ") && lines[0].length > "To: ".length,
    problem: "line 1 must be 'To: ' followed by who it was meant for",
  },
  {
    ok: !lines[0].includes("@") && !lines[0].slice(4).includes("  "),
    problem: "line 1 must not name a handle",
  },
  {
    ok: lines[1].trim().length > 0,
    problem: "line 2 must not be empty",
  },
  {
    ok: !lines[1].includes("\n"),
    problem: "line 2 must be a single line",
  },
  {
    // No trailing explanation: the message ends with the confession, and
    // there is no third line, no footnote, no postscript.
    ok: !/\b(P\.S\.|PS:|note:|anyway,)\s*$/i.test(lines[1]),
    problem: "line 2 must not carry a trailing explanation",
  },
];

for (const check of checks) {
  if (!check.ok) throw new Error(check.problem);
}

const text = lines.join("\n") + "\n";

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, text, { encoding: "utf8" });

console.log(`wrote ${lines.length} lines (${text.length} bytes) to ${OUT}`);
