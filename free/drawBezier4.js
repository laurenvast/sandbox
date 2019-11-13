function drawBezier4() {
  this.x = width * 3 / 4;
  this.y = height * 3 / 4;
  this.w = 410;
  this.h = 410;

  this.render = function() {
    stroke(255, 10);
    strokeWeight(3);
    fill(255, 0);
    bezier(this.x, this.y, width*sin(this.x), height, width / 2 + 10, height / 2 + 10, this.w, this.h);

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
    this.x = constrain(this.x, width/2, width);
    this.y = constrain(this.y, 0, height);
    this.w = constrain(this.x, width/2, width);
    this.h = constrain(this.x, 0, height);

  }
}