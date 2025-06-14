import { generateText } from "../shared/aiService.js";

async function handleContent(prompt) {
  return await generateText(prompt);
}

export { handleContent };
