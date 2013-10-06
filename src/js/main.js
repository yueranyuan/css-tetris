requirejs.config({
    baseUrl: 'js'
});

require(['tetris'], function(tetris) {
    tetris.run();
});
