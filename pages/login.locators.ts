import type { Locator, Page } from "@playwright/test";

export type LoginLocators = {
  usernameInput: Locator;
  passwordInput: Locator;
  signInButton: Locator;
};

export function createLoginLocators(page: Page): LoginLocators {
  return {
    usernameInput: page.locator('input[name="username"]'),
    passwordInput: page.locator('input[name="password"]'),
    signInButton: page.getByRole("button", { name: /sign in/i }),
  };
}
