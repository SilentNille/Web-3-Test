import 'dotenv/config';
import { By, until, WebDriver } from 'selenium-webdriver';
import { LandingPagePOM } from '../poms/LandingPagePOM';
import { StartPagePOM } from '../poms/StartPagePOM';
import { UserManagementPagePOM } from '../poms/UserManagementPagePOM';
import BasicTestingUtil from '../util/BasicTestingUtils';

describe("User Management Tests", () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await BasicTestingUtil.createWebDriver();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  test("List users and verify standard user exists", async () => {
    const landingPage: LandingPagePOM = new LandingPagePOM(driver);
    await landingPage.openPage();
    expect(await landingPage.login("admin", "123")).toBeTruthy();

    const startPage: StartPagePOM = new StartPagePOM(driver);
    await startPage.openUserManagementPage();

    const userManagementPage = await driver.wait(
      until.elementLocated(By.id("UserManagementPage")),
      5000
    );
    expect(await userManagementPage.isDisplayed()).toBe(true);

    const userListComponent = await driver.wait(
      until.elementLocated(By.id("UserManagementPageListComponent")),
      5000
    );
    expect(await userListComponent.isDisplayed()).toBe(true);

    const adminUserItem = await driver.wait(
      until.elementLocated(By.id("UserItemadmin")),
      5000
    );
    expect(await adminUserItem.isDisplayed()).toBe(true);

    const adminUserText = await adminUserItem.getText();
    expect(adminUserText).toContain("admin");
    expect(adminUserText).toContain("Admin");
    expect(adminUserText).toContain("User");
    expect(adminUserText).toContain("Yes");
  });

  test("Create new user", async () => {
    const landingPage: LandingPagePOM = new LandingPagePOM(driver);
    await landingPage.openPage();

    expect(await landingPage.login("admin", "123")).toBeTruthy();

    const startPage: StartPagePOM = new StartPagePOM(driver);
    await startPage.openUserManagementPage();

    const userManagementPage = await driver.wait(
      until.elementLocated(By.id("UserManagementPage")),
      5000
    );
    expect(await userManagementPage.isDisplayed()).toBe(true);
    const userManagementPOM = new UserManagementPagePOM(driver);
    const creationResult = await userManagementPOM.createUser(
      "testuser",
      "testpass",
      "Test",
      "User",
      false
    );
    expect(creationResult).toBe(true);

    const createdUserItem = await driver.wait(
      until.elementLocated(By.id("UserItemtestuser")),
      5000
    );
    expect(await createdUserItem.isDisplayed()).toBe(true);

    const userItemText = await createdUserItem.getText();
    expect(userItemText).toContain("testuser");
    expect(userItemText).toContain("Test");
    expect(userItemText).toContain("User");
    expect(userItemText).toContain("No");
  }, 30000);

  test("Edit existing user", async () => {
    const landingPage: LandingPagePOM = new LandingPagePOM(driver);
    await landingPage.openPage();
    expect(await landingPage.login("admin", "123")).toBeTruthy();

    const startPage: StartPagePOM = new StartPagePOM(driver);
    await startPage.openUserManagementPage();

    const userManagementPOM = new UserManagementPagePOM(driver);

    const editResult = await userManagementPOM.editUser(
      "testuser",
      "newpassword",
      "Updated",
      "Name",
      false
    );
    expect(editResult).toBe(true);

    const updatedUserItem = await driver.wait(
      until.elementLocated(By.id("UserItemtestuser")),
      5000
    );
    expect(await updatedUserItem.isDisplayed()).toBe(true);

    const userItemText = await updatedUserItem.getText();

    expect(userItemText).toContain("testuser");
    expect(userItemText).toContain("Updated");
    expect(userItemText).toContain("Name");
    expect(userItemText).toContain("No");
  }, 30000);

  test("Delete existing user", async () => {
    const landingPage: LandingPagePOM = new LandingPagePOM(driver);
    await landingPage.openPage();
    expect(await landingPage.login("admin", "123")).toBeTruthy();

    const startPage: StartPagePOM = new StartPagePOM(driver);
    await startPage.openUserManagementPage();

    const deleteUserButton = await driver.wait(
      until.elementLocated(By.id("UserItemDeleteButtontestuser")),
      5000
    );
    await deleteUserButton.click();

    const confirmButton = await driver.wait(
      until.elementLocated(By.id("DeleteDialogConfirmButton")),
      5000
    );

    await driver.executeScript("arguments[0].scrollIntoView(true);", confirmButton);
    await new Promise(res => setTimeout(res, 300));

    await confirmButton.click();

    await driver.wait(async () => {
      try {
        await driver.findElement(By.id("UserItemtestuser"));
        return false;
      } catch (e) {
        return true;
      }
    }, 5000);
  }, 30000);

  test("Error: Create user without password", async () => {
    const landingPage: LandingPagePOM = new LandingPagePOM(driver);
    await landingPage.openPage();
    expect(await landingPage.login("admin", "123")).toBeTruthy();

    const startPage: StartPagePOM = new StartPagePOM(driver);
    await startPage.openUserManagementPage();

    const userManagementPOM = new UserManagementPagePOM(driver);

    const creationResult = await userManagementPOM.createUser(
      "nopassuser",
      "",
      "No",
      "Pass",
      false
    );

    expect(creationResult).toBe(false);

    let userExists = false;
    try {
      await driver.findElement(By.id("UserItemnopassuser"));
      userExists = true;
    } catch (e) {
      userExists = false;
    }
    expect(userExists).toBe(false);
  }, 30000);

  test("Error: Create user without username", async () => {
    const landingPage: LandingPagePOM = new LandingPagePOM(driver);
    await landingPage.openPage();
    expect(await landingPage.login("admin", "123")).toBeTruthy();

    const startPage: StartPagePOM = new StartPagePOM(driver);
    await startPage.openUserManagementPage();

    const userManagementPOM = new UserManagementPagePOM(driver);

    const creationResult = await userManagementPOM.createUser(
      "",  // Empty username
      "somepassword",
      "No",
      "Username",
      false
    );

    expect(creationResult).toBe(false);
  }, 30000);

  test("Error: Create user that already exists", async () => {
    const landingPage: LandingPagePOM = new LandingPagePOM(driver);
    await landingPage.openPage();
    expect(await landingPage.login("admin", "123")).toBeTruthy();

    const startPage: StartPagePOM = new StartPagePOM(driver);
    await startPage.openUserManagementPage();

    const userManagementPOM = new UserManagementPagePOM(driver);

    const firstCreation = await userManagementPOM.createUser(
      "duplicateuser",
      "password123",
      "Duplicate",
      "User",
      false
    );
    expect(firstCreation).toBe(true);

    const firstUserItem = await driver.wait(
      until.elementLocated(By.id("UserItemduplicateuser")),
      5000
    );
    expect(await firstUserItem.isDisplayed()).toBe(true);

    const secondCreation = await userManagementPOM.createUser(
      "duplicateuser",  // Same username
      "password456",
      "Another",
      "Duplicate",
      false
    );

    expect(secondCreation).toBe(false);

    const deleteButton = await driver.wait(
      until.elementLocated(By.id("UserItemDeleteButtonduplicateuser")),
      5000
    );
    await deleteButton.click();

    const confirmButton = await driver.wait(
      until.elementLocated(By.id("DeleteDialogConfirmButton")),
      5000
    );
    await driver.executeScript("arguments[0].scrollIntoView(true);", confirmButton);
    await new Promise(res => setTimeout(res, 300));
    await confirmButton.click();

    await driver.wait(async () => {
      try {
        await driver.findElement(By.id("UserItemduplicateuser"));
        return false;
      } catch (e) {
        return true;
      }
    }, 5000);
  }, 30000);

  test("Login with newly created user", async () => {
    const landingPage: LandingPagePOM = new LandingPagePOM(driver);
    await landingPage.openPage();
    expect(await landingPage.login("admin", "123")).toBeTruthy();

    const startPage: StartPagePOM = new StartPagePOM(driver);
    await startPage.openUserManagementPage();

    const userManagementPOM = new UserManagementPagePOM(driver);

    const creationResult = await userManagementPOM.createUser(
      "newloginuser",
      "loginpass123",
      "Login",
      "Test",
      false
    );
    expect(creationResult).toBe(true);

    const createdUserItem = await driver.wait(
      until.elementLocated(By.id("UserItemnewloginuser")),
      5000
    );
    expect(await createdUserItem.isDisplayed()).toBe(true);

    const logoutButton = await driver.wait(
      until.elementLocated(By.id("LogoutButton")),
      5000
    );
    await logoutButton.click();

    await driver.wait(
      until.elementLocated(By.id("LandingPage")),
      5000
    );

    const landingPage2 = new LandingPagePOM(driver);
    expect(await landingPage2.login("newloginuser", "loginpass123")).toBeTruthy();

    const startPageElement = await driver.wait(
      until.elementLocated(By.id("StartPage")),
      5000
    );
    expect(await startPageElement.isDisplayed()).toBe(true);

    const logoutButton2 = await driver.wait(
      until.elementLocated(By.id("LogoutButton")),
      5000
    );
    await logoutButton2.click();

    await driver.wait(
      until.elementLocated(By.id("LandingPage")),
      5000
    );
    const landingPage3 = new LandingPagePOM(driver);
    expect(await landingPage3.login("admin", "123")).toBeTruthy();

    const startPage2 = new StartPagePOM(driver);
    await startPage2.openUserManagementPage();

    const deleteButton = await driver.wait(
      until.elementLocated(By.id("UserItemDeleteButtonnewloginuser")),
      5000
    );
    await deleteButton.click();

    const confirmButton = await driver.wait(
      until.elementLocated(By.id("DeleteDialogConfirmButton")),
      5000
    );
    await driver.executeScript("arguments[0].scrollIntoView(true);", confirmButton);
    await new Promise(res => setTimeout(res, 300));
    await confirmButton.click();

    await driver.wait(async () => {
      try {
        await driver.findElement(By.id("UserItemnewloginuser"));
        return false;
      } catch (e) {
        return true;
      }
    }, 5000);
  }, 60000);
});
;
