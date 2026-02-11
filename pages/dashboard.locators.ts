import type { Locator, Page } from "@playwright/test";

export type DashboardLocators = {
  dashboardNavbarTitle: Locator;
  totalPatientCard: Locator;
  logoutButton: Locator;
  roleSelect: Locator;
};

export function createDashboardLocators(page: Page): DashboardLocators {
  return {
    dashboardNavbarTitle: page.locator("a.navbar-brand"),
    totalPatientCard: page.locator("#total_patient"),
    logoutButton: page.locator('a[title="Logout"]'),
    roleSelect: page.locator('select[name="role_id"]'),
  };
}
