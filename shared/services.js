import { promisify } from "util";
import { pipeline } from "stream";
const pipelineAsync = promisify(pipeline);
import pdfkit from "pdfkit";

// Simulate AI content generation
async function generateAIContent(prompt) {
  // For the prototype, return a hardcoded response
  return `Generated content for prompt: ${prompt}`;
}

// Generate a PDF from content
async function generatePDF(content) {
  const doc = new pdfkit();
  const chunks = [];
  const resultStream = new stream.PassThrough();

  doc.pipe(resultStream);
  doc.text(content);
  doc.end();

  await pipelineAsync(resultStream, {
    write(chunk) {
      chunks.push(chunk);
    },
  });

  return Buffer.concat(chunks);
}

export { generateAIContent, generatePDF };
