function Umbrella(x, y, d) {
  var c = [163, 192, 117];
  this.x = x;
  this.y = y;
  this.yspeed = random(0.4, 1.3);
  this.r = c[floor(random(c.length))];
  this.g = c[floor(random(c.length))];
  this.b = c[floor(random(c.length))];
  this.d = d;
  this.offset = 1;

  this.display = function() {
    noStroke();
    fill(this.r, this.g, this.b);
    arc(this.x, this.y, this.d, this.d, PI, TWO_PI);
    rect(this.x - this.offset, this.y - this.d / 2 - this.d / 30 - this.offset, this.d / 30, this.d + this.d / 30 + this.offset);
    noFill();
    stroke(this.r, this.g, this.b);
    strokeWeight(this.d / 30);
    arc(this.x - this.d / 12, this.y + this.d / 2, this.d / 6, this.d / 6, 0, PI);
  };

  this.isFinished = function() {
    if (this.y > (windowHeight + this.d)) {
      return true;
    } else {
      return false;
    }
  };

  this.dragged = function() {
    var d = dist(mouseX, mouseY, this.x, this.y);
    if (d < this.d / 2) {
      this.x = mouseX;
      this.y = mouseY;
    }
  };

  this.move = function() {
    this.y = this.y + this.yspeed;
  };
}