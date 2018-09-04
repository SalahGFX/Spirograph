let graphics;
let fixedGear, gears = [];
let gearTeeths = [24, 30, 32, 36, 40, 42, 45, 48, 50, 52, 56, 60, 63, 64, 72, 75, 80, 84];
let fixedGearTeeths = [{
    outter: 150,
    inner: 105
  },
  {
    outter: 144,
    inner: 96
  }
];

let drawingCircleIndex = 17;

function setup() {
  createCanvas(innerWidth, innerHeight);

  graphics = createGraphics(innerWidth, innerHeight);
  graphics.background(50);

  angleMode(DEGREES);

  let pitch = 10;
  gears.push(new MoverGear(width / 2, height / 2, gearTeeths[5], pitch, true));
  gears.push(new MoverGear(width / 2, height / 2, gearTeeths[15], pitch, false));

  fixedGear = new StaticGear(width / 2, height / 2, fixedGearTeeths[0].outter, pitch, fixedGearTeeths[0].inner);
}

function draw() {
  image(graphics, 0, 0);

  fixedGear.draw();

  gears.forEach(gear => {
    gear.run();
    gear.update(fixedGear);
  });
}

function mousePressed() {
  //
}

function keyPressed(e) {
  gears.forEach(gear => {
    if (e.key === "h") {
      gear.hide();
    } else if (e.key === "r") {
      gear.rotate();
    } else if (e.key === "w") {

    } else if (e.key === "s") {

    } else if (e.key === "t") {
      gear.togglePosition();
    }
  });

  if (e.key === "ArrowUp") {
    drawingCircleIndex = (drawingCircleIndex + 1) % 18;
  } else if (e.key === "ArrowDown") {
    if (drawingCircleIndex - 1 === -1) {
      drawingCircleIndex = 17;
    } else {
      drawingCircleIndex--;
    }
  } else if (e.key === "c") {
    graphics.background(50);
  } else if (e.key === "h") {
    fixedGear.hide();
  }
}