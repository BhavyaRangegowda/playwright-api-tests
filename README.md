# Playwright API Automation Tests

API test automation project built with **Playwright** and **JavaScript**, practicing against the free public API [reqres.in](https://reqres.in).

## What is covered

- **CRUD requests:** GET, POST, PUT and DELETE
- **Status code validation:** single and multiple allowed codes
- **Response body validation:** field values, data types, arrays and objects
- **Header validation:** content type
- **Response time and response size checks**
- **Negative tests:** 404 not found and 400 bad request
- **Login and token chaining:** log in, read the token from the response, then use it in the next request
- **API key handling:** the key is loaded from a private `.env` file and sent with every request
- **Assertion types:** equality, comparisons, `not`, `toMatchObject`, soft assertions

## Project structure

```
tests/
  users-api.spec.js              # CRUD, negative, header, size and API key tests
  users-api-validations.spec.js  # Different assertion types in one place
  auth-token.spec.js             # Login and token chaining tests
playwright.config.js             # Base URL, API key header and report settings
```

## How to run

1. Install Node.js
2. Install dependencies:
   ```
   npm install
   ```
3. Get a free API key from [app.reqres.in/api-keys](https://app.reqres.in/api-keys)
4. Create a file named `.env` in the main folder with this line (use your own key):
   ```
   REQRES_API_KEY=your_key_here
   ```
5. Run all tests:
   ```
   npx playwright test
   ```
6. Open the HTML report:
   ```
   npx playwright show-report
   ```

## Notes

- The `.env` file holds a private key and is excluded from Git, so it is never uploaded.
- The practice API is rate limited, so running the full suite many times in a row can return 429 errors. Wait a few minutes and run again.

## Planned next

- Schema validation
- GitHub Actions pipeline