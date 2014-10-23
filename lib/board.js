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
