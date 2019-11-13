var c = 255;
var d;

function Welcome() {
  d = dist(mouseX, mouseY, width / 2, height * 3 / 4);
  stroke(255);
  strokeWeight(3);
  textAlign(CENTER);
  rectMode(CENTER);
  noStroke();
  //fill(100,80);
  //rect(width / 2, height * 1 / 3.3, width, height/4);
  fill(255);
  textSize(height/11);
  stroke(255);
  strokeWeight(2);
  text("Emoticonality o(*￣▽￣*)ゞ", width / 2, height * 1 / 3);
  textSize(20);
  noStroke();
  text("Test your emoticon-personality.", width / 2, height * 1 / 2);
  fill(c);
  ellipse(width / 2, height * 3 / 4, height * 1 / 5, height * 1 / 5);
  fill(141, 112, 126);
  textSize(36);
  textFont("Impact");
  text("START", width / 2, height * 3 / 4 + 14);
  //console.log(d+"///"+height / 10);
  //isStartMouseOver();
  if (isStartMouseOver()){
    c = 220;}else{
      c = 255;
    }
}

function isStartMouseOver() {
    if (d < height / 10) {
      return true;
    } else {
      return false;
    };
  };