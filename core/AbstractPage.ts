import { WebDriver, By, until, WebElement } from "selenium-webdriver";
import IPage from "./IPOMPage";

export abstract class AbstractPage implements IPage {
    protected driver: WebDriver;
    protected pageTagID: string;
    protected pageName: string;

    constructor(driver: WebDriver, pageTagID: string, pageName: string) {
        this.driver = driver;
        this.pageTagID = pageTagID;
        this.pageName = pageName;
    }

    getDriver(): WebDriver {
        return this.driver;
    }

    getName(): string {
        return this.pageName;
    }

    async isVisible(): Promise<boolean> {
        try {
            const landingPage: WebElement = await this.driver.wait(
                until.elementLocated(By.id(this.pageTagID)),
                5000
            );
            return await landingPage.isDisplayed();
        } catch {
            return false;
        }
    }
}
