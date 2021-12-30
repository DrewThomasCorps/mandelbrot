import Complex from './Complex';
import {Mandelbrot} from "./Mandelbrot";

test('isBounded() works as expected', () => {
    expect(new Mandelbrot(new Complex(0, 0), 50).isBounded()).toBeTruthy();
    expect(new Mandelbrot(new Complex(-1, 0), 50).isBounded()).toBeTruthy();
    expect(new Mandelbrot(new Complex(-0.5, -0.5), 50).isBounded()).toBeTruthy();
    expect(new Mandelbrot(new Complex(1, 0), 50).isBounded()).toBeFalsy();
    expect(new Mandelbrot(new Complex(-0.5, 5), 50).isBounded()).toBeFalsy();
});