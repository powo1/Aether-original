import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load HTML template
const templatePath = path.resolve(__dirname, "../shared/template.html");
const template = readFileSync(templatePath, "utf-8");

function generateLayout(content, images) {
  // Replace placeholders in the template with dynamic content
  return template.replace("{{content}}", content).replace("{{images}}", images);
}

export { generateLayout };
