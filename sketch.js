// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;

let engine;
let canvas;

let textLeft;

let projects = ["intersection", "human mass", "happy briefing", "etf insight", "5"];
let pills =[];

let ground;
let wallLeft;
let wallRight;

let widthOfPill;
let heightOfPill;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  canvas.position(0,0);


  textLeft = createP('hallo <a href="https://thanh.so">thanh.so</a>');
  // textLeft.mouseOver(overText);
  // textLeft.mouseOut(outText);
  textLeft.position(width/30,0);


  widthOfPill = windowWidth/5;
  heightOfPill = windowHeight/10;

  // create an engine
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
        label: projects[i]
      });
      pills.push(pill);
    }
  }
    
  World.add(engine.world, pills);
  console.log(pills);
 
  ground = Bodies.rectangle(windowWidth/2, windowHeight-30, windowWidth, 30, {
    isStatic: true,
    friction: 0.00001
  });
  wallLeft = Bodies.rectangle(-5, windowHeight/2, 10, windowHeight, {
    isStatic: true,
    friction: 0.00001
  });
  wallRight = Bodies.rectangle(windowWidth + 5, windowHeight/2, 10, windowHeight, {
    isStatic: true,
    friction: 0.00001
  });

  // add all of the bodies to the world
  World.add(engine.world, [pills, ground, wallLeft, wallRight]);

  /*const mouse = Mouse.create(this.element);
    this.element.addEventListener('click', () => {
      const query = Query.point(Composite.allBodies(world), mouse.position)
      console.log(mouse.position);
      console.log(query);
    });*/

  // run the engine
  Engine.run(engine);
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
    var pillColor;
    if((pill.position.x - widthOfPill/2<mouseX)&&(pill.position.x + widthOfPill/2>mouseX)&&(pill.position.y - heightOfPill/2<mouseY)&&(pill.position.y + heightOfPill>mouseY)){
      if (pill.label === "human mass") {
        pillColor = 'yellow';
        humanmass();
      } else if (pill.label === "happy briefing") {
        pillColor = 'blue';
        happybriefing();
      } else if (pill.label === "etf insight") {
        pillColor = 'green';
        etfinsight();
      } else if (pill.label === "5") {
        pillColor = 'red';
        five();
      } else if (pill.label === "intersection") {
        pillColor = 'pink';
        intersection();
      }
    } else {
      pillColor = 'white';
    }
    fill(pillColor);
    stroke(0);
    strokeWeight(2);
    drawVertices(pill.vertices);
    
    noStroke();
    fill(0);
    // textFont('inter');
    textSize(1*windowWidth/40);
    drawText(pill, projects[i]);

    // let div = createDiv('').size(100, 100);
    // div.html('hi');

    // if (mouseX<windowWidth) {
    //   // createP("hallo");
    // } else {
    //   // createP("tschüss");
    // }
    
    // let text = createP('hallo');
    // text.position(0,0);
  }

  fill(128);
  drawVertices(ground.vertices);
  drawVertices(wallLeft.vertices);
  drawVertices(wallRight.vertices);

  // if (mouseX < windowWidth/2) {
  //   overText();
  // } else {
  //   outText();
  // }
}

// function mousePressed() {
//   text;
//   text = createP('tschüss');
// }

function overText() {
  textLeft.html('wie gehts');
}

function outText() {
  textLeft.html('tschüss' + createA('http://p5js.org/', "p5"));
}

function intersection() {
  textLeft.html('intersection <br></br> <a href="https://thanh.so">thanh.so</a>');
}

function etfinsight() {
  textLeft.html('etf insight');
}

function humanmass() {
  textLeft.html('human mass');
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
  ellipse(0, 10, 2, 2);
  pop();
}