import * as THREE from 'three'
import { AppComponent } from '../app.component';

const GUIDELINE_RATIO = 10;

export class Planet {
    ORIGINAL_DISTANCE: number;
    app: AppComponent;
    name: string;
    radius: number;
    detail: number;
    color: string;
    distance: number;
    isStar: boolean;
    speed: number;
    clockwise: boolean;
    model: any;
    guideLine: any;
    angle: number;
    textureMap: any;
    oldX: number; oldY: number; oldZ: number;
    moons: Planet[]
    moonOf: Planet
  
    constructor(app: AppComponent, name: string, radius: number, detail: number, color: number, distance: number, isStar: boolean, speed: number, clockwise: boolean, textureMap: any, moonOf: Planet) {
      this.app = app
      this.name = name;
      this.radius = radius;
      this.detail = detail;
      this.color = "#" + color.toString(16);
      this.distance = distance;
      this.ORIGINAL_DISTANCE = distance;
      this.isStar = isStar;
      this.speed = speed;
      this.clockwise = clockwise;
      this.textureMap = textureMap;
      if (textureMap == null) {
        this.model = app.createPlanet(radius, detail, color, distance, isStar)
      } else {
        this.model = app.createPlanet(radius, detail, null, distance, isStar, textureMap)
      }
      if (!isStar) this.createGuideLine();
      this.moons = [];
      this.moonOf = moonOf
    }
  
    createGuideLine() {
      let g = new THREE.TorusGeometry(this.distance, this.radius/GUIDELINE_RATIO, 10, 2000)
      let m = new THREE.MeshBasicMaterial({
        color: this.color,
      });
  
      let t = new THREE.Mesh(g, m);
      t.rotation.x = 90/180*Math.PI
      t.position.set(0,0,0)
      this.guideLine = t
      if (this.app.useGuideLines) this.showGuideLine();
    }
  
    showGuideLine() {
      this.app.scene.add(this.guideLine);
    }

    removeGuideLine() {
      this.app.scene.remove(this.guideLine);
    }

    addMoon(moon: Planet) {
      moon.moonOf = this
      this.moons.push(moon)
      this.app.scene.add(moon.model)
    }
  }