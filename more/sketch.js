/* Employs the 'chaos game' algorithm on a polygon
 * with pre-chosen number of sides.
 */

// Display parameters
var sizeCtrl = (window.innerHeight > window.innerWidth)?window.innerWidth:window.innerHeight;
var cnv = {w : sizeCtrl,  h : sizeCtrl};

var alpha, beta, gamma; // global vars to store accelerometer data: z, y, x

var particles = [];

function setup() {
  var cnvs = createCanvas(cnv.w,cnv.h);
  cnvs.position(0,0);

  alpha = 0;
  beta = 0;
  gamma = 0;

  particles.push(new Particle(createVector(cnv.w/2,cnv.h/2)));
}

function draw() {
  let textpos = cnv.w/16;
  background(0);
  fill(255);
  text("alpha: " + alpha, textpos, textpos);
  fill(255, 0, 0);
  text("beta: " + beta, textpos, textpos + 25);
  text("gamma: " + gamma, textpos, textpos + 50);
  for (particle of particles) {
    particle.paint();
    particle.move();
  }
}
// accelerometer data
window.addEventListener('deviceorientation', function(e) 
{
  alpha = e.alpha/180.0;
  beta = e.beta/180.0;
  gamma = e.gamma/180.0;
  console.log(alpha,beta,gamma);
});

function Particle(pos) {
  this.pos = pos;
  this.vel = createVector(0,0);
  this.r = 15;
}

Particle.prototype.move = function() {
  this.vel.add(gamma, beta);
  this.pos.add(this.vel);
}

Particle.prototype.paint = function() {
  fill(230,230);
  ellipse(this.pos.x,this.pos.y,this.r);
}
