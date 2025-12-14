import { Browser, Builder, WebDriver } from 'selenium-webdriver';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const chrome = require('selenium-webdriver/chrome');

class BasicTestingUtil {
    static async createWebDriver(): Promise<WebDriver> {
        const options = new chrome.Options()
            .addArguments("--ignore-certificate-errors", "--headless=new")

        if (process.env.SELENIUM_URL) {
            const seleniumServerUrl = process.env.SELENIUM_URL;
            console.log("Using remote Selenium server at:", seleniumServerUrl);
            return new Builder()
                .forBrowser(Browser.CHROME)
                .setChromeOptions(options)
                .usingServer(seleniumServerUrl)
                .build();
        }

        return await new Builder()
            .forBrowser(Browser.CHROME)
            .setChromeOptions(options)
            .build();
    }
}

export default BasicTestingUtil;
