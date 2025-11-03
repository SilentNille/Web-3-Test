import { Browser, Builder, WebDriver } from 'selenium-webdriver';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const chrome = require('selenium-webdriver/chrome');

class BasicTestingUtil {
    static async createWebDriver(): Promise<WebDriver> {
        const options = new chrome.Options()
            .addArguments("--ignore-certificate-errors")

        const driver = await new Builder()
            .forBrowser(Browser.CHROME)
            .setChromeOptions(options)
            .build();
        return driver;
    }
}

export default BasicTestingUtil;
