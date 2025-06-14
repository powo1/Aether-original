import { generateText, generateImage } from "../shared/aiService.js";

// Image Module
async function handleImageGeneration(query) {
  // Mock implementation: return a placeholder image URL
  // Using placehold.co which is more reliable than placeholder.com
  return `https://placehold.co/150x150/FFFFFF/000000/png?text=${encodeURIComponent(
    query
  )}`;
}

export { handleImageGeneration };
