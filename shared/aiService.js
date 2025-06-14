// AI Service Abstraction Layer

// Simulate text generation
async function generateText(prompt) {
  // Mock implementation: return a hardcoded response
  return `Generated text for prompt: ${prompt}`;
}

// Simulate image generation
async function generateImage(query) {
  // Mock implementation: return a placeholder image URL
  return `https://via.placeholder.com/150?text=${encodeURIComponent(query)}`;
}

export { generateText, generateImage };
