(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./lib/life');

},{"./lib/life":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
/* life.js */

var board = require('./board');

},{"./board":2}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYWluLmpzIiwibGliL2JvYXJkLmpzIiwibGliL2xpZmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi9saWIvbGlmZScpO1xuIiwiLyogYm9hcmQuanNcblxuICAgdGhlIGJvYXJkIG9uIHdoaWNoIHRoZSBnYW1lIGV2b2x2ZXNcblxuICAgVGhlIGJvYXJkIGxpdmVzIGluIGEgV29ya2VyIHRocmVhZC4gSXQgcmVjaWV2ZXMgbWVzc2FnZXNcbiAgIGZyb20gdGhlIG1haW4gdGhyZWFkLCB0aGUgcGF5bG9hZCBiZWluZyBhbiBBcnJheUJ1ZmZlclxuICAgY29udGFpbmluZyBwaXhlbCBkYXRhIGZyb20gdGhlIGNhbnZhcyAodGhlIHN0YXRlIGNhblxuICAgYmUgc2V0IGJ5IHRoZSB1c2VyIGJ5IGNsaWNraW5nIGNlbGxzIHRvIHRvZ2dsZSB0aGVtLFxuICAgc28gd2UgbmVlZCB0byByZWNpZXZlIHRoYXQgZGF0YSBoZXJlKS5cblxuICAgVGhlIG1haW4gdGhyZWFkJ3MgdmlldyBvZiB0aGlzIGJ1ZmZlciBpcyBhIFVpbnQ4Q2xhbXBlZEFycmF5LlxuICAgVGhlIGJvYXJkJ3MgdmlldyBvZiB0aGF0IHNhbWUgYnVmZmVyIGlzIGEgVWludDMyQXJyYXksIGJlY2F1c2VcbiAgIGVhY2ggY2VsbCBjb3JyZXNwb25kcyB0byBvbmUgcGl4ZWwsIGFuZCBhIHBpeGVsIGNvcnJlc3BvbmRzIHRvXG4gICA0IGJ5dGVzIG9mIHRoZSBidWZmZXIgKHBpeGVsID09IFVpbnQ4Q2xhbXBlZEFycmF5KFtyLCBnLCBiLCBhXSkpLlxuXG4gICBUaGUgcHJvYmxlbSBpcyB0byB0b2dnbGUgYSBzaW5nbGUgY2VsbCBpbiBib2FyZC5zdGF0ZSwgaW4gc3VjaCBhIHdheVxuICAgdGhhdCBzZXR0aW5nIGEgY2VsbCB0byAnbGl2ZScgbWVhbnMgdGhhdCB0aGUgbWFpbiB0aHJlYWQncyB2aWV3IG9mXG4gICB0aGUgNCBieXRlcyBhdCB0aGUgYnVmZmVyIG9mZnNldCBjb3JyZXNwb25kaW5nIHRvIHRoYXQgY2VsbCBsb29rcyBsaWtlXG4gICBwaXhlbCA9IFVpbnQ4Q2xhbXBlZEFycmF5KFswLCAwLCAwLCAyNTVdKS5cblxuXG4qL1xuXG5mdW5jdGlvbiBib2FyZCh3LCBoKSB7XG4gICAgdmFyIGIgPSB7XG4gICAgICAgIHdpZHRoOiB3LFxuICAgICAgICBoZWlnaHQ6IGgsXG4gICAgICAgIHN0YXRlOiBuZXcgVWludDMyQXJyYXkodypoKSxcbiAgICB9XG5cbiAgICBiLmZyb21CdWZmZXIgPSBmdW5jdGlvbiAoYnVmZmVyKSB7XG4gICAgLyogY3JlYXRlIHZpZXcgb24gYnVmZmVyLCBzdG9yZSAqL1xuICAgICAgICB0aGlzLnN0YXRlID0gbmV3IFVpbnQzMkFycmF5KGJ1ZmZlcik7XG4gICAgfTtcblxuICAgIGIudG9CdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLmJ1ZmZlcjtcbiAgICB9O1xuXG4gICAgYi5jZWxsT2Zmc2V0ID0gZnVuY3Rpb24gKHJvdywgY29sKSB7XG4gICAgICAgIC8vIGVpdGhlciBib3VuZHMgY2hlY2sgcm93IGFuZCBjb2xcbiAgICAgICAgLy8gb3IgdXNlIG1vZHVsb1xuICAgICAgICByb3cgJT0gdGhpcy5oZWlnaHQ7XG4gICAgICAgIGNvbCAlPSB0aGlzLndpZHRoO1xuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAqIHJvdyArIGNvbDtcbiAgICB9O1xuXG4gICAgYi5nZXRDZWxsID0gZnVuY3Rpb24gKHJvdywgY29sKSB7XG4gICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLmNlbGxPZmZzZXQocm93LCBjb2wpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLnN1YmFycmF5KG9mZnNldCwgb2Zmc2V0KzEpO1xuICAgIH07XG5cbiAgICBiLnNldENlbGwgPSBmdW5jdGlvbiAocm93LCBjb2wsIFNUQVRFKSB7XG5cbiAgICAgICAgdGhpcy5zdGF0ZS5zZXQoU1RBVEUsIHRoaXMuY2VsbE9mZnNldChyb3csIGNvbCkpO1xuICAgIH07XG5cbiAgICByZXR1cm4gYjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYm9hcmQ7XG4iLCIvKiBsaWZlLmpzICovXG5cbnZhciBib2FyZCA9IHJlcXVpcmUoJy4vYm9hcmQnKTtcbiJdfQ==
