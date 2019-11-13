var CLIENT_ID = '250450104678-b346b0g3de42ubhqcfrggtk7c7k90v28.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var messageIds;
var newText, oldText, currentText;

function setup() {
  checkAuth();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  loadGmailApi();
  console.log(messageIds);

  currentText = newText;
  if (newText !== oldText) {
    console.log(currentText);
    var table = document.getElementById("line");
    var row = table.insertRow(-1);
    row.innerHTML = currentText;       
  }
  oldText = newText;
}
