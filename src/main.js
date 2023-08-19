// import kaboom lib
// do not change this
import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";

// function for adjusting game scale
function adjustGameScale() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  // Calculate the scale based on screen dimensions
  const scale = Math.min(screenWidth / 400, screenHeight / 340); // original - (screenWidth / 500, screenHeight / 400);
  // Update the game scale
  return scale;
}

// initialize kaboom context
// and add black background
kaboom({
    //width: 703 * adjustGameScale(),
    //height: 397 * adjustGameScale(),
    font: "sans-serif",
    background: [ 0, 0, 0, ],
    scale: 1
})


// Add Score object to game
const score = add([
    text("Score: 0"),
    { value: 0 },

    // Make blue
    color(0, 0, 255),

    // Position at center of screen (position relative to the center of the score object)
    pos(width() / 5 * adjustGameScale(), 20 * adjustGameScale()),
    scale(adjustGameScale()/2),
    anchor("center"),
])

// Add Player object to game
const player = add([
	sprite("player"),
	pos(50*adjustGameScale(), 80*adjustGameScale()),
  area(),
  body(),
  scale(adjustGameScale()/10),
  rotate(0),        // rotate() component gives it rotation
	anchor("center"),
])

// Player movement
// Define player movement speed (pixels per second)
const SPEED = 70 *adjustGameScale()

onKeyDown("left", () => {
	// .move() is provided by pos() component, move by pixels per second
	player.move(-SPEED, 0)
  player.angle = 180
})

onKeyDown("right", () => {
	player.move(SPEED, 0)
  player.angle = 0//changes the rotation of the object rotate(0) and anchor("center") have to be attached to object 
})

onKeyDown("up", () => {
	player.move(0, -SPEED)
  player.angle = -90
})

onKeyDown("down", () => {
	player.move(0, SPEED)
  player.angle = 90
  })

add([
	// text() component is similar to sprite() but renders text
	text("Press arrow keys to move", { width: width() / 2 * adjustGameScale() }),
	pos(12, 12),
])


// Below - examples of how to add sprite objects to game from spritesheet
// See #SpriteAtlasData type for format spec
loadSpriteAtlas("src/sprites/spritesheet.png", {
    "enemy": {
        x: 18,
        y: 84,
        width: 15,
        height: 15,
    },
	"maze-wall": {
		x: 36,
		y: 72,
		width: 10,
		height: 10,
	},
    "pointDot": {
        x: 337,
        y: 197,
        width: 6,
        height: 7,
    }
})
// load  the player sprite sprite 
loadSpriteAtlas("src/sprites/player-sprite.png", {
  "player": {
      x: 0,//horizontal sprite position on the spritesheet 
      y: 0,//vertical position on spritesheet
      width: 702,//width of the spritesheet all 3 images in the animation
      height: 234,//height of the spritesheet
      sliceX : 3,//how many sprites are on the sprite sheet for this invidual animation
      anims: {
        idle: { from: 1, to: 2,loop: true, speed:3},
        run: { from: 2, to: 0 , loop: true, speed:4},//run animation
    },
    
  }
})

player.play("run")//starts the pacman animation

//walls and stationary objects go here
addLevel([
    "                                                           ",
    '                                                           ',
    '                                                           ',
    '                                                           ',
    '===========================================================',
    '=          =                   =                          =',
    '=          =                   =                          =',
    '=          =                   =                          =',
    '=   ====   =   =   =====   =   =   =====   ============   =',
    '=                  =       =           =                  =',
    '=                  =       =           =                  =',
    '=                  =       =           =                  =',
    '=   ================   =============   ================   =',
    '=            =                               =            =',
    '=            =                               =            =',
    '=                                                         =',
    '====   ===       =   ===   =   =   ===   =       ===   ====',
    '       = =       =   = =   =   =   = =   =       = =       ',
    '       = =   =   =   = =   =   =   = =   =   =   = =       ',
    '       = =       =   = =   =   =   = =   =       = =       ',
    '====   ===       =   ===   =====   ===   =       ===   ====',
    '=                                                         =',
    '=            =                               =            =',
    '=            =                               =            =',
    '=   ================   =============   ================   =',
    '=                  =           =       =                  =',
    '=                  =           =       =                  =',
    '=                  =           =       =                  =',
    '=   ============   =====   =   =   =====   =   =   ====   =',
    '=                          =                   =          =',
    '=                          =                   =          =',
    '=                          =                   =          =',
    '===========================================================',
  ],{
      // define the size of tile bck
      tileWidth: adjustGameScale()*10,
      tileHeight:  adjustGameScale()*10,
      // define what each symbol means, by a function returning a component list (what will be passed to add())
      tiles: {
          "=": () => [//each symbol represents an object
              sprite("maze-wall"),
              scale(adjustGameScale()),
              area(),//for collision detection
              pos(),
              body({ isStatic: true }),
              "wall",// tag for collision detection
          ]
      }
  })

