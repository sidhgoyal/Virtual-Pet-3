var database, dog, dog1, dog2;
var position;
//var form;
var feed, add;
var foodobject;
var Feedtime;
var Lastfeed;
var back;
var dogName;
var form;
var gameState;
var readState;
var gardenImg, bedroomImg, washroomImg;
var currentTime;
var bimg
//Create variables here

function preload() {
  dogimg1 = loadImage("dog1.png");
  dogimg2 = loadImage("HappyDog.png");
  back = loadImage("back.jpg");
  gardenImg = loadImage("Garden.png")
  bedroomImg = loadImage("Bed Room.png")
  washroomImg = loadImage("Wash Room.png")
}

function setup() {
  createCanvas(400, 400);
  database = firebase.database();
  console.log(database);

  foodobject = new Food();
  dog = createSprite(600, 300, 10, 10);
  dog.addImage(dogimg1)
  dog.scale = 0.2

  readState = database.ref('gameState')
  readState.on("value", function (data) {
    gameState = data.val()
  })

  var dogo = database.ref('Food');
  dogo.on("value", readPosition, showError);
  feed = createButton("FEED MAC MILK")
  feed.position(580, 400)
  feed.mousePressed(FeedDog)
  feed.mouseReleased(function () {
    dog.addImage(dogimg1);

  })
  add = createButton("ADD FOOD")
  add.position(730, 400)
  add.mousePressed(AddFood)

  fedtime = database.ref('FeedTime')
  fedtime.on("value", function (data) { Lastfeed = data.val(); });
console.log(Lastfeed)
}

function draw() {
  //background(back);

  foodobject.display()
imageMode(CENTER)
  

  fill(255, 255, 254);
  textSize(15);
  currentTime = hour()

  if (currentTime === (Lastfeed + 1)) {
    update("playing")
    foodobject.garden();
    
  }
  else if (currentTime === (Lastfeed + 2)) {
    update("sleeping");
    foodobject.bedroom();
    
  }
  else if (currentTime > (Lastfeed + 2) && currentTime <= (Lastfeed + 4)) {
    update("bathing");
    foodobject.washroom();
    
  }
  else {
    update("Hungry");
    foodobject.display();
  }

  if(gameState !== "Hungry" ){
    add.hide();
    feed.hide();
    dog.remove();
  }
  else{
    add.show();
    feed.show();
    dog.addImage("dog1",dogimg1);
    
  }

  

  


  drawSprites();
}
function readPosition(data) {
  position = data.val();
  foodobject.updateFoodStock(position)
}

function showError() {
  console.log("Error in writing to the database");
}

function writePosition(position) {
  if (position > 0) {
    position = position - 1
  }
  else {
    position = 0
  }
  database.ref('/').set({
    'Food': position
  })

}
function AddFood() {

  position++
  database.ref('/').update({
    Food: position
  }

  )

}
function FeedDog() {

  dog.addImage(dogimg2)


  if (foodobject.getFoodStock() > 0) {
    foodobject.updateFoodStock(foodobject.getFoodStock() - 1)
    database.ref('/').update({
      Food: foodobject.getFoodStock(),
      FeedTime: hour()
    })
  } else {
    text("hguaiuf", 45, 100)

  }
  console.log(foodobject.getFoodStock());


}
function update(state) {
  database.ref('/').update({
    gameState: state
  })
}