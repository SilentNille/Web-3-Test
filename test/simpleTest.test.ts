import 'dotenv/config';
import { By, until, WebDriver } from 'selenium-webdriver';
import { LandingPagePOM } from '../poms/LandingPagePOM';
import BasicTestingUtil from '../util/BasicTestingUtils';
// import chrome from 'selenium-webdriver/chrome';
// import 'chromedriver';

const REST_URL = process.env.REST_URL || "https://localhost:443/";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000/";

jest.setTimeout(30000);

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
    console.log("Lade Landing Page");
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
    } catch (e) {
      landingPageVisible = false; // Not found means not visible
    }
    expect(landingPageVisible).toBe(false);
  });
});
