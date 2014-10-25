/* board.js

   the board on which the game evolves

   The board lives in a Worker thread. It recieves messages
   from the main thread, the payload being an ArrayBuffer
   containing pixel data from the canvas (the state can
   be set by the user by clicking cells to toggle them,
   so we need to recieve that data here).

   The main thread's view of this buffer is a Uint8ClampedArray.
   The board's view of that same buffer is a Uint32Array, because
   each cell corresponds to one pixel, and a pixel corresponds to
   4 bytes of the buffer (pixel == Uint8ClampedArray([r, g, b, a])).

   The problem is to toggle a single cell in board.state, in such a way
   that setting a cell to 'live' means that the main thread's view of
   the 4 bytes at the buffer offset corresponding to that cell looks like
   pixel = Uint8ClampedArray([0, 0, 0, 255]).


*/

function board(w, h) {
    var b = {
        width: w,
        height: h,
        state: new Uint32Array(w*h),
    }

    b.fromBuffer = function (buffer) {
    /* create view on buffer, store */
        this.state = new Uint32Array(buffer);
    };

    b.toBuffer = function () {
        return this.state.buffer;
    };

    b.cellOffset = function (row, col) {
        // either bounds check row and col
        // or use modulo
        row %= this.height;
        col %= this.width;
        return this.width * row + col;
    };

    b.getCell = function (row, col) {
        var offset = this.cellOffset(row, col);

        return this.state.subarray(offset, offset+1);
    };

    b.setCell = function (row, col, STATE) {

        this.state.set(STATE, this.cellOffset(row, col));
    };

    return b;
};

module.exports = board;
