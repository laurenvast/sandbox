var city, ydist, xdist, speedY, speedX;

function bg() {
  this.moveY = -1000;
  this.moveX = 0;
  city = select('#city');

  this.movebg = function() {
    city.style("bottom", this.moveY + "px");
    if (this.moveY < -18890) {
      this.moveY = 0;
    } else if (this.moveY > 0) {
      this.moveY = -18890;
    }
  };

  this.mouseControl = function() {
    ydist = dist(mouseX, mouseY, mouseX, height / 2);
    xdist = dist(mouseX, mouseY, width / 2, mouseY);
    //acceleration 
    //speedY = ydist / 6;
    //speedX = xdist / 600;

    //same speed
    speedY = width / 500;
    speedX = width / 500;

    if (mouseY < height / 2) {
      this.moveY = this.moveY - speedY;
    } else
    if (mouseY > height / 2) {
      this.moveY = this.moveY + speedY;
    }

    city.style("left", this.moveX + "px");
    if (mouseX < width / 2) {
      this.moveX = this.moveX + speedX;
    } else if (mouseX > width / 2) {
      this.moveX = this.moveX - speedX;
    }
    if (this.moveX > 0) {
      this.moveX = 0;
    } else if (this.moveX < width - 1400) {
      this.moveX = width - 1400;
    }
  };

  this.keyboard = function() {
    if (keyIsDown(UP_ARROW))
      this.moveY = this.moveY - 20;
    if (keyIsDown(DOWN_ARROW))
      this.moveY = this.moveY + 20;
  };

  this.responsive = function() {
    if (windowWidth > 1400) {
      city.style("width", "100%");
      city.style("left", "0px");
    }
    // else {
    //   city.style("width", "1400px");
    //   city.style("left", (1400 - windowWidth) / 2 * -1 + "px");
    // }
  };


}