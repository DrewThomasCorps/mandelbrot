export default class Complex {
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