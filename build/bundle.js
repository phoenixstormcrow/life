(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./lib/life');

},{"./lib/life":3}],2:[function(require,module,exports){
(function (global){
/* board.js

   the board on which the game evolves
*/


/* we'll pass ArrayBuffers to and from workers */
function encode() {
/* encode the current board state
   to binary data
    ImageData --> ArrayBuffer
*/

}

function decode(data) {
/* decode binary data to image data
    ArrayBuffer --> ImageData
*/
}

/* end private */

function boardCanvas(canvas) {
    var bc = {
        canvas: canvas,
        width: canvas.width,
        height: canvas.height,

        init: function () {
            this.context = this.canvas.getContext('2d');
            this.imgData = this.context.getImageData(0, 0, this.width, this.height);
        },

        decode: function (data) {
        /* index mapping:
           data     0 1 2  3  4  5
           imgData  3 7 11 15 19 23
        */
            var imgData = this.imgData.data;
            for (var i=0, j=3, l=data.length; i<l; ++i, j+=4) {
                imgData[j] = data[i] * 255;

            }
        },

        clear: function () {
            var data = this.imgData.data;
            for (var i = 0, l = data.length; i < l; ++i) {
                data[i] = 0;
            }
        },

        fill: function () {
        /* just fill the canvas */
            var data = this.imgData.data;
            for (var i = 0, l = data.length; i < l; ++i) {
                if ((i+1) % 4 === 0) { // set alpha every 4th byte
                    data[i] = 255;
                }
            }
        },

        paint: function () {
            this.context.putImageData(this.imgData, 0, 0);
        },
    };

    return bc;
}


/* tests */
function newbc() {
    var bc = boardCanvas(document.querySelector('canvas'));
    bc.init();
    return bc;
}
function testFill() {
    global.bc = global.bc || newbc();
    bc.fill();
    bc.paint();

}
global.testFill = testFill;

function testClear() {
    function isClear(data) {
        for (var i = 0, l = data.length; i < l; ++i) {
            if (data[i] !== 0) return false;
        }
        return true;
    }

    global.bc = global.bc || newbc();
    bc.fill();
    bc.clear();
    bc.paint();
    console.assert(isClear(bc.imgData.data));
}
global.testClear = testClear;


function testPattern() {
    global.bc = global.bc || newbc();
    var data = new Uint8ClampedArray(bc.width*bc.height);
    /* make pattern */
    for (var i = 0, l = data.length; i<l; ++i) {
        if (i%3) data[i] = 255;
    }
    bc.decode(data);
    bc.paint();
}
global.testPattern = testPattern;

function test() {
 testFill();
 testClear();
 testPattern();
}
global.test = test;
/* end tests */

global.encode = encode;
global.decode = decode;
global.bCanvas = boardCanvas;
module.exports = {};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
/* life.js */

var board = require('./board');

},{"./board":2}]},{},[1]);
