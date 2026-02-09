import { expect, type Locator, type Page } from "@playwright/test";
import { createLoginLocators } from "./login.locators";

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    const locators = createLoginLocators(page);
    this.usernameInput = locators.usernameInput;
    this.passwordInput = locators.passwordInput;
    this.signInButton = locators.signInButton;
  }

  async goto() {
    await this.page.goto("/");
  }

  async expectLoaded() {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
    await expect(this.signInButton).toBeEnabled();
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
