//var level = 1;
var capture;
var emoticons = [];
//answerButton = createButton("");

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  //canvas.position(0,0);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
  //flying emoticons
  for (var i = 0; i < 10; i++) {
    emoticons[i] = new Emoticon(random(width, width + 50), random(height), random(10, 60));
  }
  //answerButton = createButton("Answer1");
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  emoticons.push(new Emoticon(mouseX, mouseY, random(30, 80)));
  // if (level == 1 &&
  //   mouseX > width / 4 - 50 && mouseX < width / 4 + 50 &&
  //   mouseY > height / 2 - 50 && mouseY < height / 2 + 50) {
  // }
}

function draw() {
  background(255);
  imageMode(CENTER);
  image(capture, windowWidth / 2, windowHeight / 2, windowWidth, windowWidth * 3 / 4);
  filter(THRESHOLD);
  fill(240, 190, 214, 120);
  noStroke();
  rect(0, 0, width, height);
  rect(50, 50, width - 100, height - 100);
   // answerButton.position(1/4*width, height * 3 / 5, width / 6, 100);
    //answerButton.mousePressed(answerClicked);

  for (var i = emoticons.length - 1; i > 0; i--) {
    emoticons[i].display();
    emoticons[i].move();
    if (emoticons[i].isFinished()) {
      emoticons.splice(i, 1);
      emoticons[i] = new Emoticon(width, random(height), random(10, 60));
    }
  }
}