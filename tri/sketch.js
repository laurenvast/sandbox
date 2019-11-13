var x1, x2, x3, x4, y1, y2, y3, y4, y5, y6, j1, i1;
var e = 2;
//var l = 50;

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


  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      i1 = [width / 5, width / 5 * 2, width / 5 * 3, width / 5 * 4];
      j1 = [height / 5, height / 5 * 2, height / 5 * 3, height / 5 * 4];
      // tri1(i1[i], j1[j], 50, i1[i] / 4 *3-width/2400, j1[j] / 4*3 - height/2400);

      wh = (width - height) / 2;
      if (width <= height) {
        i1 = [width / 4, width / 2, width / 4 * 3];
        j1 = [width / 4 - wh, width / 2 - wh, width / 4 * 3 - wh];
        tri1(i1[i], j1[j], 50, i1[i] / 4 * 3 - width / 2400, j1[j] / 4 * 3 - width / 2400);
      } else {
        i1 = [height / 4 + wh, height / 2 + wh, height / 4 * 3 + wh];
        j1 = [height / 4, height / 2, height / 4 * 3];
        tri1(i1[i], j1[j], 50, i1[i] / 4 * 3 - height / 2400, j1[j] / 4 * 3 - height / 2400);

      }
    }
  }
}


function tri1(x, y, l, xe, ye) {
  this.l = l;
  this.x = x;
  this.y = y;
  this.xe = xe;
  this.ye = ye;
  //translate(this.x, this.y);

  x1 = this.x - this.l / 2;
  x2 = this.x;
  x3 = this.x + this.l / 2;
  xd = touchX / 4 + this.xe;
  // xd = (mouseX - width / 2) / 3 * -1;
  h = sqrt(this.l * this.l - this.l / 2 * this.l / 2);
  y1 = this.y - h / 3 * 2;
  y2 = this.y + h / 3;
  yd = touchY / 4 + this.ye;
  // yd = (mouseY - height / 2) / 2 * -1;
  //fill(255);

  triangle(x2, y1, x1, y2, x3, y2);
  line(x1, y2, xd, yd);
  line(x2, y1, xd, yd);
  line(x3, y2, xd, yd);
  //console.log(dist(x3, y3, x1, y3));
}