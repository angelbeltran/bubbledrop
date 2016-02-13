function Ball(options) {
  if (!options) {
    options = {}
  }
  /* the ball is a CreateJs Shape */
  createjs.Shape.call(this)

  /* set position */
  this.x = options.x || 0
  this.y = options.y || 0

  /* set initial velocity */
  var vx = options.vx || 0
  var vy = options.vy || 0
  this.velocity = new Vector(vx, vy)

  /* set radius */
  this.radius = options.radius || 1

  /* set mass */
  this.mass = options.mass || 1

  /* set bounciness */
  this.bounciness = options.bounciness || 0.5

  /* set the color */
  this.color = options.color || "gray"
  this.graphics
    .setStrokeStyle(1)
    .beginStroke("white")
    .beginFill(this.color)
    .drawCircle(0, 0, options.radius || 1)
  // this.graphics.beginFill("red").drawCircle(0, 0, 20)

  /* set alpha level */
  this.alpha = options.alpha || 1

  /* set ball as moving (not stuck or rigid) */
  this.moving = options.moving || true
  this.movingHorizontally = options.movingHorizontally || true
  this.movingVertically = options.movingVertically || true

  /* array to track which other balls this ball is touching */
  this.wasTouching = []
  this.touching = []
}

/* create a copy of the Shape prototype to be used to the Ball prototype */
Ball.prototype = Object.create(createjs.Shape.prototype)
/* replace the constructory with the Ball constructor */
Ball.prototype.constructor = Ball

/* bounce off a vertical wall */
Ball.prototype.bounceHorizontally = function() {
  /* flip x velocity, losing kinetic energy */
  this.velocity.x *= -this.bounciness

  /* stop in the x direction if x velocity is too small */
  if (Math.abs(this.velocity.x) < 5 * GRAVITY / (FPS * this.mass)) {
    this.velocity.x = 0
    this.movingHorizontally = false
    return
  }

  /* an element of randomness :) */
  var angle = 0.01 * Math.PI * Math.random()

  this.velocity = this.velocity.rotation(angle)
}

/* bounce off a horizontal wall */
Ball.prototype.bounceVertically = function() {
  /* flip y velocity */
  this.velocity.y *= -this.bounciness

  /* stop in the y direction if y velocity is too small */
  if (Math.abs(this.velocity.y) < 5 * GRAVITY / (FPS * this.mass)) {
    this.velocity.y = 0
    this.movingVertically = false
    return
  }

  /* an element of randomness :) */
  var angle = (0.01 * Math.random() - 0.005) * Math.PI

  this.velocity = this.velocity.rotation(angle)
}

Ball.prototype.setColor = function(color) {
  this.color = color
  var alpha = this. alpha
  this.graphics.beginFill(color).drawCircle(0, 0, this.radius)
  this.alpha = alpha
}
