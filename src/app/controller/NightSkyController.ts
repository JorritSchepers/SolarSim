import { AppComponent } from "../app.component";
import { Stars } from "../../assets/starsJson";
import * as THREE from 'three';
import { Star } from "../model/star.model";

export class NightSkyController {
    app: AppComponent;
    stars: Star[] = [];
    cHips = [
        [59774, 54061, 53910, 58001, 59774, 62956, 65378, 67301], // Ursula Major
        [11767, 85822, 82080, 77055, 79822, 75097, 72607, 77055], // Ursa Minor
        [746, 3179, 4427, 6686, 8886], // Cassiopeia
        [27366, 26727, 26311, 25930, 26311, 26727, 27989
            , 28614, 29038, 28716, 27913, 29038, 28614 // Orion - Bat
            , 27989, 26207, 25336 // Orion - Head
            , 22449, 22509, 22845, 22957, 22845, 22509, 22449, 22549, 22797, 23123, 22797, 22549, 22449 // Orion - Shield 
            , 25336, 25930, 24436, 27366], // Orion
        [47908, 48455, 50335, 50583, 54872, 57632, 54879, 49583, 50583], // Leo
        [56211, 61281, 68756, 75458, 78527, 80331, 83895, 89908, 94376, 87585, 87833, 85670, 85829, 87585], // Draco
        [85696, 86670, 87073, 86228, 84143, 82729, 82514, 82396, 81266, 80763, 80112, 78401, 78820, 79374, 78820, 78401, 78265, 78104] // Scorpius
    ]
    constellations = [];
    n = 1;
    map: any = new THREE.TextureLoader().load('./assets/maps/star-map.png')

    constructor(app: AppComponent) {
        this.app = app;    
    }

    public init(): void {
        new Stars().stars.forEach((s) => {
            const threshold = 5;
            const red = "rgb(255, 150, 150)"
            const blue = "rgb(180, 180, 255)"
            let colorString = red
            if (s.mag < threshold) colorString = blue
            const size = (1/s.mag) * 30000000000  * 5 // 30B
            // const g = new THREE.SphereGeometry(size, 10, 10);
            const g = new THREE.BoxGeometry(size, size, size)
            const m = new THREE.MeshBasicMaterial( {
                color: colorString,
                map: this.map
            });
            const star = new Star(s.hip, s.x, s.y, s.z, s.mag)
            this.stars.push(star)
            const planet = new THREE.Mesh(g, m);
            planet.position.set(s.x, s.y, s.z)
            planet.lookAt(0,0,0)
            if (s.mag < threshold) planet.layers.enable(1)
            this.app.scene.add(planet)
        })
    }   

    public drawConstellations(): void {
        this.cHips.forEach(c => {
            const points = [];
            c.forEach(cHip => {
                const star = this.stars.find(s => s.hip == cHip)
                if (star != null) points.push(new THREE.Vector3(star.x, star.y, star.z));
                else console.warn("Did not find the star with HIP-code: " + cHip)
            });
            if (points.length != 0) this.drawLine(points)
        });
    }

    private drawLine(points: THREE.Vector3[]): void {
        const g = new THREE.BufferGeometry().setFromPoints(points);
        const m = new THREE.LineBasicMaterial({
            color: "rgb(200, 200, 255)"
        });
        const line = new THREE.Line( g, m );
        line.layers.enable(1)
        this.constellations.push(line)
        this.app.scene.add( line );
    }

    showConstellations() {
        this.constellations.forEach((c) => this.app.scene.add(c));
    }
    
    removeConstellations() {
        this.constellations.forEach((c) => this.app.scene.remove(c));
    }
}
