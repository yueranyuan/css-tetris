define(['pieces'], function(pieceDict) {

    var SCALE = 10;
    var WORLD;
    var ROWS = 10;
    var COLUMNS = 22;

    init = function() {
        WORLD = $('#world');
    }

    run = function() {
        init();
        x = 0;
        for (var letter in pieceDict) {
            makePiece((++x) * 4, 5, letter);
        }
    }; 

    pxToInt = function(px) {
        return parseInt(px.slice(0, -2));
    }

    intToPx = function(val) {
        return val + 'px';
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
    }

    makeCell = function(x, y, color) {
        var div = $('<div>', {class: "cell"});

        div.css('width', intToPx(SCALE)); // make invisible while placing
        div.css('height', intToPx(SCALE)); // make invisible while placing

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
