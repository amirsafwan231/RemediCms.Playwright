import { expect, test } from "@playwright/test";
import { DashboardPage } from "../pages/dashboard.page";
import { LoginPage } from "../pages/login.page";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
});

test.describe("authentication", () => {
  test.describe.configure({ mode: "serial" });

  test("login form can be filled and submitted", async ({ page }) => {
    test.skip(
      !process.env.LOGIN_USERNAME || !process.env.LOGIN_PASSWORD,
      "LOGIN_USERNAME and LOGIN_PASSWORD are required for dashboard login verification.",
    );

    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.expectLoaded();

    await loginPage.login(
      process.env.LOGIN_USERNAME ?? "e2e.invalid.user",
      process.env.LOGIN_PASSWORD ?? "invalid-password",
    );

    await dashboardPage.expectLoaded();
  });

  test("logout redirects to login page", async ({ page }) => {
    test.skip(
      !process.env.LOGIN_USERNAME || !process.env.LOGIN_PASSWORD,
      "LOGIN_USERNAME and LOGIN_PASSWORD are required for logout verification.",
    );

    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.expectLoaded();

    await loginPage.login(
      process.env.LOGIN_USERNAME ?? "e2e.invalid.user",
      process.env.LOGIN_PASSWORD ?? "invalid-password",
    );

    await dashboardPage.expectLoaded();
    await dashboardPage.logout();
    await loginPage.expectLoaded();
  });
});
