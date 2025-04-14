import { test, expect } from "@playwright/test";

test.describe("Code Generation Test", () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[name="username"]', "dev1");
    await page.fill('input[name="password"]', "developer@123influx");
    await page.click('button[type="submit"]');

    // Wait for redirection to the editor page
    await page.waitForURL("/editor");
    await expect(page.getByText("Visual Flux")).toBeVisible();
  });

  test("generates correct Flux query code", async ({ page }) => {
    // Select home for bucket
    await page.getByText("Select a bucket").click();
    await page.getByText("home").click();

    // Drag date range from sidebar to flow
    await page
      .getByRole("button", { name: "filter date range" })
      .dragTo(page.locator(".react-flow__pane"));

    await page.getByRole("button", { name: "Align" }).click();
    // Link bucket and date range
    await page
      .locator('button:has-text("bucket") .react-flow__handle-bottom')
      .first()
      .dragTo(
        page.locator('button:has-text("date range") .react-flow__handle-top'),
      );

    await page.getByRole("button", { name: "Align" }).click();

    // Select date from 2022-01-01 to 2022-01-08
    await page
      .locator('button:has-text("date range")')
      ?.filter({ hasText: "Pick a date range" })
      ?.click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page.getByLabel("Go to previous month").click();
    await page
      .getByRole("gridcell", { name: "1", exact: true })
      .first()
      .click();
    await page
      .getByLabel("January")
      .getByRole("gridcell", { name: "8", exact: true })
      .click();
    // await page.getByText("Confirm").click();

    // Drag measurement from sidebar to flow
    await page
      .getByRole("button", { name: "selector measurement" })
      .dragTo(page.locator(".react-flow__pane"));

    // Link date range and measurement
    await page
      .locator('button:has-text("date range") .react-flow__handle-bottom')
      .first()
      .dragTo(
        page.locator('button:has-text("measurement") .react-flow__handle-top'),
      );

    // Select measurement
    await page.getByText("Select a measurement").click();
    await page.getByRole("option", { name: "home" }).click();

    await page.getByRole("button", { name: "Align" }).click();
    // Drag field from sidebar to flow
    await page
      .getByRole("button", { name: "selector field" })
      .dragTo(page.locator(".react-flow__pane"));

    // Link measurement and field
    await page
      .locator('button:has-text("measurement") .react-flow__handle-bottom')
      .first()
      .dragTo(page.locator('button:has-text("field") .react-flow__handle-top'));

    // Select field
    await page.getByText("Select a field").click();
    await page.getByRole("option", { name: "co" }).click();

    // Drag value threshold from sidebar to flow
    await page
      .getByRole("button", { name: "filter value threshold" })
      .dragTo(page.locator(".react-flow__pane"));

    await page.getByRole("button", { name: "Align" }).click();

    // Link field and value threshold
    await page
      .locator(".react-flow__handle-bottom")
      .nth(3)
      .dragTo(page.locator(".react-flow__handle-top").nth(3));

    await page.getByRole("button", { name: "Align" }).click();
    // Select value threshold
    await page
      .getByRole("button", { name: "Pick a threshold" })
      .first()
      .click();
    await page.getByRole("spinbutton").fill("1");
    await page.getByRole("combobox").click();
    await page.getByText("Greater than").click();

    // Drag another value threshold to flow
    await page
      .getByRole("button", { name: "filter value threshold" })
      .dragTo(page.locator(".react-flow__pane"));

    await page.getByRole("button", { name: "Align" }).click();

    // Link value threshold and value threshold
    await page
      .locator(".react-flow__handle-bottom")
      .nth(4)
      .dragTo(page.locator(".react-flow__handle-top").nth(4));

    await page
      .getByRole("button", { name: "Pick a threshold" })
      .first()
      .click();
    await page.getByRole("spinbutton").fill("5");
    await page.getByRole("combobox").click();
    await page.getByText("Smaller than").click();

    // Wait for code generation to complete
    await page.waitForSelector(".monaco-editor", { state: "attached" });

    // Get generated Flux code
    const generatedCode = await page.evaluate(() => {
      const editorElement = document.querySelector(
        ".monaco-editor .view-lines",
      );
      return editorElement ? editorElement.textContent : "";
    });

    const cleanedCode = generatedCode?.replace(/\s+/g, "") ?? "";
    console.log("Cleaned code:", cleanedCode);
    console.log("Cleaned code length:", cleanedCode.length);

    // Verify generated code
    expect(cleanedCode).toContain('from(bucket:"home")');
    expect(cleanedCode).toContain(
      "range(start:2021-12-01T00:00:00Z,stop:2022-01-08T00:00:00Z)",
    );
    expect(cleanedCode).toContain('filter(fn:(r)=>(r._measurement=="home"');
    expect(cleanedCode).toContain('r._field=="co"');
    expect(cleanedCode).toContain("r._value>1");
    expect(cleanedCode).toContain("r._value<5");
  });
});
