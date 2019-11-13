var input, env;
var analyzer, mic, fft;
var hz = 0, vol = 0;
// var smoothHz = 0,smoothVol = 0;
// var hzPrev = 0, volPrev = 0;
// var smoothIt = 0.1;

function setup() {

  // Create an Audio input
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  setTimeout(volume, 250);
}

function draw() {
  window.scrollBy(0, 100);

  var spectrum = fft.analyze();
  
  env = fft.getEnergy(130.81);

  // hzPrev = smoothHz;
  // hz = fft.getCentroid();
  // smoothHz = smoothIt * hz + (1 - smoothIt) * hzPrev;

  // volPrev = smoothVol;
  vol = mic.getLevel();
  // smoothVol = smoothIt * vol + (1 - smoothIt) * volPrev;

}

function volume() {
  if (
    env > 100 
    //&& vol > 0.05 && vol < 0.3
  ) {
    createP("vol:" + Math.round(vol * 10000) / 10000);
    createP(env);
  }
  setTimeout(volume, 250);
}