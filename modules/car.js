
const car = {
  brand: "Ford",
  color: "blue",
};

exports.getColor = function () {
  return car.color;
};

exports.setColor = function (color) {
  if (color == "Yellow" || color == "Red") {
    car.color = color;
  }
  // TODO: 不符合的，不給改
};

exports.car = car;
