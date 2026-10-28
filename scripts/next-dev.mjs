#!/usr/bin/env node
/**
 * `next dev`, always with NODE_ENV=development. Some environments export
 * NODE_ENV=production (seen on macOS when the dev server is started by a tool),
 * and Next 14 then skips PostCSS in dev: every page 500s on `@tailwind base`.
 * Used by the "dev" script in package.json; arguments pass through.
 *   node scripts/next-dev.mjs [-p 3000]
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(join(process.cwd(), "package.json"));
const nextBin = require.resolve("next/dist/bin/next");

const child = spawn(process.execPath, [nextBin, "dev", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "development" },
});
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("exit", (code, signal) => process.exit(signal ? 1 : (code ?? 0)));
