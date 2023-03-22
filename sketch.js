let imageScale = 1.0;

let dotDensity = 0.19;

 

let dwidth = 0;

let dheight = 0;

 

let damping = 0.7;

let kRadiusFactor = 1;

let kSpeed = 50;

let minDistFactor = 3;

let nbrParticles = 3000;

 

let catSpeed = 1;

let reference = null;

let nbrCatFrames = 80;

 

let cats = [];

let particles = [];

let capture;

 

 

 

class Particle {

                constructor(_x, _y) {

                                this.x = _x;

                                this.y = _y;

                                this.vx = 0;

                                this.vy = 0;

                                this.rad = 1;

                                this.fx = 0;

                                this.fy = 0;

                                this.wt = 0;

                }

}

 

function setup() {

                dwidth=windowWidth;

                dheight=windowHeight;

                createCanvas(windowWidth, windowHeight);

               

                // VIDEO

                capture = createCapture(VIDEO);

                capture.size(dwidth, dheight);

                capture.hide();

               

                imageScale =  width / dwidth;

               

                for (let i = 0; i < nbrParticles; i++) {

                                particles[i] = new Particle(random(width), random(height));

                }

 

                frameRate(50);

                smooth();

                noStroke();

 

                let medArea = (width * height) / nbrParticles;

                medRadius = sqrt(medArea / PI);

                minRadius = medRadius;

                maxRadius = medRadius * medRadius * 1;

                background(0);

}

 

 

function cat() {

               

                //camera image

                if (frameCount % catSpeed == 0) {

                                let frameCtr = (frameCount / catSpeed % nbrCatFrames);

                               

                                reference = capture;

                                reference.loadPixels();   //pixels update the array

               

 

                                for (let i = 0; i < nbrParticles; i++) {

                                                let px = parseInt(particles[i].x / imageScale);

                                                let py = parseInt(particles[i].y / imageScale);

                                                if (px >= 0 && px < dwidth && py >= 0 && py < dheight) {

                                                                // let v = red(pg.get(particles[i].x, particles[i].y));

                                                                let v = reference.pixels[(py*dwidth+px)*4];

                                                                particles[i].rad = map(v / 255.0, 0, 1, minRadius, maxRadius);

                                                }

                                }

                }

               

               

                for (let i = 0; i < nbrParticles; ++i) {

                                let p = particles[i];

                                p.fx = p.fy = p.wt = 0;

 

                                p.vx *= damping;

                                p.vy *= damping;

                }

 

                  // Particle -> particle interactions

                  for (let i = 0; i < nbrParticles-1; ++i) {

                                               

                    let p = particles[i];

                    for (let j = i+1; j < nbrParticles; ++j) {

                      let pj = particles[j];

                      if (i== j || Math.abs(pj.x - p.x) > p.rad*minDistFactor ||

                        Math.abs(pj.y - p.y) > p.rad*minDistFactor)

                        continue;

 

                      let  dx = p.x - pj.x;

                      let  dy = p.y - pj.y;

                      let  distance = Math.sqrt(dx*dx+dy*dy);

 

                      let  maxDist = (p.rad + pj.rad);

                      let  diff = maxDist - distance;

                      if (diff > 0) {

                        let scle = diff/maxDist;

                        scle = scle*scle;

                        p.wt += scle;

                        pj.wt += scle;

                        scle = scle*kSpeed/distance;

                        p.fx += dx*scle;

                        p.fy += dy*scle;

                        pj.fx -= dx*scle;

                        pj.fy -= dy*scle;

                      }

                    }

                  }

 

                  for (let i = 0; i < nbrParticles; ++i) {

                    let p = particles[i];

 

                    // keep within edges

                    let dx, dy, distance, scle, diff;

                    let maxDist = p.rad;

                    // left edge 

                    distance = dx = p.x - 0;   

                    dy = 0;

                    diff = maxDist - distance;

                    if (diff > 0) {

                      scle = diff/maxDist;

                      scle = scle*scle;

                      p.wt += scle;

                      scle = scle*kSpeed/distance;

                      p.fx += dx*scle;

                      p.fy += dy*scle;

                    }

                    // right edge 

                    dx = p.x - width;   

                    dy = 0;

                    distance = -dx;

                    diff = maxDist - distance;

                    if (diff > 0) {

                      scle = diff/maxDist;

                      scle = scle*scle;

                      p.wt += scle;

                      scle = scle*kSpeed/distance;

                      p.fx += dx*scle;

                      p.fy += dy*scle;

                    }

                    // top edge

                    distance = dy = p.y - 0;   

                    dx = 0;

                    diff = maxDist - distance;

                    if (diff > 0) {

                      scle = diff/maxDist;

                      scle = scle*scle;

                      p.wt += scle;

                      scle = scle*kSpeed/distance;

                      p.fx += dx*scle;

                      p.fy += dy*scle;

                    }

                    // bot edge 

                    dy = p.y - height;   

                    dx = 0;

                    distance = -dy;

                    diff = maxDist - distance;

                    if (diff > 0) {

                      scle = diff/maxDist;

                      scle = scle*scle;

                      p.wt += scle;

                      scle = scle*kSpeed/distance;

                      p.fx += dx*scle;

                      p.fy += dy*scle;

                    }

                    if (p.wt > 0) {

                      p.vx += p.fx/p.wt;

                      p.vy += p.fy/p.wt;

                    }

                    p.x += p.vx;

                    p.y += p.vy;

                  }

}

 

function draw() {

                cat();

                background(0, 50);

                noStroke();

                fill(200);

                for (let i = 0; i < nbrParticles; ++i) {

                                arc(width - particles[i].x, particles[i].y, medRadius*1, random(10, 100), 90, 10, CHORD);

                }



}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }