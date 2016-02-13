/* initiates movement processes of all objects in game */
function move() {
  // console.log('move called')
  /* loop through list of balls, copmuting their movements */
  balls.forEach(accelerateBall)
  balls.forEach(moveBall)
  balls.forEach(handleCollisions)
  balls.forEach(handleTouches)
  balls.forEach(checkForLaunch)
}

/* currently a development tool. drops a ball at top of game */
/* this version uses the Ball class */
function dropBall() {
  // console.log('dropBall called')
  /* add a Ball at the top center of the canvas to the list of balls */
  balls.push(new Ball({
    x: CANVAS_WIDTH / 2,
    y: 3 * BALL_RADIUS,
    radius: BALL_RADIUS,
    mass: BALL_MASS,
    bounciness: 0.8,
    // color: COLORS[Math.floor(COLORS.length * Math.random())],
    color: "red",
    // color: "red",
    alpha: .5
  }))
  // console.log('balls length', balls.length)
  // console.log('balls', balls)
  stage.addChild(balls[balls.length-1])
}

function accelerateBall(ball) {
  /* do nothing if the ball is not moving (stuck) */
  if (!ball.movingHorizontally && !ball.movingVertically) return

  /* list out forces */
  var forces = []

  /* gravity */
  forces.push(new Vector(0, ball.mass * GRAVITY)) // NOTE: gravity points in positive y-axis

  /* drag */
  var drag = DRAG * ball.velocity.magnitude()
  forces.push(new Vector(-drag * ball.velocity.x, -drag * ball.velocity.y))

  /* apply forces */
  forces.forEach(function(force) {
    applyImpulse(ball, force)
  })
}

function applyImpulse(ball, force) {
  if (ball.movingHorizontally) {
    ball.velocity.x += force.x / (FPS * ball.mass)
  }
  if (ball.movingVertically) {
    ball.velocity.y += force.y / (FPS * ball.mass)
  }
}

function moveBall(ball) {
  /* do nothing if the ball is not moving (stuck) */
  if (!ball.movingHorizontally && !ball.movingVertically) return

  /* perform displacements */
  ball.x += ball.velocity.x / FPS
  ball.y += ball.velocity.y / FPS

  /* correct movements off the canvas */
  if (ball.x < BALL_RADIUS) {
    ball.x = BALL_RADIUS
    ball.bounceHorizontally()
  } else if (CANVAS_WIDTH - BALL_RADIUS < ball.x) {
    ball.x = CANVAS_WIDTH - BALL_RADIUS
    ball.bounceHorizontally()
  }
  if (ball.y < BALL_RADIUS) {
    ball.y = BALL_RADIUS
    ball.bounceVertically()
  } else if (CANVAS_HEIGHT - BALL_RADIUS < ball.y) {
    ball.y = CANVAS_HEIGHT - BALL_RADIUS
    ball.bounceVertically()
  }
}

