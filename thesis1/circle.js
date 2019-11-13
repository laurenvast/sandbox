function Circle(x, y, d, v) {
  this.x = x;
  this.y = y;
  this.dspeed = -0.07;
  this.d = d;
  this.v = v;
  this.targetX = random(width);
  this.targetY = random(height);
  this.h = random(1, 100);

  this.display = function() {
    colorMode(HSB, 100);
    noStroke();
    fill(this.h, 60, 100, 100);
    ellipse(this.x, this.y, this.d, this.d);
  };

  this.isFinished = function() {
    if (this.d < 1) {
      return true;
    } else {
      return false;
    }
  };

  this.move = function() {
    this.sp = random(.01, .1);
    this.x = lerp(this.x, this.targetX, this.sp);
    this.y = lerp(this.y, this.targetY, this.sp);
    this.d = lerp(this.d, this.d / 4*3, random(.02, .07));
  }

  this.shake = function() {
    this.skd = (width + height) / 2 - dist(this.x, this.y, width / 2, height / 2);
    this.x += random(this.v * this.skd * -1, this.v * this.skd);
    this.y += random(this.v * this.skd * -1, this.v * this.skd);
  }
}

function bgCircle(d) {
  this.d = d;
  this.s = 50;
  this.h = random(1, 100);

  this.display = function() {
    colorMode(HSB, 100);
    stroke(this.h, 30, 100);
    strokeWeight(this.s);
    noFill();
    ellipse(width / 2, height / 2, this.d, this.d);
  };

  this.isFinished = function() {
    if (this.s < 1) {
      return true;
    } else {
      return false;
    }
  };

  this.fit = function(){
    if (this.d > 0 && this.d < height * 1.3){
      return true;
    } else {
      return false;
    }
  }

  this.move = function() {
    this.targetD = random(height*2, width);
    this.d = lerp(this.d, this.targetD, random(.01, .05));
    this.s = lerp(this.s, 0, random(.02, .08)); 
  };
}