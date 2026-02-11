import { expect, type Locator, type Page } from "@playwright/test";
import { createDashboardLocators } from "./dashboard.locators";

export class DashboardPage {
  readonly page: Page;
  readonly dashboardNavbarTitle: Locator;
  readonly totalPatientCard: Locator;
  readonly logoutButton: Locator;
  readonly roleSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    const locators = createDashboardLocators(page);
    this.dashboardNavbarTitle = locators.dashboardNavbarTitle;
    this.totalPatientCard = locators.totalPatientCard;
    this.logoutButton = locators.logoutButton;
    this.roleSelect = locators.roleSelect;
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

  async hasRoleOption(roleId: string) {
    return (await this.roleSelect.locator(`option[value="${roleId}"]`).count()) > 0;
  }

  async ensureRoleSelected(roleId: string) {
    await expect(this.roleSelect).toBeVisible();
    const roleAvailable = await this.hasRoleOption(roleId);
    if (!roleAvailable) return false;

    if ((await this.roleSelect.inputValue()) !== roleId) {
      await this.roleSelect.selectOption(roleId);
      await this.page.waitForLoadState("networkidle");
    }

    await expect(this.page).not.toHaveURL(/\/login/i);
    await expect(this.logoutButton).toBeVisible();
    await expect(this.roleSelect).toHaveValue(roleId);
    return true;
  }
}
