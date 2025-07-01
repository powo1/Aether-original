import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db = null;

function getDbPath() {
  return (
    process.env.AETHERPRESS_DB_PATH ||
    path.resolve(__dirname, "../data/aetherpress.db")
  );
}

async function initializeDatabase() {
  const dbPath = getDbPath();

  // Ensure the data/ directory exists
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Close existing connection if any
  if (db) {
    await new Promise((resolve) => db.close(() => resolve()));
  }

  // Create new connection
  db = new sqlite3.Database(
    dbPath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
  );

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS content (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE,
          value TEXT
        )`,
        (err) => {
          if (err) {
            console.error("Error creating table:", err.message);
            reject(err);
            return;
          }

          db.run(
            `CREATE TABLE IF NOT EXISTS documents (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL UNIQUE CHECK(length(title) <= 255),
              content TEXT NOT NULL,
              preview_html TEXT,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            (err) => {
              if (err) {
                console.error("Error creating documents table:", err.message);
                reject(err);
              } else {
                console.log("Database initialized successfully");
                resolve();
              }
            }
          );
        }
      );
    });
  });
}

// Database operations
function saveToDatabase(key, value) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO content (key, value) VALUES (?, ?) 
                  ON CONFLICT(key) DO UPDATE SET value = excluded.value`;
    db.run(query, [key, value], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function fetchFromDatabase(key) {
  return new Promise((resolve, reject) => {
    const query = `SELECT value FROM content WHERE key = ?`;
    db.get(query, [key], (err, row) => {
      if (err) reject(err);
      else resolve(row ? row.value : null);
    });
  });
}

// Check if title exists
async function checkTitleExists(title) {
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) as count FROM documents WHERE title = ?`;
    db.get(query, [title], (err, row) => {
      if (err) reject(err);
      else resolve(row.count > 0);
    });
  });
}

// Enhanced document creation with validation
async function createDocument(title, content) {
  if (!title?.trim() || !content?.trim()) {
    throw new Error("Title and content are required");
  }

  const titleExists = await checkTitleExists(title);
  if (titleExists) {
    throw new Error("A document with this title already exists");
  }

  return new Promise((resolve, reject) => {
    const query = `INSERT INTO documents (
      title, 
      content, 
      preview_html,
      created_at, 
      updated_at
    ) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

    // Store both content and its preview
    const previewHtml = generatePreview(content);

    db.run(query, [title, content, previewHtml], function (err) {
      if (err) reject(err);
      else
        resolve({
          id: this.lastID,
          title,
          content,
          preview_html: previewHtml,
          created_at: new Date().toISOString(),
        });
    });
  });
}

// Helper function to generate preview HTML
function generatePreview(content) {
  return `<div class="preview">${content}</div>`;
}

function getDocument(id) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM documents WHERE id = ?`;
    db.get(query, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row === undefined ? null : row);
    });
  });
}

async function updateDocument(id, title, content) {
  // Validation: required fields
  if (!title?.trim() || !content?.trim()) {
    throw new Error("Title and content are required");
  }
  // Validation: type and length (example: title max 255 chars)
  if (typeof title !== "string" || typeof content !== "string") {
    throw new Error("Title and content must be strings");
  }
  if (title.length > 255) {
    throw new Error("Title must be 255 characters or less");
  }
  // Validation: unique title (if changing title)
  const existing = await new Promise((resolve, reject) => {
    db.get("SELECT id FROM documents WHERE title = ?", [title], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
  if (existing && existing.id !== id) {
    throw new Error("A document with this title already exists");
  }
  return new Promise((resolve, reject) => {
    const query = `UPDATE documents SET title = ?, content = ?, 
                  updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    db.run(query, [title, content, id], (err) => {
      if (err) reject(err);
      else resolve({ id, title, content });
    });
  });
}

function deleteDocument(id) {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM documents WHERE id = ?`;
    db.run(query, [id], (err) => {
      if (err) reject(err);
      else resolve({ id });
    });
  });
}

function listDocuments() {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM documents ORDER BY updated_at DESC`;
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Add a function to (re-)initialize the schema for testing
function initializeSchema() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS content (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE,
          value TEXT
        )`,
        (err) => {
          if (err) return reject(err);
          db.run(
            `CREATE TABLE IF NOT EXISTS documents (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL UNIQUE CHECK(length(title) <= 255),
              content TEXT NOT NULL,
              preview_html TEXT,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            (err2) => {
              if (err2) return reject(err2);
              resolve();
            }
          );
        }
      );
    });
  });
}

async function closeDatabase() {
  if (db) {
    await new Promise((resolve) => db.close(() => resolve()));
    db = null;
  }
}

// Export getDbPath for test usage
export {
  saveToDatabase,
  fetchFromDatabase,
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  listDocuments,
  initializeDatabase,
  closeDatabase,
  initializeSchema, // export for test usage
  getDbPath,
};
