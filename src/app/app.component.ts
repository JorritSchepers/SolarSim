import { Component } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { Planet } from './model/planet.model';
import { Solarsystem } from './model/system.model';
import { Options } from '@angular-slider/ngx-slider';

const FOV: number = 40;
const SUN_RADIUS = 696000;
const spaceBackground = 8; // 8
const SCALE_RATIOS = false;
const PLANET_MAPS = [
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

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  scene: any;
  camera: any;
  renderer: any;
  controls: any;

  followPlanetName: string = null
  timeRatio: number = 1;
  cameraMoveSpeed: number = 20; // Higher is slower 20
  targetMoveSpeed: number = this.cameraMoveSpeed; 

  RADIUS_RATIO: number = 1;
  DISTANCE_RATIO: number = 1;
  SUN_RADIUS_RATIO: number = 1;
  cameraPos = [0, (250 * 10000), (800 * 10000)] // X, Y, Z
  
  cameraMoving: boolean = false;
  useGuideLines: boolean = true;
  showUI: boolean = true;
  showAddPlanetMenu: boolean = false;
  showContactPage: boolean = false;
  
  currentSystem: number = 0;
  systems = [new Solarsystem("The Solar System")];

  planetCounter: number = 1;
  systemCounter: number = 1;
  startDay: number = Math.floor(Math.random() * 22000000);
  day: number = this.startDay
  
  dayDisplay = 0
  distanceDisplay = 0;
  distanceInAUDisplay = 0;

  sun: Planet;

  sliderValue: number = this.timeRatio;
  options: Options = {
    floor: 0,
    ceil: 100
  };

  scaleSliderValue: number = 1;
  scaleOptions: Options = {
    floor: 0.015,
    ceil: 1,
    step: 0.001
  };

  constructor() {
    this.setup() 
  }

  setup(): void {
    this.applyScaleIfWanted(SCALE_RATIOS)
    this.initThree()
    this.initTheSolarSystem()
  }

  initTheSolarSystem(): void {
    const lunaTextureMap = new THREE.TextureLoader().load('./assets/moon-map.jpg')
    this.sun = this.addPlanet('Sun', SUN_RADIUS/this.SUN_RADIUS_RATIO, 40, 0xAAAA00, 0, 0, 0, true, 0, null, new THREE.TextureLoader().load('./assets/sun-map.jpg'));
    this.addPlanet('Mercury', 2440, 20, 0x777777, 57910000, 3.38, 2, false, 88, false, new THREE.TextureLoader().load('./assets/mercury-map.jpg'));
    this.addPlanet('Venus', 6052, 20, 0x7A381C, 108200000, 3.86, 2.7, false, 225, true, new THREE.TextureLoader().load('./assets/venus-map.jpg'));
    let earth = this.addPlanet('Earth', 6371, 20, 0x243E49, 149600000, 7.155, 23.4, false, 365, false, new THREE.TextureLoader().load('./assets/earth-map2.jpg'));
    earth.addMoon('Luna', 1737, 20, 0x777777, 384400, 5.14, false, 27, true, lunaTextureMap)
    let mars = this.addPlanet('Mars', 3390, 20, 0xAC6349, 227900000, 5.65, 25, false, 687, false, new THREE.TextureLoader().load('./assets/mars-map.jpg'));
    mars.addMoon("Phobos", 11.1, 20, 0x777777, 9377, 1.093, false, 0.463, true, lunaTextureMap)
    mars.addMoon("Deimons", 6.3, 20, 0x777777, 23460, 0.93, false, 5.44, true, lunaTextureMap)
    let jupiter = this.addPlanet('Jupiter', 69911, 20, 0x9F8E7A, 778500000, 6.09, 3, false, 4332, false, new THREE.TextureLoader().load('./assets/jupiter-map.jpg'));
    jupiter.addMoon('Ganymede', 5268/2, 20, 0x999999, 1070412, 0.204, false, 7.1546, false, new THREE.TextureLoader().load('./assets/moon-map.jpg'))
    jupiter.addMoon('Callisto', 4820/2, 20, 0x555555, 1882709, 0.205, false, 16.689, false, new THREE.TextureLoader().load('./assets/moon-map.jpg'))
    jupiter.addMoon('Io', 3643/2, 20, 0xD0C757, 421700, 0.050, false, 1.7691, false, new THREE.TextureLoader().load('./assets/moon-map.jpg'))
    jupiter.addMoon('Europa', 3121/2, 20, 0x856033, 671034, 0.471, false, 3.5512, false, new THREE.TextureLoader().load('./assets/moon-map.jpg'))
    let saturn = this.addPlanet('Saturn', 58232, 20, 0xB2915F, 1434000000, 5.51, 26.73, false, 10757, false, new THREE.TextureLoader().load('./assets/saturn-map.jpg'));
    saturn.addMoon("Titan", 5149/2, 20, 0x777777, 1221870, 0.349, false, 16, true, lunaTextureMap)
    saturn.addMoon("Rhea", 1527/2, 20, 0x777777, 527108, 0.327, false, 4.5, true, lunaTextureMap)
    saturn.addMoon("Lapetus", 1470/2, 20, 0x777777, 3560820, 15.470, false, 79, true, lunaTextureMap)
    saturn.addMoon("Dione", 1123/2, 20, 0x777777, 377396, 0.002, false, 2.7, true, lunaTextureMap)
    saturn.addMoon("Tethys", 1062/2, 20, 0x777777, 294619, 0.168, false, 1.9, true, lunaTextureMap)
    saturn.addMoon("Enceladus", 504/2, 20, 0x777777, 237948, 0.010, false, 1.4, true, lunaTextureMap)
    saturn.addMoon("Mimas", 396/2, 20, 0x777777, 185539, 1.566, false, 0.9, true, lunaTextureMap)
    let uranus = this.addPlanet('Uranus', 25362, 20, 0x8EB2C4, 2871000000, 6.48, 97.77, false, 30687, false, new THREE.TextureLoader().load('./assets/uranus-map.jpg'));
    uranus.addMoon("Titania", 1576/2, 20, 0x777777, 435910, 0.340, false, 8.7, true, lunaTextureMap)
    uranus.addMoon("Oberon", 1522/2, 20, 0x777777, 583520, 0.058, false, 13.4, true, lunaTextureMap)
    uranus.addMoon("Umbriel", 1169/2, 20, 0x777777, 266300, 0.205, false, 4.1, true, lunaTextureMap)
    uranus.addMoon("Ariel", 1157/2, 20, 0x777777, 191020, 0.260, false, 2.5, true, lunaTextureMap)
    uranus.addMoon("Miranda", 471/2, 20, 0x777777, 129390, 4.232, false, 1.4, true, lunaTextureMap)
    let neptune = this.addPlanet('Neptune', 24622, 20, 0x4662F6, 4495000000, 6.43, 28, false, 60190, false, new THREE.TextureLoader().load('./assets/neptune-map.jpg'));
    neptune.addMoon("Triton", 2705/2, 20, 0x777777, 354759, 180-156.865, false, 5.8, true, lunaTextureMap)
  }

  applyScaleIfWanted(boolean: boolean): void {
    if (boolean) {
      this.RADIUS_RATIO = 10; // 10
      this.DISTANCE_RATIO = 8000; // 8000
      this.SUN_RADIUS_RATIO = 20; // 20
      this.cameraPos = [0, 18000, 52000] // X, Y, Z // 0, 18k, 52k
    }
  }

  initThree(): void {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 5000000000000);
    camera.position.set(this.cameraPos[0], this.cameraPos[1], this.cameraPos[2])
    var renderer = renderer = new THREE.WebGLRenderer({
      antialias: true, 
      logarithmicDepthBuffer: true
    });
    renderer.setPixelRatio (window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    const controls = new OrbitControls(camera, renderer.domElement);
    this.controls = controls;
    const texture = new THREE.TextureLoader().load(
      './assets/space-background' + spaceBackground + '.jpg',
      () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt.texture;
      });

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    document.body.appendChild(renderer.domElement);

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    let app = this
    var animate = function () {
      app.day += (app.timeRatio / 20);
      app.dayDisplay = Math.floor(app.day - app.startDay);
      app.distanceInAUDisplay = Math.round(app.distanceDisplay / 149600)/1000;
      app.distanceDisplay = app.getCameraDistance();
      requestAnimationFrame(animate);
      controls.update()
      app.onWindowResize();
      app.updatePlanetDistances();
      app.movePlanets(app.systems[app.currentSystem].planets);
      if (app.cameraMoving) app.moveCameraToPlanet()
      else {
        app.timeRatio = app.sliderValue;
        if (app.followPlanetName != null) app.followPlanet(app.followPlanetName);
      }
      if (app.sun != null) app.sun.model.rotation.y += (app.timeRatio/1000);
      renderer.render(scene, camera);
    };
    animate();
  }

  getCameraDistance(): number {
    const target = this.controls.target
    let distance = Math.sqrt(Math.abs(target.x**2) + Math.abs(target.z**2))
    distance = Math.sqrt(Math.abs(distance**2) + Math.abs(target.y**2))
    return Math.round(distance);
  }

  updatePlanetDistances(): void {
    for (let i = 0; i < this.systems[this.currentSystem].planets.length; i++) {
      let planet = this.systems[this.currentSystem].planets[i]
      planet.distance = planet.ORIGINAL_DISTANCE * this.scaleSliderValue;
    }
  }

  addPlanet(name: string, radius: number, detail: number, color: number, distance: number, inclination: number, axis: number, isStar: boolean, speed: number, clockwise: boolean, textureMap, moonOf?: Planet): Planet {
    let planet = new Planet(this, name, radius/this.RADIUS_RATIO, detail, color, distance/this.DISTANCE_RATIO, inclination, axis, isStar, speed, clockwise, textureMap, moonOf)
    if (!isStar) 
      this.systems[this.currentSystem].addPlanet(planet);
    console.log("Created planet: " + planet.name)
    return planet;
  }

  addRandomPlanet(): void {
    for (let index = 0; index < 1; index++) {
      const map = new THREE.TextureLoader().load('./assets/' + PLANET_MAPS[Math.floor(Math.random() * PLANET_MAPS.length)])
      const lunaMap = new THREE.TextureLoader().load('./assets/moon-map.jpg')
      const randomRadius = 50000 + (Math.random() * 100000)
      const planetName = 'New Planet ' + this.planetCounter
      const planet = this.addPlanet(
        planetName, //name
        randomRadius, //radius
        20, //detail
        0xff00ff, // color
        10000000 + (Math.random() * 20000000), // distance
        Math.random() * 30, // inclination
        Math.random() * 30, // Axis
        false, // isstar
        200 + (Math.random() * 1000), // speed
        false, // clockwise
        map // texture map
      );  
      let moonCounter = 1;
      for (let i = 0; i < Math.floor(Math.random() * 6); i++) {
        planet.addMoon(
          'Moon ' + this.planetCounter + " of " + planetName, //name
          (randomRadius / 20) + (Math.random() * randomRadius / 8), //radius
          20, //detail
          0x777777, // color
          (randomRadius * 6) + (Math.random() * randomRadius * 20), // distance
          Math.random() * 20, // inclination
          false, // isstar
          20 + (Math.random() * 40), // speed
          false, // clockwise
          lunaMap // texture map
        )   
      }
      this.planetCounter++;
      this.flyToPlanet(planetName)
    }
  }

  addNewSystem(): void {
    this.addSystem("New Solarsystem " + this.systemCounter);
    this.systemCounter++;
  }

  addSystem(systemName: string): void {
    this.systems.push(new Solarsystem(systemName))
    this.flyToPlanet(this.sun.name)
    this.switchToSystem(this.systems.length-1)
  }

  switchToSystem(systemIndex: number):  void {
    this.removeAllPlanetsFromScene()
    this.flyToPlanet(this.sun.name)
    this.currentSystem = systemIndex
    this.addAllPlanetsToScene()
  }

  getSystemIndex(name: string): number {
    for (let i = 0; i < this.systems.length; i++) {
      if (this.systems[i].name == name) return i    
    }
    return 0
  }

  removeAllPlanetsFromScene(): void {
    for (let i = 0; i < this.systems[this.currentSystem].planets.length; i++) {
      const planet = this.systems[this.currentSystem].planets[i]
      this.scene.remove(planet.model)
      this.scene.remove(planet.guideLine)
      for (let j = 0; j < planet.moons.length; j++) {
        const moon = planet.moons[j];
        this.scene.remove(moon.model)
        this.scene.remove(moon.guideLine)
      }
    }
  }

  addAllPlanetsToScene(): void {
    for (let i = 0; i < this.systems[this.currentSystem].planets.length; i++) {
      const planet = this.systems[this.currentSystem].planets[i]
      this.scene.add(planet.model)
      if (this.useGuideLines) this.scene.add(planet.guideLine)
      for (let j = 0; j < planet.moons.length; j++) {
        const moon = planet.moons[j]
        this.scene.add(moon.model)
        if (this.useGuideLines) this.scene.add(moon.guideLine)
      }
    }
  }

  createPlanet(radius: number, detail: number, color: number, distance: number, axis: number, isStar: boolean, textureMap?: string): void {
    let geometry = new THREE.SphereGeometry(radius, detail, detail)
    let material = new THREE.MeshStandardMaterial({
      color: color,
      map: textureMap,
    });
  
    if (isStar) {
      material = new THREE.MeshBasicMaterial({
        color: color,
        map: textureMap,
      });  
    }
  
    let planet = new THREE.Mesh(geometry, material);
    planet.position.set(distance, 0, 0)
  
    if (isStar) { 
      let pointLight = new THREE.PointLight(isStar)
      pointLight.position.set(distance, 0, 0)
      this.scene.add(pointLight);
    }
  
    planet.rotation.z = axis/180*Math.PI;

    this.scene.add(planet);
    return planet;
  }

  movePlanets(planets): void {
    for (let i = 0; i<planets.length; i++) {
      let planet  = planets[i];
      planet.oldX = planet.model.position.x;
      planet.oldY = planet.model.position.y;
      planet.oldZ = planet.model.position.z;    
      planet.angle = this.day / planet.speed * 360 % 360;
      let ratio = Math.cos(planet.inclination/180*Math.PI)
      
      if (planet.moonOf != null) {
        planet.guideLine.position.set(planet.moonOf.model.position.x, planet.moonOf.model.position.y, planet.moonOf.model.position.z) 
        planet.model.position.set(
          planet.moonOf.model.position.x + Math.sin(planet.angle/180*Math.PI) * ratio * planet.distance,
          planet.moonOf.model.position.y + Math.sin(planet.angle/180*Math.PI) * planet.distance * Math.sin(planet.inclination/180*Math.PI),
          planet.moonOf.model.position.z + Math.cos(planet.angle/180*Math.PI) * ratio * planet.distance
        )
      } else {
        planet.model.position.set(
          Math.sin(planet.angle/180*Math.PI) * ratio * planet.distance,
          Math.sin(planet.angle/180*Math.PI) * planet.distance * Math.sin(planet.inclination/180*Math.PI),
          Math.cos(planet.angle/180*Math.PI) * planet.distance
        )
      }
      this.movePlanets(planet.moons)
    }
  }

  onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  toggleGuideLines(): void {
    for (let i=0; i<this.systems[this.currentSystem].planets.length; i++) {
      const planet = this.systems[this.currentSystem].planets[i]
      if (this.useGuideLines) {
        this.scene.remove(planet.guideLine)
        for (let j = 0; j < planet.moons.length; j++)
          this.scene.remove(planet.moons[j].guideLine);
      } else {
          planet.createGuideLine()
          planet.showGuideLine();
          for (let j = 0; j < planet.moons.length; j++) {
            planet.moons[j].createGuideLine()
            planet.moons[j].showGuideLine();
          }
      }
    }
    this.useGuideLines = !this.useGuideLines
    console.log(this.useGuideLines)
  }

  toggleContactPage(): void {
    this.showContactPage = !this.showContactPage
  }

  flyToPlanet(planetName: string): void {
    if (planetName == this.sun.name) {
      this.followPlanetName = null;
      this.cameraMoving = false;
      this.controls.target.x = this.sun.model.position.x
      this.controls.target.y = this.sun.model.position.y
      this.controls.target.z = this.sun.model.position.z
      this.camera.position.set(this.cameraPos[0], this.cameraPos[1], this.cameraPos[2])
      return;
    } 
    this.followPlanetName = planetName
    this.cameraMoving = true;
  }

  moveCameraToPlanet(): void {
    if (this.followPlanetName == null) return;
    let planet = this.getPlanet(this.followPlanetName)
    let distance = planet.radius * 5
    let ratio = (planet.distance - distance) / planet.distance
    let destination = [planet.model.position.x * ratio, planet.model.position.y, planet.model.position.z * ratio]
  
    this.timeRatio = 0;
    this.camera.position.x += (destination[0] - this.camera.position.x) / this.cameraMoveSpeed
    this.camera.position.y += (destination[1] - this.camera.position.y) / this.cameraMoveSpeed
    this.camera.position.z += (destination[2] - this.camera.position.z) / this.cameraMoveSpeed
  
    this.controls.target.x += (planet.model.position.x - this.controls.target.x) / this.targetMoveSpeed  
    this.controls.target.y += (planet.model.position.y - this.controls.target.y) / this.targetMoveSpeed
    this.controls.target.z += (planet.model.position.z - this.controls.target.z) / this.targetMoveSpeed
  
    if (destination[0] - this.camera.position.x <= 100 && destination[0] - this.camera.position.x >= -100) {
      this.cameraMoving = false;
    }
  }

  followPlanet(name: string): void {
    let planet = this.getPlanet(name)
  
    this.controls.target.x = planet.model.position.x;
    this.controls.target.y = planet.model.position.y;
    this.controls.target.z = planet.model.position.z;
  
    this.camera.position.x += planet.model.position.x - planet.oldX;
    this.camera.position.y += planet.model.position.y - planet.oldY;
    this.camera.position.z += planet.model.position.z - planet.oldZ;
  }

  getPlanet(name: string): Planet {
    for (let i=0; i<this.systems[this.currentSystem].planets.length; i++) {
    const planet = this.systems[this.currentSystem].planets[i];
      if (planet.name == name) 
        return this.systems[this.currentSystem].planets[i];
      for (let j = 0; j < planet.moons.length; j++) {
        if (planet.moons[j].name == name)
        return planet.moons[j]; 
      }
    }
  }
}
