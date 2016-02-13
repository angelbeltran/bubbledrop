/* holds all the global object and variable references */

/* frame rate */
const FPS = 120

/* physical constants */
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const BALL_RADIUS = 20
const BALL_MASS = 10 // will be parametetrized later
const GRAVITY = 500 // random scalar lol
const DRAG = 0.001 // random scalar :)
// const MIN_NORMAL_VELOCITY = 0.001
const COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "violet",
  "gray",
  "pink"
]

/* objects */
var stage
var balls = []

/* counters */
var ticks = 0 /* for tracking periodic actions */
