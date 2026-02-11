import { DashboardPage } from "../pages/dashboard.page";
import { expect, test } from "./fixtures/auth.fixture";

const adminUsername = process.env.ADMIN_USERNAME ?? process.env.LOGIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD ?? process.env.LOGIN_PASSWORD;

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
});

test.describe("authentication", () => {
  test.describe.configure({ mode: "serial" });

  test("login form can be filled and submitted", async ({ loginPage, page }) => {
    test.skip(
      !adminUsername || !adminPassword,
      "ADMIN_USERNAME/LOGIN_USERNAME and ADMIN_PASSWORD/LOGIN_PASSWORD are required for dashboard login verification.",
    );

    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.expectLoaded();

    await loginPage.login(adminUsername ?? "e2e.invalid.user", adminPassword ?? "invalid-password");

    await dashboardPage.expectLoaded();
  });

  test("logout redirects to login page", async ({ dashboardPage, loginPage }) => {
    await dashboardPage.expectLoaded();
    await dashboardPage.logout();
    await loginPage.expectLoaded();
  });

  test("doctor can login", async ({ doctorSession }) => {
    test.skip(
      !doctorSession.isAuthenticated,
      "Doctor session is not available. Configure DOCTOR_* creds or ensure admin account has DOCTOR (role_id=2).",
    );
    await expect(doctorSession.dashboardPage.page).not.toHaveURL(/\/login/i);
    await expect(doctorSession.dashboardPage.logoutButton).toBeVisible();
    await expect(doctorSession.dashboardPage.roleSelect).toHaveValue("2");
  });

  test("staff can login", async ({ staffSession }) => {
    test.skip(
      !staffSession.isAuthenticated,
      "Staff session is not available. Configure STAFF_* creds or ensure admin account has STAFF (role_id=3).",
    );
    await expect(staffSession.dashboardPage.page).not.toHaveURL(/\/login/i);
    await expect(staffSession.dashboardPage.logoutButton).toBeVisible();
    await expect(staffSession.dashboardPage.roleSelect).toHaveValue("3");
  });
});
