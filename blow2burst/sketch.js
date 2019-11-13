var particles = [],
  BGCircle = [];
var numOfParts = 0;
var numOfBGC = 1;
var input;
var analyzer, mic, fft;
var vol = 0.5;
var bgD = 0;
var c = ['#FB5E97', '#9ACBA7', '#FADBC3', '#FB960A'];
var blows = 0;
var sz = 1,
  stk = 1,
  spe = 1;
var doesExplode = false;


function initializeCircles() {
  for (var i = 0; i < numOfParts; i++) {
    particles.push(new Circle(width / 2, height / 2, random(vol * 800, vol * 300)));
  }
  for (var j = 0; j < numOfBGC; j++) {
    BGCircle.push(new bgCircle(vol * 300, sz, stk, spe));
  }
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id('bubble');
  // colorMode(HSB, 100);
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function draw() {
  background("#4D2833");
  var spectrum = fft.analyze();
  vol = mic.getLevel();
  var env = fft.getEnergy(70);

  if (vol > 0.06 && vol < 0.3 && env > 130) {
    initializeCircles();
    for (var j = BGCircle.length - 1; j >= 0; j--) {
      if (doesExplode === false) {
        BGCircle[j].expand();
      }
    }
  }

  goCircle();
}


function goCircle() {
  for (var j = BGCircle.length - 1; j >= 0; j--) {
    BGCircle[j].display();
    BGCircle[j].move()

    if (BGCircle.length >= 60) {
      numOfParts = 50;
      doesExplode = true;
    } else {
      numOfParts = 0;
    }

    if (doesExplode === true) {
      BGCircle[j].explode();

      if (BGCircle.length < 2) {
        doesExplode = false;
        // BGCircle[j].reset();
      }
    }

    if (particles.length < 10 && particles.length > 1) {
      BGCircle[j].reset();
    }

    if (BGCircle[j].isFinished()) {
      BGCircle.splice(j, 1);
    }
  }

  for (var i = particles.length - 1; i >= 0; i--) {
    particles[i].display();
    particles[i].move();

    particles[i].shake();


    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }
}

function mousePressed() {
  initializeCircles();
}