int gridSize = 70;

void setup(){
  //fullScreen();
  size(500,500);
  frameRate(10);
}
void draw(){  
    background(245);
    //fill(100,200,200);
    //rect(50,50,100,100);
  for(int x = gridSize/2; x < width; x = x + gridSize){
  for(int y = gridSize/2; y < height; y = y + gridSize){
    //colorMode(RGB);
    stroke(180,150);
    strokeWeight(0.7);
    fill(random(150,250),random(150,230),random(150,200),random(00, 00));
    triangle(mouseX,mouseY,random(width),random(width),random(width),random(width));
  }
  }
}