var girl, umbrella, deg, girlnumb, legs;

function girlWithUmb() {
  girl = select('#girl');
  umbrella = select('#umbrella');
  girlnumb = select('#girlnumb');
  legs = select('#leg');

  this.drift = function() {
    var wait = randomGaussian();
    var sd = 25;
    var mean = 180;
    wait = (wait * sd) + mean;
    setInterval(this.timeRotation, wait);
  };

  this.timeRotation = function() {
    deg = -2;
    randomGaussian();
    var sd = 3;
    var mean = -1;
    deg = (deg * sd) + mean + 5 * sin(0.01 * millis());
  };

  this.display = function() {
    girl.style("transform", "rotate(" + deg * 2 / 3 + "deg)");
    umbrella.style("transform", "rotate(" + deg + "deg)");
  };

  this.rotate = function() {
    var degall = map(mouseX, 0, width, -45, 25);
    girlnumb.style("transform", "rotate(" + degall + "deg)");
    girlnumb.style("transform-origin", "50% 50%");
  };

  this.waveLegs = function() {
    legs.style("rotate", "rotate(" + deg + "deg)")
  }

  // this.dragged = function() {
  //   this.x = 
  //   var d = dist(mouseX, mouseY, this.x, this.y);
  //   if (d < this.d / 2) {
  //     this.x = mouseX;
  //     this.y = mouseY;
  //   }
  // };
}