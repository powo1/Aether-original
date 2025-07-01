// backend/__tests__/schemaCreation.test.js

import fs from "fs";
import path from "path";
import sqlite3Pkg from "sqlite3";
import { fileURLToPath } from "url";
import { describe, test, beforeAll } from "vitest";

const sqlite3 = sqlite3Pkg.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH =
  process.env.AETHERPRESS_DB_PATH ||
  path.join(__dirname, "../../data/aetherpress.db");
const ASSEMBLY_MODULE_PATH = path.join(__dirname, "../assemblyModule.js");

function waitForFile(filePath, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    (function check() {
      if (fs.existsSync(filePath)) return resolve();
      if (Date.now() - start > timeout)
        return reject(new Error("Timeout waiting for file: " + filePath));
      setTimeout(check, 100);
    })();
  });
}

describe("Schema Creation", () => {
  beforeAll(() => {
    // Ensure the data/ directory exists before test
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    // Only remove the database file, never the directory
    if (fs.existsSync(DB_PATH)) {
      fs.unlinkSync(DB_PATH);
    }
  });

  test("Database file and tables are created on startup", async () => {
    // Start the backend module (which should create the DB and schema)
    await import(ASSEMBLY_MODULE_PATH);
    await waitForFile(DB_PATH);

    // Check for expected tables
    const db = new sqlite3.Database(DB_PATH);
    const expectedTables = ["documents"]; // Add more if needed
    await new Promise((resolve, reject) => {
      db.all(
        "SELECT name FROM sqlite_master WHERE type='table'",
        (err, rows) => {
          if (err) return reject(err);
          const tableNames = rows.map((r) => r.name);
          for (const tbl of expectedTables) {
            if (!tableNames.includes(tbl)) {
              return reject(new Error(`Missing table: ${tbl}`));
            }
          }
          resolve();
        },
      );
    });
    db.close();
  });
});
