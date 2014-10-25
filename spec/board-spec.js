var boardFactory = require('../lib/board'),
    W = 2,
    H = 1,
    ON = new Uint32Array([0xff000000]),
    OFF = new Uint32Array([0x0]),
    board = boardFactory(W, H);

describe('width', function () {
    it('should be ' + W, function () {
        expect(board.width).toBe(W);
    });
});

describe('height', function () {
    it('should be ' + H, function () {
        expect(board.height).toBe(H);
    });
});

describe('state', function () {
    it('should be defined', function () {
        expect(board.state).toBeDefined();
    });

    it('should have length equal to width * height', function () {
        expect(board.state.length).toEqual(board.width * board.height);
    });

    it('should use 4 bytes per element', function () {
        expect(board.state.BYTES_PER_ELEMENT).toEqual(4);
    });

    it('should be 4*w*h bytes long', function () {
        expect(board.state.byteLength).toEqual(4*board.width*board.height);
    });


});

describe('board.state.fromBuffer', function () {
    var pixelData = new Uint8ClampedArray(W*H*4);
    pixelData.set([0, 0, 0, 255, 0, 0, 0, 0]);
    board.fromBuffer(pixelData.buffer);

    it('should work', function () {
        expect(board.state[0]).toEqual(ON[0]);
        expect(board.state[1]).toEqual(OFF[0]);
    });
});

var pixelData = new Uint8ClampedArray(W*H*4);
pixelData.set([0, 0, 0, 255, 0, 0, 0, 0]);
board.fromBuffer(pixelData.buffer);

describe('board.state.toBuffer', function () {

    it('should work', function () {
        expect(board.toBuffer()).toBe(pixelData.buffer);
    });
});

describe('getCell', function () {
    it('should get '+ ON, function () {
        expect(board.getCell(0, 0)).toEqual(ON);
    });
    it('should get ' + OFF, function () {
        expect(board.getCell(0, 1)).toEqual(OFF);
    });
});

describe('setCell', function () {
    it('should be ' + OFF, function () {
        board.setCell(0, 0, OFF);
        expect(board.getCell(0, 0)).toEqual(OFF);
    });

    it('should be ' + ON, function () {
        board.setCell(0, 0, ON);
        expect(board.getCell(0, 0)).toEqual(ON);
    });
});
