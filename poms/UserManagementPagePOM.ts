import { By, until, WebDriver } from 'selenium-webdriver';
import { AbstractPage } from "../core/AbstractPage";

export class UserManagementPagePOM extends AbstractPage {
    constructor(driver: WebDriver) {
        super(driver, "UserManagementPage", "User Management Page");
    }

    async createUser(userID: string, password: string, firstName: string, lastName: string, isAdmin: boolean): Promise<boolean> {
        if (!this.driver) return false;

        const addUserButton = await this.driver.wait(
            until.elementLocated(By.id("UserManagementPageCreateUserButton")),
            5000
        );
        await addUserButton.click();

        const userIdField = await this.driver.wait(
            until.elementLocated(By.id("CreateUserComponentEditUserID")),
            5000
        );
        const passwordField = await this.driver.findElement(By.id("CreateUserComponentEditPassword"));
        const firstNameField = await this.driver.findElement(By.id("CreateUserComponentEditFirstName"));
        const lastNameField = await this.driver.findElement(By.id("CreateUserComponentEditLastName"));
        const isAdminCheckbox = await this.driver.findElement(By.id("CreateUserComponentEditIsAdministrator"));
        const saveButton = await this.driver.findElement(By.id("CreateUserComponentCreateUserButton"));

        await userIdField.sendKeys(userID);
        await passwordField.sendKeys(password);
        await firstNameField.sendKeys(firstName);
        await lastNameField.sendKeys(lastName);
        if (isAdmin) {
            await isAdminCheckbox.click();
        }
        await saveButton.click();

        try {
            await this.driver.wait(until.stalenessOf(saveButton), 3000);
            return true;
        } catch (e) {
            const cancelButton = await this.driver.findElement(By.id("OpenUserManagementPageListComponentButton"));
            await cancelButton.click();
            return false;
        }
    }

    async editUser(userID: string, password: string, newFirstName: string, newLastName: string, isAdmin: boolean): Promise<boolean> {
        if (!this.driver) return false;

        const editButton = await this.driver.wait(
            until.elementLocated(By.id(`UserItemEditButton${userID}`)),
            5000
        );

        await editButton.click();

        const userIdField = await this.driver.findElement(By.id("EditUserComponentEditUserID"));
        const firstNameField = await this.driver.findElement(By.id("EditUserComponentEditFirstName"));
        const lastNameField = await this.driver.findElement(By.id("EditUserComponentEditLastName"));
        const passwordField = await this.driver.findElement(By.id("EditUserComponentEditPassword"));
        const isAdminField = await this.driver.findElement(By.id("EditUserComponentEditIsAdministrator"));
        const saveButton = await this.driver.findElement(By.id("EditUserComponentSaveUserButton"));

        await userIdField.sendKeys(userID);
        await firstNameField.sendKeys(newFirstName);
        await lastNameField.sendKeys(newLastName);
        await passwordField.sendKeys(password);

        const isCurrentlyAdmin = await isAdminField.isSelected();
        if (isAdmin !== isCurrentlyAdmin) {
            await isAdminField.click();
        }

        await saveButton.click();

        try {
            await this.driver.wait(until.stalenessOf(saveButton), 3000);
            return true;
        } catch (e) {
            const cancelButton = await this.driver.findElement(By.id("OpenUserManagementPageListComponentButton"));
            await cancelButton.click();
            return false;
        }
    }

    async deleteUser(userID: string): Promise<boolean> {
        if (!this.driver) return false;

        const deleteButton = await this.driver.wait(
            until.elementLocated(By.id(`UserItemDeleteButton${userID}`)),
            5000
        );

        await deleteButton.click();

        const confirmButton = await this.driver.wait(
            until.elementLocated(By.id("DeleteDialogConfirmButton")),
            5000
        );

        await confirmButton.click();

        return true;
    }
}
