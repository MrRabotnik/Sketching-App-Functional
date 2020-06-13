// Drawing new sheet when the page is loaded
//Setting the height of sheet when page is loaded

const CANVAS_SIZES = {
  large: 400,
  medium: 2500,
  small: 10000
}

const Canvas = $("main")
const PixelElement = $("<div class='large'></div>");
const DefaultColor = "whitesmoke"

let appState = {
  color: "black",
  pixelMouseDown: false,
  inEraseMode: false,
  canvasSize: CANVAS_SIZES.LARGE,
  canvas: [],
  grid_clicked: true,
}

function pixelMouseDown(e) {
  setSingleState("pixelMouseDown", true)
}

function pixelMouseUp(e) {
  setSingleState("pixelMouseDown", false)
  let pixel = $(e.target)
  renderPixel(pixel)
}

function pixelMouseOver(e) {
  if (getState("pixelMouseDown")) {
    let pixel = $(e.target)
    renderPixel(pixel)
    let canvas = getState("canvas")
    canvas[pixel.data("index")] = color
    setSingleState("canvas", canvas)
  }
}

function renderPixel (pixel) {
    color = getState("inEraseMode") ? DefaultColor : getState("color")
    pixel.css("background", color)
}



function renderCanvas(size = "large") {
  // size = size || CANVAS_SIZES.LARGE
  Canvas.html("")

  let canvas = getState("canvas")
  setState("canvasSize", size)

  for(let i = 0;i < CANVAS_SIZES[size]; i++){
    canvas[i] = canvas[i] === undefined ? DefaultColor : canvas[i]

    let pixel = PixelElement.clone()
    pixel.addClass(size)
    pixel.data("index", i)
    pixel.css("background",canvas[i]);
    pixel.css("z-index", 1000)
    pixel.mousedown(pixelMouseDown)
    pixel.mouseup(pixelMouseUp)
    pixel.mouseover(pixelMouseOver)
    Canvas.append(pixel)
  }

  let main_width = Canvas.width()
  Canvas.css({
    height:main_width,
  })

  //set the new state for the initial rendering
  setSingleState("canvas", canvas)
}



function setState(newState) {
  return appState = {...appState,...newState}
}
function setSingleState(stateKey, stateVal) {
  return appState[stateKey] = stateVal
}

function getState(key) {
    if (key) {
      if (appState[key]) {
        return appState[key];
      }
      return undefined
    }
    return appState
}

let main_width = Canvas.width()
Canvas.css({
  height:main_width,
})

renderCanvas()


// Adjusting the sheet's height when resized
$(window).resize(function(){
  main_width = $("main").width()
  $("main").css({
    height:main_width,
  })
})

// Getting color
$(".color").change(function(){
  setSingleState("color",$(this).val())
})

$(".size").change(function(){
  setSingleState("canvas", [])
  renderCanvas($(this).val().toLowerCase())
})

$(".reset").click(function(){
  setSingleState("canvas", [])
  renderCanvas(getState("canvasSize"))
})

$(".eraser").click(function() {
  $(this).toggleClass("eraser-clicked")
  setSingleState("inEraseMode", !getState("inEraseMode"))
})

$(".grid").click(function(){
  $(this).toggleClass("grid-clicked");
  $("main div").toggleClass("border_true")
})
