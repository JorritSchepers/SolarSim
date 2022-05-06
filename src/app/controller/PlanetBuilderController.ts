import { Options } from "@angular-slider/ngx-slider";
import { AppComponent } from "../app.component";
import * as THREE from 'three';

const DETAIL = 40;
const COLOR = 0xdddddd;
const MIN_DISTANCE = 10000000
const MAX_DISTANCE = 20000000
const MIN_RADIUS = 50000
const MAX_RADIUS = 100000
const MAX_INCLINATION = 30;
const MAX_AXIS = 30;
const MIN_ORBITAL_PERIOD = 200
const MAX_ORBITAL_PERIOD = 1000
const PLANET_MAPS: string[] = [
    "mercury-map.jpg",
    "venus-map.jpg",
    "earth-map.jpeg",
    "earth-map2.jpg",
    "mars-map.jpg",
    "jupiter-map.jpg",
    "saturn-map.jpg",
    "uranus-map.jpg",
    "neptune-map.jpg",
    "moon-map.jpg"
]  

export class PlanetBuilderController {
    app: AppComponent;

    planetCounter: number = 1;
    name: string = "New Planet " + this.planetCounter;
    distance: number = 0;
    radius: number = 0;
    inclination: number = 0;
    inclinationOptions: Options = {
        floor: 0,
        ceil: 90,
    };
    axis: number = 0;
    axisOptions: Options = {
        floor: 0,
        ceil: 180
    }
    orbitalPeriod: number = 0;
    clockwise: boolean = false;

    constructor(app: AppComponent) {
        this.app = app;
    }

    updateDistance(value: string): void {
        const x = parseInt(value)
        this.distance = x
    }

    updateRadius(value: string): void {
        const x = parseInt(value)
        this.radius = x
    }

    updateOrbitalPeriod(value: string): void {
        const x = parseInt(value)
        this.orbitalPeriod = x
    }

    generateRandomValues(): void {
        this.distance = this.randomInt(MIN_DISTANCE, MAX_DISTANCE)
        this.radius = this.randomInt(MIN_RADIUS, MAX_RADIUS)
        this.inclination = this.randomInt(0, MAX_INCLINATION)
        this.axis = this.randomInt(0, MAX_AXIS)
        this.orbitalPeriod = this.randomInt(MIN_ORBITAL_PERIOD, MAX_ORBITAL_PERIOD)
        const r = this.randomInt(0, 1)
        if (r == 0) this.clockwise = true
        else this.clockwise = false
    }

    randomInt(min: number, max: number): number {
        return Math.round(min + (Math.random() * max))
    }

    createPlanet() {
        const map = new THREE.TextureLoader().load('./assets/maps/' + PLANET_MAPS[Math.floor(Math.random() * PLANET_MAPS.length)])
        let name = this.name;
        if (this.checkNameAvailability(name)) name = this.name + " 2"
        this.app.addPlanet(name, this.radius, DETAIL, COLOR, this.distance, this.inclination, this.axis, false, this.orbitalPeriod, this.clockwise, map, 24)
        this.app.flyToPlanet(this.name)
        this.app.ui.showPlanetbuilder = false;
        this.distance = 0 
        this.radius = 0
        this.inclination = 0
        this.axis = 0
        this.orbitalPeriod = 0
        this.clockwise = false
        if (this.name == "New Planet " + this.planetCounter) this.planetCounter += 1;
        this.name = "New Planet " + this.planetCounter
    }

    private checkNameAvailability(name: string): boolean {
        for (let i = 0; i < this.app.systems[this.app.currentSystem].planets.length; i++) {
          let planet = this.app.systems[this.app.currentSystem].planets[i]
            if (planet.name == name) {
              return true
            }
        }
        return false;
    }
}