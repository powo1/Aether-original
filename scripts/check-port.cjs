#!/usr/bin/env node
// check-port.js
// Usage: node check-port.js <port>

const port = process.argv[2];
if (!port) {
  console.error("Usage: node check-port.js <port>");
  process.exit(1);
}

const { execSync } = require("child_process");

try {
  // Check if port is in use
  const output = execSync(`lsof -i :${port} -t`, { encoding: "utf8" });
  if (output) {
    const pids = output.split("\n").filter(Boolean);
    console.log(`Port ${port} is in use by process(es): ${pids.join(", ")}`);
    // Prompt user for confirmation to kill
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question(
      `Kill process(es) using port ${port}? (y/N): `,
      (answer) => {
        if (answer.toLowerCase() === "y") {
          pids.forEach((pid) => {
            try {
              process.kill(pid, "SIGKILL");
              console.log(`Killed process ${pid}`);
            } catch (e) {
              console.error(`Failed to kill process ${pid}:`, e.message);
            }
          });
        } else {
          console.log("Aborted.");
          process.exit(1);
        }
        readline.close();
      }
    );
  } else {
    process.exit(0);
  }
} catch (e) {
  // Port is free
  process.exit(0);
}
