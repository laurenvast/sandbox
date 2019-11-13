var dbHue_array = [];
var w_array = [], h_array = [];
var dbd_array = [], dbVol_array = [];
var dbKey_array = [];
var sw = [];
var particles = [], bGCircle = [];
var numOfParts = 12, numOfBGC = 1;
var ballListRef, userListRef;
var chance, totalUsers;
var bgColor, bgHue, bgB = 500, d = 0, targetD = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 100);
  // bgColor = color("#000");

  userListRef = firebase.database().ref('/user_list');
  userListRef.on("value", function(snap) {
    totalUsers = snap.numChildren();
    chance = totalUsers * 50;
     // console.log("online users = " + totalUsers);
   }); 


  ballListRef = firebase.database().ref('/ball_list');
  ballListRef.on("child_added", function(snapshot) {
    try {
      dbVol_array.push(snapshot.val().vol);
      dbKey_array.push(snapshot.getKey());
      num = random(chance);
      // console.log(snapshot.val().vol + " " + snapshot.getKey());
      if (num < 1) {
        bgB = 500;
          d = 0;
          targetD = 0;        
          initializeCircles();
          // console.log("chance" + num);
          bgHue = snapshot.val().hue;
          targetD = sqrt(height*height+width*width);
      } else if (bGCircle.length > 0 && bGCircle[0].fit() && bGCircle.length <= 50){
        // bgB = 400;
        d = 0;
        targetD = 0;        
        initializeCircles();
        bgHue = snapshot.val().hue;
        targetD = sqrt(height*height+width*width);
        // console.log("fit"+ bGCircle[0] +'....'+ bGCircle.length);
      } else {
        d = 0;
        targetD = 0;        
        var w = random(width);
        var h = random(height/2, height);
        w_array.push(w);
        h_array.push(h);
        dbHue_array.push(snapshot.val().hue);
        dbd_array.push(snapshot.val().d / 8);
        sw.push(snapshot.val().d / 16); 
        // bgColor = color(bgHue, 100, bgB);
        // bgB = lerp(bgB, 1, .1);
        // console.log("small");

      }
    }catch(err) {}
  });
}

function bgc() {
  console.log("here");
  var bgCc = color(bgHue, 100, bgB);
  fill(bgCc);
  ellipse(width/2, height/2, d,d);
  d = lerp(d, targetD, .06);
  bgB = lerp(bgB, 1, .03);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  colorMode(HSB, 100);
  background('#000');
  bgc();
  smallBubbles();
  bigBubbles();

} 

function smallBubbles(){
  for (var i = 0; i < dbHue_array.length; i++) {
    var ed = lerp(dbd_array[i]/3, dbd_array[i] *3, .06);
    colorMode(HSB, 100);
    stroke(dbHue_array[i], 100, 100);
    strokeWeight(sw[i]);
    noFill();
    ellipse(w_array[i], h_array[i], ed, ed);

    h_array[i] -= random(1.5);
    sw[i] = lerp(sw[i], 0, random(.01, .07));

    // console.log(sw[i] + '`````' + dbKey_array[i]);

    if(h_array[i] <= 0 || sw[i] <= 0.1 ) {
      var refToRemove = firebase.database().ref('/ball_list/' + dbKey_array[i]);
      refToRemove.remove();

      dbHue_array.splice(i, 1);
      dbd_array.splice(i, 1);
      w_array.splice(i, 1);
      h_array.splice(i, 1);
      sw.splice(i, 1);
      dbVol_array.splice(i, 1);
      dbKey_array.splice(i, 1);
    }
  }
}

function initializeCircles() {
  for (var i = 0; i < dbVol_array.length; i++) {
    for (var j = 0; j < numOfParts; j++) {
      particles.push(new Circle(width / 2, height / 2, random(dbVol_array[i] * 800, dbVol_array[i] * 300)));
    }
    for (var j = 0; j < numOfBGC; j++) {
      bGCircle.push(new bgCircle(dbVol_array[i] * 300));
    }
    // console.log(dbKey_array[i]);
    // var refToRemove = firebase.database().ref('/ball_list/' + dbKey_array[i]);
    // refToRemove.remove();
  }

  // bgHue = snapshot.val().hue;
  // targetD = sqrt(height*height+width*width);   
  
  
  dbd_array = [];
  w_array = [];
  dbHue_array = [];
  h_array = [];
  dbKey_array = [];
  dbVol_array = [];
  var refToRemove = firebase.database().ref('/ball_list/');
  refToRemove.remove();
}

function bigBubbles() {
  for (var i = particles.length - 1; i >= 0; i--) {
    particles[i].display();
    particles[i].move();

    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }

  for (var j = bGCircle.length - 1; j >= 0; j--) {
    bGCircle[j].display();
    bGCircle[j].move();

    if (bGCircle[j].isFinished()) {
      bGCircle.splice(j, 1);
    }     
  }
  // console.log(particles.length + "......" + bGCircle.length);

}