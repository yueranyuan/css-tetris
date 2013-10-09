define(function() {
    function init(controller) {
        $(document).keydown(function(event) {
            if (event.which == 38) {
                controller.rotate();
            } else if (event.which == 37) {
                controller.left();
            } else if (event.which == 39) {
                controller.right();
            } else if (event.which == 40) {
                controller.down();
            } else if (event.which == 32) {
                controller.drop();
            }
        });
    }
    return {
        init: init
    };
});
