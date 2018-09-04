class MoverGear {
  constructor(x, y, numberOfTeeth, pitch, inside) {
    this.location = new p5.Vector(x, y);

    this.numberOfTeeth = numberOfTeeth;
    this.pitch = pitch;
    this.inside = inside;

    this.radius = this.getRadius(numberOfTeeth);

    this.rotationAngle = 360 / numberOfTeeth;

    this.toothDepth = pitch / 2;
    this.toothThickness = pitch / 4;

    this.angle = inside ? 0 : 180;
    this.prevAngle = 0;
    this.rotationNumber = 0;
    this.localAngle = 0;
    this.prevLocalAngle = 0;

    this.display = false;
    this.autoRun = false;

    this.col = color(255, 0, 0);

    this.gearRotationOffset = 0;

    this.pointX = 0;
    this.pointY = 0;
    this.prevPointX = 0;
    this.prevPointY = 0;

    this.enter = true;
  }

  getRadius(numberOfTeeth) {
    return this.pitch / (2 * sin((360 / numberOfTeeth) / 2));
  }

  togglePosition() {
    this.inside = !this.inside;
  }

  run() {
    this.autoRun = true;
  }

  hide() {
    this.display = !this.display;
  }

  rotate() {
    this.gearRotationOffset += (360 / this.numberOfTeeth);
    let m = this.gearRotationOffset * (this.numberOfTeeth / 360);
    push();
    colorMode(HSB)
    this.col = color(map(m, 0, this.numberOfTeeth, 0, 360), 100, 100);
    pop();
    if (m >= this.numberOfTeeth) {
      this.gearRotationOffset = 0;
    }
  }

  drawGear(i, radius, toothDepth, thickness) {
    let x = radius * cos(i);
    let y = radius * sin(i);
    this.pointLocation = new p5.Vector(x, y);

    if (i !== 0) {
      let v = p5.Vector.sub(this.pointLocation, this.pPointLocation);
      let mag = Math.round(v.mag());
      let angle = degrees(v.heading());
      let vCopy = v.copy();

      v.setMag(thickness / 2);
      v.add(this.pPointLocation);

      vertex(v.x, v.y);

      v.sub(this.pPointLocation);
      let length = (mag - thickness - thickness / 2) / 2;
      let theta = atan(-toothDepth / length);
      let mag_ = -toothDepth / sin(theta);
      v.setMag(mag_);
      v.rotate(radians(theta));
      v.add(this.pPointLocation);

      vertex(v.x, v.y);
      vertex(v.x + thickness * cos(angle), v.y + thickness * sin(angle));

      vCopy.setMag(mag - thickness);
      vCopy.add(this.pPointLocation);

      vertex(vCopy.x, vCopy.y);
    }

    vertex(this.pointLocation.x, this.pointLocation.y);

    this.pPointLocation = this.pointLocation.copy();
  }

  draw() {
    if (this.display) {
      fill(255, 50);
      stroke(0, 100);
      push();
      translate(this.location.x, this.location.y);
      rotate(this.gearRotationOffset - this.angle * this.ratio);
      beginShape();
      for (let i = 0; i <= 360 + 1; i += this.rotationAngle) {
        this.drawGear(-i, this.radius, this.toothDepth, this.toothThickness);
      }
      endShape();
      pop();
    }
    push();
    let index = 0;
    for (let k = 0; k < 360; k += 20) {
      let radius = int(map(k, 0, 360, this.radius / 6, this.radius - this.toothDepth));
      let angleOffset = this.gearRotationOffset - this.localAngle * this.ratio;

      if (index === drawingCircleIndex) {
        this.lastPointX = this._pointX;
        this.lastPointY = this._pointY;

        this._pointX = this.location.x + radius * cos(k + angleOffset);
        this._pointY = this.location.y + radius * sin(k + angleOffset);
      }

      this.pointX = this.location.x + radius * cos(k + angleOffset);
      this.pointY = this.location.y + radius * sin(k + angleOffset);

      if (index === drawingCircleIndex && this.enter) {
        if (this.autoRun) {
          graphics.push();
          graphics.noFill();
          graphics.stroke(this.col);
          graphics.strokeWeight(1);
          graphics.beginShape();
          graphics.vertex(this.lastPointX, this.lastPointY);
          graphics.vertex(this.firstPointX, this.firstPointY);
          graphics.endShape();
          graphics.pop();

          this.firstPointX = this._pointX;
          this.firstPointY = this._pointY;
        }

        this.prevPointX = this.pointX;
        this.prevPointY = this.pointY;

        this.enter = false;
      }

      if (this.display) {
        fill(50, 100);
        stroke(0, 100)
        index === drawingCircleIndex && fill(this.col);
        ellipse(this.pointX, this.pointY, 5);
      }

      if (mouseIsPressed || this.autoRun) {
        graphics.push();
        if (index === drawingCircleIndex) {
          graphics.noFill();
          graphics.stroke(this.col);
          graphics.strokeWeight(1);
          let d = dist(this.prevPointX, this.prevPointY, this.pointX, this.pointY);
          if (d < 50 || this.autoRun) {
            graphics.beginShape();
            graphics.vertex(this.prevPointX, this.prevPointY);
            graphics.vertex(this.pointX, this.pointY);
            graphics.endShape();
          }
        }
        graphics.pop();
      }
      if (index === drawingCircleIndex) {
        this.prevPointX = this.pointX;
        this.prevPointY = this.pointY;
      }
      index++;
    }
    pop();
  }

  update(fixedGear) {
    this.prevAngle = this.angle;
    this.prevLocalAngle = this.localAngle;

    if (this.autoRun) {
      this.period = 360;
      this.angle += 360 / this.period;
      this.localAngle += 360 / this.period;
    } else {
      let v = p5.Vector.sub(new p5.Vector(mouseX, mouseY), fixedGear.location);
      this.angle = degrees(v.heading());
      !this.inside && (this.angle += 180);

      let diff = this.angle - this.prevAngle;
      if (diff <= -45 && diff >= -360) {
        this.rotationNumber++;
      } else if (diff >= 45 && diff <= 360) {
        this.rotationNumber--;
      }

      this.localAngle = 360 * this.rotationNumber + this.angle;
    }

    if (this.inside) {
      this.ratio = fixedGear.numberOfInnerTeeth / this.numberOfTeeth - 1;

      this.location = p5.Vector.fromAngle(radians(this.angle));
      this.location.setMag(fixedGear.innerRadius - this.radius);
    } else {
      this.ratio = -(fixedGear.numberOfTeeth / this.numberOfTeeth + 1);

      this.location = p5.Vector.fromAngle(radians(this.angle));
      this.location.setMag(-fixedGear.radius - this.radius);
    }
    this.location.add(fixedGear.location);

    this.draw();

    if (this.autoRun) {
      let a;
      if (this.inside) {
        a = (this.angle) % 360 - (this.prevAngle) % 360;
      } else {
        a = (this.angle - 180) % 360 - (this.prevAngle - 180) % 360;
      }

      if (a < 0 && abs(Math.round(this.localAngle * this.ratio) % 360) < 0.1) {
        this.rotate();
        this.angle = this.inside ? 0 : 180;
        this.localAngle = 0;
        this.enter = true;
      }
    }
  }
}