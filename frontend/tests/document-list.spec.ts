// tests/document-list.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Document Manager UI", () => {
  test("should display saved documents list and allow creating a new document", async ({
    page,
  }) => {
    await page.goto("/");

    // Check for the Saved Documents section
    await expect(page.getByText("Saved Documents")).toBeVisible();

    // Create a new document
    await page.getByPlaceholder("Document title").fill("Playwright Test Doc");
    await page.getByRole("button", { name: /save document/i }).click();

    // Wait for success message
    await expect(page.getByText("Document saved successfully!")).toBeVisible();

    // The new document should appear in the list
    await expect(page.getByText("Playwright Test Doc")).toBeVisible();
  });
});
