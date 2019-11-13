var d1;
var d2;
var d3;
var d4;

function setup() {
  createCanvas(1200, 800);
  d1 = new drawBezier1();
  d2 = new drawBezier2();
  d3 = new drawBezier3();
  d4 = new drawBezier4();
  background(240);

}


function draw() {
  d1.step();
  d1.render();
  d2.step();
  d2.render();
  d3.step();
  d3.render();
  d4.step();
  d4.render();
  noFill();
  stroke(255);
  strokeWeight(60);
  rect(0, 0, 400, 400);
  rect(400, 400, 400, 400);
  rect(400, 0, 400, 400);
 // rect(0, 400, 400, 800);


};