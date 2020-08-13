/*

The Game Project.

Extensions added

- sound
- enemies
- few graphics tweaks, including background image and moving clouds.


I have added sound to the game project. This includes sound for falling into canyon, sound for collecting collectables, jump sound and game background tune. I have also added enemies to the game. I used classes and objects to create, interact and render the objects. I have also made a few graphical tweaks such as randomly appearing moving clouds and a background image for the game. 
The environment in the game is randomly generated for every level. Although the environment is randomly generated the environement generated for each level is the same since I used randomSeed function for generating the same environment for a level. The game has unlimited number of levels.
I found it challenging to integrate the state of the game, for example, game over, pause game, level up, etc with the rendering and interaction behaviour of the game. I also found it especially challenging to randomly generate objects without compromising on gameplay.



*/
var seed = 10;
var startLoc = 80;
var endLoc = 5000;
var gameChar;
var gameWorldX;
var floorPos_y;
var objects;
var canyons;
var collectables;
var clouds;
var mountains;
var trees;
var enemies;
var flagpole;
var game;
var jumpSound;
var gameOverSound;
var gameTune;
var collectableSound;
var image;

function preload() {
  image = loadImage('assets/star.jpeg');
  soundFormats('wav', 'mp3');
  jumpSound = loadSound('assets/jump.wav');
  gameTune = loadSound('assets/gameTune.mp3');
  gameTune.setVolume(0.1);
  gameOverSound = loadSound('assets/gameOverSound.wav');
  collectableSound = loadSound('assets/collectableSound.wav');
  jumpSound.setVolume(0.1);
  collectableSound.setVolume(0.1);
  gameOverSound.setVolume(0.1);
}

function setup() {
  createCanvas(1024, 576);
  floorPos_y = (height * 3) / 4;
  lives = 3;
  startGame();
}

// Function to draw the game character.

function startGame() {
  randomSeed(seed);
  objects = [];
  canyons = [];
  collectables = [];
  clouds = [];
  mountains = [];
  trees = [];
  enemies = [];

  game = new Game();

  gameChar = new GameChar(startLoc, floorPos_y, 3);
  scrubber = 100;
  options = [
    'mountain',
    'tree',
    'collectable',
    'cloud',
    'canyon',
    'enemy',
    'cloud',
    'cloud',
    'trees',
    'mountain'
  ];

  while (endLoc > scrubber) {
    if (options.length <= 0) {
      options = ['mountain', 'tree', 'collectable', 'cloud', 'canyon', 'enemy'];
    }
    index = floor(random(0, options.length));
    pick = options[index];

    switch (pick) {
      case 'mountain':
        scrubber += 50;
        mountains.push(new Mountain(scrubber, floorPos_y));

        break;
      case 'tree':
        scrubber += 50;
        trees.push(new Tree(scrubber));

        break;
      case 'collectable':
        scrubber += 50;
        collectables.push(new Collectable(scrubber, floorPos_y, 20));

        break;
      case 'cloud':
        scrubber += 50;
        clouds.push(new Cloud(scrubber, 100 + ceil(random(50, 100))));

        break;
      case 'canyon':
        scrubber += 50;
        canyons.push(new Canyon(scrubber, floorPos_y, 160, 240));
        scrubber += 190;

        break;
      case 'enemy':
        scrubber += 50;
        enemies.push(new Enemy(scrubber, floorPos_y));
        scrubber += 120;
        break;

      default:
    }
    options.splice(index, 1);
  }
  scrubber += ceil(random() * 250 + 30);
  flagpole = new Flagpole(scrubber);

  objects = [
    clouds,
    mountains,
    canyons,
    trees,
    collectables,
    [flagpole],
    enemies
  ];
}

