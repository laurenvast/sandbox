var umbrellas = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (var i = 0; i < 10; i++) {
    umbrellas[i] = new Umbrella(random(width), random(-50, 0), random(30, 100));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  umbrellas.push(new Umbrella(mouseX, mouseY, random(30, 100)));
}

function mouseDragged() {
  for (var i = 0; i < umbrellas.length; i++) {
    umbrellas[i].dragged();
  }
}

function draw() {
  background(240);
  for (var i = umbrellas.length - 1; i > 0; i--) {
    umbrellas[i].display();
    umbrellas[i].move();
    if (umbrellas[i].isFinished()) {
      umbrellas.splice(i, 1);
      umbrellas[i] = new Umbrella(random(width), random(-50, 0), random(width/35, width/15));
    }
  }
}