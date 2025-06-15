# Known Issues and Potential Solutions

## SQLite Native Bindings Issue

Error: Could not locate the bindings file for SQLite3 native module.

### Potential Solutions

1. **Development Environment Setup**

   - Add build essentials to devcontainer:
     ```bash
     build-essential python3 make gcc g++ sqlite3 libsqlite3-dev
     ```
   - Add to updateContentCommand in devcontainer.json

2. **Package Management Solutions**

   - Switch to prebuild version: `"sqlite3": "^5.1.7-napi"`
   - Consider using `better-sqlite3` instead

3. **Architectural Solutions**
   - Switch to PostgreSQL (ports already configured)
   - Use pure JS implementations like LowDB
   - Use SQLite with pure JS implementation

## Frontend-Backend Communication Issues

Error: Proxy error ECONNREFUSED when frontend tries to connect to backend

### Potential Solutions

1. **Resilience**

   - Implement retry mechanism in frontend
   - Add service health checks

2. **Initialization**
   - Improve service startup sequence
   - Ensure backend is running before frontend starts

## Previous Working State

- Note: System was previously functional
- Investigation needed: What changed between working and current state
- Quick recovery might be possible by reviewing recent changes

## Priority

Solutions should be evaluated based on:

1. Speed of implementation
2. Minimal changes to existing architecture
3. Long-term maintainability
