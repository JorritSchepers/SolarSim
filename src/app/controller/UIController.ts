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
    showSystemNameInput: boolean = false;

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
        if (this.showConstellations) {
            this.showNav = false;
            this.showContactPage = false;
            this.showInfoPanel = false;
            this.showPlanetbuilder = false;
            this.showSettings = false;
            console.log(this.showNav)
            this.app.nightSky.showConstellations();
        }
        else {
            this.app.nightSky.removeConstellations();
            this.showNav = true;
        }
    }

    transformHoursToTime(hours: number): string {
        if (hours <= 24) {
            return hours + " hours";
        }

        let time: string = "";
        let days = Math.floor(hours / 24);
        let hoursLeft = Math.round(hours % 24);

        if (hoursLeft == 0) {

            return days + " days";
        }

        time = days + " days " + hoursLeft + " hours";
        return time;
    }

    transformDaysToTime(days: number): string {
        if (days <= 365) {
            return days + " days";
        }

        let time: string = "";
        let years = Math.floor(days / 365);
        let daysLeft = Math.round(days % 365);

        if (daysLeft == 0) {

            return days + " days";
        }

        time = years + " years " + daysLeft + " days";
        return time;
    }
}