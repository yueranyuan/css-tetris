define(['vec'], function(vec) {
    var WORLD = $('#world');
    var SCALE = 10;
    var displayBoard;

    function init(board, scale) {
        SCALE = scale || SCALE;
        WORLD.css({width: intToPx(board.columns * SCALE),
                height: intToPx(board.rows * SCALE)});
        generateBoard(board.rows, board.columns);
        updateBoard(board);
        WORLD.css('visibility', 'visible');
    }

    function updatePiece(piece) {
        var grid = piece.grid;
        for (var y = 0; y < grid.length; y++) {
            for (var x = 0; x < grid[0].length; x++) {
                if (grid[y][x]) {
                    var pos = new vec(x, y);
                    pos.add(piece.pos);
                    cellOn(new vec(pos.x, pos.y), piece.canon.color);
                }
            }
        }
    }

    function updateBoard(board) {
        for (var y = 0; y < board.rows; y++) {
            for (var x = 0; x < board.columns; x++) {
                if (board.locked[y][x]) {
                    cellOn(new vec(x, y), board.locked[y][x]);
                } else {
                    cellOff(new vec(x, y));
                }
            }
        }
    }

    function generateBoard(rows, columns) {
        displayBoard = [];
        for (var y = 0; y < rows; y++) {
            displayBoard[y] = [];
            for (var x = 0; x < columns; x++) {
                var div = makeCell(new vec(x, y), 'gray', true);
                displayBoard[y][x] = div;
                WORLD.append(div);
            }
        }
    }

    function cellOn(pos, color) {
        var cell = displayBoard[pos.y][pos.x];
        cell.css({'background-color': color,
            visibility: 'visible'});
    }

    function cellOff(pos, color) {
        var cell = displayBoard[pos.y][pos.x]
        cell.css('visibility', 'hidden');
    }

    function makeCell(pos, color, visible) {
        var div = $('<div>', {class: "cell"});

        div.css('width', intToPx(SCALE));
        div.css('height', intToPx(SCALE));

        div.css("background-color", color);
        setPos(div, pos.mult(SCALE));

        div.css('visibility', visible ? 'visible': 'hidden');

        return div;
    };

    function getPos(thing) {
        return {
            x: pxToInt(thing.css('left')),
            y: pxToInt(thing.css('top'))};
    }

    function setPos(thing, pos) {
        thing.css({'left': intToPx(pos.x),
                'top': intToPx(pos.y)});
    }

    function pxToInt(px) {
        return parseInt(px.slice(0, -2));
    }

    function intToPx(val) {
        return val + 'px';
    }

    return {
        init: init,
        updateBoard: updateBoard,
        updatePiece: updatePiece
    };
});
