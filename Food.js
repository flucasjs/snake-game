import Block from './Block.js';

class Food extends Block {

    constructor(blockDimension = 1) {

        super(blockDimension);

        this.block = new Block(blockDimension);

    }

    // --------------- Food Methods --------------- //

    randomizePosition(maxHorizontalPosition = 1, maxVerticalPosition = 1, borderOffset = 0) {

        // Returns an arbitrary number between min (inclusive) and max (exclusive).
        function getRandomArbitraryNumber(min, max) {

            return Math.random() * (max - min) + min;

        }

        this.block.x = Math.floor(getRandomArbitraryNumber(borderOffset, maxVerticalPosition - borderOffset));
        this.block.y = Math.floor(getRandomArbitraryNumber(borderOffset, maxHorizontalPosition - borderOffset));

    }

    drawFood(context) {

        this.block.drawBlock(context, "yellow", "orange");

    }

    // ----------- Food Getters/Setters ----------- //

    set block(blockObj) {

        this._block = blockObj;

    }

    set x(value) {

        this._x = value;

        this._block = new Block(this.blockDimension, this._y, this._x);

    }

    set y(value) {

        this._y = value;

        this._block = new Block(this.blockDimension, this._y, this._x);

    }

    get block() {

        return this._block;

    }

    get x() {

        return this._block.x;

    }

    get y() {

        return this._block.y;

    }

}

export default Food;