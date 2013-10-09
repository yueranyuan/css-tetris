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

        $(document).keydown(function(event) {
            if (!current) {
                return;
            }

            if (event.which == 38) {
                explore(rotatePiece);
            } else if (event.which == 37) {
                explore(move, vec(-1, 0));
            } else if (event.which == 39) {
                explore(move, vec(1, 0));
            } else if (event.which == 40) {
                gravity(current);
            } else if (event.which == 32) {
                while (!gravity(current)) {}
            }
        });
    }

    spawnPiece = function() {
        current = makePiece(vec(3, 0), 'L');
        checkLine();
    }

    checkLine = function() {
        // find cleared lines
        var baseLine = 0;
        var lineCnt = 0;
        $.each(board, function(y, row) {
            var good = true;
            $.each(row, function(idx, cell) {
                good = good && (cell != null)
            });
            // clear line
            if (good) {
                console.log('clearing');
                $.each(row, function(idx, cell) {
                    cell.remove();
                    row[idx] = null;
                });
                baseLine = Math.max(y, baseLine);
                lineCnt += 1;
            }
        });

        // clear line
        if (lineCnt > 0) {
            for (var y = baseLine - lineCnt; y >= 0; y--) {
                var row = board[y];
                board[y] = board[y + lineCnt];
                board[y + lineCnt] = row;
                $.each(row, function(idx, cell) {
                    if (cell) {
                        move(cell, vec(0, lineCnt));
                    }
                });
            }
        }
    }

    update = function(complete) {
        if (!current) {
            spawnPiece();
        }

        if (gravity(current)) {
            lockPiece(current);
            complete();
        }
        setTimeout(function() {update(complete)}, 500);
    }

    gravity = function(piece) {
        if (!collide(piece, vec(0, 1))) {
            return true;
        }
        move(piece, vec(0, 1));
        return false;
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
    }

    collide = function(piece, dir) {
        var p_pos = vecAdd(getPos(piece), vecMult(dir, SCALE));
        var good = true;
        piece.children().each(function() {
            var cell = $(this);
            var pos = vecMult(vecAdd(getPos(cell), p_pos), 1/SCALE);
            good = good && checkBoard(pos);
        });
        return good;
    }

    checkBoard = function(pos) {
        return !!(board[pos.y] && board[pos.y][pos.x] === null);
    }

    run = function() {
        init();
        y = 0;
        update(spawnPiece);
    }; 

    pxToInt = function(px) {
        return parseInt(px.slice(0, -2));
    }

    intToPx = function(val) {
        return val + 'px';
    }

    explore = function(fn) {
        var explorer = current.clone();
        var args = Array.prototype.slice.call(arguments, 1);
        args.unshift(explorer);
        fn.apply(this, args);
        if (collide(explorer, vec(0, 0))) {
            current.remove();
            current = explorer; 
            WORLD.append(explorer);
        }
    }

    rotatePiece = function(piece, dir) {
        piece.children().each(function() {
            var cell = $(this);
            var pos = getPos(cell);
            if (dir == 1) {
                temp = pos.y;
                pos.y = pxToInt(current.css('width')) - SCALE - pos.x;
                pos.x = temp;
            } else {
                temp = pos.x;
                pos.x = pxToInt(current.css('width')) - SCALE - pos.y;
                pos.y = temp;
            }
            setPos(cell, pos);
        });
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
        div.css({
            width: intToPx(SCALE * cells.length),
            height: intToPx(SCALE * cells.length)});

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
