# Playwright API Automation Tests

API test automation project built with **Playwright** and **JavaScript**, practicing against the free public API [reqres.in](https://reqres.in).

## What is covered

- **CRUD requests:** GET, POST, PUT and DELETE
- **Status code validation:** single and multiple allowed codes
- **Response body validation:** field values, data types, arrays and objects
- **Header validation:** content type
- **Response time and response size checks**
- **Negative tests:** 404 not found and 400 bad request
- **API key header** sent with a request
- **Assertion types:** equality, comparisons, `not`, `toMatchObject`, soft assertions

## Project structure

```
tests/
  users-api.spec.js              # CRUD, negative, header, size and auth tests
  users-api-validations.spec.js  # Different assertion types in one place
playwright.config.js             # Base URL and report settings
```

## How to run

1. Install Node.js
2. Install dependencies:
   ```
   npm install
   ```
3. Run all tests:
   ```
   npx playwright test
   ```
4. Open the HTML report:
   ```
   npx playwright show-report
   ```

## Notes

- The practice API is rate limited, so running the full suite many times in a row can return 429 errors. Wait a few minutes and run again.
- The API key in the tests is a public practice key.

## Planned next

- Login and token chaining
- Schema validation
- GitHub Actions pipeline