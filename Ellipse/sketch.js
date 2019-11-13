var gridSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(8);
}

function draw() {
  background(245);
  gridSize = 70;
  randomEllipse();
}

function randomEllipse() {
  colorMode(RGB);
  for (var x = mouseX / 5 / 2; x < width; x = x + mouseX / 5 + 10) {
    for (var y = gridSize / 2; y < height; y = y + gridSize) {
      noStroke();
      fill(random(150, 250), random(150, 230), random(150, 200), random(10, 100));
      ellipse(x, y, mouseX / 5, random(0, height - mouseY));
    }
  }
}