import { Component } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { Planet } from './model/planet.model';
import { Solarsystem } from './model/system.model';
import { Options } from '@angular-slider/ngx-slider';

const FOV = 40;
const SUN_RADIUS = 696000;
const spaceBackground = 8;
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
  name = 'Angular';

  scene;
  camera;
  renderer;
  controls;

  followPlanetName = null
  timeRatio = 1;
  cameraMoveSpeed = 20; // Higher is slower 40
  targetMoveSpeed = this.cameraMoveSpeed; 

  RADIUS_RATIO = 1;
  DISTANCE_RATIO = 1;
  SUN_RADIUS_RATIO = 1;
  cameraPos = [0, (250 * 10000), (800 * 10000)] // X, Y, Z
  
  cameraMoving = false;
  useGuideLines = true;
  showUI = true;
  showAddPlanetMenu = false;
  
  currentSystem = 0;
  systems = [new Solarsystem("The Solar System")];

  n = 1;
  m = 1;
  day = Math.floor(Math.random() * 22000000);

  sun;

  sliderValue = this.timeRatio;
  options: Options = {
    floor: 0,
    ceil: 100
  };

  scaleSliderValue = 1;
  scaleOptions: Options = {
    floor: 0.015,
    ceil: 1,
    step: 0.001
  };

  constructor() {
    this.setup() 
  }

  setup() {
    this.applyScaleIfWanted(SCALE_RATIOS)
    this.initThree()
    this.initTheSolarSystem()
  }

  initTheSolarSystem() {
    this.sun = this.addPlanet('Sun', SUN_RADIUS/this.SUN_RADIUS_RATIO, 40, 0xAAAA00, 0, true, 0, null, new THREE.TextureLoader().load('./assets/sun-map.jpg'));
    this.addPlanet('Mercury', 2440, 20, 0x777777, 57910000, false, 88, false, new THREE.TextureLoader().load('./assets/mercury-map.jpg'));
    this.addPlanet('Venus', 6052, 20, 0x7A381C, 108200000, false, 225, true, new THREE.TextureLoader().load('./assets/venus-map.jpg'));
    let earth = this.addPlanet('Earth', 6371, 20, 0x243E49, 149600000, false, 365, false, new THREE.TextureLoader().load('./assets/earth-map2.jpg'));
    // earth.addMoon(new Planet(this, 'Luna', 1737, 20, 0x777777, 384400, false, 27, true, new THREE.TextureLoader().load('./assets/moon-map.jpg')))
    this.addPlanet('Luna', 1737, 20, 0x777777, 384400, false, 27, false, new THREE.TextureLoader().load('./assets/moon-map.jpg'), earth)
    this.addPlanet('Mars', 3390, 20, 0xAC6349, 227900000, false, 687, false, new THREE.TextureLoader().load('./assets/mars-map.jpg'));
    let jupiter = this.addPlanet('Jupiter', 69911, 20, 0x9F8E7A, 778500000, false, 4332, false, new THREE.TextureLoader().load('./assets/jupiter-map.jpg'));
    this.addPlanet('Ganymede', 5268/2, 20, 0x999999, 1070412, false, 7.1546, false, new THREE.TextureLoader().load('./assets/moon-map.jpg'), jupiter)
    this.addPlanet('Callisto', 4820/2, 20, 0x555555, 1882709, false, 16.689, false, new THREE.TextureLoader().load('./assets/moon-map.jpg'), jupiter)
    this.addPlanet('Io', 3643/2, 20, 0xD0C757, 421700, false, 1.7691, false, new THREE.TextureLoader().load('./assets/moon-map.jpg'), jupiter)
    this.addPlanet('Europa', 3121/2, 20, 0x856033, 671034, false, 3.5512, false, new THREE.TextureLoader().load('./assets/moon-map.jpg'), jupiter)
    this.addPlanet('Saturn', 58232, 20, 0xB2915F, 1434000000, false, 10757, false, new THREE.TextureLoader().load('./assets/saturn-map.jpg'));
    this.addPlanet('Uranus', 25362, 20, 0x8EB2C4, 2871000000, false, 30687, false, new THREE.TextureLoader().load('./assets/uranus-map.jpg'));
    this.addPlanet('Neptune', 24622, 20, 0x4662F6, 4495000000, false, 60190, false, new THREE.TextureLoader().load('./assets/neptune-map.jpg'));
  }

  applyScaleIfWanted(boolean): void {
    if (boolean) {
      this.RADIUS_RATIO = 10;
      this.DISTANCE_RATIO = 8000;
      this.SUN_RADIUS_RATIO = 20;
      this.cameraPos = [0, 18000, 54000] // X, Y, Z
    }
  }

  initThree(): void {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 5000000000000);
    camera.position.set(this.cameraPos[0], this.cameraPos[1], this.cameraPos[2])
    var renderer = renderer = new THREE.WebGLRenderer({
      // canvas: document.querySelector('#bg'),
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
      if (app.sun != null) app.sun.model.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();
  }

  updatePlanetDistances() {
    for (let i = 0; i < this.systems[this.currentSystem].planets.length; i++) {
      let planet = this.systems[this.currentSystem].planets[i]
      planet.distance = planet.ORIGINAL_DISTANCE * this.scaleSliderValue;
    }
  }

  addPlanet(name, radius, detail, color, distance, isStar, speed, clockwise, textureMap, moonOf?) {
    let planet = new Planet(this, name, radius/this.RADIUS_RATIO, detail, color, distance/this.DISTANCE_RATIO, isStar, speed, clockwise, textureMap, moonOf)
    if (!isStar) 
      this.systems[this.currentSystem].addPlanet(planet);
    console.log("Created planet: " + planet.name)
    return planet;
  }

  addRandomPlanet() {
    let map = new THREE.TextureLoader().load('./assets/' + PLANET_MAPS[Math.floor(Math.random() * PLANET_MAPS.length)])
    this.addPlanet('New Planet ' + this.n, 50000 + (Math.random() * 100000), 20, 0xff00ff, 2000000 + (Math.random() * 20000000), false, 1 + (Math.random() * 9), false, map);
    this.n++;
  }

  addNewPlanet() {
    // this.showAddPlanetMenu = true;
    this.addRandomPlanet();
  }

  addNewSystem() {
    this.addSystem("New Solarsystem " + this.m);
    this.m++;
  }

  addSystem(systemName) {
    this.systems.push(new Solarsystem(systemName))
    this.switchToSystem(this.systems.length-1)
  }

  switchToSystem(systemIndex) {
    this.removeAllPlanetsFromScene()
    this.currentSystem = systemIndex
    this.addAllPlanetsToScene()
  }

  getSystemIndex(name) {
    for (let i = 0; i < this.systems.length; i++) {
      if (this.systems[i].name == name) return i    
    }
    return 0
  }

  removeAllPlanetsFromScene() {
    for (let i = 0; i < this.systems[this.currentSystem].planets.length; i++) {
      this.scene.remove(this.systems[this.currentSystem].planets[i].model)
      this.scene.remove(this.systems[this.currentSystem].planets[i].guideLine)
    }
  }

  addAllPlanetsToScene() {
    for (let i = 0; i < this.systems[this.currentSystem].planets.length; i++) {
      this.scene.add(this.systems[this.currentSystem].planets[i].model)
      if (this.useGuideLines) this.scene.add(this.systems[this.currentSystem].planets[i].guideLine)
    }
  }

  createPlanet(radius: number, detail: number, color: number, distance: number, isStar: boolean, textureMap?: string) {
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
  
    this.scene.add(planet);
    return planet;
  }

  movePlanets(planets) {
    this.day += this.timeRatio;
    for (let i = 0; i<planets.length; i++) {
      let planet  = planets[i];
      planet.oldX = planet.model.position.x;
      planet.oldY = planet.model.position.y;
      planet.oldZ = planet.model.position.z;    
      planet.angle = this.day /planet.speed %360;
      
      if (planet.moonOf != null) {
        planet.guideLine.position.set(planet.moonOf.model.position.x, planet.moonOf.model.position.y, planet.moonOf.model.position.z) 
        if (planet.clockwise) {
          planet.model.position.set(
            planet.moonOf.model.position.x + Math.cos(planet.angle/180*Math.PI) * planet.distance,
            0,
            planet.moonOf.model.position.z + Math.sin(planet.angle/180*Math.PI) * planet.distance
          )
        } else {
          planet.model.position.set(
            planet.moonOf.model.position.x + Math.sin(planet.angle/180*Math.PI) * planet.distance,
            0,
            planet.moonOf.model.position.z + Math.cos(planet.angle/180*Math.PI) * planet.distance
          )
        }
      } else {
        if (planet.clockwise) {
          planet.model.position.set(
            Math.cos(planet.angle/180*Math.PI) * planet.distance,
            0,
            Math.sin(planet.angle/180*Math.PI) * planet.distance
          )
        } else {
          planet.model.position.set(
            Math.sin(planet.angle/180*Math.PI) * planet.distance,
            0,
            Math.cos(planet.angle/180*Math.PI) * planet.distance
          )
        }
      }
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  toggleGuideLines() {
    for (let i=0; i<this.systems[this.currentSystem].planets.length; i++) {
      let planet = this.systems[this.currentSystem].planets[i]
      if (this.useGuideLines) this.scene.remove(planet.guideLine)
      else {
          planet.createGuideLine()
          planet.showGuideLine();
        // this.scene.add(this.systems[this.currentSystem].planets[i].guideLine)
      }
    }
    this.useGuideLines = !this.useGuideLines
  }

  flyToPlanet(planetName) {
    if (planetName == this.sun.name) {
      this.followPlanetName = null;
      this.cameraMoving = false;
      this.controls.target.x = this.sun.model.position.x
      this.controls.target.y = this.sun.model.position.y
      this.controls.target.z = this.sun.model.position.z
      // this.timeRatio = parseInt(this.slider.value)
      this.camera.position.set(this.cameraPos[0], this.cameraPos[1], this.cameraPos[2])
      return;
    } 
    this.followPlanetName = planetName
    this.cameraMoving = true;
  }

  moveCameraToPlanet() {
    if (this.followPlanetName == null) return;
    let planet = this.getPlanet(this.followPlanetName)
    let distance = planet.radius * 5
    let ratio = (planet.distance - distance) / planet.distance
    let destination = [planet.model.position.x * ratio, planet.radius, planet.model.position.z * ratio]
  
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

  followPlanet(name) {
    let planet = this.getPlanet(name)
  
    this.controls.target.x = planet.model.position.x;
    this.controls.target.y = planet.model.position.y;
    this.controls.target.z = planet.model.position.z;
  
    this.camera.position.x += planet.model.position.x - planet.oldX;
    this.camera.position.y += planet.model.position.y - planet.oldY;
    this.camera.position.z += planet.model.position.z - planet.oldZ;
  }

  getPlanet (name) {
    for (let i=0; i<this.systems[this.currentSystem].planets.length; i++) 
      if (this.systems[this.currentSystem].planets[i].name == name) 
        return this.systems[this.currentSystem].planets[i];
  }
}
