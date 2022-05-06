import { AppComponent } from "../app.component";

export class UIController {
    app: AppComponent;

    showUI: boolean = true;
    showContactPage: boolean = false;
    showInfoPanel: boolean = false;
    showNav: boolean = true;
    showSettings: boolean = false;
    showPlanetbuilder: boolean = false;
    showConstellations: boolean = true;

    mobile: boolean = false;
    navCurrentPage: number = 1; // 0=Systems, 1=Planets, 2=Moons
    currentSlider: string = "Time"

    constructor(app: AppComponent) {
        this.app = app;
    }

    toggleUI(): void {
        this.showUI = !this.showUI;
    }

    showInfo(): void {
        this.showInfoPanel = !this.showInfoPanel; 
        this.showSettings = false;
        if (this.mobile) this.showNav = false;
    }

    showContact(): void {
        this.showContactPage = !this.showContactPage;
        this.showSettings = false;
        if (this.mobile) this.showNav = false; 
    }

    toggleSettings() {
        this.showSettings = !this.showSettings
        if (this.showSettings) this.showInfoPanel = false;
    }

    toggleConstellations(): void {
        this.showConstellations = !this.showConstellations;
        if (this.showConstellations) this.app.nightSky.showConstellations();
        else this.app.nightSky.removeConstellations();
    }
}