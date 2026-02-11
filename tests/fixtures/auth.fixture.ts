import { expect, test as base, type Page } from "@playwright/test";
import { DashboardPage } from "../../pages/dashboard.page";
import { LoginPage } from "../../pages/login.page";

type Role = "admin" | "doctor" | "staff";

type AuthSession = {
  role: Role;
  username: string;
  isAuthenticated: boolean;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

type AuthFixtures = {
  loginPage: LoginPage;
  adminSession: AuthSession;
  doctorSession: AuthSession;
  staffSession: AuthSession;
  dashboardPage: DashboardPage;
};

function getRoleCredentials(role: Role) {
  if (role === "admin") {
    return {
      username: process.env.ADMIN_USERNAME ?? process.env.LOGIN_USERNAME,
      password: process.env.ADMIN_PASSWORD ?? process.env.LOGIN_PASSWORD,
      userKeys: "ADMIN_USERNAME/LOGIN_USERNAME",
      passKeys: "ADMIN_PASSWORD/LOGIN_PASSWORD",
    };
  }

  if (role === "doctor") {
    return {
      username: process.env.DOCTOR_USERNAME,
      password: process.env.DOCTOR_PASSWORD,
      userKeys: "DOCTOR_USERNAME",
      passKeys: "DOCTOR_PASSWORD",
    };
  }

  return {
    username: process.env.STAFF_USERNAME,
    password: process.env.STAFF_PASSWORD,
    userKeys: "STAFF_USERNAME",
    passKeys: "STAFF_PASSWORD",
  };
}

function getRequestedRoleId(role: Role) {
  if (role === "admin") return "5";
  if (role === "doctor") return "2";
  return "3";
}

async function buildAuthenticatedSession(page: Page, role: Role): Promise<AuthSession> {
  const roleCreds = getRoleCredentials(role);
  const adminCreds = getRoleCredentials("admin");
  let loginUsername = roleCreds.username ?? adminCreds.username;
  let loginPassword = roleCreds.password ?? adminCreds.password;
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  if (!loginUsername || !loginPassword) {
    return {
      role,
      username: "",
      isAuthenticated: false,
      loginPage,
      dashboardPage,
    };
  }

  await loginPage.goto();
  await loginPage.expectLoaded();

  const tryLogin = async (username: string, password: string) => {
    await loginPage.login(username, password);
    return !/\/login/i.test(page.url());
  };

  let loggedIn = await tryLogin(
    loginUsername ?? "e2e.invalid.user",
    loginPassword ?? "invalid-password",
  );

  // If direct role credentials fail, retry with admin credentials and switch role post-login.
  if (
    !loggedIn &&
    role !== "admin" &&
    adminCreds.username &&
    adminCreds.password &&
    (adminCreds.username !== loginUsername || adminCreds.password !== loginPassword)
  ) {
    await loginPage.goto();
    await loginPage.expectLoaded();
    loggedIn = await tryLogin(adminCreds.username, adminCreds.password);
    if (loggedIn) {
      loginUsername = adminCreds.username;
      loginPassword = adminCreds.password;
    }
  }

  if (!loggedIn) {
    return {
      role,
      username: loginUsername ?? "",
      isAuthenticated: false,
      loginPage,
      dashboardPage,
    };
  }

  if (role === "admin") {
    await dashboardPage.expectLoaded();
  } else {
    const hasRequestedRole = await dashboardPage.ensureRoleSelected(getRequestedRoleId(role));
    if (!hasRequestedRole) {
      return {
        role,
        username: loginUsername,
        isAuthenticated: false,
        loginPage,
        dashboardPage,
      };
    }
  }

  return {
    role,
    username: loginUsername ?? "",
    isAuthenticated: true,
    loginPage,
    dashboardPage,
  };
}

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  adminSession: async ({ page }, use) => {
    await use(await buildAuthenticatedSession(page, "admin"));
  },
  doctorSession: async ({ page }, use) => {
    await use(await buildAuthenticatedSession(page, "doctor"));
  },
  staffSession: async ({ page }, use) => {
    await use(await buildAuthenticatedSession(page, "staff"));
  },
  dashboardPage: async ({ adminSession }, use) => {
    await use(adminSession.dashboardPage);
  },
});

export { expect } from "@playwright/test";
