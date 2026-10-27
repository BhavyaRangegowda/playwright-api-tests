// Import the Playwright test tools
const { test, expect } = require('@playwright/test');

// Read your private key from the .env file (loaded by playwright.config.js).
// The key itself is never written in this file, so it is safe to publish.
const apiKey = process.env.REQRES_API_KEY;

// Group the login and token tests together in the report
test.describe('Login and token chaining', () => {

  // beforeAll runs once before the tests in this group.
  // If the key is missing, stop early with a clear message instead of a confusing 401.
  test.beforeAll(() => {
    expect(apiKey, 'REQRES_API_KEY is missing. Check your .env file.').toBeTruthy();
  });

  // ---------- CHAINING: login, then reuse the token ----------
  test('login returns a token and the token is used in the next request', async ({ request }) => {

    // STEP 1: Send the login request with valid demo credentials.
    // The base URL comes from playwright.config.js
    const loginResponse = await request.post('/api/login', {
      headers: { 'x-api-key': apiKey },
      data: {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka',
      },
    });

    // A successful login should return 200
    expect(loginResponse.status()).toBe(200);

    // STEP 2: Read the token out of the response body and save it in a variable
    const loginBody = await loginResponse.json();
    const token = loginBody.token;

    // The token should exist and be a non-empty piece of text
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);

    // STEP 3: Use the saved token in the next request.
    // Real APIs expect it in the Authorization header as "Bearer <token>".
    const userResponse = await request.get('/api/users/2', {
      headers: {
        'x-api-key': apiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    // DEBUGGING: print what the server sent back, so we can read the reason for a failure.
    console.log('Status:', userResponse.status());
    console.log('Body:', await userResponse.text());

    // The request with the token should succeed
    expect(userResponse.status()).toBe(200);

    const userBody = await userResponse.json();
    // Check we got the user we asked for
    expect(userBody.data.id).toBe(2);
  });

  // ---------- NEGATIVE: login with a user that does not exist ----------
  test('login with an unknown user returns 400 and no token', async ({ request }) => {
    const response = await request.post('/api/login', {
      headers: { 'x-api-key': apiKey },
      data: {
        email: 'nobody@example.com',
        password: 'wrongpassword',
      },
    });

    // The server should reject the login
    expect(response.status()).toBe(400);

    const body = await response.json();
    // A failed login must NOT hand out a token
    expect(body.token).toBeUndefined();
    // There should be an error message explaining the problem
    expect(body.error).toBeDefined();
  });
});