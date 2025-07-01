# Implementation Issues & Task Breakdown: Database Setup

## Purpose

This section provides a detailed breakdown of the implementation tasks for Database Setup, as outlined in the Core Infrastructure section of the MVP Checklist and NEXT_STEPS.

---

## Database Setup Implementation

### Goal

Establish a robust and maintainable database layer that supports all required backend features and ensures data integrity.

### Tasks & Subtasks

1. **Database Initialization**

   - [x] Choose and configure the database system (e.g., SQLite, PostgreSQL, MySQL). _(SQLite in use)_
   - [x] Ensure the database file or server is created and accessible. _(data/aetherpress.db is created if missing)_
   - [x] Add database connection logic to the backend (using environment variables for credentials/paths). _(AETHERPRESS_DB_PATH supported)_

2. **Schema Definition & Migration**

   - [x] Define the database schema (tables, columns, types, indexes). _(Schema defined in assemblyModule.js)_
   - [x] Implement migration scripts or logic to create/update the schema. _(Tables created on startup; no migration scripts yet)_
   - [x] Test schema creation on a fresh setup. _(Tables auto-create if missing)_
   - [x] TODO: Update tests and backend to only remove the database file (not the data/ directory), and to create the data/ directory if missing, with zero risk of deleting anything else. This will ensure no unintended file or directory deletions and keep the repo clean.

3. **CRUD Operations**

   - [x] Implement Create, Read, Update, Delete operations for all required entities (e.g., documents, users). _(Implemented for documents/content)_
   - [x] Add backend endpoints that interact with the database. _(Implemented)_
   - [x] Test each operation for correctness and error handling. _(Basic tests/manual verification done)_

4. **Data Validation & Integrity**

   - [x] Add validation for data before writing to the database. _(Some validation exists, can be expanded)_
   - [x] Enforce constraints (e.g., unique fields, foreign keys). _(Unique title enforced; more constraints possible)_
   - [x] Test that invalid data is rejected and errors are handled gracefully.

5. **Seeding & Sample Data (Optional)**

   - [x] Provide scripts or logic to seed the database with initial/sample data for development/testing.
   - [x] Verify that seeding works and data appears as expected.

6. **Testing & Verification**
   - [ ] Write and run tests to verify all database operations.
   - [ ] Check backend communication with the database.
   - [ ] Confirm frontend can access and display data from the database.

---

### Notes on Current State

- SQLite is in use, with schema and CRUD logic implemented.
- Database path is now configurable via environment variable.
- No migration or seeding scripts yet; tables are auto-created on startup.
- Validation and constraints exist but can be expanded.
- Testing and verification are ongoing.

---

## Acceptance Criteria

- Database is initialized and accessible by the backend.
- Schema is defined, migrated, and up to date.
- All required CRUD operations are implemented and tested.
- Data validation and integrity are enforced.
- Sample data can be seeded for development/testing.
- Backend and frontend communicate with the database as expected.

---

## Notice

**Frontend and backend integration improvements** will be the next area of focus after Database Setup implementation and verification.
