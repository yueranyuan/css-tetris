define(['tetris-model', 'vec'], function(model, vec) {
    var view;
    var current;
    var board;

    function init() {
        console.log('initializing world');
    }

    function run(arg_view) {
        view = arg_view;
        board = new model.Board(22, 10);
        init();
        view.init(board);
        spawnPiece();
        update(function() {console.log('done')});
    }

    function sim(arg_view, arg_board, piece) {
        view = arg_view;
        board = arg_board;
        init();
        view.init(board);
        current = piece;
        update(function() {console.log('analyze')});
    }

    function rotate() {
        return explore(function(p) {p.Rotate()});
    }

    function left() {
        return move(new vec(-1, 0));
    }

    function down() {
        return move(new vec(0, 1));
    }

    function right() {
        return move(new vec(1, 0));
    }

    function drop() {
        while (move(new vec(0, 1))) {
        }
        lockPiece();
    }

    function move(dir) {
        return explore(function(p) {p.pos.add(dir)});
    }

    function update(complete) {
        if (current.locked) {
            complete();
            return;
        }
        if (!move(new vec(0, 1))) {
            lockPiece();
            complete();
            return;
        }
        view.updateBoard(board);
        view.updatePiece(current);
        setTimeout(function() {update(complete)}, 500);
    }

    function lockPiece() {
        var piece = current;
        if (piece.locked) {
            return;
        }
        var grid = piece.grid;
        var b_grid = board.locked;
        $.each(grid, function(p_y, row) {
            $.each(row, function(p_x, cell) {
                var x = p_x + piece.pos.x;
                var y = p_y + piece.pos.y;
                if (typeof b_grid[y] == 'undefined' || typeof b_grid[y][x] == 'undefined') {
                    return;
                }
                b_grid[y][x] = grid[p_y][p_x] ? piece.canon.color : b_grid[y][x];
            });
        });
        piece.locked = true;
    }

    function spawnPiece() {
        current = new model.Piece(new vec(0,0), 'L');
    }

    function clone(obj) {
        return $.extend(true, {}, obj);
    }

    explore = function(fn) {
        if (current.locked) {
            return false;
        }
        var explorer = new model.Piece(
                current.pos.clone(), current.letter, current.rotation);
        fn(explorer);
        if (collide(explorer)) {
            return false;
        } else {
            current = explorer;
            view.updateBoard(board);
            view.updatePiece(current);
            return true;
        }
    }

    function collide(piece) {
        var good = true;
        var grid = piece.grid;
        var b_grid = board.locked;
        $.each(grid, function(p_y, row) {
            $.each(row, function(p_x, cell) {
                if (!grid[p_y][p_x]) {
                    return;
                }
                var x = p_x + piece.pos.x;
                var y = p_y + piece.pos.y;
                good = good && !!b_grid[y] && (b_grid[y][x] === null);
            });
        });
        return !good;
    }

    function getState() {
        return {
            current: current,
            board: board.locked
        };
    }

    return {
        run: run,
        getState: getState,
        left: left,
        right: right,
        rotate: rotate,
        down: down,
        drop: drop
    };
});
