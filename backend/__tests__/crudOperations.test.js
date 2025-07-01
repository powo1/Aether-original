// backend/__tests__/crudOperations.test.js
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  initializeDatabase,
  closeDatabase,
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  listDocuments,
} from "../assemblyModule.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH =
  process.env.AETHERPRESS_DB_PATH ||
  path.join(__dirname, "../../data/aetherpress.db");

function resetDatabase() {
  if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);
}

describe("CRUD Operations", () => {
  beforeEach(async () => {
    await closeDatabase();
    resetDatabase();
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("creates and fetches a document", async () => {
    const doc = await createDocument("Test Doc", "Test content");
    expect(doc.title).toBe("Test Doc");
    const fetched = await getDocument(doc.id);
    expect(fetched.title).toBe("Test Doc");
    expect(fetched.content).toBe("Test content");
  });

  it("updates a document", async () => {
    const doc = await createDocument("To Update", "Old content");
    const updated = await updateDocument(
      doc.id,
      "Updated Title",
      "New content"
    );
    expect(updated.title).toBe("Updated Title");
    const fetched = await getDocument(doc.id);
    expect(fetched.title).toBe("Updated Title");
    expect(fetched.content).toBe("New content");
  });

  it("deletes a document", async () => {
    const doc = await createDocument("To Delete", "Content");
    await deleteDocument(doc.id);
    const fetched = await getDocument(doc.id);
    expect(fetched).toBeNull();
  });

  it("lists documents", async () => {
    await createDocument("Doc1", "Content1");
    await createDocument("Doc2", "Content2");
    const docs = await listDocuments();
    expect(docs.length).toBe(2);
    const titles = docs.map((d) => d.title);
    expect(titles).toContain("Doc1");
    expect(titles).toContain("Doc2");
  });
});
