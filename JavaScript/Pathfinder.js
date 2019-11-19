class Pathfinder {
    constructor() {
        this.start;
        this.end;

        this.openSet = [];
        this.closedSet = [];

        this.step = false;
        this.delay = 50;
    }

    reset() {
        this.openSet = [];
        this.closedSet = [];

        for (var r = 0; r < rows; ++r) {
            for (var c = 0; c < columns; ++c) {
                var vert = vertices[r][c];

                if (vert.state != STATE.WALL) vert.state = STATE.NONE;

                vert.cameFrom = null;
                vert.g = Infinity;
                vert.h = 0;
            }
        }
    }

    actualDistance(from, to) {
        var delta = {
            x: Math.abs(from.x - to.x),
            y: Math.abs(from.y - to.y)
        };

        return Math.sqrt(delta.x * delta.x + delta.y * delta.y);
    }

    heuristicDistance(from, to) {
        return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
    }

    getNodeWithLowestFScore() {
        var min = Infinity;
        var res = null;

        this.openSet.forEach((vertex) => {
            if (vertex.getFScore() < min) {
                min = vertex.getFScore();
                res = vertex;
            }
        });

        console.log(min);

        return res;
    }

    getNeighbours(vertex) {
        var neighbours = [];

        var i = vertices.findIndex(e => e.includes(vertex));
        var j = vertices[i].findIndex(e => e.x === vertex.x && e.y === vertex.y);

        for (var jOffset = -1; jOffset <= 1; jOffset++) {
            var indexJ = j + jOffset;
            if (indexJ < 0 || indexJ >= vertices[0].length) continue;

            for (var iOffset = -1; iOffset <= 1; iOffset++) {
                var indexI = i + iOffset;

                if ((iOffset === 0 && jOffset === 0) ||
                    (indexI < 0 || indexI >= vertices.length) ||
                    vertices[indexI][indexJ].state == STATE.WALL) {
                    continue;
                }

                neighbours.push(vertices[indexI][indexJ]);
            }
        }

        return neighbours;
    }

    async backtrackPath() {
        var current = this.end;

        while (current.cameFrom != null) {
            if (current.state != STATE.END) current.state = STATE.PATH;
            current = current.cameFrom;

            if (this.step) await this.sleep(this.delay);
        }
    }

    pushClosed(vert) {
        if (vert.state != STATE.START && vert.state != STATE.END) vert.state = STATE.CLOSED;
        this.closedSet.push(vert);
    }

    pushOpen(vert) {
        if (vert.state != STATE.END) vert.state = STATE.OPEN;
        this.openSet.push(vert);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async find(start, end) {
        this.start = start;
        this.end = end;

        this.openSet = [];
        this.openSet.push(this.start);

        this.closedSet = [];

        this.start.g = 0;
        this.start.h = this.heuristicDistance(this.start, this.end);

        while (this.openSet.length != 0) {
            //Our current node is the node from the open set with the lowest fscore
            var current = this.getNodeWithLowestFScore();

            //Remove current node from open set
            this.openSet.splice(this.openSet.findIndex(v => {
                return v === current;
            }), 1);

            if (current == this.end) {
                //We are done :)
                this.pushClosed(current);
                this.backtrackPath();
                return;
            }

            var neighbours = this.getNeighbours(current);

            neighbours.forEach((neighbour) => {
                var tentativeG = current.g + this.actualDistance(current, neighbour);

                if (tentativeG < neighbour.g) {
                    neighbour.cameFrom = current;
                    neighbour.g = tentativeG;
                    neighbour.h = this.heuristicDistance(neighbour, this.end);

                    if (!this.openSet.includes(neighbour)) {
                        this.pushOpen(neighbour);
                    }
                }
            });

            this.pushClosed(current);

            if (this.step) await this.sleep(this.delay);
        }
    }   
}