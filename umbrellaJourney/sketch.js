var chara, BG, song, c;

function preload() {
  song = loadSound('assets/if_i_were_a_bird.mp3');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id('fly');
  //background(0);
  chara = new girlWithUmb();
  BG = new bg();
  song.loop();
  //system = new ParticleSystem(createVector(width / 2 + 50, height / 3));

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  //background(0);
  // system.addParticle();
  // system.run();
  chara.rotate();
  chara.drift();
  chara.display();
  chara.waveLegs();
  BG.movebg();
  BG.mouseControl();
  BG.responsive();
  BG.keyboard();
  c = 240;
  noStroke();
  fill(c, 200);
  //ellipse(width - 30, 30, 30, 30);

  console.log(BG.moveX);

}

function isMouseOverPlayMusic() {
  var d = dist(mouseX, mouseY, width - 30, 30);
  if (d < 15) {
    return true;
    c = 255;
  } else {
    return false;
    c = 240;
  }
}

function mousePressed() {
  if (isMouseOverPlayMusic()) {
    if (song.isPlaying()) {
      song.pause();
      noStroke();
      fill(c, 100);
      ellipse(width - 30, 30, 30, 30);
      fill(100);
      triangle(width - 34, 22, width - 34, 38, width - 23, 30);
    } else {
      song.play();
      noStroke();
      fill(c, 100);
      ellipse(width - 30, 30, 30, 30);
      rectMode(CENTER);
      fill(100);
      rect(width - 27, 30, 4, 10);
      rect(width - 33, 30, 4, 10);
    }
  }
}