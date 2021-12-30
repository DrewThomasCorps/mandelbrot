import Complex from './Complex';

test('add real number works as expected', () => {
    expect(new Complex(1, 0)
        .add(new Complex(2, 0)),
    ).toEqual(new Complex(3, 0));
    expect(new Complex(-4, 0)
        .add(new Complex(2, 0)),
    ).toEqual(new Complex(-2, 0));
});

test('add() complex numbers works as expected', () => {
    expect(new Complex(2, -4)
        .add(new Complex(-5, 8))
    ).toEqual(new Complex(-3, 4))
});

test('multiply() works as expected', () => {
    expect(new Complex(2, -4)
        .multiply(new Complex(-5, 8))
    ).toEqual(new Complex(22, 36))
});