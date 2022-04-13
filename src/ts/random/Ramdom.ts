export const Randomer = new class {
  gen = Math.random

  change(gen: () => number) {
    this.gen = gen;
  }

}();