function draw() {
  console.log(keyCode);
  //Environment being rendered
  background(image);
  noStroke();
  fill(0, 155, 0);
  rect(0, floorPos_y, width, height / 4);
  push();
  cloudOver = true;
  translate(gameChar.scrollPos, 0); // translate by scrollPos
  for (i = 0; i < objects.length; i++) {
    for (j = 0; j < objects[i].length; j++) {
      obj = objects[i][j];
      obj.render();
      if (obj instanceof Cloud) {
        if (obj.x - gameChar.scrollPos < 512) {
          cloudOver = false;
        }
      }
    }
  }
  if (cloudOver) {
    clouds.push(
      new Cloud(gameChar.scrollPos - 40, 100 + ceil(random(50, 100)))
    );
    clouds.push(
      new Cloud(gameChar.scrollPos - 180, 100 + ceil(random(50, 100)))
    );
  }
  pop();

  game.displayStats();
  //Game logic
  if (!game.start) {
    noStroke();
    textSize(60);
    fill(204, 0, 102);

    rect(240, 240, 540, 75, 30);
    fill(255);
    text('Press enter to Start ', 250, 300);
    if (keyCode == 13) {
      gameTune.loop();
      game.start = true;
    }

    return;
  }

  if (game.halt) {
    fill(255);
    noStroke();
    textSize(60);
    fill(204, 0, 102);

    rect(210, 240, 650, 75, 30);
    fill(255);
    text('Press enter to Continue ', 220, 300);
    gameTune.stop();
    if (keyCode == 13) {
      gameChar = new GameChar(startLoc, floorPos_y, 3);
      game.halt = false;
      gameTune.loop();
    }
    return;
  }
  if (game.levelComplete) {
    fill(0);
    noStroke();
    textSize(60);
    fill(204, 0, 102);
    rect(280, 150, 465, 75, 30);
    rect(210, 240, 650, 75, 30);
    fill(255);
    text('Level Complete! ', 300, 210);
    text('Press enter to Continue ', 220, 300);
    var level = game.level + 1;
    var score = game.score;
    gameTune.stop();
    if (keyCode == 13) {
      seed += 10;
      console.log('here');
      game.levelComplete = false;
      startGame();
      game.score = score;
      game.level = level;
    }
    return;
  }

  if (game.gameOver) {
    fill(0);
    noStroke();
    textSize(60);
    fill(204, 0, 102);
    rect(280, 150, 380, 75, 30);
    rect(210, 240, 650, 75, 30);
    fill(255);
    text('Game Over! ', 300, 210);
    text('Press enter to Continue ', 220, 300);
    gameTune.stop();
    if (keyCode == 13) {
      game.gameOver = false;
      startGame();
    }
    return;
  }

  gameChar.render();
  gameChar.updateWorldX();
  gameChar.updateMovements();
}

// ---------------------
// Key control functions
// ---------------------

function keyPressed() {
  if (keyCode == 37) {
    gameChar.isLeft = true;
  }
  if (keyCode == 39) {
    gameChar.isRight = true;
  }
  if (keyCode == 32) {
    gameChar.isJumping = true;
  }
}

function keyReleased() {
  if (keyCode == 37) {
    gameChar.isLeft = false;
  }
  if (keyCode == 39) {
    gameChar.isRight = false;
  }
}

class Game {
  constructor() {
    this.score = 0;
    this.lives = 3;
    this.halt = false;
    this.start = false;
    this.levelComplete = false;
    this.gameOver = false;
    this.level = 0;
  }

  displayStats() {
    fill(255);
    noStroke();
    textSize(10);
    text('Score : ' + this.score, 20, 20);
    text('Lives: ' + this.lives, 20, 35);
    text('Level: ' + this.level, 20, 50);
  }
  incrementScore() {
    score += 1;
  }
  decrementLife() {
    gameOverSound.play();
    if (!this.halt) {
      this.lives -= 1;
      if (this.lives > 0) {
        this.halt = true;
      } else {
        this.gameOver = true;
      }
    }
  }

  reset() {
    game = new Game();
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y - 50;
    this.isRight = false;
    this.h = 100;
    this.disabled = false;
    this.w = 100;
    this.x_t = 0;
    this.y_t = 0;
    this.counter = 0;
    this.base = this.y + this.h / 2 + 10 + this.y_t;
  }
  render() {
    this.renderCheck();
    if (!this.disabled) {
      this.check();
      this.drawEnemy();
    }
  }
  renderCheck() {
    if (this.x - gameChar.x_world > 1024) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }

