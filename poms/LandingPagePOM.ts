import 'dotenv/config';
import { By, until, WebDriver, WebElement } from "selenium-webdriver";
import { AbstractPage } from "../core//AbstractPage";

export class LandingPagePOM extends AbstractPage {
    static OPEN_LOGIN_DIALOG_BUTTON: string = "OpenLoginDialogButton";

    constructor(driver: WebDriver) {
        super(driver, "LandingPage", "Landing Page");
    }

    async openPage(): Promise<boolean> {
        if (!this.driver) return false;

        const url = process.env.FRONTEND_URL;
        if (!url) {
            console.error("FRONTEND_URL is not defined in environment variables");
            return false;
        }
        await this.driver.get(url);
        return true;
    }

    async login(userID: string, password: string): Promise<boolean> {
        const loginDialogOpened: boolean = await this.clickComponentWithIDAndWait(
            LandingPagePOM.OPEN_LOGIN_DIALOG_BUTTON,
            "OpenLoginDialogButton"
        );

        if (!loginDialogOpened) {
            console.error("Could not open login dialog");
            return false;
        }

        // Wait for the user ID field to be present and visible
        const userIDField: WebElement = await this.driver.wait(
            until.elementLocated(By.id("LoginDialogUserIDText")),
            5000
        );
        await this.driver.wait(until.elementIsVisible(userIDField), 5000);

        const passwordField: WebElement = await this.driver.wait(
            until.elementLocated(By.id("LoginDialogPasswordText")),
            5000
        );
        await this.driver.wait(until.elementIsVisible(passwordField), 5000);

        const submitButton: WebElement = await this.driver.wait(
            until.elementLocated(By.id("PerformLoginButton")),
            5000
        );
        await this.driver.wait(until.elementIsVisible(submitButton), 5000);

        await userIDField.sendKeys(userID);
        await passwordField.sendKeys(password);
        await submitButton.click();

        return true;
    }
}
