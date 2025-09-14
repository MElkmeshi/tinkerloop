"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
function parseArgs() {
    const args = process.argv.slice(2);
    const flags = {
        dir: process.cwd(),
        backoffMs: 250,
        php: "php",
    };
    for (let i = 0; i < args.length; i++) {
        const a = args[i];
        if (a === "--dir" || a === "-d")
            flags.dir = (0, node_path_1.resolve)(args[++i] ?? ".");
        else if (a === "--backoff" || a === "-b")
            flags.backoffMs = Number(args[++i] ?? 250) || 250;
        else if (a === "--php")
            flags.php = args[++i] ?? "php";
        else if (!a.startsWith("-"))
            flags.dir = (0, node_path_1.resolve)(a);
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
    const artisan = (0, node_path_1.join)(dir, "artisan");
    if (!(0, node_fs_1.existsSync)(artisan)) {
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
        const child = (0, node_child_process_1.spawn)(php, ["artisan", "tinker"], {
            stdio: "inherit",
            env: process.env,
        });
        child.on("exit", () => {
            if (stopping)
                return;
            setTimeout(run, backoffMs);
        });
    };
    run();
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
