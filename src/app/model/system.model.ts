import { Planet } from "./planet.model";

export class Solarsystem {
    name: string;
    planets: Planet[];
  
    constructor(name: string, planets?: Planet[]) {
      this.name = name;
      if (planets != null)
        this.planets = planets;
      else 
        this.planets = []
    }
  
    addPlanet(planet) {
      this.planets.push(planet)
    }
}