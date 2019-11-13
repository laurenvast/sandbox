var CLIENT_ID = '250450104678-b346b0g3de42ubhqcfrggtk7c7k90v28.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var messageIds;
var newText, oldText, currentText;
var msgArray = [];
var checkNum = 10;
var hasText, currentLine, oldLine;
var time = new Date().getTime();


function preload() {
  readPoem = loadSound('libraries/readpoem.mp3');
}

function setup() {
  checkAuth();
  setInterval(loadGmailApi, 500);

}

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }

function draw() {
  currentText = newText;
  if (currentText != oldText) {
    var table = document.getElementById("line");
    time = new Date().getTime();
    if (table.rows.length >= checkNum) {
      var rem = table.deleteRow(0);
    }
    responsiveVoice.speak(currentText);
    console.log(currentText);
    var row = table.insertRow(-1);
    row.innerHTML = currentText;
    row.className = 'new-item';
  }
  oldText = newText;

  refresh();
  window.scrollBy(0, 10);


}

function playPoem() {
  var table = document.getElementById("line");
  hasText = table.rows.length;
  currentLine = hasText;

  if (currentLine != oldLine && currentLine == 0) {
      //console.log(currentLine);
    readPoem.play();
  }

  oldLine = hasText;
}

function refresh() {
  if (new Date().getTime() - time >= 1000 * 60 * 3) {
    var table = document.getElementById("line");
    for (var i = 0; i < table.rows.length; i++) {
      var remov = table.deleteRow(i);
    }
  }
  playPoem();
}