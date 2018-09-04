class StaticGear extends MoverGear {
  constructor(x, y, numberOfTeeth, pitch, numberOfInnerTeeth) {
    super(x, y, numberOfTeeth, pitch);

    this.angle = 0;

    this.numberOfInnerTeeth = numberOfInnerTeeth;

    this.innerRadius = this.getRadius(numberOfInnerTeeth);

    this.innerRotationAngle = 360 / numberOfInnerTeeth;
  }

  draw() {
    if (this.display) {
      push();
      translate(this.location.x, this.location.y);
      rotate(this.angle);
      fill(255, 50);
      stroke(0, 100);
      beginShape();
      for (let i = 0; i <= 361; i += this.rotationAngle) {
        this.drawGear(i, this.radius, this.toothDepth, this.toothThickness);
      }
      beginContour();
      for (let i = 0; i <= 361; i += this.innerRotationAngle) {
        this.drawGear(-i, this.innerRadius, this.toothDepth, this.toothThickness);
      }
      endContour();
      endShape();
      pop();
    }
  }
}