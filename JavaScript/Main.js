var canvas = document.getElementById("cvs");

/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext('2d');

var input = new Input();

document.getElementById("trage-rens-knop").addEventListener("mousedown", gaatRensRennenOfNiet);
document.getElementById("clear").addEventListener("mousedown", clearScreen);
document.getElementById("rens-snelheid").addEventListener('input', veranderRensZijnSnelheid);

//Mouse handling
window.addEventListener('mousedown', (e) => {
    input.onMouseDown(e);
});
window.addEventListener('mouseup', (e) => {
    input.onMouseUp(e);
});
window.addEventListener('mousemove', (e) => {
    input.onMouseMove(e)
});

canvas.addEventListener('contextmenu', event => event.preventDefault())

const TILESIZE = 32;
const UPS = 60;

var vertices = [];
var rows = Math.floor(canvas.clientWidth / TILESIZE);
var columns = Math.floor(canvas.clientHeight / TILESIZE);

var rens = new Pathfinder();
load();

var MODES = {
    selectingStart: 1,
    selectingEnd: 2,
    walling: 3
}

var mode = MODES.selectingStart;
var startV = null;

function draw() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    vertices.forEach((vertexRow) => vertexRow.forEach((vertex) => vertex.onRender()));

    window.requestAnimationFrame(draw);
}

function onUpdate() {
    if (!input.isClicked(MOUSE_BUTTONS.LEFT) && 
        !input.isClicked(MOUSE_BUTTONS.RIGHT) &&
        !input.isHeld(MOUSE_BUTTONS.RIGHT)) return;

    for (var row = 0; row < rows; row++) {
        for (var column = 0; column < columns; column++) {
            var vert = vertices[row][column];

            if (input.isClicked(MOUSE_BUTTONS.LEFT)) {
                if (vert.overlaps(input.mousePos)) {
                    switch (mode) {
                        case MODES.selectingStart:
                            rens.reset();
                            vert.state = STATE.START;
                            mode = MODES.selectingEnd;
                            startV = vert;
                            break;
                        case MODES.selectingEnd:
                            vert.state = STATE.END;
                            rens.find(startV, vert);
                            mode = MODES.selectingStart;
                    }

                    input.clickHandled(MOUSE_BUTTONS.LEFT);
                    break;
                }
            } else if (input.isClicked(MOUSE_BUTTONS.RIGHT)) {
                if (vert.overlaps(input.mousePos)) {
                    if (vert.state == STATE.WALL) {
                        vert.state = STATE.NONE;
                    } else {
                        vert.state = STATE.WALL;
                    }
                    input.clickHandled(MOUSE_BUTTONS.RIGHT);
                }
            } else if (input.isHeld(MOUSE_BUTTONS.RIGHT)) {
                if (vert.overlaps(input.mousePos)) {
                    vert.state = STATE.WALL;
                }
            }
        }
    }

    input.clickHandled(MOUSE_BUTTONS.LEFT);
}

function addVertices() {
    vertices = [];
    for (var r = 0; r < rows; r++) {
        vertices[r] = [];
        for (var c = 0; c < columns; c++) {
            vertices[r][c] = new Vertex(r * TILESIZE, c * TILESIZE);
        }
    }
}

function gaatRensRennenOfNiet() {
    rens.step ^= true;
    this.classList.toggle("active");
}

function clearScreen() {
    for (var r = 0; r < rows; ++r) {
        for (var c = 0; c < columns; ++c) {
            var vert = vertices[r][c];

            vert.state = STATE.NONE;

            vert.cameFrom = null;
            vert.g = Infinity;
            vert.h = 0;
        }
    }

    rens.openSet = [];
    rens.closedSet = [];
}

function veranderRensZijnSnelheid() {
    rens.delay = document.getElementById("rens-snelheid").value;
    document.getElementById("range-text").innerText = rens.delay;
}

function save() {
    localStorage.setItem("vertices", JSON.stringify(vertices));
}

function load() {
    var data = localStorage.getItem("vertices");

    if (data == null) {
        addVertices();
    }
    else {
        var json = JSON.parse(data);

        vertices = [];
        for (var r = 0; r < rows; r++) {
            vertices[r] = [];
            for (var c = 0; c < columns; c++) {
                vertices[r][c] = new Vertex(r * TILESIZE, c * TILESIZE);
                vertices[r][c].state = json[r][c].state;
            }
        }

        rens.reset();
    }
}

setInterval(onUpdate, UPS / 1000);
window.requestAnimationFrame(draw);