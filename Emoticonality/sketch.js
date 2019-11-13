var level = 1;
var capture;
var emoticons = [];
var bga = 200;
var img0, img1, img2, img3, img4, img5, img6;
var r, g, b;
//var result = selectAll('#emoticon');
var s1, s2, s3, s4, s5, s6, s7;


function preload() {
  img0 = loadImage("libraries/assets/bg0.png");
  img1 = loadImage("libraries/assets/bg1.png");
  img2 = loadImage("libraries/assets/bg2.png");
  img3 = loadImage("libraries/assets/bg3.png");
  img4 = loadImage("libraries/assets/bg4.png");
  img5 = loadImage("libraries/assets/bg5.png");
  img6 = loadImage("libraries/assets/bg6.png");
  imgM = loadImage("libraries/assets/mask.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id('answer_button');
  capture = createCapture(VIDEO);
  capture.size(80, 60);
  capture.hide();
  for (var i = 0; i < 30; i++) {
    emoticons[i] = new Emoticon(random(width, width + 50), random(height), random(10, 60));
  }



  //background(240);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  //console.log(level);
  background(255);
  imageMode(CENTER);
  image(capture, windowWidth / 2, windowHeight / 2, windowWidth, windowWidth * 3 / 4);
  //   image(img0, random(width), height * 3 / 5);
  // // blendMode(BLEND);
  //   //
  //   image(img2, 0, width * 2 / 3);

  //   // image(img5, emot.x, emot.y);
  //   image(img6, width / 3, random(height) + 10);
  var thsh = filter(POSTERIZE, 5);
  image(img4, random(width) + 20, random(height));
  image(img4, random(width), random(height));

  for (var i = emoticons.length - 1; i > 0; i--) {
    emoticons[i].display();
    emoticons[i].move();
    if (level == 2) {
      emoticons[i].fadeout();
    }
    if (emoticons[i].isFinished()) {
      emoticons.splice(i, 1);
      emoticons[i] = new Emoticon(width, random(height), random(10, 60));
    }
  }

  r = 255;
  g = 208;
  b = 208;
  fill(r, g, b, bga);
  noStroke();
  rect(0, 0, windowWidth, windowHeight);

  if (level == 1) {
    Welcome();
  } else if (level >= 2 && level < q.length + 2) {
    bga = bga + 2;
    if (bga > 245) {
      bga = 245;
    }
    //console.log(bga);
    question();
    buttons();
  } else if (level == q.length + 2) {
    //bga = bga - 4;

    //  if (bga < 100) {
    //  bga = 100;
    //} 
    //thsh.remove();
    //button.remove();
    //qa.remove();
    var hideButton = select('#answer_button');
    hideButton.style("z-index", "2");
    
    emot.style("color", "#ffffff");

    textAlign(CENTER);
    textFont("Impact");
    textSize(150);
    fill(255);
    text("Your Emoticonality:", width / 2, height / 3);
    shakemo();
    //textFont('Helvetica');
   // textSize(150);
   // strokeWeight(3);
   // text(s1.html() + s2.html() + s3.html() + s4.html() + s5.html() + s6.html() + s7.html(), width / 2, height * 2 / 3);

  }
}

if (level == 7) {
  button.hide();
  // textAlign(CENTER);
  //   textFont("Impact");
  //   textSize(150);
  //   fill(255);
  //   text("Your Emoticonality:", width / 2, height / 3);
}

function mousePressed() {
  emoticons.push(new Emoticon(mouseX, mouseY, random(30, 80)));
  if (level == 1 && isStartMouseOver()) {
    c = 150;
    level = 2;
  }
}