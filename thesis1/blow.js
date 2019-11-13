// var userId;
var d, w, h, hue;
var analyzer, mic, fft;
var hz, vol;
var targetY, ed, ey;
var shakeEvent;
var ax, ay, az;

window.ondevicemotion = function(event) {
  ax = Math.abs(event.accelerationIncludingGravity.x);
  ay = Math.abs(event.accelerationIncludingGravity.y);
  az = Math.abs(event.accelerationIncludingGravity.z);
};
//stop listening
function stopShake(){
  shakeEvent.stop();
}

function shake(){
  d = pow(ax + ay + az, 1.5);
  colorMode(HSB, 100);

  noStroke();
  fill(hue, 100, 100, 100);
  ellipse(width/2, height/2, d, d);
  // background(d, 100, 100);
  //alert(d);
  sendbg(d);
}

//check if shake is supported or not.
if(!("ondevicemotion" in window)){
  alert("Not Supported");
}

function setup() {
  hue = round(random(1, 25))*4 - 2;
  colorMode(HSB, 100);

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id('blow');

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);

  shakeEvent = new Shake({threshold: 15});
  shakeEvent.start();

  sendUser();

}

function draw() {
  background(hue, 100, 100);
  var spectrum = fft.analyze();
  vol = mic.getLevel();
  var env = fft.getEnergy(70);

  if (touchIsDown) {
    background('#000');
    textAlign(CENTER);
    textSize(36);
    fill('#fff');
    text("Don't release, \n BLOW or SHAKE to make bubbles", width/2, height/4*3);
   if (vol > 0.04 && vol < 0.3 && env > 130) {
      // targetY = map(vol, 0.04, 0.25, height, 0);
    d = map(vol, 0.03, 0.28, 0, width);
    // h = random(300,700);
    // w = random(1004);
      // textSize(36);
      // fill('#fff');
      // text("blow", width/2, height/5*4);

    colorMode(HSB, 100);
    noStroke();
    fill(hue, 100, 100, 100);
    ellipse(width/2, height/2, d, d);
    // console.log(d);
    sendbg(vol);
    }else if(ax+ay+az>=30){
      // textSize(36);
      // fill('#fff');
      // text("shake", width/2, height/5);

      vol = (ax + ay + az)/400;
      window.addEventListener('shake', shake(), false);
    }
  } else {
    textAlign(CENTER);
    textSize(30);
    fill('#000');
    text("Tap and hold the screen", width/2, height/4*3);
  }

};

function sendbg(sound) {
  // Send that object to the database
  var ballListRef = firebase.database().ref('/ball_list');
  var newBallRef = ballListRef.push();

  newBallRef.set({
    'hue': hue,
    // 'w': w,
    // 'h': h,
    'd': d,
    'vol': vol,
  });
}

function sendUser() {
  var userListRef = firebase.database().ref('/user_list');
  var userRef = userListRef.push();
  
  // Add ourselves to presence list when online.
  var presenceRef = firebase.database().ref('/.info/connected');
  presenceRef.on("value", function(snap) {
    if (snap.val()) {
    // Remove ourselves when we disconnect.
    userRef.onDisconnect().remove();
    userRef.set(true);
    }
  });

  // Number of online users is the number of objects in the presence list.
  userListRef.on("value", function(snap) {
     console.log("# of online users = " + snap.numChildren());
  });    

}