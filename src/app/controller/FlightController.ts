import { typeWithParameters } from "@angular/compiler/src/render3/util";
import { AppComponent } from "../app.component";
import * as THREE from 'three';
// import { FlyControls } from './jsm/controls/FlyControls.js';


export class FlightController {
    app: AppComponent;
    speed = 0.001;
    turnSpeed = 50000;
    target = {
        x: -1,
        y: -1,
        z: -1
    }
    
    constructor(app: AppComponent) {
        this.app = app;
    }

    control(keys: string[]) {
        keys.forEach((k) => {
            switch(k) {
                case 'w':
                    this.target.y -= this.turnSpeed
                case 'a':
                    this.target.x -= this.turnSpeed
                case 's':
                    this.target.y += this.turnSpeed
                case 'd':
                    this.target.x += this.turnSpeed
            }    
        })

        console.log(keys)
        
        this.moveCamera(this.app.camera.position, this.target)
        this.app.camera.lookAt(this.target.x, this.target.y, this.target.z)
    }

    private moveCamera(cPos, tPos): void {
        this.app.camera.position.set(
            cPos.x + ((tPos.x - cPos.x) * this.speed),
            cPos.y + ((tPos.y - cPos.y) * this.speed),
            cPos.z + ((tPos.z - cPos.z) * this.speed)
        )

        this.target.x = tPos.x + ((tPos.x - cPos.x) * this.speed)
        this.target.y = tPos.y + ((tPos.y - cPos.y) * this.speed)
        this.target.z = tPos.z + ((tPos.z - cPos.z) * this.speed)
    }

    setTarget(x: number, y: number, z: number): void {
        this.target.x = x;
        this.target.y = y;
        this.target.z = z;
    }
}