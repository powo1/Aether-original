# Contributing to AetherPress

Thank you for your interest in contributing to AetherPress! This document outlines the standards and practices for testing, module systems, and code organization across the project.

## Unified Testing & Module System Policy

### Unified Testing Experience

- **Client-side (frontend) tests:**

  - All tests for React components and frontend logic are written and run using **Jest**.
  - This provides seamless integration with React, excellent mocking utilities, and a familiar ecosystem for UI development.

- **Server-side (backend) tests:**

  - All tests for backend logic, APIs, and database operations are written and run using **Vitest**.
  - Vitest offers fast execution, modern syntax, and is optimized for Node.js/TypeScript workflows.

- **Separation of Concerns:**
  - Client and server tests are kept in their respective directories (`frontend/` and `backend/`).
  - Each uses the best-in-class tooling for its environment, ensuring reliability and speed.

### Module System

- **ES Modules (ESM) Standardization:**

  - All code (frontend and backend) uses ES Modules (`import`/`export` syntax).
  - Benefits:
    - Native `async/await` support without transpilation.
    - Improved tree-shaking and build optimization.
    - Consistent, future-proof codebase aligned with modern JavaScript standards.
    - Simplifies sharing code and utilities between client and server.

- **Consistent Import/Export:**
  - No mixing of CommonJS (`require`, `module.exports`) and ESM.
  - All packages, scripts, and tests use ESM for maximum compatibility and maintainability.

## Code Organization

- Keep client and server code in their respective folders.
- Place tests alongside the code they test, or in a `__tests__` subfolder.
- Use clear, descriptive names for files and functions.

## Pull Requests

- Ensure all new code is covered by appropriate tests.
- Run all tests locally before submitting a PR.
- Follow the ESM import/export standard throughout.

---

Thank you for helping keep AetherPress modern, reliable, and maintainable!
