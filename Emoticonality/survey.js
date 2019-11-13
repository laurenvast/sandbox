var emot;
var button;
var s = 90;
var q = [
  "1. Are you a morning person?",
  "2. If you knew you'd die tomorrow\nhow would you spend your last day?",
  "3. Which food do you like the most?",
  "4. Are you a good singer?",
  "5. Do you like to be weird?",
];
var leye = ["￣", "> ", "^", "・", "╯", "Θ", "☆", "′  ", "T"];
var reye = ["￣", " <", "^", "・", "╰", "Θ", "☆", "′ ", "T"];
var mouth = [" ˍ ", "﹏", "▽", "ω", " 。", "□", " 3 "];
var face = ["(＃", "( || ", "(〃", "(* ", "(；", "( ", "( "];
var lhand = ["╮", "<", "< ", "o ", "っ"];
var rhand = ["╭", "／", " >", " o", "っ"];

var qa = [
  ["Always!", "Sometimes", "What's morning?"],
  ["Spending all my $$", "Try to be as fun as possible", "crying:("],
  ["Meat", "Vegetables", "Fruits"],
  ["I'm a weirdo", "Sometimes", "Hell no!"],
  ["Definitely!", "I like to sing, but...", "Not Really"],
  []
];

function buttons() {
  for (var r = 0; r < 3; r++) {
    for (var c = 0; c < 1; c++) {
      button = createButton(qa[level - 2][r]);
      button.background = color(255, 0);
      button.style("width", "300px");
      button.style("height", "80px");
      button.style("padding", "10px");
      button.style("font-size", 20 + "px");
      button.style("opacity", "0.5");
      button.style("background-color", "#efefef");
      button.position(windowWidth * (r + 1) / 4 - 150, windowHeight * 2 / 5);
      button.mousePressed(showSymble);
      //button.mousePressed(button.hide);
    }
  }
}

function changeBG() {
  background(0, 0);
}

function question() {
  var qn = level - 2;
  noStroke();
  rectMode(CENTER);
  //fill(255, 70);
  // rect(width * 2 / 3, height * 2 / 3, width * 4 / 5, height * 5 / 6);
  this.que = q[qn];
  textAlign(CENTER);
  textFont("Impact");
  textSize(height / 11);
  noStroke();
  fill(141, 112, 126);
  text(this.que, width / 2, height / 4);
}

function showSymble() {
  level = level + 1;
  stroke(200, 0, 0);
  strokeWeight(3);
  textAlign(CENTER);
  textSize(s);
  fill(200, 0, 0);
  var h = windowHeight * 3 / 4;
  var eyes = floor(random(leye.length));
  var hands = floor(random(lhand.length));

  if (level == 3) {
    var strlh = lhand[hands];
    var reslh = strlh.toString();
    var strrh = rhand[hands];
    var resrh = strrh.toString();
    document.getElementById("lefthand").innerHTML = reslh;
    document.getElementById("righthand").innerHTML = resrh;
  } else if (level == 4) {
    var strface = face[floor(random(face.length))];
    var resface = strface.toString();
    document.getElementById("lface").innerHTML = resface;
    document.getElementById("rface").innerHTML = ")";
  } else if (level == 5) {
    var strleye = leye[eyes];
    var resleye = strleye.toString();
    var strreye = reye[eyes];
    var resreye = strreye.toString();
    document.getElementById("lefteye").innerHTML = resleye;
    document.getElementById("righteye").innerHTML = resreye;
  } else if (level == 6) {
    var strmouse = mouth[floor(random(mouth.length))];
    var resmouse = strmouse.toString();
    document.getElementById("mouse").innerHTML = resmouse;
  } else if (level == 7) {
    r = random(120, 220);
    g = random(120, 220);
    b = random(120, 220);
    //for (var i = 0; i < result.length; i++) {
    // var printresule = result[i].html();
    //   }
    //var stryour = "Your Emoticonality:";
    //var resyour = stryour.toString();
    // document.getElementById("your").innerHTML = resyour;
    // console.log(printresule);
    //blendMode(DIFFERENCE);
    //fill(random(255), random(255), random(255), random(255));
    //rect(0, 0, emot.x, emot.y);
    //level = 8;
    emot = select('#emoticon');
    s1 = select('#lefthand');
    s2 = select('#lface');
    s3 = select('#lefteye');
    s4 = select('#mouse');
    s5 = select('#righteye');
    s6 = select('#rface');
    s7 = select('#righthand');
    //emot.hide();
    //var strresult = select('#emoticon');
    // var resresult = stryour.toString();
    //document.getElementById("result").innerHTML = resresult;

    var ec = random(255);
    //console.log(ec);
    emot.style("background-color", "hsla(" + random(360) + ", 90%, 50%,0.4)");
    emot.style("padding", "10px");
    emot.style("font-size", "120px");
    emot.style("bottom", "10%");


    imageMode(CENTER);

    image(capture, windowWidth / 2, windowHeight / 2, windowWidth, windowWidth * 3 / 4);
    blendMode(DIFFERENCE);
    //blendMode(BURN);

    image(img0, random(width), emot.y * 3 / 5);
    image(img4, random(width) + 20, random(height));
    image(img2, 0, emot.x * 2 / 3);
    image(img3, emot.x / 3, emot.y);
    image(img6, width * 3 / 4 + 20, emot.y / 3);
    image(img5, random(width * 2 / 3, width), height / 2);
    image(img1, random(width), height + 30);


    //var strmask = imgM;
    //var resmask = strmask.toString();
    //document.getElementById("mask").innerHTML = resmask;

  }
}