/* Employs the 'chaos game' algorithm on a polygon
 * with pre-chosen number of sides.
 */

// Display parameters
var cnv = {w : window.innerWidth,  h : window.innerHeight};

var sources = [];
var drops = [];
const sourceNum = 300;

function setup() {
  var cnvs = createCanvas(cnv.w,cnv.h);
  cnvs.position(0,0);
  cnvs.style("z-index","-9999");
  background(200);
  createSources();
  stroke(30,170);
  frameRate(30);
}

function draw() {
  if((frameCount - 1)%30 == 0) {
    let num = 3;
    for(let i = 0; i < num; i++) {
      index = floor(random(sourceNum));
      alpha = floor(random(128,192+1));
      drops.push(new Drop(sources[index],alpha));
    }
  }
  background(200);
  for (let i = 0; i < drops.length; i++) {
    let drop = drops[i];
    drop.paint();
    drop.grow();
  }
  for (let i = 0; i < drops.length; i++) {
      let drop = drops[i];
      if(drop.r > windowHeight*0.5) {
      drops = drops.slice(0,i).concat(drops.slice(i+1));
      --i;
    }
  }
  // console.log(drops.length);
  // if(drops.length > sourceNum*0.01) {
  //   drops = drops.slice(drops.length - sourceNum*0.1);
  // }
}

function createSources() {
  sources = [];
  for(let i = 0; i < sourceNum; i++) {
    let x = random(windowWidth);
    let y = random(windowHeight);
    sources.push(createVector(x,y));
  }
}

function windowResized() {  // built-in event
  resizeCanvas(windowWidth,windowHeight);
  createSources();
}

function Drop(vec,startAlpha = 192,startWeight = 3) {
  this.x = vec.x;
  this.y = vec.y;
  this.r = 0;
  this.alpha = startAlpha;
  this.wt = startWeight;
}

Drop.prototype.grow = function() {
  this.r += 1;
  this.alpha -= 0.8;
  if(this.wt > 0.01) {
    this.wt -= 0.01;
  }
  else {
    this.wt = 0;
  }
}

Drop.prototype.paint = function() {
  noFill();
  strokeWeight(this.wt);
  stroke(30,this.alpha);
  ellipse(this.x,this.y,this.r);
}