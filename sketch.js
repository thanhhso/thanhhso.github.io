// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;

let mouseConstraint = Matter.MouseConstraint;
let mConstraint;

let engine;
let canvas;

let textLeft;
let currentState;

let projects = ["intersection", "human mass", "happy briefing", "etf insight", "5"];
let pills =[];

let ground;
let wallLeft;
let wallRight;

let widthOfPill;
let heightOfPill;

let img;

function preload() {
  img = loadImage('assets/bricks.jpg');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  cursor(CROSS);
  canvas.position(0,0);

  textLeft = createP("THANH NGUYEN <br> is a student in interaction design based <br> between Berlin and Schwäbisch Gmünd. He works <br> mostly within a team with ambitious goals and visions <br> to expand the border of what is currently known. <br> Here is a photo. <br><br> CONTACT <br> <a href = mailto: heyhey@thanh.so>heyhey@thanh.so</a> <br> <a href=tel:+491637859019>+491637859019</a> <br> <a href=https://linkedin.com/in/thanh-nguyen-b88721206 target=_blank >LinkedIn</a> <br><br> CV <br> <a href=/thanh-nguyen-cv.pdf download>thanh-nguyen-cv.pdf</a> <br><br> ASSOCIATES & FRIENDS <br><br> CHANGE THE TONE <br> for dreamers <br> for starters <br> for friends from the hood <br> <div class=hover-title>Image Hover One</div><div class=hover-image></div> <br>​");
  textLeft.position(width/30,0);

  widthOfPill = windowWidth/5 - (width/15)/5;
  heightOfPill = windowHeight/10;

  engine = Engine.create();

  for (let i = 0; i < projects.length; i++) {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      // true for mobile device
      let pill = Bodies.rectangle(windowWidth/projects.length*i + widthOfPill/2, -150, widthOfPill, heightOfPill/2, {
        chamfer: { radius: heightOfPill/4 },
        angle: Math.PI * random(-0.30 , 0.30),
        friction: 0.00001,
        frictionAir: 0.01,
        restitution: 0.0,
        slop: 0,
        label: projects[i]
      });
      pills.push(pill);
    
    } else {
      // false for not mobile device
      let pill = Bodies.rectangle(windowWidth/projects.length*i + widthOfPill/2, -150, widthOfPill, heightOfPill, {
        chamfer: { radius: heightOfPill/2 },
        angle: Math.PI * random(-0.30 , 0.30),
        friction: 0.00001,
        frictionAir: 0.005,
        density: 100,
        restitution: 0,
        slop: 0,
        label: projects[i]
      });
      pills.push(pill);
    }
  }
    
  World.add(engine.world, pills);
  
 
  ground = Bodies.rectangle(width/2, height-height/60, width, 30, {
    isStatic: true,
    friction: 0.00001,
    slop: 0
  });
  wallLeft = Bodies.rectangle(width/60, height/2, width/30, height+height/2, {
    isStatic: true,
    friction: 0.00001,
    slop: 0,
    angle: 0.00
  });
  wallRight = Bodies.rectangle(width-width/60, height/2, width/30, height+height/2, {
    isStatic: true,
    friction: 0.00001,
    slop: 0,
    angle: 0.00
  });

  World.add(engine.world, [pills, ground, wallLeft, wallRight]);

  Engine.run(engine);

  engine.enableSleeping = true

  let canvasmouse = Mouse.create(canvas.elt);
  canvasmouse.pixelRatio = pixelDensity();
  let options = {
    mouse: canvasmouse
  }
  mConstraint = mouseConstraint.create(engine, options)
  World.add(engine.world, mConstraint);
}

let clickCount;

function clickCounter() {
  clickCount;
  clickCount = "click";
}

function draw() {
  background(255,255,255,70);

  for (let i = 0; i < pills.length; i++) {
    const pill = pills[i];
    let pillColor;
    let pillStroke = 0;
    let textColor;

    if (pill.position.y > (height - height/30) - heightOfPill/2 - 5) {
      pillColor = 'white';

    } else {
      pillColor = 'black';
      for (let i = 255; i < 255; i--) {
        pillStroke ++;
      }
    }
   
    if((pill.position.x - widthOfPill/2<mouseX)&&(pill.position.x + widthOfPill/2>mouseX)&&(pill.position.y - heightOfPill/2<mouseY)&&(pill.position.y + heightOfPill>mouseY)){
      // cursor(CROSS);
      pillColor = 'black';
      textColor = 'white'
      if (pill.label === "human mass") {
        // pillColor = 'yellow';
        if (mConstraint.body) {
          humanmass();
          // pillColor = 'black';
        }
      } else if (pill.label === "happy briefing") {
        // pillColor = 'blue';
        if (mConstraint.body) {
          happybriefing();
        }
      } else if (pill.label === "etf insight") {
        // pillColor = 'green';
        if (mConstraint.body) {
          etfinsight();
        }
      } else if (pill.label === "5") {
        // pillColor = 'red';
        if (mConstraint.body) {
          five();
        }
      } else if (pill.label === "intersection") {
        // pillColor = 'pink';
        if (mConstraint.body) {
          intersection();
        }
      }
    } 


    fill(pillColor);
    stroke(pillStroke);
    strokeWeight(2);
    drawVertices(pill.vertices);
    
    noStroke();
    fill(255);
    // textFont('inter');
    textSize(1*windowWidth/40);
    drawText(pill, projects[i]);

    textSize(1*windowWidth/20);
    fill('green');
    text(currentState, width/2,height/2);

  }

  //walls & ground
  // fill("#FFFFFF");
  noFill();
  drawVertices(ground.vertices);
  drawVertices(wallLeft.vertices);
  drawVertices(wallRight.vertices);


  ////////////////// construction lines
  // fill('red');
  // //middle
  // rect(width/2, 0, 1, height);
  // //left
  // rect(width/30, 0, 1, height);
  // //right
  // rect(width-width/30, 0, 1, height);
  // //above ground 
  // rect(0, (height - height/30) - heightOfPill/2 - 5, width, 1);
}


function overText() {
  textLeft.html('wie gehts');
}

function outText() {
  textLeft.html('tschüss' + createA('http://p5js.org/', "p5"));
}

function intersection() {
  textLeft.html('<a href="https://thanh.so">THANH NGUYEN</a> <br> intersection <br></br> ');
}

function etfinsight() {
  textLeft.html('etf insight');
}

function humanmass() {
  textLeft.html('human mass');
  text('intersection', width/2, height/2);
  currentState = "human mass";
}

function happybriefing() {
  textLeft.html('happy briefing');
}

function five() {
  textLeft.html('5');
}

function drawVertices(vertices) {
  beginShape();
  for (let i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}

function drawBody(body) {
  if (body.parts && body.parts.length > 1) {
    for (let p = 1; p < body.parts.length; p++) {
      drawVertices(body.parts[p].vertices)
    }
  } else {
    drawVertices(body.vertices);
  }
}

function drawText(body, txt) {
  const pos = body.position;
  const angle = body.angle;
  push();
  translate(pos.x, pos.y);
  rotate(angle);
  textAlign(CENTER, CENTER);
  text(txt, 0, 0);
  pop();
  
}


