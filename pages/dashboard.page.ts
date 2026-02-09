import { expect, type Locator, type Page } from "@playwright/test";
import { createDashboardLocators } from "./dashboard.locators";

export class DashboardPage {
  readonly page: Page;
  readonly dashboardNavbarTitle: Locator;
  readonly totalPatientCard: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    const locators = createDashboardLocators(page);
    this.dashboardNavbarTitle = locators.dashboardNavbarTitle;
    this.totalPatientCard = locators.totalPatientCard;
    this.logoutButton = locators.logoutButton;
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/admin\/dashboard/i);
    await expect(this.dashboardNavbarTitle).toContainText("Dashboard");
    await expect(this.totalPatientCard).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }

  async logout() {
    await Promise.all([
      this.page.waitForURL(/\/login/i),
      this.logoutButton.click(),
    ]);
  }
}
