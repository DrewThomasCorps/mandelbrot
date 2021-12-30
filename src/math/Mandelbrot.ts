import Complex from "./Complex";

export class Mandelbrot {

    constructor(readonly c: Complex, readonly max_iterations: number) {
    }

    isBounded() {
        let z = this.c;
        for (let i = 0; i < this.max_iterations; i++) {
            z = this.f_of_z(z);
            if (!Mandelbrot.is_under_radius_two(z)) {
                return false;
            }
        }
        return true;
    }

    iterationsTillUnbounded(): number {
        let z = this.c;
        for (let i = 0; i < this.max_iterations; i++) {
            z = this.f_of_z(z);
            if (!Mandelbrot.is_under_radius_two(z)) {
                return i;
            }
        }
        return this.max_iterations
    }


    private f_of_z(z: Complex): Complex {
        return z.multiply(z).add(this.c);
    }

    private static is_under_radius_two(value: Complex): boolean {
        const distance = Math.sqrt(Math.pow(value.real, 2) + Math.pow(value.imaginary, 2));
        return distance <= 2;
    }
}