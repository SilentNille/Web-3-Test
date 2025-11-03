import 'dotenv/config';
import { By, until, WebDriver } from 'selenium-webdriver';
import { DegreeCourseManagementPagePOM } from '../poms/DegreeCourseManagementPagePOM';
import { LandingPagePOM } from '../poms/LandingPagePOM';
import { StartPagePOM } from '../poms/StartPagePOM';
import BasicTestingUtil from '../util/BasicTestingUtils';

describe("Degree Course Management Tests", () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await BasicTestingUtil.createWebDriver();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  test("Create new Couerse", async () => {
    const landingPage: LandingPagePOM = new LandingPagePOM(driver);
    await landingPage.openPage();

    expect(await landingPage.login("admin", "123")).toBeTruthy();

    const startPage: StartPagePOM = new StartPagePOM(driver);
    await startPage.openDegreeCourseManagementPage();

    const degreeCourseManagementPage = await driver.wait(
      until.elementLocated(By.id("DegreeCourseManagementPage")),
      5000
    );
    expect(await degreeCourseManagementPage.isDisplayed()).toBe(true);
    const degreeCourseManagementPOM = new DegreeCourseManagementPagePOM(driver);
    const creationResult = await degreeCourseManagementPOM.createDegreeCourse(
      "Test Course",
      "TC",
      "Test University",
      "TU",
      "Test Department",
      "TD"
    );
    expect(creationResult).toBe(true);

    const createdCourseItem = await driver.wait(
      until.elementLocated(By.id("DegreeCourseItemTest Course")),
      5000
    );
    expect(await createdCourseItem.isDisplayed()).toBe(true);

    const courseItemText = await createdCourseItem.getText();
    expect(courseItemText).toContain("Test Course");
    expect(courseItemText).toContain("Test University");
    expect(courseItemText).toContain("Test Department");
  });

  test("Edit existing degree course", async () => {
    const landingPage: LandingPagePOM = new LandingPagePOM(driver);
    await landingPage.openPage();
    expect(await landingPage.login("admin", "123")).toBeTruthy();

    const startPage: StartPagePOM = new StartPagePOM(driver);
    await startPage.openDegreeCourseManagementPage();

    const degreeCourseManagementPOM = new DegreeCourseManagementPagePOM(driver);

    const editResult = await degreeCourseManagementPOM.editDegreeCourse(
      "Test Course",
      "Updated Course",
      "UC",
      "Updated University",
      "UU",
      "Updated Department",
      "UD"
    );
    expect(editResult).toBe(true);

    const updatedCourseItem = await driver.wait(
      until.elementLocated(By.id("DegreeCourseItemUpdated Course")),
      5000
    );
    expect(await updatedCourseItem.isDisplayed()).toBe(true);

    const courseItemText = await updatedCourseItem.getText();

    expect(courseItemText).toContain("Updated Course");
    expect(courseItemText).toContain("Updated University");
    expect(courseItemText).toContain("Updated Department");
  }, 30000);

  test("Delete existing degree course", async () => {
    const landingPage: LandingPagePOM = new LandingPagePOM(driver);
    await landingPage.openPage();
    expect(await landingPage.login("admin", "123")).toBeTruthy();

    const startPage: StartPagePOM = new StartPagePOM(driver);
    await startPage.openDegreeCourseManagementPage();

    const courseRow = await driver.wait(
      until.elementLocated(By.id("DegreeCourseItemUpdated Course")),
      5000
    );

    const deleteCourseButton = await courseRow.findElement(By.css("button[id^='DegreeCourseItemDeleteButton']"));
    await deleteCourseButton.click();

    const confirmButton = await driver.wait(
      until.elementLocated(By.id("DeleteDialogConfirmButton")),
      5000
    );

    await driver.executeScript("arguments[0].scrollIntoView(true);", confirmButton);
    await new Promise(res => setTimeout(res, 300));

    await confirmButton.click();

    await driver.wait(async () => {
      try {
        await driver.findElement(By.id("DegreeCourseItemUpdated Course"));
        return false;
      } catch (_e) {
        return true;
      }
    }, 5000);
  }, 30000);
});