  drawEnemy() {
    var x_t = this.x_t;
    var y_t = this.y_t;
    var h = this.h;
    var w = this.w;
    var off_x = 13;
    var off_y = 13;
    var e_r = 30;
    var curve_x = 150;
    var curve_y = 150;
    var e1x = this.x - off_x;
    var e1y = this.y - off_y;
    var e2x = this.x + off_x;
    var e2y = this.y - off_x;
    var wheels_r = 25;
    var x_1 = this.x - w / 2;
    var y_1 = this.y + h / 2;
    var x_2 = this.x + w / 2;
    var y_2 = this.y + h / 2;
    var x_3 = this.x;
    var y_3 = this.y - h / 2;

    fill(100, 200, 255);
    quad(
      x_1 - 5,
      y_1 + 5,
      x_1 + 5,
      y_1 + 5,
      this.x + x_t + 5,
      this.y + y_t + 5,
      this.x + x_t - 5,
      this.y + y_t + 5
    );
    quad(
      x_2 - 5,
      y_2 + 5,
      x_2 + 5,
      y_2 + 5,
      this.x + x_t + 5,
      this.y + y_t + 5,
      this.x + x_t - 5,
      this.y + y_t + 5
    );
    fill(255, 0, 0);
    ellipse(x_1, y_1, wheels_r, wheels_r);
    ellipse(x_2, y_2, wheels_r, wheels_r);
    push();
    fill(196, 255, 249);
    translate(x_t, y_t);
    triangle(x_1, y_1, x_2, y_2, x_3, y_3);

    for (var k = 0; k < 10; k++) {
      triangle(
        x_1 + (k * w) / 10,
        y_1,
        x_1 + ((k + 1) * w) / 10,
        y_1,
        x_1 + (((2 * k + 1) / 2) * w) / 10,
        y_1 + 10
      );
    }

    fill(90, 100, 90);
    strokeWeight(2);
    stroke(51);
    curve(
      this.x - curve_x / 2,
      this.y + curve_y,
      this.x - curve_x / 4,
      this.y + curve_y / 4,
      this.x + curve_x / 4,
      this.y + curve_y / 4,
      this.x + curve_x / 2,
      this.y + curve_y / 4
    );
    curve(
      this.x - curve_x / 2,
      this.y + curve_y + curve_y / 4,
      this.x - curve_x / 4,
      this.y + curve_y / 4,
      this.x + curve_x / 4,
      this.y + curve_y / 4,
      this.x + curve_x / 2,
      this.y + curve_y / 4
    );
    fill(0, 0, 255);
    ellipse(e1x, e1y, 4, 4);
    ellipse(e2x, e2y, 4, 4);
    pop();
    this.counter += 0.06;
    this.y_t = 70 * -sin(this.counter) - 70; // was 50
    this.base = this.y + this.h / 2 + 10 + this.y_t;
  }

  check() {
    if (
      this.base > gameChar.y - 65 &&
      gameChar.x_world > this.x - this.w / 2 &&
      gameChar.x_world < this.x + this.w / 2 &&
      !game.halt &&
      !game.gameOver
    ) {
      game.decrementLife();
    }
  }
}

class GameChar {
  constructor(x, y, lives) {
    this.x = x;
    this.y = y;
    this.isFalling = false;
    this.isPlummetting = false;
    this.isLeft = false;
    this.isRight = false;
    this.isJumping = false;
    this.scrollPos = 0;
    this.x_world = x;
  }
  render() {
    if (this.isLeft && this.isFalling) {
      this.drawJumpingLeft();
    } else if (this.isRight && this.isFalling) {
      this.drawJumpingRight();
    } else if (this.isLeft) {
      this.drawLeft();
    } else if (this.isRight) {
      this.drawRight();
    } else if (this.isFalling || this.isPlummeting) {
      this.drawPlummetting();
    } else {
      this.drawNormal();
    }
  }

