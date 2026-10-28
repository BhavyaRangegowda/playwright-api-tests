// Import the Playwright test tools:
// "test" defines a test case, "expect" checks results (assertions)
const { test, expect } = require('@playwright/test');

// Group all user-related tests together under one name in the report
test.describe('Users API', () => {

  // ---------- GET: read data ----------
  test('GET list of users returns 200 and correct page', async ({ request }) => {
    // "request" is Playwright's built-in API client.
    // The base URL and the API key header both come from playwright.config.js
    const response = await request.get('/api/users?page=2');

    // Check the HTTP status code is 200 (OK)
    expect(response.status()).toBe(200);

    // Convert the response body from JSON text into a JavaScript object
    const body = await response.json();

    // Check the "page" field in the response equals 2
    expect(body.page).toBe(2);
    // Check the "data" list is not empty
    expect(body.data.length).toBeGreaterThan(0);
  });

  // ---------- POST: create data ----------
  test('POST create user returns 201 with name and job', async ({ request }) => {
    // "data" is the JSON body we send to the server
    const response = await request.post('/api/users', {
      data: {
        name: 'Star',
        job: 'QA Engineer',
      },
    });

    // 201 means "Created"
    expect(response.status()).toBe(201);

    const body = await response.json();
    // The server should echo back what we sent
    expect(body.name).toBe('Star');
    expect(body.job).toBe('QA Engineer');
    // The server should generate an id for the new user
    expect(body.id).toBeDefined();
  });

  // ---------- PUT: update data ----------
  test('PUT update user returns 200 with updated job', async ({ request }) => {
    // Update user number 2 with a new job title
    const response = await request.put('/api/users/2', {
      data: {
        name: 'Star',
        job: 'Senior QA Engineer',
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    // The response should show the new job
    expect(body.job).toBe('Senior QA Engineer');
    // The server adds a timestamp showing when it was updated
    expect(body.updatedAt).toBeDefined();
  });

  // ---------- DELETE: remove data ----------
  test('DELETE user returns 204', async ({ request }) => {
    const response = await request.delete('/api/users/2');

    // 204 means "No Content": deleted successfully, nothing to return
    expect(response.status()).toBe(204);
  });

  // ---------- NEGATIVE TESTS: check that errors are handled ----------
  test('GET single user that does not exist returns 404', async ({ request }) => {
    // User 9999 does not exist, so we expect "Not Found"
    const response = await request.get('/api/users/9999');

    expect(response.status()).toBe(404);
  });

  test('POST login without password returns 400 with error message', async ({ request }) => {
    // We deliberately leave out the password to trigger an error
    const response = await request.post('/api/login', {
      data: {
        email: 'peter@klaven',
      },
    });

    // 400 means "Bad Request": the server rejected our incomplete data
    expect(response.status()).toBe(400);

    const body = await response.json();
    // The server should tell us exactly what was missing
    expect(body.error).toBe('Missing password');
  });

  // ---------- HEADER AND RESPONSE TIME CHECKS ----------
  test('GET users returns JSON content type and responds within 3 seconds', async ({ request }) => {
    // Record the time before sending the request (in milliseconds)
    const startTime = Date.now();

    const response = await request.get('/api/users?page=2');

    // Work out how long the request took
    const responseTime = Date.now() - startTime;

    // Headers are the extra info sent with the response.
    // Check the content type says the body is JSON
    expect(response.headers()['content-type']).toContain('application/json');

    // Check the response came back in under 3000 milliseconds
    expect(responseTime).toBeLessThan(3000);
  });

  // ---------- RESPONSE SIZE CHECK ----------
  test('GET users response body is not empty and within a sensible size', async ({ request }) => {
    const response = await request.get('/api/users?page=2');

    // "body()" gives the raw response as a buffer of bytes.
    // Its length is the response size in bytes.
    const rawBody = await response.body();
    const sizeInBytes = rawBody.length;

    // The response should contain something, but not be unexpectedly huge
    expect(sizeInBytes).toBeGreaterThan(0);
    expect(sizeInBytes).toBeLessThan(10000);
  });

  // ---------- API KEY CHECK ----------
  test('GET users with the API key from the config returns 200', async ({ request }) => {
    // No header is written here: playwright.config.js adds the
    // x-api-key header (read from your private .env file) to every request.
    const response = await request.get('/api/users?page=2');

    // With a valid key, we expect a successful response
    expect(response.status()).toBe(200);
  });
});