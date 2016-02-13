function init() {
  /* initialize canvas */
  stage = new createjs.Stage("myCanvas")

  /* set frames per second */
  createjs.Ticker.setFPS(FPS)

  /* process game at each tick */
  createjs.Ticker.addEventListener("tick", onTick)
}

function onTick() {
  /* development tool: adds balls to top of screen every second */
  // if (ticks >= 2 * FPS) {
  //   dropBall()
  //   ticks = 0
  //   console.log('balls[0]', balls[0])
  // }

  if (ticks % (3 * FPS) == 0) {
    dropBall()
    ticks = 0
    // console.log('balls[0]', balls[0])
    // console.log(4 * GRAVITY / FPS / balls[0].mass)
  } else if ( ticks % (2 * FPS) == 0) {
    // console.log('balls[0]', balls[0])
    // console.log('balls[1]', balls[1])
  }
  if (ticks == 3* FPS) {
    dropBall()
  }

  /* handle movement of all objects */
  move()

  /* increment number of passed  since last dropped ball ticks */
  ticks++

  /* update the stage/canvas */
  stage.update()
}
