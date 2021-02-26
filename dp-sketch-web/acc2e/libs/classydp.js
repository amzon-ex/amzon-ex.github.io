class DoublePendulum {
  constructor(len1 = 1, len2 = 1, m1 = 1, m2 = 1, globscale = 0.5*height) {
    this.length1 = len1;
    this.length2 = len2;
    this.mass1 = m1;
    this.mass2 = m2;
    
    this.pvt = createVector(0, 0);

    this.Lscale = globscale / (len1 + len2);

    this.colors = {};
  }

  initialize(dt, theta1 = 0, theta2 = 0, ptheta1 = 0, ptheta2 = 0) {
    this.dt = dt;
    this.q1 = theta1;
    this.q2 = theta2;
    this.p1 = ptheta1;
    this.p2 = ptheta2;
  }
  
  setColor(r, g, b) {
    function shade(col, per) {
      let newcol = color(255, 255, 255);
      newcol.setRed(red(col)*(1.0 - per/100.0));
      newcol.setGreen(green(col)*(1.0 - per/100.0));
      newcol.setBlue(blue(col)*(1.0 - per/100.0));
      return newcol;
    }
    this.colors.basergb = color(r, g, b);
    this.colors.bob1 = this.colors.basergb;
    this.colors.bob2 = this.colors.basergb;
    this.colors.line = shade(this.colors.basergb, 10);
    this.colors.pivot = shade(this.colors.basergb, 30);
  }

  set pivot(vec) {
    this.pvt = vec;
  }

  step() {
    let q1 = this.q1;
    let q2 = this.q2;
    let p1 = this.p1;
    let p2 = this.p2;
    let l1 = this.length1;
    let l2 = this.length2;
    let m1 = this.mass1;
    let m2 = this.mass2;

    let dq = q1 - q2;

    let h1 = (p1 * p2 * sin(dq)) / (l1 * l2 * (m1 + m2 * (sin(dq)) ** 2));
    let h2 = (m2 * l2 * l2 * p1 * p1 + (m1 + m2) * l1 * l1 * p2 * p2 - 2 * m2 * l1 * l2 * p1 * p2 * cos(dq)) / (2 * l1 * l1 * l2 * l2 * (m1 + m2 * (sin(dq)) ** 2) ** 2);

    this.dq1 = (l2 * p1 - l1 * p2 * cos(dq)) / (l1 * l1 * l2 * (m1 + m2 * (sin(dq)) ** 2));
    this.dq2 = (-m2 * l2 * p1 * cos(dq) + (m1 + m2) * l1 * p2) / (m2 * l1 * l2 * l2 * (m1 + m2 * (sin(dq)) ** 2));
    this.dp1 = -((m1 + m2) * g * l1 * sin(q1) + h1 - h2 * sin(2 * dq));
    this.dp2 = -(m2 * g * l2 * sin(q2) - h1 + h2 * sin(2 * dq));
  }

  integrate() {
    // Euler method
    this.q1 = this.q1 + this.dt * this.dq1;
    this.q2 = this.q2 + this.dt * this.dq2;
    this.p1 = this.p1 + this.dt * this.dp1;
    this.p2 = this.p2 + this.dt * this.dp2;
  }

  get loc1() {
    let x = this.pvt.x + this.length1 * this.Lscale * sin(this.q1);
    let y = this.pvt.y + this.length1 * this.Lscale * cos(this.q1);
    return createVector(x, y);
  }

  get loc2() {
    let x = this.loc1.x + this.length2 * this.Lscale * sin(this.q2);
    let y = this.loc1.y + this.length2 * this.Lscale * cos(this.q2);
    return createVector(x, y);
  }

  get mom1() {
    return this.p1;
  }

  get mom2() {
    return this.p2;
  }

  paint(buffer) {
    // buffer.clear();
    buffer.ellipseMode(CENTER);
    buffer.fill(this.colors.pivot);
    buffer.ellipse(this.pvt.x, this.pvt.y, 5);
    
    buffer.noStroke();
    buffer.fill(this.colors.bob1);
    buffer.ellipse(this.loc1.x, this.loc1.y, 6);
    buffer.fill(this.colors.bob2);
    buffer.ellipse(this.loc2.x, this.loc2.y, 6);

    buffer.stroke(this.colors.line);
    buffer.strokeWeight(3);
    buffer.line(this.pvt.x, this.pvt.y, this.loc1.x, this.loc1.y);
    buffer.line(this.loc1.x, this.loc1.y, this.loc2.x, this.loc2.y);
  }
}