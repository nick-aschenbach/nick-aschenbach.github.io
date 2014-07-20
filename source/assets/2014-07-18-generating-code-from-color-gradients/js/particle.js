var Particle = function (gradient) {
  this.positionX = 0;
  this.positionY = 0;
  this.deltaX = 10 * (Math.random() - 0.5);
  this.deltaY = -10 * Math.random() - 5;
  this.age = 0;
  this.gradient = gradient;
}

Particle.prototype = {
  step: function () {
    // Integrate using Euler's method
    var delta = 0.05;
    this.deltaY += 0.1 /* gravity */ + (Math.random() - 0.5);
    this.deltaX += Math.random() - 0.5;

    this.positionX += this.deltaX * delta;
    this.positionY += this.deltaY * delta;

    this.updateColor();
  },

  updateColor: function () {
    this.age++;
  },

  getAge: function () {
    return this.age;
  },

  getColor: function () {
    switch (this.gradient) {
      case 'skyline':
        return skyline[this.age];
      case 'carribean_blues':
        return carribean_blues[this.age];
      case 'deep_sea':
        return deep_sea[this.age];
      case 'full_saturation_spectrum':
        return full_saturation_spectrum[this.age];
      case 'greyscale':
        return greyscale[this.age];
      case 'horizon1':
        return horizon1[this.age];
      case 'horizon2':
        return horizon2[this.age];
      case 'incandescent':
        return incandescent[this.age];
      case 'land_and_sea':
        return land_and_sea[this.age];
      case 'land':
        return land[this.age];
      case 'tropical_colors':
        return tropical_colors[this.age];
      case 'yellow_orange':
        return yellow_orange[this.age];
      default:
        return skyline[this.age];
    }

    return this.gradient[this.age];
  },

  setGradient: function (gradient) {
    this.gradient = gradient;
  },

  getX: function () {
    return this.positionX;
  },

  getY: function () {
    return this.positionY;
  }
}
