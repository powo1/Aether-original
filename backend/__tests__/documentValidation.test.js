// backend/__tests__/documentValidation.test.js

import { describe, it, expect, beforeAll } from "vitest";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import sqlite3Pkg from "sqlite3";

const sqlite3 = sqlite3Pkg.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH =
  process.env.AETHERPRESS_DB_PATH ||
  path.join(__dirname, "../../data/aetherpress.db");

// Import functions from assemblyModule.js
import {
  createDocument,
  updateDocument,
  listDocuments,
  initializeDatabase,
  closeDatabase,
  initializeSchema,
  getDbPath,
} from "../assemblyModule.js";

function resetDatabase() {
  if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);
}

describe("Document Validation & Error Handling", () => {
  beforeAll(async () => {
    await closeDatabase();
    resetDatabase();
    await initializeDatabase();
    await initializeSchema();
  });

  it("rejects creation with missing title/content", async () => {
    await expect(createDocument("", "content")).rejects.toThrow();
    await expect(createDocument("Title", "")).rejects.toThrow();
    await expect(createDocument(null, "content")).rejects.toThrow();
    await expect(createDocument("Title", null)).rejects.toThrow();
  });

  it("rejects creation with overly long title", async () => {
    const longTitle = "a".repeat(256);
    await expect(createDocument(longTitle, "content")).rejects.toThrow();
  });

  it("rejects duplicate titles", async () => {
    await createDocument("Unique Title", "content");
    await expect(createDocument("Unique Title", "other")).rejects.toThrow();
  });

  it("rejects update with invalid data", async () => {
    const doc = await createDocument("Update Test", "content");
    await expect(updateDocument(doc.id, "", "content")).rejects.toThrow();
    await expect(updateDocument(doc.id, "Valid", "")).rejects.toThrow();
    await expect(
      updateDocument(doc.id, "a".repeat(256), "content")
    ).rejects.toThrow();
    await expect(updateDocument(doc.id, null, "content")).rejects.toThrow();
    await expect(updateDocument(doc.id, "Valid", null)).rejects.toThrow();
  });

  it("rejects update to duplicate title", async () => {
    const doc1 = await createDocument("Doc1", "content");
    const doc2 = await createDocument("Doc2", "content");
    await expect(
      updateDocument(doc2.id, "Doc1", "new content")
    ).rejects.toThrow();
  });

  it("allows valid creation and update", async () => {
    const doc = await createDocument("Valid Title", "content");
    expect(doc.title).toBe("Valid Title");
    const updated = await updateDocument(doc.id, "New Title", "new content");
    expect(updated.title).toBe("New Title");
  });
});
