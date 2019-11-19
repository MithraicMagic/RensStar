
const STATE = {
    NONE:   0,
    WALL:   1,
    START:  2,
    END:    3,
    CLOSED: 4,
    OPEN:   5,
    PATH:   6
};

class Vertex {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.width  = TILESIZE;
        this.height = TILESIZE; 

        this.g = Infinity;
        this.h = 0;

        this.cameFrom = null;

        this.state = STATE.NONE;
    }

    getFScore() {
        return this.g + this.h;
    }

    onRender() {
        ctx.lineWidth = 2;

        switch (this.state) {
            case STATE.WALL:
                ctx.fillStyle = "#000";
                break;
            case STATE.START:
                ctx.fillStyle = "#669DB3FF";
                break;
            case STATE.END:
                ctx.fillStyle = "#FF4F58FF";
                break;
            case STATE.CLOSED:
                ctx.fillStyle = "lightgray";
                break;
            case STATE.OPEN:
                ctx.fillStyle = "#A89C9455";
                break;
            case STATE.PATH:
                ctx.fillStyle = "lightgreen"
                break;
            default:
                ctx.strokeStyle = "gray";
                ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        if (this.state != STATE.NONE) ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    overlaps(mouse) {
        return mouse.x >= this.x && mouse.x <= this.x + this.width && mouse.y >= this.y && mouse.y <= this.y + this.height;
    }
}