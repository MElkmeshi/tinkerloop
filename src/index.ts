import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve, join } from "node:path";

type Flags = {
  dir: string;
  backoffMs: number;
  php: string;
};

function parseArgs(): Flags {
  const args = process.argv.slice(2);
  const flags: Flags = {
    dir: process.cwd(),
    backoffMs: 250,
    php: "php",
  };

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--dir" || a === "-d") flags.dir = resolve(args[++i] ?? ".");
    else if (a === "--backoff" || a === "-b")
      flags.backoffMs = Number(args[++i] ?? 250) || 250;
    else if (a === "--php") flags.php = args[++i] ?? "php";
    else if (!a.startsWith("-")) flags.dir = resolve(a);
    else if (a === "--help" || a === "-h") {
      printHelp();
      process.exit(0);
    }
  }
  return flags;
}

function printHelp() {
  console.log(`tinkerloop

Usage:
  tinkerloop [project-path] [--dir PATH] [--php PHP_BIN] [--backoff MS]

Examples:
  tinkerloop                       # uses current dir
  tinkerloop ~/code/app           # explicit project
  tinkerloop -d . --php php       # custom PHP
`);
}

async function main() {
  const { dir, backoffMs, php } = parseArgs();

  const artisan = join(dir, "artisan");
  if (!existsSync(artisan)) {
    console.error(`No Laravel 'artisan' found in: ${dir}`);
    process.exit(1);
  }

  process.chdir(dir);

  let stopping = false;
  const stop = () => {
    stopping = true;
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  process.on("SIGHUP", stop);

  const run = () => {
    const child = spawn(php, ["artisan", "tinker"], {
      stdio: "inherit",
      env: process.env,
    });

    child.on("exit", () => {
      if (stopping) return;
      setTimeout(run, backoffMs);
    });
  };

  run();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
