function drawBezier1() {
  this.x = width / 6;
  this.y = height / 6;
  this.w = 10;
  this.h = 10;

  this.render = function() {
    stroke(0, 1);
    strokeWeight(3);
    // noFill();
    fill(255, 0);
    //point(this.x, this.y);
    //ellipse(this.x, this.y, this.w, this.h);
    bezier(this.x, this.y, 0, 0, this.w*sin(this.w), this.h*cos(this.h), this.w, this.h);

  };

  this.step = function() {
    var choice = floor(random(4));
    if (choice == 0) {
      this.x = this.x + random(10);
      this.w = this.w + random(10);
    } else if (choice == 1) {
      this.x = this.x - random(10);
      this.w = this.w - random(10);
    } else if (choice == 2) {
      this.y = this.y + random(10);
      this.h = this.h + random(10);
    } else {
      this.y = this.y - random(10);
      this.h = this.h - random(10);
    }
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
    this.w = constrain(this.x, 0, width);
    this.h = constrain(this.x, 0, height);

  }
}