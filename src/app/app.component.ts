import { Component } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { Planet } from './model/planet.model';
import { UIController } from './controller/UIController';
import { Solarsystem } from './model/system.model';
import { Options } from '@angular-slider/ngx-slider';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { PlanetBuilderController } from './controller/PlanetBuilderController';
import { NightSkyController } from './controller/NightSkyController';
import { FlightController } from './controller/FlightController';
import { HostListener } from '@angular/core';

const FOV: number = 40; // 40
const SUN_RADIUS: number = 696000;
const SCALE_RATIOS: boolean = false;
const BLOOM_SCENE: number = 1;
const BLOOM_PARAMS = {
  bloomThreshold: 0,
  bloomStrength: 3, // 2
  bloomRadius: 0, // 1.5
};

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  keys = []

  REAL_TIME = 1/24/3600;

  ui: UIController = new UIController(this);
  pb: PlanetBuilderController = new PlanetBuilderController(this);
  nightSky: NightSkyController = new NightSkyController(this);
  fc: FlightController = new FlightController(this);

  test: boolean = true;

  scene: any;
  camera: any;
  renderer: any;
  controls: any;

  bloomLayer: any;
  bloomComposer: any;
  finalComposer: any;
  
  darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );
	materials = {};

  followPlanetName: string = null
  timeRatio: number = 1;
  cameraMoveSpeed: number = 20; // Higher is slower 20
  targetMoveSpeed: number = this.cameraMoveSpeed; 

  RADIUS_RATIO: number = 1;
  DISTANCE_RATIO: number = 1;
  SUN_RADIUS_RATIO: number = 1;
  cameraPos = [0, (250 * 10000), (-800 * 10000)] // X, Y, Z
  
  cameraMoving: boolean = false;
  useGuideLines: boolean = true;
 
  currentSystem: number = 0;
  systems = [new Solarsystem("The Solar System")];

  planetCounter: number = 1;
  systemCounter: number = 1;
  startDay: number = Math.floor(Math.random() * 22000000);
  day: number = this.startDay
  
  dayDisplay = 0
  distanceDisplay = 0;
  distanceInAUDisplay = 0;

  railedCam: boolean = false;
  flightMode: boolean = false;

  sun: Planet;

  flashlight;
  lightsOn: boolean = false;
  pov: boolean = false;
  
  sliderValue: number = this.timeRatio;
  options: Options = {
    floor: 0,
    ceil: 100
  };

  distanceRatio: number = 1;
  prevDistanceRatio: number = 1;
  scaleOptions: Options = {
    floor: 0.02,
    ceil: 2,
    step: 0.02
  };

  zoomOptions: Options = {
    floor: 0.5,
    ceil: 10,
    step: 0.5
  };

  unit: string = "AU"
  showBloom: boolean = false;

  old = this.timeRatio;

  constructor() {
    this.setup() 
  }

  private setup(): void {
    this.applyScaleIfWanted(SCALE_RATIOS)
    this.initThree()
    this.initTheSolarSystem()
    if (window.innerWidth < 768) {
      this.ui.mobile = true;
    }
    this.nightSky.init();
    this.nightSky.drawConstellations();
  }

  private initTheSolarSystem(): void {
    const moonTextureMap = new THREE.TextureLoader().load('./assets/maps/moon-map.jpg')
    this.sun = this.addPlanet('Sun', SUN_RADIUS/this.SUN_RADIUS_RATIO, 40, 0, 0, 0, 0, true, 0, null, new THREE.TextureLoader().load('./assets/maps/sun-map.jpg'), 28*24);
    this.sun.model.layers.enable(BLOOM_SCENE)
    this.addPlanet('Mercury', 2440, 20, 0x777777, 57910000, 3.38, 2, false, 88, false, new THREE.TextureLoader().load('./assets/maps/mercury-map.jpg'), 59*24);
    this.addPlanet('Venus', 6052, 20, 0x7A381C, 108200000, 3.86, 2.7, false, 225, true, new THREE.TextureLoader().load('./assets/maps/venus-map.jpg'), 243 * 24);
    let earth = this.addPlanet('Earth', 6371, 20, 0x243E49, 149600000, 7.155, 23.4, false, 365, false, new THREE.TextureLoader().load('./assets/maps/earth-map2.jpg'), 24);
    earth.addMoon('Moon', 1737, 20, 0x777777, 384400, 5.14, false, 27, true, moonTextureMap)
    let mars = this.addPlanet('Mars', 3390, 20, 0xAC6349, 227900000, 5.65, 25, false, 687, false, new THREE.TextureLoader().load('./assets/maps/mars-map.jpg'), 24.6);
    mars.addMoon("Phobos", 11.1, 20, 0x777777, 9377, 1.093, false, 0.463, true, moonTextureMap)
    mars.addMoon("Deimons", 6.3, 20, 0x777777, 23460, 0.93, false, 5.44, true, moonTextureMap)
    let jupiter = this.addPlanet('Jupiter', 69911, 20, 0x9F8E7A, 778500000, 6.09, 3, false, 4332, false, new THREE.TextureLoader().load('./assets/maps/jupiter-map.jpg'), 9.5);
    jupiter.addMoon('Ganymede', 5268/2, 20, 0x999999, 1070412, 0.204, false, 7.1546, false, new THREE.TextureLoader().load('./assets/maps/moon-map.jpg'))
    jupiter.addMoon('Callisto', 4820/2, 20, 0x555555, 1882709, 0.205, false, 16.689, false, new THREE.TextureLoader().load('./assets/maps/moon-map.jpg'))
    jupiter.addMoon('Io', 3643/2, 20, 0xD0C757, 421700, 0.050, false, 1.7691, false, new THREE.TextureLoader().load('./assets/maps/moon-map.jpg'))
    jupiter.addMoon('Europa', 3121/2, 20, 0x856033, 671034, 0.471, false, 3.5512, false, new THREE.TextureLoader().load('./assets/maps/moon-map.jpg'))
    let saturn = this.addPlanet('Saturn', 58232, 20, 0xB2915F, 1434000000, 5.51, 26.73, false, 10757, false, new THREE.TextureLoader().load('./assets/maps/saturn-map.jpg'), 10.5);
    saturn.addRing(136780, 136780-74500, new THREE.TextureLoader().load('./assets/maps/rings.png'))
    saturn.addMoon("Titan", 5149/2, 20, 0x777777, 1221870, 0.349, false, 16, true, moonTextureMap)
    saturn.addMoon("Rhea", 1527/2, 20, 0x777777, 527108, 0.327, false, 4.5, true, moonTextureMap)
    saturn.addMoon("Lapetus", 1470/2, 20, 0x777777, 3560820, 15.470, false, 79, true, moonTextureMap)
    saturn.addMoon("Dione", 1123/2, 20, 0x777777, 377396, 0.002, false, 2.7, true, moonTextureMap)
    saturn.addMoon("Tethys", 1062/2, 20, 0x777777, 294619, 0.168, false, 1.9, true, moonTextureMap)
    saturn.addMoon("Enceladus", 504/2, 20, 0x777777, 237948, 0.010, false, 1.4, true, moonTextureMap)
    saturn.addMoon("Mimas", 396/2, 20, 0x777777, 185539, 1.566, false, 0.9, true, moonTextureMap)
    let uranus = this.addPlanet('Uranus', 25362, 20, 0x8EB2C4, 2871000000, 6.48, 97.77, false, 30687, false, new THREE.TextureLoader().load('./assets/maps/uranus-map.jpg'), 7.25);
    uranus.addMoon("Titania", 1576/2, 20, 0x777777, 435910, 0.340, false, 8.7, true, moonTextureMap)
    uranus.addMoon("Oberon", 1522/2, 20, 0x777777, 583520, 0.058, false, 13.4, true, moonTextureMap)
    uranus.addMoon("Umbriel", 1169/2, 20, 0x777777, 266300, 0.205, false, 4.1, true, moonTextureMap)
    uranus.addMoon("Ariel", 1157/2, 20, 0x777777, 191020, 0.260, false, 2.5, true, moonTextureMap)
    uranus.addMoon("Miranda", 471/2, 20, 0x777777, 129390, 4.232, false, 1.4, true, moonTextureMap)
    let neptune = this.addPlanet('Neptune', 24622, 20, 0x4662F6, 4495000000, 6.43, 28, false, 60190, false, new THREE.TextureLoader().load('./assets/maps/neptune-map.jpg'), 16);
    neptune.addMoon("Triton", 2705/2, 20, 0x777777, 354759, 180-156.865, false, 5.8, true, moonTextureMap)
  }

  applyScaleIfWanted(boolean: boolean): void {
    if (boolean) {
      this.RADIUS_RATIO = 10; // 10
      this.DISTANCE_RATIO = 8000; // 8000
      this.SUN_RADIUS_RATIO = 20; // 20
      this.cameraPos = [0, 18000, 52000] // 0, 18000, 52000
    }
  }

  initThree(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 500000000000000000);
    this.camera.position.set(this.cameraPos[0], this.cameraPos[1], this.cameraPos[2])
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, 
      logarithmicDepthBuffer: true
    });
    
    this.renderer.setPixelRatio (window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls = controls;
    this.initBloom();
    this.flashlight = new THREE.PointLight(0xffffff)
    document.body.appendChild(this.renderer.domElement);

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    let app = this
    var animate = function () {
      app.day += (app.timeRatio / 120);
      app.dayDisplay = Math.floor(app.day - app.startDay);
      app.distanceInAUDisplay = Math.round(app.distanceDisplay / 149600)/1000;
      app.distanceDisplay = app.getCameraDistance();
      requestAnimationFrame(animate);
      controls.update()
      app.onWindowResize();
      app.updatePlanetDistances();
      app.movePlanets(app.systems[app.currentSystem].planets);
      app.rotatePlanets(app.systems[app.currentSystem].planets)
      
      if (app.cameraMoving) app.moveCameraToPlanet()
      else {
        app.timeRatio = app.sliderValue;
        if (app.pov) app.povCamera()
        else if (app.flightMode) {
          if (app.fc.target.x == -1) app.fc.setTarget(app.controls.target.x, app.controls.target.y, app.controls.target.z)
          app.fc.control(app.keys);
        }
        else if (app.followPlanetName != null) app.followPlanet(app.followPlanetName);
        
      }
      if (app.sun != null) app.sun.model.rotation.y += (app.timeRatio/1000);
      if (app.lightsOn) app.flashlight.position.set(app.camera.position.x, app.camera.position.y, app.camera.position.z)
      app.checkDistanceRatio()
      app.render()
    };
    animate();
  }

  rotatePlanets(planets: Planet[]) {
    planets.forEach((planet) => {
      planet.model.rotateOnAxis(new THREE.Vector3(0, 1, 0).normalize(), planet.rotationSpeed/24*this.timeRatio/180*Math.PI*3)
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    if (!this.showBloom) return;
    this.scene.traverse( (obj) => {
      if (obj.isMesh && this.bloomLayer.test( obj.layers ) === false) {
        this.materials[ obj.uuid ] = obj.material;
        obj.material = this.darkMaterial;
      } 
    });
    this.bloomComposer.render();
    this.scene.traverse( (obj) => {
      if ( this.materials[ obj.uuid ] ) {
        obj.material = this.materials[ obj.uuid ];
        delete this.materials[ obj.uuid ];
      } 
    } );
    this.finalComposer.render();
  }

  checkDistanceRatio() {
    if (!this.useGuideLines) return;
    if (this.distanceRatio == this.prevDistanceRatio) return;
    this.prevDistanceRatio = this.distanceRatio;
    this.toggleGuideLines()
    this.toggleGuideLines()
  }

  initBloom() {
    this.bloomLayer = new THREE.Layers();
    this.bloomLayer.set( BLOOM_SCENE )
    const renderScene = new RenderPass( this.scene, this.camera );
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ),  1.5, 0.4, 0.85 );
    bloomPass.threshold = BLOOM_PARAMS.bloomThreshold;
    bloomPass.strength = BLOOM_PARAMS.bloomStrength;
    bloomPass.radius = BLOOM_PARAMS.bloomRadius;

    this.bloomComposer = new EffectComposer( this.renderer );
    this.bloomComposer.renderToScreen = false;
    this.bloomComposer.addPass( renderScene );
    this.bloomComposer.addPass( bloomPass );

    const finalPass = new ShaderPass(
      new THREE.ShaderMaterial( {
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
        },
        vertexShader: document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        defines: {}
      } ), "baseTexture"
    );
    finalPass.needsSwap = true;

    this.finalComposer = new EffectComposer( this.renderer );
    this.finalComposer.addPass( renderScene );
    this.finalComposer.addPass( finalPass );
  }

  getCameraDistance(): number {
    let target = this.controls.target
    if (this.pov) target = this.camera.position
    let distance = Math.sqrt(Math.abs(target.x**2) + Math.abs(target.z**2))
    distance = Math.sqrt(Math.abs(distance**2) + Math.abs(target.y**2))
    return Math.round(distance);
  }

  updatePlanetDistances(): void {
    this.systems[this.currentSystem].planets.forEach((planet) => {
      planet.distance = planet.ORIGINAL_DISTANCE * this.distanceRatio;
    });
  }

  addPlanet(name: string, radius: number, detail: number, color: number, distance: number, inclination: number, axis: number, isStar: boolean, speed: number, clockwise: boolean, textureMap, rotationSpeed: number, moonOf?: Planet): Planet {
    let planet = new Planet(this, name, radius/this.RADIUS_RATIO, detail, color, distance/this.DISTANCE_RATIO, inclination, axis, isStar, speed, clockwise, textureMap, moonOf, rotationSpeed)
    if (!isStar) 
      this.systems[this.currentSystem].addPlanet(planet);

    return planet;
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
    this.ui.navCurrentPage = 1;
    this.removeAllPlanetsFromScene()
    this.flyToPlanet(this.sun.name)
    this.currentSystem = systemIndex
    this.addAllPlanetsToScene()
  }

  getSystemIndex(name: string): number {
    return this.systems.findIndex((system) => system.name == name);
  }

  removeAllPlanetsFromScene(): void {
    this.systems[this.currentSystem].planets.forEach((planet) => {
      this.scene.remove(planet.model)
      this.scene.remove(planet.guideLine)
      planet.moons.forEach((moon) => {
        this.scene.remove(moon.model)
        this.scene.remove(moon.guideLine)
      });
    });
  }

  addAllPlanetsToScene(): void {
    this.systems[this.currentSystem].planets.forEach((planet) => {
      this.scene.add(planet.model)
      if (this.useGuideLines) this.scene.add(planet.guideLine)
      planet.moons.forEach((moon) => {
        this.scene.add(moon.model)
        if (this.useGuideLines) this.scene.add(moon.guideLine)
      });
    });
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

  movePlanets(planets: Planet[]): void {
    planets.forEach((planet) => {
      planet.oldX = planet.model.position.x;
      planet.oldY = planet.model.position.y;
      planet.oldZ = planet.model.position.z;
      planet.angle = this.day / planet.speed * 360 % 360;
      let ratio = Math.cos(planet.inclination/180*Math.PI)
      
      if (planet.moonOf != null) { // If the planet is a moon
        planet.guideLine.position.set(planet.moonOf.model.position.x, planet.moonOf.model.position.y, planet.moonOf.model.position.z) 
        planet.model.position.set(
          planet.moonOf.model.position.x + Math.sin(planet.angle/180*Math.PI) * ratio * planet.distance,
          planet.moonOf.model.position.y + Math.sin(planet.angle/180*Math.PI) * planet.distance * Math.sin(planet.inclination/180*Math.PI),
          planet.moonOf.model.position.z + Math.cos(planet.angle/180*Math.PI) * planet.distance
        )
      } else { // If the planet is not a moon
        planet.model.position.set(
          Math.sin(planet.angle/180*Math.PI) * ratio * planet.distance,
          Math.sin(planet.angle/180*Math.PI) * planet.distance * Math.sin(planet.inclination/180*Math.PI),
          Math.cos(planet.angle/180*Math.PI) * planet.distance
        )
        if (planet.ring != null) { // if the planet has a ring
          planet.ring.position.set(planet.model.position.x, planet.model.position.y, planet.model.position.z)
        }
      }

      planet.guideLine.rotation.z = (planet.angle/180*Math.PI - (Math.PI / 2)) * -1
      this.movePlanets(planet.moons)
    });
  }

  onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  toggleGuideLines(): void {
    this.setGuideLines(!this.useGuideLines)
  }

  setGuideLines(status: boolean) {
    this.useGuideLines = status;
    this.systems[this.currentSystem].planets.forEach((planet) => {
      if (!status) {
        this.scene.remove(planet.guideLine)
        planet.moons.forEach((moon) => this.scene.remove(moon.guideLine))
      } else {
          planet.createGuideLine()
          planet.moons.forEach((moon) => {
            moon.createGuideLine()
          });
      }
    });
  }

  flyToPlanet(planetName: string): void {
    if (planetName == this.sun.name) {
      this.followPlanetName = null;
      this.cameraMoving = false;
      this.ui.showInfoPanel = false;
      this.controls.target.x = this.sun.model.position.x
      this.controls.target.y = this.sun.model.position.y
      this.controls.target.z = this.sun.model.position.z
      this.camera.position.set(this.cameraPos[0], this.cameraPos[1], this.cameraPos[2])
      return;
    } 
    if (!this.ui.mobile) this.ui.showInfoPanel = true;
    if (this.getPlanet(planetName).moons.length == 0 && this.ui.mobile) this.ui.showNav = false;
    this.followPlanetName = planetName
    this.cameraMoving = true;
    this.ui.showSettings = false;
    const planet = this.getPlanet(planetName)
    if (planet.moons.length > 0) {
      this.ui.navCurrentPage = 2;
    }
  }

  moveCameraToPlanet(): void {
    if (this.followPlanetName == null) return;
    let planet = this.getPlanet(this.followPlanetName)
    let distance = planet.radius * 5
    let ratio = (planet.distance - distance) / planet.distance
    
    if (planet.moonOf != null) {
      ratio = (planet.moonOf.distance - distance) / planet.moonOf.distance
    }

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
    let ratio = (planet.distance - planet.radius*5) / planet.distance
    if (planet.moonOf != null) {
      ratio = (planet.moonOf.distance - planet.radius*5) / planet.moonOf.distance
    }

    this.controls.target.set(planet.model.position.x, planet.model.position.y, planet.model.position.z)

    if (this.railedCam) {
      this.camera.position.set(planet.model.position.x * ratio, planet.model.position.y * ratio, planet.model.position.z * ratio);
    } else {
      this.camera.position.x += planet.model.position.x - planet.oldX;
      this.camera.position.y += planet.model.position.y - planet.oldY;
      this.camera.position.z += planet.model.position.z - planet.oldZ;
    }
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

  toggleLight(): void {
    this.lightsOn = !this.lightsOn;
    if (this.lightsOn) this.scene.add(this.flashlight)
    else this.scene.remove(this.flashlight)
  }

  togglePOV(): void {
    this.pov = !this.pov;
    this.controls.target.set(0,0,0)
    if (!this.pov) {
      const planet = this.getPlanet(this.followPlanetName)
      let ratio = (planet.distance - (planet.radius * 10)) / planet.distance;
      if (planet.moonOf != null) ratio = (planet.distance + planet.moonOf.distance - (planet.radius * 10)) / (planet.distance + planet.moonOf.distance);
      this.controls.target.set(planet.model.position.x, planet.model.position.y, planet.model.position.z)
      this.camera.position.set(planet.model.position.x * ratio, planet.model.position.y, planet.model.position.z * ratio) 
      this.flyToPlanet(this.followPlanetName)
    }
  }

  povCamera() {
    if (this.followPlanetName == null) return;
    const planet = this.getPlanet(this.followPlanetName)
    this.camera.position.set(planet.model.position.x, planet.model.position.y, planet.model.position.z)
    if (planet.moonOf != null) this.camera.lookAt(planet.moonOf.model.position.x, planet.moonOf.model.position.y, planet.moonOf.model.position.z)
  }

  getDistanceDisplay(unit: string) {
    switch (unit) {
      case "km":
        return this.distanceDisplay
      case "mi":
        return Math.round(this.distanceDisplay * 0.621371)
      case "AU":
        return Math.round(this.distanceDisplay / 149600)/1000
      default:
        break;
    }
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEventDown(event: KeyboardEvent) { 
    if (this.keys.find((k) => k == event.key) != null) return;
    this.keys.push(event.key)
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEventUp(event: KeyboardEvent) { 
    this.keys = this.keys.filter((k) => k != event.key)
  }
}
