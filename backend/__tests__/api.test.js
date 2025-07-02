// backend/__tests__/api.test.js
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  initializeDatabase,
  closeDatabase,
  getDbPath,
} from "../assemblyModule.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = getDbPath();

function resetDatabase() {
  if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);
}

describe("API Integration: Document CRUD", () => {
  beforeEach(async () => {
    await closeDatabase();
    resetDatabase();
    await initializeDatabase();
  });
  afterAll(async () => {
    await closeDatabase();
  });

  it("POST /documents creates a document", async () => {
    const res = await request(app)
      .post("/documents")
      .send({ title: "API Doc", content: "API Content" });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("API Doc");
  });

  it("GET /documents lists documents", async () => {
    await request(app)
      .post("/documents")
      .send({ title: "Doc1", content: "C1" });
    await request(app)
      .post("/documents")
      .send({ title: "Doc2", content: "C2" });
    const res = await request(app).get("/documents");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("GET /documents/:id fetches a document", async () => {
    const create = await request(app)
      .post("/documents")
      .send({ title: "FetchMe", content: "FetchContent" });
    const id = create.body.id;
    const res = await request(app).get(`/documents/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("FetchMe");
  });

  it("PUT /documents/:id updates a document", async () => {
    const create = await request(app)
      .post("/documents")
      .send({ title: "ToUpdate", content: "Old" });
    const id = create.body.id;
    const res = await request(app)
      .put(`/documents/${id}`)
      .send({ title: "Updated", content: "New" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated");
  });

  it("DELETE /documents/:id deletes a document", async () => {
    const create = await request(app)
      .post("/documents")
      .send({ title: "ToDelete", content: "Gone" });
    const id = create.body.id;
    const del = await request(app).delete(`/documents/${id}`);
    expect(del.status).toBe(200);
    const get = await request(app).get(`/documents/${id}`);
    expect(get.status).toBe(404);
  });

  it("POST /documents with missing fields returns 400", async () => {
    const res = await request(app)
      .post("/documents")
      .send({ title: "", content: "" });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/);
  });

  it("POST /documents with duplicate title returns 409", async () => {
    await request(app)
      .post("/documents")
      .send({ title: "DupTitle", content: "A" });
    const res = await request(app)
      .post("/documents")
      .send({ title: "DupTitle", content: "B" });
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/exists/);
  });

  it("GET /documents/:id with non-existent id returns 404", async () => {
    const res = await request(app).get("/documents/9999");
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/);
  });

  it("PUT /documents/:id with invalid data returns 400", async () => {
    const create = await request(app)
      .post("/documents")
      .send({ title: "ToUpdate", content: "Old" });
    const id = create.body.id;
    const res = await request(app)
      .put(`/documents/${id}`)
      .send({ title: "", content: "" });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/);
  });

  it("PUT /documents/:id with non-existent id returns 404", async () => {
    const res = await request(app)
      .put("/documents/9999")
      .send({ title: "X", content: "Y" });
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/);
  });

  it("DELETE /documents/:id with non-existent id returns 200", async () => {
    // Should still return 200 for idempotency
    const res = await request(app).delete("/documents/9999");
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/);
  });

  it("GET /test-db returns success", async () => {
    const res = await request(app).get("/test-db");
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Database test successful/);
  });
});
