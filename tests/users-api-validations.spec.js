// Import the Playwright test tools
const { test, expect } = require('@playwright/test');

// This file shows many different kinds of assertions.
// It sends only ONE request and reuses the result, which also avoids rate limit (429) errors.
test.describe('Users API validations', () => {
  let response; // the raw response from the server
  let body;     // the response body converted to a JavaScript object
  let rawBody;  // the response body as raw bytes (used for the size check)

  // beforeAll runs once before all tests in this group.
  // The Postman equivalent is the setup you do before running a collection.
  test.beforeAll(async ({ playwright }) => {
    // "request" is not available inside beforeAll, so we create our own API client
    const apiContext = await playwright.request.newContext({
      baseURL: 'https://reqres.in',
      extraHTTPHeaders: { 'x-api-key': 'reqres-free-v1' },
    });

    response = await apiContext.get('/api/users?page=2');
    rawBody = await response.body();
    body = JSON.parse(rawBody.toString());

    // Close the client when finished
    await apiContext.dispose();
  });

  // ---------- 1. STATUS CODE: allow several values ----------
  test('status code is one of the allowed values', async () => {
    // Passes if the status is 200 OR 201
    expect([200, 201]).toContain(response.status());
    // ok() is true for any status from 200 to 299
    expect(response.ok()).toBeTruthy();
  });

  // ---------- 2. COMPARISONS: equal, lower, higher ----------
  test('comparison assertions on size and numbers', async () => {
    const size = rawBody.length; // response size in bytes

    expect(size).toBeGreaterThan(0);          // higher than
    expect(size).toBeGreaterThanOrEqual(1);   // higher than or equal
    expect(size).toBeLessThan(10000);         // lower than
    expect(size).toBeLessThanOrEqual(10000);  // lower than or equal
    expect(body.page).toBe(2);                // exactly equal
    expect(body.page).not.toBe(1);            // NOT equal
  });

  // ---------- 3. DATA TYPES ----------
  test('fields have the correct data types', async () => {
    const firstUser = body.data[0];

    expect(typeof firstUser.id).toBe('number');         // id is a number
    expect(Number.isInteger(firstUser.id)).toBe(true);  // id is a whole number
    expect(typeof firstUser.email).toBe('string');      // email is text
    expect(Array.isArray(body.data)).toBe(true);        // data is a list
  });

  // ---------- 4. ARRAYS AND OBJECTS ----------
  test('array and object assertions', async () => {
    // The list length should match the per_page value the server reports
    expect(body.data).toHaveLength(body.per_page);

    // The first user should contain at least these fields with these types
    expect(body.data[0]).toMatchObject({
      id: expect.any(Number),
      email: expect.any(String),
      first_name: expect.any(String),
    });

    // The list should contain a user object with an email field
    expect(body.data).toContainEqual(
      expect.objectContaining({ email: expect.any(String) })
    );

    // Loop through EVERY user and check each one
    for (const user of body.data) {
      expect(user.email).toContain('@');
      expect(user.id).toBeGreaterThan(0);
    }
  });

  // ---------- 5. NEGATIVE ASSERTIONS ----------
  test('negative assertions using not', async () => {
    expect(body.error).toBeUndefined();        // there should be no error field
    expect(body.data).not.toHaveLength(0);     // the list should not be empty
    expect(response.status()).not.toBe(500);   // no server error
  });

  // ---------- 6. SOFT ASSERTIONS ----------
  test('soft assertions keep going after a failure', async () => {
    // A normal expect stops the test at the first failure.
    // expect.soft records the failure but continues, so you see ALL problems at once.
    expect.soft(response.status()).toBe(200);
    expect.soft(body.page).toBe(2);
    expect.soft(body.per_page).toBeGreaterThan(0);
  });
});