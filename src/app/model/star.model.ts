export class Star {
    // name: string;
    x: number;
    y: number;
    z: number;
    // id;
    hip: number;
    mag: number;

    // constructor(name: string, x: number, y: number, z: number, mag: number) {
    //     this.name = name;
    //     this.x = x;
    //     this.y = y;
    //     this.z = z;
    //     this.mag = mag;
    // }

    constructor(hip: number, x: number, y: number, z: number, mag: number) {
        this.hip = hip
        this.x = x;
        this.y = y;
        this.z = z;
        this.mag = mag;
    }
}