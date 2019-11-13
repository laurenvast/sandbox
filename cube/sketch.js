var x1, x2, x3, x4, y1, y2, y3, y4, y5, y6, j1, i1;
var e = 2;


function setup() {
  //noCursor();
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  noFill();
  //fill(255, 100);
  stroke(255);

  cube(width / 2, height / 2, width / 8);
}
  

function cube(x, y, l) {
  this.x = x;
  this.y = y;
  this.l = l;

  //find the distants between mouse and mid-point
  var mx = (mouseX - width / 2) / 3;
  var my = (mouseY - height / 2) / 2;

  var m = Math.sqrt(l * l - l / 2 * l / 2);
  x1 = x - m;
  x2 = x - mx;
  x3 = x + m;
  x4 = x + mx;
  y1 = y - l + my;
  y2 = y - l / 2;
  y3 = y - my;
  y4 = y + l / 2;
  y5 = y3 + l;
  y6 = y + my;
  fill(255, 0);
  stroke(255, 150);
  quad(x1, y2, x4, y3, x4, y5, x1, y4);
  quad(x1, y2, x2, y1, x2, y6, x1, y4);
  quad(x3, y2, x2, y1, x2, y6, x3, y4);
  quad(x3, y2, x4, y3, x4, y5, x3, y4);
  quad(x1, y2, x4, y3, x3, y2, x2, y1);
  quad(x1, y4, x4, y5, x3, y4, x2, y6);
  //quad(x2,y1, x4,y3, x4,y5, x2,y6);
}
