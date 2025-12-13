import 'dotenv/config';
import { By, until, WebDriver } from 'selenium-webdriver';
import { LandingPagePOM } from '../poms/LandingPagePOM';
import { StartPagePOM } from '../poms/StartPagePOM';
import { UserManagementPagePOM } from '../poms/UserManagementPagePOM';
import BasicTestingUtil from '../util/BasicTestingUtils';

describe('Kompletter User-Management-Anwendungsfall', () => {
  let driver: WebDriver;
  const testUser = {
    username: 'prozessuser',
    password: 'prozesspass',
    firstName: 'Prozess',
    lastName: 'User'
  };

  beforeAll(async () => {
    driver = await BasicTestingUtil.createWebDriver();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  test('Admin legt User an, User kann sich einloggen, sieht kein User-Management', async () => {
    const landingPage = new LandingPagePOM(driver);
    await landingPage.openPage();
    expect(await landingPage.login('admin', '123')).toBeTruthy();

    const startPage = new StartPagePOM(driver);
    await startPage.openUserManagementPage();

    const userManagementPOM = new UserManagementPagePOM(driver);
    expect(await userManagementPOM.createUser(
      testUser.username,
      testUser.password,
      testUser.firstName,
      testUser.lastName,
      false
    )).toBeTruthy();

    const createdUserItem = await driver.wait(
      until.elementLocated(By.id(`UserItem${testUser.username}`)),
      5000
    );
    expect(await createdUserItem.isDisplayed()).toBe(true);

    const logoutButton = await driver.wait(
      until.elementLocated(By.id('LogoutButton')),
      5000
    );
    await logoutButton.click();

    const landingPage2 = new LandingPagePOM(driver);
    expect(await landingPage2.login(testUser.username, testUser.password)).toBeTruthy();

    let userManagementVisible = true;
    try {
      await driver.findElement(By.id('OpenUserManagementPageButton'));
      userManagementVisible = true;
    } catch (_e) {
      userManagementVisible = false;
    }
    expect(userManagementVisible).toBe(false);

    const logoutButton2 = await driver.wait(
      until.elementLocated(By.id('LogoutButton')),
      5000
    );
    await logoutButton2.click();
  }, 30000);
});
