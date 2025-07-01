// backend/seedDatabase.js
import {
  initializeDatabase,
  createDocument,
  closeDatabase,
} from "./assemblyModule.js";

const sampleDocs = [
  {
    title: "Welcome to AetherPress",
    content: "This is your first document. Edit or delete it to get started!",
  },
  {
    title: "Sample Guide",
    content: "This is a sample guide document for demonstration purposes.",
  },
  {
    title: "About",
    content: "AetherPress is a modern publishing platform.",
  },
];

async function seed() {
  try {
    await initializeDatabase();
    for (const doc of sampleDocs) {
      try {
        await createDocument(doc.title, doc.content);
        console.log(`Seeded: ${doc.title}`);
      } catch (e) {
        if (e.message.includes("already exists")) {
          console.log(`Skipped (already exists): ${doc.title}`);
        } else {
          console.error(`Error seeding ${doc.title}:`, e.message);
        }
      }
    }
  } finally {
    await closeDatabase();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed().then(() => {
    console.log("Seeding complete.");
    process.exit(0);
  });
}

export { seed };
