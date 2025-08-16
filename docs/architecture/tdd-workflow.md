# TDD Workflow for Launchpad Lunes

## Smart Contracts (ink!)

1. Write test first in `smart-contracts/[contract-name]/tests/`
2. Run test (will fail): `cargo test`
3. Implement contract functionality
4. Run test again until it passes
5. Refactor code as needed
6. Measure coverage: `cargo tarpaulin`

## Backend API

1. Write test first in `backend/tests/unit/` or `backend/tests/integration/`
2. Run test (will fail): `pytest tests/unit/test_file.py -v`
3. Implement API functionality
4. Run test again until it passes
5. Refactor code as needed
6. Measure coverage: `pytest --cov=app tests/`

## Frontend

1. Write test first in `frontend/src/components/__tests__/`
2. Run test (will fail): `npm test`
3. Implement component functionality
4. Run test again until it passes
5. Refactor code as needed
6. Measure coverage: `npm test -- --coverage`

## Integration Tests

After unit tests pass for individual components:

1. Write integration tests in `backend/tests/integration/`
2. Run integration tests: `pytest tests/integration/`
3. Fix any integration issues
4. Run E2E tests: `pytest tests/e2e/`