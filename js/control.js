control = {

    tiles: null,
    tilesCTX: null,
    sourceMap: null,
    sourceMapCTX: null,

    map: [
        "11111111777777677787777711111111",
        "11111777777237237777777777711111",
        "11177777177111147777787777777111",
        "11777771117514777237777787777711",
        "11770711117217777547777777777711",
        "17777777717547777772377777877771",
        "17777777167112377775472377777771",
        "17777771237775137777724537777781",
        "77777717511378513777753247777777",
        "76237177711477711777775472377777",
        "77111877754777754776777775478211",
        "37547177777777777177777237777511",
        "477777177777237721377775477776..",
        "7777777777785137514777771777213.",
        "8723772377238548247777772377514.",
        "11111111111477721372377214238...",
        "5487547754777775147547714854...2",
        "777777777777777777777214777...21",
        "77777677777766666677754777...211",
        "7777777767777777776761777...24.5",
        "776777777777777777677177...24..8",
        "777776777777711111117187..24....",
        "77777777111111111116117..2477777",
        "87777777718177777777817.21..23..",
        "11111111777771777777717.548.54.1",
        "17787771111111777777717...23...1",
        "17777777111111877771177...54...1",
        "11777717718177777717777.......11",
        "11877717777771777177777.......11",
        "11177717111111111777723.23...111",
        "11111777718177777777754.54.11111",
        "11111111777771177777723811111111"
    ],

    init: function() {

        control.tiles = document.getElementById("canvasTiles");
        control.tilesCTX = control.tiles.getContext("2d");
        control.sourceMap = document.getElementById("canvasSourceMap");
        control.sourceMapCTX = control.sourceMap.getContext("2d");

        $('#tiles').bind("load", function() {
            control.tilesCTX.drawImage(document.getElementById("tiles"), 0, 0);
            control.plotMap();
        }).attr('src', 'img/tiles.gif');
    },

    plotMap: function() {

        var offset = 0;
        var tile = '.';

        for (var y = 0; y < 32; y++) {
            for (var x = 0; x < 32; x++) {
                tile = control.map[y].charAt(x);
                if (tile == '.') {
                    control.sourceMapCTX.beginPath();
                    control.sourceMapCTX.rect(x*64, y*64, 64, 64);
                    control.sourceMapCTX.fill();
                } else {
                    offset = parseInt(control.map[y].charAt(x), 10)*65;
                    control.sourceMapCTX.drawImage(control.tiles, offset, 0, 64, 64, x*64, y*64, 64, 64);
                }
            }
        }

    }
};


utils = {

    log: function(msg) {

        try {
            console.log(msg);
        } catch(er) {
            // IGNORE
        }
    }

};