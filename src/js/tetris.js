define(['pieces'], function(pieceDict) {

    var SCALE = 15;
    var WORLD;
    var ROWS = 22;
    var COLUMNS = 10;
    var board = [];
    var current = null;

    init = function() {
        WORLD = $('#world');
        WORLD.css({
            'width': intToPx(COLUMNS * SCALE),
            'height': intToPx(ROWS * SCALE)});
        for (var y = 0; y < ROWS; y++) {
            board[y] = [];
            for (var x = 0; x < COLUMNS; x++) {
                board[y][x] = null;
            }
        }
    }

    update = function() {
        if (!current) {
            current = makePiece(3, 0, 'L');
        }

        move(current, 0, 1);
        if (!collide(0, 1)) {
            lockPiece(current);
        }
    }

    getX = function(thing) {
        return pxToInt(thing.css('left'));
    }

    getY = function(thing) {
        return pxToInt(thing.css('top'));
    }

    move = function(thing, dx, dy) {
        var x = pxToInt(thing.css('left')) + dx * SCALE;
        var y = pxToInt(thing.css('top')) + dy * SCALE;
        thing.css({'left': intToPx(x),
                'top': intToPx(y)});
    }

    collide = function(x, y) {
        var p_x = getX(current) + x * SCALE;
        var p_y = getY(current) + y * SCALE;
        var good = true;
        current.children().each(function() {
            var cell = $(this);
            var x = Math.floor((pxToInt(cell.css('left')) + p_x) / SCALE);
            var y = Math.floor((pxToInt(cell.css('top')) + p_y) / SCALE);
            good = good && checkBoard(x, y);
        });
        return good;
    }

    checkBoard = function(x, y) {
        return !!(board[y] && board[y][x] == null);
    }

    run = function() {
        init();
        y = 0;
        update();
        setInterval(update, 500);
    }; 

    pxToInt = function(px) {
        return parseInt(px.slice(0, -2));
    }

    intToPx = function(val) {
        return val + 'px';
    }

    lockPiece = function(piece) {
        var p_x = pxToInt(piece.css('left'));
        var p_y = pxToInt(piece.css('top'));
        piece.children().each(function() {
            var cell = $(this);
            var x = pxToInt(cell.css('left')) + p_x;
            var y = pxToInt(cell.css('top')) + p_y;
            cell.css({
                'left': x,
                'top': y});
            WORLD.append(cell);

            // write to board
            b_y = Math.floor(y / SCALE);
            b_x = Math.floor(x / SCALE);
            board[b_y][b_x] = cell;
        });
        piece.remove();
    }

    makePiece = function(x, y, letter) {
        var div = $('<div>', {class: "piece"});
        div.css({
            "left": intToPx(x * SCALE),
            "top": intToPx(y * SCALE)});
        
        pieceInfo = pieceDict[letter];
        color  = pieceInfo.color;
        cells = pieceInfo.cells;
        for (var y = 0; y < cells.length; y++) {
            for (var x = 0; x < cells[0].length; x++) {
                if (cells[y][x]) {
                    div.append(makeCell(x, y, color));
                }
            }
        }

        WORLD.append(div);
        return div;
    }

    makeCell = function(x, y, color) {
        var div = $('<div>', {class: "cell"});

        div.css('width', intToPx(SCALE));
        div.css('height', intToPx(SCALE));

        div.css({
            "background-color": color,
            "left": intToPx(x * SCALE),
            "top": intToPx(y * SCALE)});

        return div;
    };

    return {
        run: run,
    }
});
