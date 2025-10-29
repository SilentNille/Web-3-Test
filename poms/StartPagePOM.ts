import { By, until, WebDriver } from 'selenium-webdriver';
import { AbstractPage } from "../core/AbstractPage";

export class StartPagePOM extends AbstractPage {
    constructor(driver: WebDriver) {
        super(driver, "StartPage", "Start Page");
    }

    async openUserManagementPage(): Promise<void> {
        const userManagementButton = await this.driver.wait(
            until.elementLocated(By.id("OpenUserManagementPageButton")),
            5000
        );
        await userManagementButton.click();
    }

    async openDegreeCourseManagementPage(): Promise<void> {
        const degreeCourseManagementButton = await this.driver.wait(
            until.elementLocated(By.id("OpenDegreeCourseManagementPageButton")),
            5000
        );
        await degreeCourseManagementButton.click();
    }
}
