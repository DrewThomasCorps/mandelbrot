// @ts-ignore
class Complex {
    constructor(readonly real: number, readonly imaginary: number) {
    }

    public add(value: Complex): Complex {
        return new Complex(this.real + value.real, this.imaginary + value.imaginary);
    }

    public multiply(value: Complex): Complex {
        const real = (this.real * value.real) - (this.imaginary * value.imaginary);
        const imaginary = (this.real * value.imaginary) + (this.imaginary * value.real);
        return new Complex(real, imaginary);
    }
}

class Mandelbrot {

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

onmessage = function ({
                          data: {
                              row_start,
                              row_end,
                              rect: {height, width},
                              bounds: {height_range, lower, left, width_range},
                              maxIterations
                          },
                      }) {
    const iterationsArray: number[][] = [];
    for (let x = row_start; x < row_end; x++) {
        const row = [];
        for (let y = 0; y < width; y++) {
            const real = ((x / width) * (width_range)) + left;
            const imaginary = ((y / height) * (height_range)) + lower;
            const mandelbrot = new Mandelbrot(new Complex(real, imaginary), maxIterations);
            const iterationsTillUnbounded = mandelbrot.iterationsTillUnbounded();
            row.push(iterationsTillUnbounded);
        }
        iterationsArray.push(row);
    }

    postMessage({row_start, iterationsArray});
}
