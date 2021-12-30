// @ts-ignore
var Complex = /** @class */ (function () {
    function Complex(real, imaginary) {
        this.real = real;
        this.imaginary = imaginary;
    }
    Complex.prototype.add = function (value) {
        return new Complex(this.real + value.real, this.imaginary + value.imaginary);
    };
    Complex.prototype.multiply = function (value) {
        var real = (this.real * value.real) - (this.imaginary * value.imaginary);
        var imaginary = (this.real * value.imaginary) + (this.imaginary * value.real);
        return new Complex(real, imaginary);
    };
    return Complex;
}());
var Mandelbrot = /** @class */ (function () {
    function Mandelbrot(c, max_iterations) {
        this.c = c;
        this.max_iterations = max_iterations;
    }
    Mandelbrot.prototype.isBounded = function () {
        var z = this.c;
        for (var i = 0; i < this.max_iterations; i++) {
            z = this.f_of_z(z);
            if (!Mandelbrot.is_under_radius_two(z)) {
                return false;
            }
        }
        return true;
    };
    Mandelbrot.prototype.iterationsTillUnbounded = function () {
        var z = this.c;
        for (var i = 0; i < this.max_iterations; i++) {
            z = this.f_of_z(z);
            if (!Mandelbrot.is_under_radius_two(z)) {
                return i;
            }
        }
        return this.max_iterations;
    };
    Mandelbrot.prototype.f_of_z = function (z) {
        return z.multiply(z).add(this.c);
    };
    Mandelbrot.is_under_radius_two = function (value) {
        var distance = Math.sqrt(Math.pow(value.real, 2) + Math.pow(value.imaginary, 2));
        return distance <= 2;
    };
    return Mandelbrot;
}());
onmessage = function (_a) {
    var _b = _a.data, row_start = _b.row_start, row_end = _b.row_end, _c = _b.rect, height = _c.height, width = _c.width, _d = _b.bounds, height_range = _d.height_range, lower = _d.lower, left = _d.left, width_range = _d.width_range, maxIterations = _b.maxIterations;
    var iterationsArray = [];
    for (var x = row_start; x < row_end; x++) {
        var row = [];
        for (var y = 0; y < width; y++) {
            var real = ((x / width) * (width_range)) + left;
            var imaginary = ((y / height) * (height_range)) + lower;
            var mandelbrot = new Mandelbrot(new Complex(real, imaginary), maxIterations);
            var iterationsTillUnbounded = mandelbrot.iterationsTillUnbounded();
            row.push(iterationsTillUnbounded);
        }
        iterationsArray.push(row);
    }
    postMessage({ row_start: row_start, iterationsArray: iterationsArray });
};
