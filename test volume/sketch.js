/**
 * @name Mic Input
 * @description <p>Get audio input from your computer's microphone.
 * Make noise to float the ellipse.</p>
 * <p>Note: p5.AudioIn contains its own p5.Amplitude object,
 * so you can call getLevel on p5.AudioIn without
 * creating a p5.Amplitude.</p>
 * <p><em><span class="small"> To run this example locally, you will need the
 * <a href="http://p5js.org/reference/#/libraries/p5.sound">p5.sound library</a>
 * and a running <a href="https://github.com/processing/p5.js/wiki/Local-server">local server</a>.</span></em></p>
 */
var input;
    var env5;
var analyzer, vol;

function setup() {

  // Create an Audio input
  mic = new p5.AudioIn();

  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);
  setTimeout(volume, 250);
}

function draw() {

  // Get the overall volume (between 0 and 1.0)
      var spectrum = fft.analyze();
  vol = mic.getLevel();
  env5 = fft.getEnergy(900);


}

function volume() {
  createP(vol + "__" + env5);
  setTimeout(volume, 250);
}