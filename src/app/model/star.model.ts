export class Star {
    x: number;
    y: number;
    z: number;
    hip: number;
    mag: number;

    constructor(hip: number, x: number, y: number, z: number, mag: number) {
        this.hip = hip
        this.x = x;
        this.y = y;
        this.z = z;
        this.mag = mag;
    }
}