  drawNormal() {
    fill(255, 0, 0);
    ellipse(this.x, this.y - 45, 20, 20);
    fill(0);
    ellipse(this.x - 3, this.y - 45, 2, 2);
    ellipse(this.x + 3, this.y - 45, 2, 2);
    //body
    fill(0);
    rect(this.x - 10, this.y - 35, 20, 25);
    //hand left
    fill(0, 255, 0);
    rect(this.x - 17, this.y - 35, 7, 5);
    //hand right
    rect(this.x + 10, this.y - 35, 7, 5);
    //leg left
    fill(0, 0, 255);
    rect(this.x - 10, this.y - 10, 7, 12);
    //leg right
    rect(this.x + 3, this.y - 10, 7, 12);
  }
  drawLeft() {
    fill(255, 0, 0);
    ellipse(this.x, this.y - 45, 20, 20);
    fill(0);
    ellipse(this.x - 7, this.y - 45, 2, 2);
    ellipse(this.x - 3, this.y - 45, 2, 2);
    //body
    fill(0);
    rect(this.x - 10, this.y - 35, 20, 25);
    //hand left
    fill(0, 255, 0);
    rect(this.x - 17, this.y - 35, 7, 5);
    //hand right
    rect(this.x - 17, this.y - 25, 7, 5);
    //leg left
    fill(0, 0, 255);
    rect(this.x - 10, this.y - 10, 7, 12);
    //leg right
    rect(this.x + 3, this.y - 10, 7, 12);
  }
  drawRight() {
    fill(255, 0, 0);
    ellipse(this.x, this.y - 45, 20, 20);
    fill(0);
    ellipse(this.x + 7, this.y - 45, 2, 2);
    ellipse(this.x + 3, this.y - 45, 2, 2);
    //body
    fill(0);
    rect(this.x - 10, this.y - 35, 20, 25);
    //hand left
    fill(0, 255, 0);
    rect(this.x + 10, this.y - 25, 7, 5);
    //hand right
    rect(this.x + 10, this.y - 35, 7, 5);
    //leg left
    fill(0, 0, 255);
    rect(this.x - 10, this.y - 10, 7, 12);
    //leg right
    rect(this.x + 3, this.y - 10, 7, 12);
  }
  drawJumpingLeft() {
    fill(255, 0, 0);
    ellipse(this.x, this.y - 45, 20, 20);
    fill(0);
    ellipse(this.x - 7, this.y - 45, 2, 2);
    ellipse(this.x - 3, this.y - 45, 2, 2);
    //body
    fill(0);
    rect(this.x - 10, this.y - 35, 20, 25);
    //hand left
    fill(0, 255, 0);
    rect(this.x - 17, this.y - 35, 7, 5);
    //hand right
    rect(this.x - 17, this.y - 25, 7, 5);
    //leg left
    fill(100, 100, 200);
    rect(this.x - 10, this.y - 10, 7, 5);
    //leg right
    rect(this.x + 3, this.y - 10, 7, 5);
  }
  drawJumpingRight() {
    fill(255, 0, 0);
    ellipse(this.x, this.y - 45, 20, 20);
    fill(0);
    ellipse(this.x + 7, this.y - 45, 2, 2);
    ellipse(this.x + 3, this.y - 45, 2, 2);
    //body
    fill(0);
    rect(this.x - 10, this.y - 35, 20, 25);
    //hand left
    fill(0, 255, 0);
    rect(this.x + 10, this.y - 25, 7, 5);
    //hand right
    rect(this.x + 10, this.y - 35, 7, 5);
    //leg left
    fill(100, 100, 200);
    rect(this.x - 10, this.y - 10, 7, 5);
    //leg right
    rect(this.x + 3, this.y - 10, 7, 5);
  }
  drawPlummetting() {
    fill(255, 0, 0);
    ellipse(this.x, this.y - 45, 20, 20);
    fill(0);
    ellipse(this.x - 3, this.y - 45, 2, 2);
    ellipse(this.x + 3, this.y - 45, 2, 2);
    //body
    fill(0);
    rect(this.x - 10, this.y - 35, 20, 25);
    //hand left
    fill(0, 255, 0);
    rect(this.x - 17, this.y - 35, 7, 5);
    //hand right
    rect(this.x + 10, this.y - 35, 7, 5);
    //leg left
    fill(100, 100, 200);
    rect(this.x - 10, this.y - 10, 7, 5);
    //leg right
    rect(this.x + 3, this.y - 10, 7, 5);
  }

  updateMovements() {
    this.left();
    this.right();
    this.jump();
    this.plummet();
    this.updateWorldX();
  }

  left() {
    if (this.isLeft) {
      if (this.x > width * 0.2) {
        this.x -= 5;
      } else {
        this.scrollPos += 5;
      }
    }
  }
  right() {
    if (this.isRight) {
      if (this.x < width * 0.8) {
        this.x += 5;
      } else {
        this.scrollPos -= 5;
      }
    }
  }
  jump() {
    if (this.isJumping && !this.isFalling) {
      this.y -= 100;
      this.isJumping = false;
    }
    if (this.y < floorPos_y) {
      this.isFalling = true;
      this.y += 2;
    } else {
      this.isFalling = false;
    }
  }
  plummet() {
    if (this.isPlummetting) {
      this.y += 8;
      if (this.y > height) {
        game.decrementLife();
      }
    }
  }

  updateWorldX() {
    this.x_world = this.x - this.scrollPos;
  }
}

// Classes that interact with gameChar

