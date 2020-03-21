/* Employs the 'chaos game' algorithm on a polygon
 * with pre-chosen number of sides.
 */

// Display parameters
var sizeCtrl = (window.innerHeight > window.innerWidth)?window.innerWidth:window.innerHeight;
var cnv = {w : sizeCtrl,  h : 0.9*sizeCtrl};
var wfrac = 0.10*cnv.w;
var hfrac = 0.37*cnv.h;
var sfrac = 0.33*cnv.w;

var alpha, beta, gamma;
const dt = 0.6; // global vars to store accelerometer data: z, y, x

var particles = [];
var holes;
var maxP;
var holeRadius;

var font;

function preload() {
  font = loadFont('carlito/Carlito-Bold.ttf');
}

function setup() {
  var cnvs = createCanvas(cnv.w,cnv.h);
  cnvs.position(0,0);
  background(40);

  alpha = 0;
  beta = 0;
  gamma = 0;

  let bound = font.textBounds('madhu!', wfrac, hfrac, sfrac);
  sfrac = sfrac*(cnv.w - 2.25*wfrac)/bound.w; // rescale size of text using bounds
  let hole1 = font.textToPoints('hbd', 3*wfrac, hfrac, sfrac);
  let hole2 = font.textToPoints('madhu!', wfrac, 2*hfrac, sfrac);
  holes = hole1.concat(hole2);

  maxP = holes.length;
  holeRadius = 0.1*sfrac;

  // for (let i = 0; i < holes.length; i++) {
  //   let pt = holes[i];
  //   fill(200,200,0);
  //   noStroke();
  //   ellipse(pt.x,pt.y,4);
  // }

  // The texty stuff
  fill(180);
  textSize(15);
  textFont(font);
  textAlign(LEFT,BASELINE);

  createParticles(40);
}

function draw() {
  background(40);  
  // let textpos = cnv.w/16;
  // fill(255);
  // text("alpha: " + alpha, textpos, textpos);
  // fill(255, 0, 0);
  // text("beta: " + beta, textpos, textpos + 25);
  // text("gamma: " + gamma, textpos, textpos + 50);

  for (particle of particles) {
    particle.paint();
    particle.move();
    particle.strikeBounds();
    particle.inHole();
  }

  text('Move your device around!', 20 ,cnv.h - 20);
}
// accelerometer data
window.addEventListener('deviceorientation', function(e) 
{
  alpha = e.alpha/360.0;
  beta = e.beta/360.0;
  gamma = e.gamma/360.0;
});

function createParticles(num) {
  let border = 20;
  for (let i = 0; i < num; i++) {
    let x = random(border, cnv.w - border);
    let y = random(border, cnv.h - border);
    particles.push(new Particle(createVector(x,y)));
  }
}

function createParticle()  {
  if(particles.length < maxP) {
    let border = 20;
    let x = random(border, cnv.w - border);
    // let y = random(border, cnv.h - border);
    particles.push(new Particle(createVector(x,border)));
  }
}

function Particle(pos) {
  this.pos = pos;
  this.vel = createVector(0,0);
  this.r = 0.05*sfrac;
  this.holed = false;
}

Particle.prototype.move = function() {
  if(!this.holed) {
    this.vel.add(createVector(gamma, beta).mult(dt));
    this.pos.add(this.vel);
  }
}

Particle.prototype.paint = function() {
  noStroke();
  fill(230,230);
  ellipse(this.pos.x,this.pos.y,this.r);
}

Particle.prototype.strikeBounds = function() {
  let radius = this.r/2;
  if((this.pos.x - radius) < 0 || (this.pos.x + radius) > cnv.w) {
    this.vel.x = -this.vel.x;
  }
  if((this.pos.y - radius) < 0 || (this.pos.y + radius) > cnv.h) {
    this.vel.y = -this.vel.y;
  }
}

Particle.prototype.inHole = function() {
  for (let i = 0; i < holes.length; i++) {
    let hole = holes[i];
    if(dist(this.pos.x,this.pos.y,hole.x,hole.y) < (holeRadius - this.r)/2) {
      this.pos = hole;
      this.r += 1;
      this.holed = true;
      createParticle();
      holes = holes.slice(0,i).concat(holes.slice(i+1));
      --i;
    }
  }
}