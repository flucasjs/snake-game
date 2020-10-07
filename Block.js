class Block {

    constructor(blockDimension = 1, x = 0, y = 0) {

        this.blockDimension = blockDimension;

        this.x = x;
        this.y = y;

    }

    // --------------- Block Methods --------------- //

    drawBlock(context, fill, stroke) {

        context.fillStyle = fill;
        context.fillRect(this._x * this.blockDimension, this._y * this.blockDimension, this.blockDimension, this.blockDimension);

        context.strokeStyle = stroke;
        context.strokeRect(this._x * this.blockDimension, this._y * this.blockDimension, this.blockDimension, this.blockDimension);

    }

    // ----------- Block Getters/Setters ----------- //

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    set x(value) {
        this._x = value;
    }

    set y(value) {
        this._y = value;
    }

}

export default Block;