class Flagpole {
  constructor(x) {
    this.x = x;
    this.isReached = false;
    this.disabled = false;
  }
  render() {
    this.renderCheck();
    if (!this.disabled) {
      this.checkFlagpole();
      if (this.isReached) {
        this.drawCompletedFlagpole();
      } else {
        this.drawNormalFlagpole();
      }
    }
  }
  drawNormalFlagpole() {
    stroke(126);
    strokeWeight(4);
    line(this.x, floorPos_y, this.x, floorPos_y - 70);
    fill(23, 236, 236);
    rect(this.x, floorPos_y - 100, 50, 30);
  }
  drawCompletedFlagpole() {
    stroke(126);
    strokeWeight(4);
    line(this.x, floorPos_y, this.x, floorPos_y - 70);
    fill(23, 236, 236);
    rect(this.x, floorPos_y - 30, 50, 30);
  }

  renderCheck() {
    if (this.x - gameChar.x_world > 1024) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }

  reached() {
    this.reached = true;
  }
  checkFlagpole() {
    if (gameChar.x_world >= this.x) {
      this.isReached = true;
      game.levelComplete = true;
    }
  }
}
class Collectable {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.disabled = false;
    this.size = size;
    this.isFound = false;
  }
  render() {
    this.renderCheck();
    if (!this.disabled) {
      this.check();
      if (!this.isFound) {
        this.drawCollectable();
      }
    }
  }
  renderCheck() {
    if (this.x - gameChar.x_world > 1024) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }
  drawCollectable() {
    fill(255, 215, 0);
    ellipse(this.x, this.y - this.size / 2, this.size);
  }
  found() {
    this.isFound = true;
  }
  check() {
    if (
      abs(gameChar.x_world - this.x) < this.size / 2 &&
      abs(gameChar.y - this.y) <= this.size / 2 &&
      this.isFound == false
    ) {
      this.isFound = true;
      collectableSound.play();
      game.score += 1;
    }
  }
}
class Canyon {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.disabled = false;
  }
  render() {
    this.check();
    this.renderCheck();
    if (!this.disabled) {
      this.drawCanyon();
    }
  }
  drawCanyon() {
    fill(29, 41, 81);
    rect(this.x, this.y, this.width, this.height);
  }
  renderCheck() {
    if (this.x - gameChar.x_world > 1024) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }
  check() {
    var condition =
      gameChar.x_world > this.x &&
      gameChar.x_world < this.x + this.width &&
      gameChar.y == this.y;

    if (condition) {
      gameChar.isPlummetting = true;
    }
  }
}

//Classes that dont interact with gameChar

class Cloud {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.disabled = false;
  }
  renderCheck() {
    if (this.x - gameChar.x_world > 1024) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }
  render() {
    this.renderCheck();
    if (!this.disabled) {
      fill(200, 200, 200);
      ellipse(this.x - 25, this.y + 20, 60);
      ellipse(this.x, this.y, 60);
      ellipse(this.x + 25, this.y + 20, 60);
    }
    if (game.start && !game.halt && !game.complete) {
      this.x = this.x + 1;
    }
  }
}
class Mountain {
  constructor(x, y) {
    this.x = x;
    this.y = y - 200;
    this.disabled = false;
  }
  render() {
    this.renderCheck();
    if (!this.disabled) {
      this.drawMountain();
    }
  }
  renderCheck() {
    if (this.x - gameChar.x_world > 1024) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }
  drawMountain() {
    var x = this.x;
    var y = this.y;
    fill(150, 75, 0);
    triangle(x, y - 80, x - 85, y + 200, x + 85, y + 200);
    x += 60;
    triangle(x + 20, y, x - 85, y + 200, x + 85, y + 200);
    x -= 30;
    y -= 10;
    triangle(x, y - 50, x - 65, y + 100, x + 65, y + 100);
  }
}
class Tree {
  constructor(x) {
    this.x = x;
    this.disabled = false;
  }
  render() {
    this.renderCheck();
    if (!this.disabled) {
      this.drawTree();
    }
  }
  renderCheck() {
    if (this.x - gameChar.x_world > 1024) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }
  drawTree() {
    fill(101, 67, 33);
    rect(this.x, floorPos_y - 80, 20, 80);
    var x = this.x + 10;
    var y = floorPos_y - 100;
    fill(17, 59, 8);
    triangle(x, y, x - 45, y + 60, x + 45, y + 60);
    triangle(x, y - 50, x - 45, y + 10, x + 45, y + 10);
  }
}
