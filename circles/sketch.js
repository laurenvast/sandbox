var gridSize = 70;

function setup(){
  //fullScreen();
  createCanvas(windowWidth, windowHeight);
  frameRate(8);
}
function draw(){  
    background(245);
    //fill(100,200,200);
    //rect(50,50,100,100);
  for(var x = gridSize/2; x < width; x = x + gridSize){
  for(var y = gridSize/2; y < height; y = y + gridSize){
    //colorMode(RGB);
    stroke(180,100);
    strokeWeight(0.7);
    fill(random(150,250),random(150,230),random(150,200),random(0));
    triangle(mouseX,mouseY,random(width),random(width),random(width),random(width));
  }
  }
}