/**
 * Generate a random direction (left, right, up or down)
 * @returns a random direction
 */
function randomDirection() {
    let enemySpeed = 100;
    let directionsList = [
        [enemySpeed, 0],
        [-enemySpeed, 0],
        [0, enemySpeed],
        [0, -enemySpeed]
    ]
    let randomIndex = Math.floor(Math.random() * 4);
    let direction = directionsList[randomIndex];

    return direction;
}

/**
 * Based on the current movement of the enemy, returns a new direction that will
 * cause enemy to turn (randomly) right or left when it hits a wall
 * @param {*} currentDirection 
 * @returns direction as an array
 */
// --- COMMENT BACK IN FROM HERE FOR CHANGE DIRECTION CODE ---
// function changeDirection(currentDirection) {
//     // set speed
//     let enemySpeed = 100

//     // randomly generate a positive or negative speed
//     let posOrNeg = Math.floor(Math.random() * 2)
//     let randSpeed
//     if (posOrNeg == 0) {
//         randSpeed = enemySpeed
//     } else {
//         randSpeed = -enemySpeed
//     }

//     // change the direction - set whatever axis was non-zero to zero and set the other
//     // axis to the random direction from above
//     let xMov = currentDirection[0]
//     let yMov = currentDirection[1]
//     if (xMov != 0) {
//         xMov = 0
//         yMov = randSpeed
//     } else if (yMov != 0) {
//         xMov = randSpeed
//         yMov = 0
//     }

//     // store the new x and y speeds in an array
//     let direction = [xMov, yMov]

//     return direction
// }
// --- COMMENT BACK IN UP UNTIL HERE FOR CHANGE DIRECTION CODE ---

// Create an empty array to store all enemy objects
const allEnemies = []

// Add 3 ghosts to game
for (let i = 0; i < 3; i++) {
    let enemy = add([
        sprite("enemy"),
        pos(200 *adjustGameScale(), 100 * adjustGameScale()), // position on screen
        scale(adjustGameScale()), // size of sprite
        area(), // necessary to allow collisions
        body(), // necessary so it doesn't pass through other objects
        "enemy"
        ])
    
        allEnemies.push(enemy) // add new enemy object to allEnemies
}

// On each frame, enemy moves in the x and y directions stored in newDir
// When enemy hits a wall, direction changes, causing it to turn left or right
allEnemies.forEach((enemy) => {
    let newDir = randomDirection()
    onUpdate(() => {
        enemy.move(newDir[0], newDir[1])
    })
    // --- COMMENT BACK IN FROM HERE FOR CHANGE DIRECTION CODE ---
    // enemy.onCollide("wall", () => {
    //     debug.log("enemy hit wall") // CAN BE REMOVED - checking when they hit walls
    //     newDir = changeDirection(newDir)
    // })
    // --- COMMENT BACK IN UNTIL HERE FOR CHANGE DIRECTION CODE
})

// Add 5 point dots to game
for (let i = 0; i < 5; i++){
    add([
        sprite("pointDot"),
        pos(100* adjustGameScale() + i * 30 *adjustGameScale(), 150*adjustGameScale()),
        scale(adjustGameScale()),
    
        // area() component gives the object a collider, which enables collision checking
        area(),
    
        // add tag so behavior can be assigned (on collision)
        "pointDot",
    ])
}

// When player collides with a point dot, it disappears and 10 points are added to the score
player.onCollide("pointDot", (pointDot) => {
    destroy(pointDot)

    // Increase score and update display
    score.value += 10
    score.text = "Score: " + score.value
})

//when player collides with enemy the enemy disappears and 10 points are added to the score and
//the kaboom explosion animation plays in the enemy position
player.onCollide("enemy", (enemy)=>{
    destroy(enemy)
    score.value += 10
    score.text = "Score: " + score.value
    addKaboom(enemy.pos)
})