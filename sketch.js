var PLAY = 1;
var END = 0;
var gameState = PLAY;
var ground, grass;
var monkey, monkey_running, monkey_collided;
var banana, bananaImg, obstacle, obstacleImg;
var foodGrp, obstacleGrp;
var score = 0;
var survivalTime = 0;

function preload(){
  monkey_running =            loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png")
  
  monkey_collided = loadAnimation("sprite_0.png");
  
  bananaImg = loadImage("banana.png");
  obstacleImg = loadImage("obstacle.png");
}

function setup() {
  createCanvas(400,400);

  monkey = createSprite(80,315);
  monkey.addAnimation("moving", monkey_running);
  monkey.scale = 0.1;
  
  ground = createSprite(400,350,900,10);
  ground.shapeColor = "brown";
  
  grass = createSprite(400,378,900,44.9);
  grass.shapeColor = "green";
  
  foodGrp = new Group();
  obstaclesGrp = new Group();
}

function draw() {
  background("lightBlue");
  
  stroke("red");
  fill("red");
  text("SURVIVAL TIME: "+ survivalTime, 10,25);
  
  stroke("blue");
  fill("blue");
  text("SCORE: "+ score, 10,45);
  
  if(gameState === PLAY){
    survivalTime = survivalTime + Math.round(getFrameRate()/60);
    
    ground.velocityX = -(6 + survivalTime/100);
    grass.velocityX = -(6 + survivalTime/100);
    
    if(ground.x < 0){
      ground.x = ground.width/2;
    }
    if(grass.x < 0){
      grass.x = grass.width/2;
    }
    if(keyDown("space")&& monkey.y >= 280) {
        monkey.velocityY = -14;
    }
    monkey.velocityY = monkey.velocityY + 0.65;
    
    spawnFood();
    spawnObstacles();
    
    if(obstaclesGrp.isTouching(monkey)){
      gameState = END;
    }
    if(foodGrp.isTouching(monkey)){
      foodGrp.destroyEach();
      score = score + 5;
      monkey.scale = monkey.scale + 0.005;
    }
  }
  else if(gameState === END){
    monkey.scale = 0.1;
    
    ground.velocityX = 0;
    grass.velocityX = 0;
    monkey.velocityY = 0;
    
    monkey.changeAnimation("moving", monkey_collided);
    
    obstaclesGrp.setLifetimeEach(-1);
    foodGrp.destroyEach();
    
    obstaclesGrp.setVelocityXEach(0);
    foodGrp.setVelocityXEach(0);
  }
  monkey.collide(ground);

  drawSprites();
}

function spawnFood(){
  if(frameCount % 80 === 0){
    banana = createSprite(400,200);
    banana.y = Math.round(random(120,200));
    banana.addImage(bananaImg);
    banana.scale = 0.1;
    banana.velocityX = -(6 + survivalTime/100);
    
    banana.lifetime = 85;
    
    banana.setCollider("rectangle", 0, 0, 400, 340)
    
    banana.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;
    
    foodGrp.add(banana);
  }
}

function spawnObstacles(){
  if(frameCount % 300 === 0){
    obstacle = createSprite(400,320);
    obstacle.addImage(obstacleImg);
    obstacle.velocityX = -(6 + survivalTime/100);
    
    obstacle.scale = 0.12;
    obstacle.lifetime = 300;
   
    obstaclesGrp.add(obstacle);
  }
} 