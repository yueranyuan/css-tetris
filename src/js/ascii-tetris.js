requirejs.config({
    baseUrl: 'js'
});

require(['tetris-controller', 'ascii-view', 'controls'], 
        function(tetris, view, controls) {
    tetris.run(view);
    controls.init(tetris);
});
