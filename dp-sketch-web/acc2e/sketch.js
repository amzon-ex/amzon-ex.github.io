// Display parameters
var pivot;
var fr = 60;
const loops = 10;

// The parameters of the problem
const g = 9.8;
const dt = 1.0 / fr / loops;

// The variables of the problem
var dp1, dp2;
var period2;
var vp1, vp2;

var im;
var lumamap;

var cnvs;
var dpGfx, sktch;
var myFrameCount;
var showpendulum;
var pauseSketch;
var speed, speedslider;

function preload() {
  im = loadImage('res/acc2e.jpg');
}

function setup() {
  pixelDensity(1);
  cnvs = createCanvas(im.width, im.height);
  frameRate(fr);

  im.loadPixels();
  lumamap = new Array(floor(im.pixels.length/4));
  for(let i = 0; i < im.pixels.length - 1; i += 4) {
    let R = im.pixels[i];
    let G = im.pixels[i+1];
    let B = im.pixels[i+2];
    let luma = 0.2126*R + 0.7152*G + 0.0722*B;
    lumamap[floor((i+1)/4)] = luma; 
  }

  pivot = {
    x: width / 2,
    y: height / 2
  };
  
  dp1 = new DoublePendulum(1, 1, 1, 1, 0.52*height);
  dp2 = new DoublePendulum(1, 1, 1, 1, 0.54*height);

  handleLocalDOM();

  initSketch();
  
  period2 = 15*fr;
  
  dp1.setColor(210, 210, 0);
  dp2.setColor(210, 0, 0);

  dp1.pivot = createVector(pivot.x, pivot.y);
  dp2.pivot = createVector(pivot.x, pivot.y);

  speed = (speedslider.value*2/100.0)**2;
}

function draw() {
  for(let i = 0; i < loops*speed; i++) {
    background(0);
    speed = (speedslider.value*2/100.0)**2
    let osc2 = sin(PI*myFrameCount*speed/period2);

    if(myFrameCount <= 600) {
      startSequence(300);
    }

    let w1 = 1.9*exp(-(dp1.mom2**2)/10) + 0.7;
    let w2 = 1.9*exp(-(dp2.mom2**2)/10) + 0.7;
    let c1 = mapxy(dp1.loc2.x, dp1.loc2.y)/255.0;
    let c2 = mapxy(dp2.loc2.x, dp2.loc2.y)/255.0;
    sktch.strokeWeight(w1);
    sktch.strokeCap(SQUARE);
    try {
      sktch.stroke(c1*255, c1*255, c1*125, 230);
    } catch (error) {
      console.log(0, c1, 0);
      console.error(error);
    }
    sktch.line(vp1.x, vp1.y, dp1.loc2.x, dp1.loc2.y);
    if(osc2 > 0) {
      sktch.strokeWeight(w2);
      sktch.stroke(c2*220, 0, 0, 190);
      sktch.line(vp2.x, vp2.y, dp2.loc2.x, dp2.loc2.y);
    }
    image(sktch, 0, 0);

    vp1 = dp1.loc2;
    vp2 = dp2.loc2;


    if(showpendulum) {
      dpGfx.clear();

      dp1.paint(dpGfx);
      dp2.paint(dpGfx);

      image(dpGfx, 0, 0);
    }

    dp1.step();
    dp1.integrate();

    if(osc2 > 0) {
      dp2.step();
      dp2.integrate();
    }
  }
  myFrameCount++;
  // capturer.capture(canvas);
}

function initSketch() {
  myFrameCount = 0;

  dpGfx = createGraphics(width, height);
  sktch = createGraphics(width, height);

  showpendulum = false;
  pauseSketch = false;

  dp1.initialize(dt, 3, 3.1, 0, 0.5);
  dp2.initialize(dt, 3, 3.105, 0, 0.5);

  vp1 = dp1.loc2;
  vp2 = dp2.loc2;

  background(0);

  speedslider.value = 50;
  speedslider.dispatchEvent(new Event('input', { bubbles: true }));
}

function startSequence(fadeFrameNum) {
  dpGfx.clear();

  dp1.paint(dpGfx);
  dp2.paint(dpGfx);

  image(dpGfx, 0, 0);

  if(myFrameCount >= fadeFrameNum) {
    background(0, (myFrameCount - fadeFrameNum)*255.0/300.0);
  }
}

function mapxy(x, y) {
  let idx = floor(x) + floor(y)*im.width;
  return lumamap[idx];
}

function handleLocalDOM() {
  let descdiv = document.getElementById("desc");
  if(window.innerHeight < window.innerWidth) {
    descdiv.style.left = 1.01*width+"px";
    descdiv.style.width = (window.innerWidth - 1.08*width)+"px";
    cnvs.style('border-right', '2px solid #d2d200');
  }
  else {
    descdiv.style.top = 1.15*height+"px";
    descdiv.style.width = 0.93*width+"px";
    cnvs.style('border-bottom', '2px solid #d2d200');
  }

  let showDPCheck = document.getElementById("show-dp-check");
  showDPCheck.onchange = function() { showpendulum = showDPCheck.checked; }

  let pauseBtn = document.getElementById("pausebtn");
  pauseBtn.onclick = function() {
    pauseSketch = !pauseSketch;
    if(pauseSketch) {
      pauseBtn.innerHTML = "Resume";
      showDPCheck.disabled = true;
      noLoop();
    }
    else {
      pauseBtn.innerHTML = "Pause";
      showDPCheck.disabled = false;
      loop();
    }
  }

  let resetBtn = document.getElementById("resetbtn");
  resetbtn.onclick = function() { initSketch(); }
  
  speedslider = document.getElementById("speedslider");
  let speed = function() { return ((speedslider.value*2/100.0)**2).toFixed(2)+"x"; }
  let speedval = document.getElementById("speedval");
  speedval.innerHTML = speed();
  speedslider.oninput = function() { speedval.innerHTML = speed(); }

  let savebtn = document.getElementById("savebtn");
  savebtn.onclick = function() { save(sktch, 'sketch-frame-'+myFrameCount+'.jpg') }
}

function keyTyped() {
  if (key === 's') {
    capturer.stop();
    capturer.save();
    noLoop();
  }
}