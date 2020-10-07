import Block from './Block.js';

class Snake extends Block {

    constructor(blockDimensions = 1, initialLength = 4, initialDirection = "ArrowRight") {

        super(blockDimensions);
        this.blockDimensions = blockDimensions;
        this.direction = initialDirection;
        this.inputLocked = 0;
        this.blocks = [];
        for (let i = initialLength - 1; i >= 0; i--) {

            this.blocks.push(new Block(this.blockDimension, i, 0));

        }

    }

    // --------------- Snake Methods --------------- //

    pop() {

        this.blocks.pop();

    }

    unshift(value) {

        this.blocks.unshift(value);

    }

    drawSnake(context) {

        for (let i = this.length - 1; i >= 0; i--) {

            this.blocks[i].drawBlock(context, "white", "aqua");

        }

    }

    boundsCollision(totalHorizontalBlocks, totalVerticalBlocks) {

        return (this.head.x < 0 || this.head.y < 0 || this.head.x >= totalHorizontalBlocks || this.head.y >= totalVerticalBlocks);

    }

    selfCollision() {

        for (let i = 1; i < this.blocks.length; i++) {

            if ((this.head.x == this.blocks[i].x) && (this.head.y == this.blocks[i].y)) {
                
                return true;

            };

        }

    }

    headCollision(totalHorizontalBlocks, totalVerticalBlocks) {

        return (this.selfCollision() || this.boundsCollision(totalHorizontalBlocks, totalVerticalBlocks));

    }


    // ----------- Snake Getters/Setters ----------- //

    set direction(code) {

            if ((code == "ArrowUp" || code == "KeyW") && (this._direction != "down")) {

                this._direction = "up";

            } else if ((code == "ArrowDown" || code == "KeyS") && (this._direction != "up")) {

                this._direction = "down";

            } else if ((code == "ArrowLeft" || code == "KeyA") && (this._direction != "right")) {

                this._direction = "left";

            } else if ((code == "ArrowRight" || code == "KeyD") && (this._direction != "left")) {

                this._direction = "right";

            }

            this.inputLocked = 1;

    }

    set length(value) {

        throw new Error("length property is read only.");

    }

    set head(blockObj) {

        this._blocks.unshift(blockObj);

    }

    set nextHead(value) {

        throw new Error('nextHead property is read only');

    }

    set blocks(blockArray) {

        this._blocks = blockArray;

    }

    get direction() {

        return this._direction;

    }

    get length() {

        return this._blocks.length;

    }

    get head() {

        return this._blocks[0];

    }

    get nextHead() {

        this._nextHead = new Block(this.blockDimensions, this.head.x, this.head.y);

            if (this.direction == "up") {

                this._nextHead.y--;

            } else if (this.direction == "down") {

                this._nextHead.y++;

            } else if (this.direction == "left") {

                this._nextHead.x--;

            } else if (this.direction == "right") {

                this._nextHead.x++;

            }

        return this._nextHead;

    }

    get blocks() {

        return this._blocks;

    }

}

export default Snake;