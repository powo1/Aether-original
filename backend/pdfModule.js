import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

async function exportToPDF(content) {
  try {
    // Create a new PDF document
    const doc = await PDFDocument.create();

    // Add a page to the document
    const page = doc.addPage();

    // Embed the Times Roman font
    const font = await doc.embedFont(StandardFonts.TimesRoman);

    // Get the page dimensions
    const { width, height } = page.getSize();

    // Draw the content on the page
    page.drawText(content, {
      x: 50,
      y: height - 50,
      size: 12,
      font,
      color: rgb(0, 0, 0),
      maxWidth: width - 100,
      lineHeight: 16,
    });

    // Serialize the PDF to bytes
    const pdfBytes = await doc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error("Error during PDF generation:", error);
    throw error;
  }
}

export { exportToPDF };
