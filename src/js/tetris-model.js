define(['pieces'], function(pieceDict) {

    function Piece(pos, letter, rotation) {
        this.pos = pos;
        this.letter = letter;
        if (letter in pieceDict) {
            this.canon = pieceDict[letter];
        } else {
            console.log('letter ' + letter + ' not found');
        }
        this.grid = [];
        this.Rotate(rotation);
        this.locked = false;
    }

    Piece.prototype.Rotate = function(d_r) {
        if (typeof d_r == 'undefined') {
            d_r = 1;
        }
        this.rotation = this.rotation || 0;
        this.rotation += d_r;
        this.rotation %= 4;
        rotation = this.rotation;

        var cells = this.canon.cells;
        this.grid = $.map(cells, function(row, y) {
            return [$.map(row, function(cell, x) {
                if (rotation == 0) {
                    return cells[y][x];
                } else if (rotation == 1) {
                    return cells[cells.length - 1 - x][y];
                } else if (rotation == 2) {
                    return cells[cells.length - 1 - y][cells.length - 1 - x];
                } else if (rotation == 3) {
                    return cells[x][cells.length - 1 - y];
                }
            })];
        });
    }

    function Board(rows, columns) {
        this.locked = [];
        for (var y = 0; y < rows; y++) {
            this.locked[y] = [];
            for (var x = 0; x < columns; x++) {
                this.locked[y][x] = null;
            }
        }
        this.rows = rows;
        this.columns = columns;
    }

    Board.prototype.Lock = function(pos, color) {
        this.locked[pos.y][pos.x] = color || 'gray';
    }

    return {
        Piece: Piece,
        Board: Board
    };
});
