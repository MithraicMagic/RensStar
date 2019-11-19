class Edge {
    constructor(start, end) {
        this.start = start;
        this.end   = end;
    }

    onRender() {
        ctx.strokeStyle = "orangered";
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
    }

}