function drawBezier2() {
  this.x = width *3/4;
  this.y = height /4;
  this.w = 410;
  this.h = 10;

  this.render = function() {
    stroke(0, 1);
    strokeWeight(3);
    fill(255, 0);
    bezier(this.x, this.y, width/2, 0, width, height/2, this.w, this.h);
    
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
    this.y = constrain(this.y, 0, height/2);
    this.w = constrain(this.x, width/2, width);
    this.h = constrain(this.x, height/2, height);

  }
}