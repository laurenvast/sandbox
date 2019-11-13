function drawBezier3() {
  this.x = width / 6;
  this.y = height;
  this.w = 10;
  this.h = 410;

  this.render = function() {
    stroke(0, 1);
    strokeWeight(3);
    fill(255, 0);
    bezier(this.x+20, this.y+20,  width / 2, height, 0, height / 2,this.w, this.h);

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
    this.y = constrain(this.y, height/2, height);
    this.w = constrain(this.x, 0, width);
    this.h = constrain(this.x, height/2-10, height);

  }
}