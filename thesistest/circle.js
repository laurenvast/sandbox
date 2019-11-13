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

function polygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function tri(w, h, ed, c){
  this.color = c;
  this.w = w;
  this.h = h;
  this.ed = ed;
  this.sw = this.ed;
  this.targetX = random(width);
  this.targetY = random(height);
  this.rot = 300;

  this.display = function(){
    colorMode(HSB, 100);
    push();
    translate(this.w, this.h);
    rotate(frameCount / this.rot);

    stroke(this.color, 100, 100);
    strokeWeight(this.sw);
    noFill();    
    polygon(0, 0, this.ed, 3); 
    pop();
  };

  this.move = function(){
    this.w = lerp(this.w, this.targetX, random(.01, .05));
    this.h = lerp(this.h, this.targetY, random(.01, .05));
    this.sw = lerp(this.sw, 0, random(.01, .07));
  };  

  this.isFinished = function() {
    if (this.sw < .5) {
      return true;
    } else {
      return false;
    }
  };
}

function strokeline(x, y, c) {
  this.color = c;
  this.x = x;
  this.y = y;
  this.targetX = random(width*-.3, width*.3);
  this.targetY = random(height*-.3, height*.3);
  this.sp = random(.05, .1);
  this.history = [];
  
  this.update = function() {
    // this.x += random(-10, 10);
    // this.y += random(-10, 10);
    
    for (var i = 0; i < this.history.length; i++) {
      this.x += this.targetX*this.sp;
      this.y += this.targetY*this.sp;
      this.history[i].x += random(-3, 3);
      this.history[i].y += random(-3, 3);
    }

    var v = createVector(this.x, this.y);
    this.history.push(v); 
    if (this.history.length > random(5, 15)) {
      this.history.splice(0, 1);
    }
  }
  
  this.show = function() {
    colorMode(HSB, 100);
    stroke(this.color, 100,100);
    strokeWeight(3);
    
    noFill();
    beginShape();
    for (var i = 0; i < this.history.length; i++) {
      var pos = this.history[i];
      vertex(pos.x, pos.y);
    }
    endShape();    
  };

  this.isFinished = function(){
      if (this.history[0].x >= width || this.history[0].x <=0) {
      return true;
    } else if (this.history[0].y >= height || this.history[0].y <=0){
      return true;
    } else {
      return false;
    }
  }
}

function stripe(num, c){
  this.num = num;
  this.color = c;
  this.d = 0;
  this.h = height / 2 / (this.num*1.5);
  this.leading = (height/2 - this.h * this.num) / (this.num - 1);
  this.dspeed = width/40;

  this.display = function() {
        colorMode(HSB, 100);
    for (var i = 0; i < this.num; i++) {
      var h = (height - i * this.h - this.leading * i*5)/2;
      console.log(this.d);
      noStroke();
      fill(this.color, 100, 100);
      rect(this.d, h+200, this.d*2, this.h);   
    }
  };

  this.isFinished = function() {
    if (this.d < 1) {
      return true;
    } else {
      return false;
    }
  };

  this.move = function() {
    this.d += this.dspeed;
    if (this.d > width*1.2){
      this.dspeed = -this.dspeed;  
    };

  };
}