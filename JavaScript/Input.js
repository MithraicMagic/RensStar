var MOUSE_BUTTONS = {
    LEFT:       0,
    MIDDLE:     1,
    RIGHT:      2,
    FORWARD:    3,
    BACKWARD:   4
};

var MOUSE_STATE = {
    UP:         0,
    DOWN:       1,
    HELD:       2,
    CLICKED:    3
};

const MOUSE_HELD_DELAY = 125;

class Input {
    constructor() {
        this.keyStates   = new Map();
        this.mouseStates = [];

        this.mousePos = {
            x: 0,
            y: 0
        };
    }

    onMouseMove(m) {
        this.mousePos.x = m.clientX - canvas.offsetLeft;
        this.mousePos.y = m.clientY - canvas.offsetTop;
    }

    isClicked(button) {
        return this.mouseStates[button] == MOUSE_STATE.CLICKED;
    }

    isHeld(button) {
        return this.mouseStates[button] == MOUSE_STATE.HELD;
    }

    clickHandled(button) {
        this.mouseStates[button] = MOUSE_STATE.UP;
        save();
    }

    onMouseDown(e) {
        this.mouseStates[e.button] = MOUSE_STATE.DOWN;

        setTimeout(() => {
            if (this.mouseStates[e.button] == MOUSE_STATE.DOWN) {
                this.mouseStates[e.button] = MOUSE_STATE.HELD;
            }
        }, MOUSE_HELD_DELAY);
    }

    onMouseUp(e) {
        console.log(this.mouseStates[e.button]);
        var state = this.mouseStates[e.button]
        this.mouseStates[e.button] = state == MOUSE_STATE.HELD ? MOUSE_STATE.UP : MOUSE_STATE.CLICKED;
    }

    onKeyDown(e) {
        
    }

    onKeyUp(e) {

    }
}