function handleCollisions(ball) {
  /* do nothing if the ball isn't moving */
  if (!ball.movingHorizontally && !ball.movingVertically) return

  /* loop through all other balls */
  balls.forEach(function(other) {
    // console.log('other radius', other.radius)
    // TODO: make sure that after detecting a collinsion we not only accelerate the balls
    //       in the appropriate directions but also move the balls apart so that the collision is only detected once.
    /* don't compare ball with itself */
    if (ball.id == other.id) return

    /* check if balls' possibly collided */
    if (Math.abs(ball.x - other.x) < ball.radius + other.radius) {
      // console.log('x coordinates close')
      if (Math.abs(ball.y - other.y) < ball.radius + other.radius) {
        // console.log('x coordinates close')
        /* get distance between balls' centers */
        var distance = Math.sqrt(Math.pow(ball.x - other.x, 2) + Math.pow(ball.y - other.y, 2))
        var overlap = ball.radius + other.radius - distance

        /* if distance is short enough, a collision occured */
        if (overlap > 0) {
          /* check if they were already touching */
          var wereTouching = (ball.wasTouching.indexOf(other.id) !== -1)

          /* set that they're touching for reference in the next frame */
          ball.touching.push(other.id)
          other.touching.push(ball.id)

          // console.log('collision occured: ', ball.velocity, other.velocity)
          /* move the balls just outside of each others' space */
          var r = new Vector(other.x - ball.x, other.y - ball.y)
          var overlapVector = r.unit().times(overlap)
          // NOTE: COULD THE ISSUE BE IN THE SIGNS IN THE FOUR NEXT LINES???
          ball.x -= (overlapVector.x * 1.005) / 2 // slightly extra shifting to prevent collision being detected twice due to rounding error
          ball.y -= (overlapVector.y * 1.005) / 2
          other.x += (overlapVector.x * 1.005) / 2
          other.y += (overlapVector.y * 1.005) / 2

          /* Now compute velocity vectors */

          /* compute v_21 = v_1_0 - v_2_0*/
          var v_21 = ball.velocity.minus(other.velocity)

          /* recompute r = r_2 - r_1 (balls were shifted slightly) */
          var r = new Vector(other.x - ball.x, other.y - ball.y)

          /* compute gamma */
          var gamma = 2*r.dot(v_21) / ((ball.mass + other.mass)*r.dot(r))

          // var gamma = 1.2 * 2 * r.dot(ball.velocity.minus(other.velocity)) / ((ball.mass + other.mass) * r.dot(r))

          // console.log('gamma', gamma)

          /* finish computing new velocities */
          var v_1f = ball.velocity.minus(r.times(ball.mass * gamma))
          var v_2f = other.velocity.plus(r.times(other.mass * gamma))


          /* if balls weren't already touching, reduce kinetic energy in system */
          if (!wereTouching) {
            v_1f = v_1f.times(ball.bounciness)
            v_2f = v_2f.times(other.bounciness)
          } else {
            v_1f = v_1f.times(1.1)
            v_2f = v_2f.times(1.1)
          }

          /* set velocities of respective balls */
          ball.velocity = v_1f
          other.velocity = v_2f

          /* set balls as moving */
          if (Math.abs(ball.velocity.x) > 5 * GRAVITY / FPS / ball.mass) {
            ball.movingHorizontally = true
          }
          if (Math.abs(ball.velocity.y) > 5 * GRAVITY / FPS / ball.mass) {
            ball.movingVertically = true
          }
          if (Math.abs(other.velocity.x) > 5 * GRAVITY / FPS / other.mass) {
            other.movingHorizontally = true
          }
          if (Math.abs(other.velocity.y) > 5 * GRAVITY / FPS / other.mass) {
            other.movingVertically = true
          }

          /* change colors to random color if colors were matching */
          if (ball.color === other.color) {
            console.log('matching colors!')
            var new_color_index = COLORS.indexOf(ball.color) + 1
            if (new_color_index == COLORS.length) {
              var ball_index = findBallIndex(ball)
              var other_index = findBallIndex(other)
              var lesser_index
              var greater_index
              if (ball_index < other_index) {
                lesser_index = ball_index
                greater_index = other_index
              } else {
                lesser_index = other_index
                greater_index = ball_index
              }
              balls = balls.slice(0, lesser_index).concat(balls.slice(lesser_index + 1, greater_index), balls.slice(greater_index + 1))
              stage.removeChild(ball)
              stage.removeChild(other)
            }
            ball.setColor(COLORS[new_color_index])
            other.setColor(COLORS[new_color_index])
          }
        }
      }
    }
  })
}

function handleTouches(ball) {
  if (ball.wasTouching.length === ball.touching.length && ball.touching.length === 0) return

  ball.wasTouching = ball.touching
  ball.touching = []
}

function checkForLaunch(ball) {
  if (ball.x < BALL_RADIUS + 5 || ball.x > CANVAS_WIDTH - BALL_RADIUS - 5) {
    if (Math.abs(CANVAS_HEIGHT - ball.y - ball.radius) < 1) {
      ball.velocity.y -= 500
      ball.movingVertically = true
    }
  }
}

function findBallIndex(ball) {
  return balls.reduce(function(index, other, i) {
    return (index === -1 && other.id === ball.id) ? i : index
  }, -1)
}


// /* currently a development tool. drops a ball at top of game */
// function dropBall() {
//   /* initialize empty shape (ball) */
//   var ball = new createjs.Shape()
//
//   /* give ball a random color */
//   var randomColor = COLORS[Math.floor(COLORS.length * Math.random())]
//   ball.graphics.beginFill(randomColor).drawCircle(0, 0, BALL_RADIUS)
//
//   /* place ball at center, one diameter from top */
//   ball.x = (CANVAS_WIDTH + BALL_RADIUS) / 2
//   ball.y = 3 * BALL_RADIUS
//
//   /* initialize the velocity to 0  */
//   ball.velocity = new Vector(0, 0)
//
//   /* set mass to general amount. will be parametrized later */
//   ball.mass = BALL_MASS
//
//   /* mark as moving */
//   ball.moving = true
//
//   /* add ball to list of balls */
//   balls.push(ball)
// }
