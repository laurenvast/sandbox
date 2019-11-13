var particles = [],
  bGCircle = [],
  triangles = [],
  // lines = [],
  burstLines = [],
  stripes = [];

var numOfParts = 10,
  numOfBGC = 1,
  numOfLines = 20;
var input;
var analyzer, mic, fft;
var vol = 0.5;
var bgD = 0;
var c = ['#4D2833','#FB5E97', '#9ACBA7', '#FADBC3', '#FB960A'];
var blows = 0;
var sz = 1, stk = 1, spe = 1;
var doesExplode = false;
var bg = 0;
var pw, ph;

function initializeStripe() {
  for (var j = 0; j < 1; j++) {
    stripes.push(new stripe(12));
  }
}

function initializeBGCircle() {
  for (var j = 0; j < numOfBGC; j++) {
    bGCircle.push(new BgCircle(vol * 300));
  }
}

function initializeTris(){
    triangles.push(new tri(random(width),random(height),random(10,100)));
}

function initicalizeParticles(){
    for (var i = 0; i < numOfParts; i++) {
    particles.push(new Circle(pw, ph, random(vol * 800, vol * 300)));
  }
}

function initicalizeLines(){
    for (var i = 0; i < numOfLines; i++) {
    burstLines.push(new strokeline(random(width),random(height)));
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
  background(0);
  // background(c[bg]);

  var spectrum = fft.analyze();
  vol = mic.getLevel();
  var env1 = fft.getEnergy(70);
  var env2 = fft.getEnergy(170);
  var env3 = fft.getEnergy(230);
  var env4 = fft.getEnergy(990);
  var env5 = fft.getEnergy(470);


  if (vol > 0.06 && vol < 0.3 ) {
    if(env1 > 110){
      initializeBGCircle();
      bg = round(random(c.length-1));

    }
    if(env2 > 140) {
      initializeTris();
    }
    if(env3 > 100 || env3 < 190) {
      initicalizeParticles();
      pw = random(width);
      ph = random(height);
    }
    if(env4 > 230) {
      initicalizeLines();
    }
    if(env5 > 200) {
      initializeStripe();
      bg = round(random(c.length-1));
    }
  }

  goCircle();
      // console.log(burstLines.length);

}



function goCircle() {
  // for (var i = lines.length - 1; i >= 0; i--) {
  //   lines[i].display();
  //   lines[i].move();

  //   if (lines[i].isFinished()) {
  //     lines.splice(i, 1);
  //   }
  // }

  for (var i = triangles.length - 1; i >= 0; i--) {
    triangles[i].display();
    triangles[i].move();

    if (triangles[i].isFinished()) {
      triangles.splice(i, 1);
    }
  }

  for (var i = bGCircle.length - 1; i >= 0; i--) {
    bGCircle[i].display();
    bGCircle[i].move()

    if (bGCircle[i].isFinished()) {
      bGCircle.splice(i, 1);
    }
  }

  for (var i = particles.length - 1; i >= 0; i--) {
    particles[i].display();
    particles[i].move();

    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }

  for (var i = burstLines.length - 1; i >= 0; i--) {
   burstLines[i].update();
   burstLines[i].show();
   
   if (burstLines[i].isFinished()) {
     burstLines.splice(i, 1);
   }
  }

  for (var i = stripes.length - 1; i >= 0; i--) {
    stripes[i].display();
    stripes[i].move()

    if (stripes[i].isFinished()) {
      stripes.splice(i, 1);
    }
  }


}

function mousePressed() {
  initializeStripe();
  bg = round(random(c.length-1));
}