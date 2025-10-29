import { By, until, WebDriver } from 'selenium-webdriver';
import { AbstractPage } from "../core/AbstractPage";

export class DegreeCourseManagementPagePOM extends AbstractPage {
    constructor(driver: WebDriver) {
        super(driver, "DegreeCourseManagementPage", "Degree Course Management Page");
    }

    async createDegreeCourse(
        courseName: string,
        courseShortName: string,
        universityName: string,
        universityShortName: string,
        departmentName: string,
        departmentShortName: string
    ): Promise<boolean> {
        if (!this.driver) return false;

        const addCourseButton = await this.driver.wait(
            until.elementLocated(By.id("DegreeCourseManagementPageCreateDegreeCourseButton")),
            5000
        );
        await addCourseButton.click();

        const nameField = await this.driver.findElement(By.id("CreateDegreeCourseComponentEditName"));
        const shortNameField = await this.driver.findElement(By.id("CreateDegreeCourseComponentEditShortName"));
        const universityNameField = await this.driver.findElement(By.id("CreateDegreeCourseComponentEditUniversityName"));
        const universityShortNameField = await this.driver.findElement(By.id("CreateDegreeCourseComponentEditUniversityShortName"));
        const departmentNameField = await this.driver.findElement(By.id("CreateDegreeCourseComponentEditDepartmentName"));
        const departmentShortNameField = await this.driver.findElement(By.id("CreateDegreeCourseComponentEditDepartmentShortName"));
        const saveButton = await this.driver.findElement(By.id("CreateDegreeCourseComponentCreateDegreeCourseButton"));

        await nameField.sendKeys(courseName);
        await shortNameField.sendKeys(courseShortName);
        await universityNameField.sendKeys(universityName);
        await universityShortNameField.sendKeys(universityShortName);
        await departmentNameField.sendKeys(departmentName);
        await departmentShortNameField.sendKeys(departmentShortName);

        await saveButton.click();

        return true;
    }

    async editDegreeCourse(
        courseName: string,
        updatedCourseName: string,
        courseShortName: string,
        universityName: string,
        universityShortName: string,
        departmentName: string,
        departmentShortName: string
    ): Promise<boolean> {
        if (!this.driver) return false;

        const courseRow = await this.driver.wait(
            until.elementLocated(By.id(`DegreeCourseItem${courseName}`)),
            5000
        );

        const editCourseButton = await courseRow.findElement(By.css("button[id^='DegreeCourseItemEditButton']"));
        await editCourseButton.click();

        const nameField = await this.driver.wait(
            until.elementLocated(By.id("EditDegreeCourseComponentEditName")),
            5000
        );
        const shortNameField = await this.driver.findElement(By.id("EditDegreeCourseComponentEditShortName"));
        const universityNameField = await this.driver.findElement(By.id("EditDegreeCourseComponentEditUniversityName"));
        const universityShortNameField = await this.driver.findElement(By.id("EditDegreeCourseComponentEditUniversityShortName"));
        const departmentNameField = await this.driver.findElement(By.id("EditDegreeCourseComponentEditDepartmentName"));
        const departmentShortNameField = await this.driver.findElement(By.id("EditDegreeCourseComponentEditDepartmentShortName"));
        const saveButton = await this.driver.findElement(By.id("EditDegreeCourseComponentSaveDegreeCourseButton"));

        await nameField.clear();
        await nameField.sendKeys(updatedCourseName);
        await shortNameField.clear();
        await shortNameField.sendKeys(courseShortName);
        await universityNameField.clear();
        await universityNameField.sendKeys(universityName);
        await universityShortNameField.clear();
        await universityShortNameField.sendKeys(universityShortName);
        await departmentNameField.clear();
        await departmentNameField.sendKeys(departmentName);
        await departmentShortNameField.clear();
        await departmentShortNameField.sendKeys(departmentShortName);

        await saveButton.click();

        return true;
    }

    async deleteCourse(CourseID: string): Promise<boolean> {
        if (!this.driver) return false;

        const deleteButton = await this.driver.wait(
            until.elementLocated(By.id(`DeleteDialogDegreeCourse${CourseID}`)),
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
