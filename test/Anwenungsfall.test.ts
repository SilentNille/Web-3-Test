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
    // Einloggen als Administrator
    const landingPage = new LandingPagePOM(driver);
    await landingPage.openPage();
    expect(await landingPage.login('admin', '123')).toBeTruthy();

    const startPage = new StartPagePOM(driver);
    await startPage.openUserManagementPage();

    // Anlegen eines neuen Users, der nicht Administrator ist
    const userManagementPOM = new UserManagementPagePOM(driver);
    expect(await userManagementPOM.createUser(
      testUser.username,
      testUser.password,
      testUser.firstName,
      testUser.lastName,
      false
    )).toBeTruthy();

    // Überprüfen, ob der User in der Liste steht
    const createdUserItem = await driver.wait(
      until.elementLocated(By.id(`UserItem${testUser.username}`)),
      5000
    );
    expect(await createdUserItem.isDisplayed()).toBe(true);

    // Ausloggen
    const logoutButton = await driver.wait(
      until.elementLocated(By.id('LogoutButton')),
      5000
    );
    await logoutButton.click();

    // Einloggen als der neu angelegte User
    const landingPage2 = new LandingPagePOM(driver);
    expect(await landingPage2.login(testUser.username, testUser.password)).toBeTruthy();

    // Prüfen, ob das User-Management zu sehen ist (sollte nicht der Fall sein)
    let userManagementVisible = true;
    try {
      await driver.findElement(By.id('OpenUserManagementPageButton'));
      userManagementVisible = true;
    } catch (e) {
      userManagementVisible = false;
    }
    expect(userManagementVisible).toBe(false);

    // Ausloggen
    const logoutButton2 = await driver.wait(
      until.elementLocated(By.id('LogoutButton')),
      5000
    );
    await logoutButton2.click();
  }, 30000);
});
