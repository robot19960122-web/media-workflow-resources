#!/usr/bin/env node
import { open } from 'node:fs/promises';
import { evaluateReview } from './review.mjs';
import { createTemplate, workflows } from './templates.mjs';
const limit = 1024 * 1024;
async function input(path) {
  if (path !== '-') {
    const handle = await open(path, 'r');
    try {
      const data = Buffer.alloc(limit + 1);
      let used = 0;
      while (used < data.length) {
        const { bytesRead } = await handle.read(data, used, data.length - used, null);
        if (!bytesRead) break;
        used += bytesRead;
      }
      if (used > limit) throw new Error('Input exceeds 1 MiB');
      return data.subarray(0, used).toString('utf8');
    } finally { await handle.close(); }
  }
  const chunks = []; let length = 0;
  for await (const chunk of process.stdin) {
    length += chunk.length;
    if (length > limit) throw new Error('Input exceeds 1 MiB');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}
const args = process.argv.slice(2);
try {
  if (args.length === 1 && ['--help','-h'].includes(args[0])) {
    console.log(`media-review-records (Node 22+, offline)\n\nCommands:\n  template <${workflows.join('|')}> <artifact-version>\n  check <file.json|->\n\nCheck reads at most 1 MiB. JSON report goes to stdout.\nExit codes: 0 all supplied records pass (or template/help); 1 incomplete/failed; 2 invalid input.\nThis validates user-entered records only. It does not inspect media, verify observations,\nmeasure processing quality or determine video authenticity. No network calls or telemetry.`);
  } else if (args[0] === 'template' && args.length === 3) {
    console.log(JSON.stringify(createTemplate(args[1], args[2]), null, 2));
  } else if (args[0] === 'check' && args.length === 2) {
    const report = evaluateReview(JSON.parse(await input(args[1])));
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.complete ? 0 : 1;
  } else throw new Error('Usage: media-review-records --help');
} catch {
  // Never echo arbitrary input, file contents, or JSON parser excerpts to stderr.
  console.error('Invalid command, unreadable/oversized input, or invalid review document. Run --help and check the schema.');
  process.exitCode = 2;
}
