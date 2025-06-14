# Changelog

## [0.2.0] - 2025-05-04

### Added

- Document Management Feature
  - Save generated content as documents with titles
  - List saved documents
  - Load saved documents back into editor
  - Delete saved documents
  - Input validation and error handling
  - Success/error feedback messages
  - Unique title validation
  - Preview HTML storage
  - Proper timestamps
- Two-panel UI layout
  - Left panel: Content generation and preview
  - Right panel: Document management
- Enhanced styling with modern UI components

### Fixed

- Updated image placeholder service to use placehold.co
- Automatic preview generation after content submission
- CORS and WebSocket configuration for development

### Remaining Tasks

1. Document Loading Enhancements:

   - Preview restoration when loading documents
   - Maintain document metadata across loads
   - Add document version tracking

2. PDF Template System:

   - Multiple template options
   - Custom styling controls
   - Header/footer customization
   - Template switching UI

3. Content Preview Features:

   - Side-by-side edit/preview
   - Live preview updates
   - Template previews

4. User Experience Improvements:

   - Undo/redo functionality
   - Progress indicators
   - Batch operations for documents

5. Extended AI Integration:
   - Multiple prompt templates
   - Content refinement options
   - Style variations

## [0.1.0] - 2025-05-04

### Base Foundation

- Express backend (port 3000)
- React frontend (port 5173)
- Features:
  - PDF generation using pdf-lib
  - SQLite database integration
  - CORS and proxy configuration
- Development Environment:
  - Hot reload enabled
  - Concurrent server execution
  - ESLint configuration
