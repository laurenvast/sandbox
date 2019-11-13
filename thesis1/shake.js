var shakeEvent;
var ax, ay, az;
var d, hue;

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

  hue = round(random(1, 25))*4;
  colorMode(HSB, 100);

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id('shake');

    //listen to shake event
  shakeEvent = new Shake({threshold: 15});
  shakeEvent.start();
  sendUser();

}

function draw() {
  background(hue, 100, 100);

  if (touchIsDown) {
    background('#000');
    textAlign(CENTER);
    textSize(36);
    fill('#fff');
    text("Don't release, \n SHAKE to make bubbles", width/2, height/4*3);
    if (ax+ay+az>=30) {
      window.addEventListener('shake', shake(), false);
    }
  }else{
    textAlign(CENTER);
    fill('#000');
    textSize(36);
    text("Tap and hold the screen", width/2, height/4*3);
    window.removeEventListener('shake', null);
  }
}


function sendbg(acceleration) {
  // Send that object to the database
  var ballListRef = firebase.database().ref('/ball_list');
  var newBallRef = ballListRef.push();

  newBallRef.set({
    'hue': hue,
    // 'w': w,
    // 'h': h,
    'd': d,
    'vol': (ax + ay + az)/400,
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