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
            current = makePiece(vec(3, 0), 'L');
        }

        move(current, vec(0, 1));
        if (!collide(vec(0, 1))) {
            lockPiece(current);
        }
    }

    getPos = function(thing) {
        return {
            x: pxToInt(thing.css('left')),
            y: pxToInt(thing.css('top'))};
    }

    setPos = function(thing, pos) {
        thing.css({'left': intToPx(pos.x),
                'top': intToPx(pos.y)});
    }

    vecAdd = function(a, b) {
        a.x += b.x;
        a.y += b.y;
        return a;
    }

    vecMult = function(a, s) {
        a.x *= s;
        a.y *= s;
        return a;
    }

    vec = function(x, y) {
        return {x: x, y: y};
    }

    move = function(thing, dir) {
        pos = vecAdd(getPos(thing), vecMult(dir, SCALE));
        setPos(thing, pos);
        thing.css({'left': intToPx(pos.x),
                'top': intToPx(pos.y)});
    }

    collide = function(dir) {
        var p_pos = vecAdd(getPos(current), vecMult(dir, SCALE));
        var good = true;
        current.children().each(function() {
            var cell = $(this);
            var pos = vecMult(vecAdd(getPos(cell), p_pos), 1/SCALE);
            good = good && checkBoard(pos);
        });
        return good;
    }

    checkBoard = function(pos) {
        return !!(board[pos.y] && board[pos.y][pos.x] == null);
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
        var p_pos = getPos(piece);
        piece.children().each(function() {
            var cell = $(this);
            var pos = vecAdd(getPos(cell), p_pos);
            setPos(cell, pos);
            WORLD.append(cell);

            // write to board
            var b_pos = vecMult(pos, 1 / SCALE);
            board[b_pos.y][b_pos.x] = cell;
        });
        piece.remove();
    }

    makePiece = function(pos, letter) {
        var div = $('<div>', {class: "piece"});
        setPos(div, vecMult(pos, SCALE));
        
        pieceInfo = pieceDict[letter];
        color  = pieceInfo.color;
        cells = pieceInfo.cells;
        for (var y = 0; y < cells.length; y++) {
            for (var x = 0; x < cells[0].length; x++) {
                if (cells[y][x]) {
                    div.append(makeCell(vec(x, y), color));
                }
            }
        }

        WORLD.append(div);
        return div;
    }

    makeCell = function(pos, color) {
        var div = $('<div>', {class: "cell"});

        div.css('width', intToPx(SCALE));
        div.css('height', intToPx(SCALE));

        div.css("background-color", color);
        setPos(div, vecMult(pos, SCALE));

        return div;
    };

    return {
        run: run,
    }
});
