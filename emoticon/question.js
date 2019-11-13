function Question() {
  textSize(50);
  fill(100);
  text("This is a question?", 100, 120);
}

function Answer(){
  for (var btnX = width / 4; btnX < width; btnX = btnX + width / 4) {
    fill(100);
    rectMode(CENTER);
    //rect(btnX, height * 3/5, width / 6, 100);
    //answerButton = createButton("Answer1");
  };
}

function answerClicked(){
  //level + 1
  //get symbol
  //slide right
  Question();
}