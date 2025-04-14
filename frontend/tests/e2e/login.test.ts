import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("logged in user stays on editor page when going to the login page after closing the window", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.waitForURL("/login");
    await page.fill('input[name="username"]', "dev1");
    await page.fill('input[name="password"]', "developer@123influx");
    await page.click('button[type="submit"]');
    await page.waitForURL("/editor");
    await page.reload();
    await page.waitForURL("/editor");
    await expect(page.getByText("Visual Flux")).toBeVisible();
    await page.reload();
    await page.waitForURL("/editor");
    await expect(page.getByText("Visual Flux")).toBeVisible();
  });

  test("logged in user gets redirected to editor page when going to the login page", async ({
    page,
  }) => {
    await page.fill('input[name="username"]', "dev1");
    await page.fill('input[name="password"]', "developer@123influx");
    await page.click('button[type="submit"]');
    await page.waitForURL("/editor");

    await page.goto("/login");
    await page.waitForURL("/editor");
    await expect(page.getByText("Visual Flux")).toBeVisible();
  });

  test("successful login redirects to editor page", async ({ page }) => {
    await page.fill('input[name="username"]', "dev1");
    await page.fill('input[name="password"]', "developer@123influx");
    await page.click('button[type="submit"]');

    // Wait for navigation or potential error messages
    const result = await Promise.race([
      page.waitForURL("/editor", { timeout: 5000 }).then(() => "editor"),
      page
        .waitForSelector('li[role="status"][data-type="error"]', {
          timeout: 5000,
        })
        .then(() => "error"),
      page.waitForTimeout(5000).then(() => "timeout"),
    ]);

    console.log("Race result:", result);
    console.log("Current URL:", page.url());

    if (result === "editor") {
      await expect(page).toHaveURL("/editor");
      await expect(page.getByText("Visual Flux")).toBeVisible();
    } else {
      const errorToasts = await page
        .locator('li[role="status"][data-type="error"]')
        .all();
      for (const toast of errorToasts) {
        console.log("Error message:", await toast.textContent());
      }

      console.log("Page content:", await page.content());
      await page.screenshot({ path: "login-failure.png" });
      throw new Error(`Login failed: ${result}`);
    }
  });

  test("failed login shows error message", async ({ page }) => {
    await page.fill('input[name="username"]', "wronguser");
    await page.fill('input[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Wait for at least one error toast to appear
    await page.waitForSelector('li[role="status"][data-type="error"]');

    // Get all error toasts
    const errorToasts = await page
      .locator('li[role="status"][data-type="error"]')
      .all();

    // Ensure at least one error toast is present
    expect(errorToasts.length).toBeGreaterThan(0);

    // Check if any of the error toasts contain the expected message
    let hasExpectedError = false;
    for (const toast of errorToasts) {
      const toastContent = await toast.locator("[data-title]").textContent();
      if (toastContent === "Invalid username or password") {
        hasExpectedError = true;
        break;
      }
    }
    expect(hasExpectedError).toBe(true);

    await expect(page).toHaveURL("/login");
  });

  test("empty form submission shows validation errors", async ({ page }) => {
    await page.click('button[type="submit"]');

    await expect(page.getByText("Username is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
  });
});
