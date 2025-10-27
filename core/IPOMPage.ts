interface IPOMPage {
    isVisible(): Promise<boolean>;
    getName(): string;
}

export default IPOMPage
