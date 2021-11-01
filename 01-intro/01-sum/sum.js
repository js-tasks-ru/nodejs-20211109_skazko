function sum(a, b) {
  if ([a, b].every(Number.isFinite)) {
    return a + b;
  }

  throw new TypeError('both arguments should be type of Number');
}

module.exports = sum;
