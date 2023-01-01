xunit = 0
yunit = 0

function init() { 
    const body = document.getElementsByTagName('body')[0]
    const screen = document.createElement('canvas')
    body.prepend(screen)
    const ctx = screen.getContext("2d")
    screen.width = window.screen.width*0.9
    screen.height = window.screen.height*0.75

    xunit = screen.width * (1/100)
    yunit = screen.height * (1/100)

    drawNode(ctx, 10, 10, 10, 10)
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

init()