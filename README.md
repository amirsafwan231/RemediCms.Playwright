# RemediCms.Playwright

Playwright end-to-end test setup for Remedi CMS.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Run tests

```bash
npm test
```

Run in headed mode:

```bash
npm run test:headed
```

## Configure target URL

Set `BASE_URL` to the app under test:

```bash
BASE_URL=https://your-app-url npm test
```

Optional login credentials for the login test:

```bash
LOGIN_USERNAME=your-username
LOGIN_PASSWORD=your-password
```

Run only the login test:

```bash
npx playwright test -g "login form can be filled and submitted"
```

## CI/CD (GitHub Actions)

A Playwright pipeline is configured at:

`.github/workflows/playwright.yml`

It runs on:

1. Push to `main` or `master`
2. Pull requests to `main` or `master`
3. Manual trigger (`workflow_dispatch`)

### Optional GitHub Secrets

Set these in your repo settings if you want CI to run against your real environment:

1. `BASE_URL`
2. `LOGIN_USERNAME`
3. `LOGIN_PASSWORD`

If `BASE_URL` is not set, CI uses `https://example.com`.
