function Circle(x, y) {
  this.x = x;
  this.y = y;
  this.dspeed = -0.08;
  this.d = random(vol * 500, vol * 1000);
  this.targetX = random(width);
  this.targetY = random((width - height) / -2, height + (width - height) / 2);
  this.h = round(random(c.length - 1));
  this.dis = dist(this.targetX, this.targetY, width / 2, height / 2);

  this.display = function() {
    // console.log(bgD);
    // this.r = lerp(this.r, targetD, 0.1);
    if (this.dis <= bgD) {
      colorMode(HSB, 100);
      noStroke();
      fill(c[this.h]);
      ellipse(this.x, this.y, this.d, this.d);
    }
  };

  this.isFinished = function() {
    if (this.d < 2
      //|| this.dis > bgD
    ) {
      return true;
    } else {
      return false;
    }
  };

  this.move = function() {
    // if (this.dis < 300) {
    this.sp = random(.01, .1);
    this.x = lerp(this.x, this.targetX, this.sp);
    this.y = lerp(this.y, this.targetY, this.sp);
    this.d = lerp(this.d, this.d / 4 * 3, random(.02, .07));
    // }
  }

  this.shake = function() {
    this.skd = (width + height) / 2 - dist(this.x, this.y, width / 2, height / 2);
    this.x += random(vol * this.skd * -1, vol * this.skd);
    this.y += random(vol * this.skd * -1, vol * this.skd);
  }
}

function bgCircle(d, size, s, sp) {
  this.d = d;
  this.size = height / 3;
  this.sp2 = sp;
  this.s = s;

  // this.h = random(1, 100);
  this.angle = 0;
  this.inc = TWO_PI / 150;
  this.h = round(random(c.length - 1));
  this.sp = random(this.sp2 / 2, this.sp2);



  this.display = function() {
    this.d2 = this.size + sin(this.angle) * this.d * this.sp2;

    colorMode(HSB, 100);
    // stroke(this.h, 30, 100);
    stroke(c[this.h]);
    strokeWeight(this.s);
    noFill();
    ellipse(width / 2, height / 2, this.d2, this.d2);
  };

  this.isFinished = function() {
    if (this.s < .1) {
      return true;
    } else {
      return false;
    }
  };

  this.move = function() {
    // this.targetD = random(height, width);
    // this.d = lerp(this.d, this.targetD, random(.01, .05));
    // this.s = lerp(this.s, 2, random(.02, .08));
    this.angle += this.inc;
  };

  this.expand = function() {
    this.size += random(BGCircle.length);
    this.s = BGCircle.length / 10 + 1;
    this.sp2 = BGCircle.length / 10;
    // console.log(this.size + "..." + this.s + "..." + this.sp2)
  }

  this.explode = function() {
    bgD = this.size;
    this.s = lerp(this.s, 0, random(.1));
    this.size = lerp(this.size, height, random(.2));
  }

  this.reset = function() {
    this.d = d;
    this.sp2 = sp;
    this.s = s;
    this.size = height / 3;
    bgD = 0
  }
}