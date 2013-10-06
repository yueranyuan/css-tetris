define(function() {

    var SCALE = 0;
    var WORLD;

    init = function() {
        WORLD = $('#world');
    }

    run = function() {
        init();
        makeCell(1, 6, 'red');
    };

    parsePx = function(px) {
        return parseInt(px.slice(0, -2));
    }

    makeCell = function(x, y, color) {
        var div = $('<div>', {class: "cell"});

        // place the div in the world so we can access the width
        div.css('visibility', 'hidden'); // make invisible while placing
        WORLD.append(div);

        SCALE = SCALE || parseInt(div.css('width').slice(0, -2));
        world_x = SCALE * x;
        world_y = SCALE * y;

        div.css({
            "background-color": color,
            "left": world_x + 'px',
            "top": world_y + 'px'});

        div.css('visibility', 'visible'); // show after processing is done
        return div;
    };

    return {
        run: run,
    }
});
