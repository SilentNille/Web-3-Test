import 'dotenv/config';
import { By, until, WebDriver } from 'selenium-webdriver';
import { LandingPagePOM } from '../poms/LandingPagePOM';
import BasicTestingUtil from '../util/BasicTestingUtils';

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000/";

jest.setTimeout(60000);

describe('Selenium + REST', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await BasicTestingUtil.createWebDriver();
  }, 50000);

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  test('Frontend loads and title contains expected text', async () => {
    await driver.get(FRONTEND_URL);
    await driver.wait(until.titleIs(await driver.getTitle()), 5000).catch(() => {});
    const title = await driver.getTitle();
    expect(title).toEqual(expect.stringContaining("Vite + React + TS"));
  });
});

describe("Login Tests", () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await BasicTestingUtil.createWebDriver();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  test("Login mit gültigen Admin Credentials", async () => {
    const landingPage: LandingPagePOM = new LandingPagePOM(driver);
    await landingPage.openPage();
    // Login as admin
    expect(await landingPage.login("admin", "123")).toBeTruthy();

    // Wait for StartPage to be visible
    const startPage = await driver.wait(
      until.elementLocated(By.id("StartPage")),
      1000
    );
    expect(await startPage.isDisplayed()).toBe(true);

    // LandingPage should be invisible
    let landingPageVisible = true;
    try {
      const landingPageDiv = await driver.findElement(By.id("LandingPage"));
      landingPageVisible = await landingPageDiv.isDisplayed();
    } catch (_e) {
      landingPageVisible = false; // Not found means not visible
    }
    expect(landingPageVisible).toBe(false);
  });

  test("Login mit ungültigen Admin Credentials", async () => {
    const landingPage: LandingPagePOM = new LandingPagePOM(driver);
    await landingPage.openPage();
    // Login as admin with wrong password
    expect(await landingPage.login("admin", "abc")).toBeTruthy();

    // LandingPage should still be visible
    let landingPageVisible = false;
    try {
      const landingPageDiv = await driver.findElement(By.id("LandingPage"));
      landingPageVisible = await landingPageDiv.isDisplayed();
    } catch (_e) {
      landingPageVisible = false;
    }
    expect(landingPageVisible).toBe(true);

    // StartPage should NOT be present
    let startPagePresent = true;
    try {
      await driver.findElement(By.id("StartPage"));
      startPagePresent = true;
    } catch (_e) {
      startPagePresent = false;
    }
    expect(startPagePresent).toBe(false);

    // Wait for alert to appear
    await new Promise(res => setTimeout(res, 1200));
    let alertPresent = false;
    try {
      const alert = await driver.findElement(By.className("login-alert"));
      alertPresent = await alert.isDisplayed();
    } catch (_e) {
      alertPresent = false;
    }
    expect(alertPresent).toBe(true);
  });
});
