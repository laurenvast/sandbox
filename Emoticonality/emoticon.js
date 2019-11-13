function Emoticon(x, y, d) {
  var leye = ["￣", "> ", "^","・", "╯", "Θ", "☆", "′  ", "T"];
  var reye = ["￣", " <", "^","・", "╰", "Θ", "☆", "′ " , "T"];
  var mouth = [" ˍ ", "﹏", "▽", "ω", " 。", "□", " 3 "];
  var face = ["(＃", "( || ", "(〃", "(* ", "(；", "( ", "( "];
  var lhand = ["╮", "<", "< ", "o ", "っ", " "];
  var rhand = ["╭", "／", " >", " o", "っ", " "];
  var c = [42, 255, 122];
  var h = floor(random(lhand.length));
  var e = floor(random(leye.length));
  
  this.x = x;
  this.y = y;
  this.xspeed = random(1, 3);
  this.r = c[floor(random(c.length))];
  this.g = c[floor(random(c.length))];
  this.b = c[floor(random(c.length))];
  this.a = 255;
  this.d = d;
  this.lhand = lhand[h];
  this.face = face[floor(random(face.length))];
  this.leye = leye[e];
  this.mouth = mouth[floor(random(mouth.length))];
  this.reye = reye[e];
  this.rhand = rhand[h];

  this.display = function() {
    stroke(this.r, this.g, this.b, this.a);
    strokeWeight(3);
    textSize(d);
    fill(this.r, this.g, this.b, this.a);
    //txt = 
    text(this.lhand + this.face + this.leye + this.mouth + this.reye + ")" + this.rhand, this.x, this.y);
    //text.style("font-weight","900");
  };

  this.isFinished = function() {
    if (this.x < -100 || this.a<=0) {
      return true;
    } else {
      return false;
    }
  };

  this.move = function() {
    this.x = this.x - this.xspeed;
  };
  
  this.fadeout = function(){
    this.a = this.a - 10;
  }
}