xunit = 0
yunit = 0
CLICK_START_MOUSE_POS = [0, 0]
CMOUSE_POS = [0, 0]
DELTA = [0, 0]
DELTA_UPDATED = false
MOUSE_IS_DOWN = false

function init() { 
    const body = document.getElementsByTagName('body')[0]
    const screen = document.createElement('canvas')
    body.prepend(screen)
    const ctx = screen.getContext("2d")
    screen.width = window.screen.width*0.9
    screen.height = window.screen.height*0.75

    xunit = screen.width * (1/100)
    yunit = screen.height * (1/100)

    nodes = [
        new DrawNode(10, 10, 10, 10)
    ]

    update(ctx, nodes, screen)
}

function update(ctx, nodes, screen) {
    ctx.clearRect(0, 0, screen.width, screen.height)
    nodes.forEach(node => { 
        if (!DELTA_UPDATED) {
            node.update_position(DELTA)
        }
        node.draw(ctx) 
    })
    DELTA_UPDATED = true
    CLICK_START_MOUSE_POS = CMOUSE_POS
    drawBorder(ctx)
    requestAnimationFrame(() => {
        update(ctx, nodes, screen)
    })
}

function drawBorder(ctx) {
    ctx.strokeStyle = 'darkslategray';
    ctx.beginPath() ;
    ctx.roundRect(0*xunit, 0*yunit, 100*xunit, 100*yunit, 10)
    ctx.lineWidth = 4
    ctx.stroke()
}

function drawNode(ctx, x, y, w, h) {
    ctx.strokeStyle = 'darkslategray';
    ctx.beginPath() ;
    ctx.roundRect(x*xunit, y*yunit, w*xunit, h*yunit, 10)
    ctx.lineWidth = 4
    ctx.stroke()
    ctx.fillStyle = 'grey'
    ctx.fill()
}

class DrawNode {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    draw(ctx) {
        drawNode(ctx, this.x, this.y, this.w, this.h)
    }

    update_position(delta) {
        console.log(delta)
        this.x -= delta[0]/xunit
        this.y -= delta[1]/yunit
    }
}

init()


window.addEventListener("mousedown", e => {
    document.documentElement.style.cursor = "grabbing"

    CLICK_START_MOUSE_POS = [e.clientX, e.clientY]
    CMOUSE_POS = [e.clientX, e.clientY]
    MOUSE_IS_DOWN = true
    
})

window.addEventListener("mouseup", _ => {
    document.documentElement.style.cursor = "default"

    MOUSE_IS_DOWN = false
})

window.addEventListener("mousemove", e => {
    if (MOUSE_IS_DOWN) {
        CMOUSE_POS = [e.clientX, e.clientY]
        DELTA = [CLICK_START_MOUSE_POS[0] - e.clientX, CLICK_START_MOUSE_POS[1] - e.clientY]
        DELTA_UPDATED = false
    } 
})