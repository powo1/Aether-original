import { promisify } from "util";
import { pipeline } from "stream";
const pipelineAsync = promisify(pipeline);
import pdfkit from "pdfkit";
import { generateText } from "../shared/aiService.js";

// ...existing code...
