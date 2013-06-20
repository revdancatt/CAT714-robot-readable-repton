control = {

    tiles: null,
    tilesCTX: null,
    sourceMap: null,
    sourceMapCTX: null,
    player: {
        position: {
            x: 4,
            y: 4
        },
        target: {
            x: 4,
            y: 4
        },
        isMoving: false,
        startMoveTime: null,
        direction: 0,
        lastDirection: 0
    },
    moveDuration: 200, // The number of milliseconds it takes to make a move.
    direction: {
        none: 0,
        up: 1,
        down: 2,
        left: 3,
        right: 4
    },
    viewportSize: {
        x: 10,
        y: 10
    },

    map: [
        "11111111777777777787777711111111",
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
        control.targetMap = document.getElementById("canvasTargetMap");
        control.targetMapCTX = control.targetMap.getContext("2d");
        control.blankMap = document.getElementById("canvasBlankMap");
        control.blankMapCTX = control.blankMap.getContext("2d");

        $('#tiles').bind("load", function() {
            control.tilesCTX.drawImage(document.getElementById("tiles"), 0, 0);
            control.plotMap();
            control.plotBlankMap();
            control.drawStaticFrame();
            setInterval(function() {
                control.tick();
            }, 16);
        }).attr('src', 'img/tiles.gif');

        //  Bind the keys
        $(document).bind('keydown', function(e) {

            //  Se which key is down and set the direction.
            //  NOTE: yes we could be clever and assign the keycode values to the
            //  control.direction values and so on. But this makes the code at least
            //  understandable when you first come here, optimise at leasure.
            if (e.keyCode == 39 || e.keyCode == 68) {                                               //  cursor right || D
                control.player.direction = control.direction.right;
                control.player.lastDirection = control.direction.right;
            }
            if (e.keyCode == 37 || e.keyCode == 65) {                                               //  cursor right || A
                control.player.direction = control.direction.left;
                control.player.lastDirection = control.direction.left;
            }
            if (e.keyCode == 38 || e.keyCode == 87) {                                               //  cursor right || W
                control.player.direction = control.direction.up;
                control.player.lastDirection = control.direction.up;
            }
            if (e.keyCode == 40 || e.keyCode == 83) {                                               //  cursor right || S
                control.player.direction = control.direction.down;
                control.player.lastDirection = control.direction.down;
            }
        });

        $(document).bind('keyup', function(e) {

            //  if we lift a key up, and it was the last direction moving
            //  then we set the player to not be moving
            if (e.keyCode == 39 || e.keyCode == 68) {                                               //  cursor right || D
                if (control.player.lastDirection == control.direction.right) {
                    control.player.direction = control.direction.none;
                }
            }
            if (e.keyCode == 37 || e.keyCode == 65) {                                               //  cursor right || A
                if (control.player.lastDirection == control.direction.left) {
                    control.player.direction = control.direction.none;
                }
            }
            if (e.keyCode == 38 || e.keyCode == 87) {                                               //  cursor right || W
                if (control.player.lastDirection == control.direction.up) {
                    control.player.direction = control.direction.none;
                }
            }
            if (e.keyCode == 40 || e.keyCode == 83) {                                               //  cursor right || S
                if (control.player.lastDirection == control.direction.down) {
                    control.player.direction = control.direction.none;
                }
            }

        });


    },

    plotBlankMap: function() {

        for (var y = 0; y < (this.viewportSize.x+1)*64; y++) {
            for (var x = 0; x < (this.viewportSize.y+1)*64; x++) {
                offset = 1*65;
                control.blankMapCTX.drawImage(control.tiles, offset, 0, 64, 64, x*64, y*64, 64, 64);
            }
        }

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

    },

    //  This will draw the initial frame
    drawStaticFrame: function() {

        var left = (this.player.position.x-((this.viewportSize.x-1)/2)) * 64;
        var top = (this.player.position.y-((this.viewportSize.y-1)/2)) * 64;
        var width = left + (this.viewportSize.x * 64);
        var height = top + (this.viewportSize.y * 64);
        var offsetX = 0;
        var offsetY = 0;

        //  Check to see if we are off the left or top of the map
        if (left < 0) {
            offsetX = left*-1;
            left = 0;
        }
        if (top < 0) {
            offsetY = top*-1;
            top = 0;
        }

        //  Check to see if we are going off the map to the
        //  right or bottom.
        if (left+width > 2048) {
            width += 2048 - (left+width);
        }
        if (top+height > 2048) {
            height += 2048 - (top+height);
        }

        //  NOTE: in the above two cases we need to fill in the extra
        //  with solid wall.

        //  draw the frame
        control.targetMapCTX.drawImage(control.blankMap, 32, 32, this.viewportSize.x*64, this.viewportSize.y*64, 0, 0, this.viewportSize.x*64, this.viewportSize.y*64);
        control.targetMapCTX.drawImage(control.sourceMap, left, top, width, height, offsetX, offsetY, width, height);

        //  draw the player tile
        control.drawPlayerTile();

    },

    //  This draws the frame when the player is moving.
    drawMovingFrame: function() {

        //  find out how many miliseconds have passed since we started
        //  the move, and then what percentage we are through the
        //  whole allowed move duration. So if the duration is 
        //  2,000ms, and 1,000ms have passed we are 50% of the
        //  way from the current position to the target.
        var endMoveTime = new Date();
        var timeDelta = endMoveTime - this.player.startMoveTime;
        var timeDeltaPercent = timeDelta / this.moveDuration;

        //  if the percent is >= 1 then we have finished our move
        if (timeDeltaPercent >= 1) {
            //  update the source map


            //  set the position
            this.player.position.x = this.player.target.x;
            this.player.position.y = this.player.target.y;
            this.player.isMoving = false;
            this.drawStaticFrame();
            return;
        }

        //  otherwise we work out the new positions
        var left = ((this.player.position.x-((this.viewportSize.x-1)/2)) * 64) + (((this.player.target.x - this.player.position.x) * timeDeltaPercent) * 64);
        var top = ((this.player.position.y-((this.viewportSize.x-1)/2)) * 64) + (((this.player.target.y - this.player.position.y) * timeDeltaPercent) * 64);
        var width = left + (this.viewportSize.x * 64);
        var height = top + (this.viewportSize.y * 64);
        var offsetX = 0;
        var offsetY = 0;

        //  Check to see if we are off the left or top of the map
        if (left < 0) {
            offsetX = left*-1;
            left = 0;
        }
        if (top < 0) {
            offsetY = top*-1;
            top = 0;
        }

        //  Check to see if we are going off the map to the
        //  right or bottom.
        if (left+width > 2048) {
            width += 2048 - (left+width);
        }
        if (top+height > 2048) {
            height += 2048 - (top+height);
        }

        //  NOTE: in the above two cases we need to fill in the extra
        //  with solid wall.

        //  draw the frame
        var backOffsetX = (((this.player.target.x - this.player.position.x) * timeDeltaPercent) * 64);
        var backOffsetY = (((this.player.target.y - this.player.position.y) * timeDeltaPercent) * 64);
        if (backOffsetX < 0) backOffsetX+=64;
        if (backOffsetY < 0) backOffsetY+=64;
        backOffsetX += 32;
        backOffsetY += 32;
        if (backOffsetX > 64) backOffsetX -= 64;
        if (backOffsetY > 64) backOffsetY -= 64;

        control.targetMapCTX.drawImage(control.blankMap, backOffsetX, backOffsetY, this.viewportSize.x*64, this.viewportSize.y*64, 0, 0, this.viewportSize.x*64, this.viewportSize.y*64);
        control.targetMapCTX.drawImage(control.sourceMap, left, top, width, height, offsetX, offsetY, width, height);

        //  draw the player tile
        control.drawPlayerTile();

    },

    drawPlayerTile: function() {
        control.targetMapCTX.drawImage(control.tiles, 0, 0, 64, 64, ((this.viewportSize.x-1)/2)*64, ((this.viewportSize.x-1)/2)*64, 64, 64);
    },

    //  we do this each game tick
    tick: function() {

        //  if the player is moving then do the whole animation thing
        if (this.player.isMoving) {
            this.drawMovingFrame();
        } else {

            //  set the player in motion
            if (this.player.direction == this.direction.left) {
                this.movePlayer(-1, 0);
            }
            if (this.player.direction == this.direction.right) {
                this.movePlayer(1, 0);
            }
            if (this.player.direction == this.direction.up) {
                this.movePlayer(0, -1);
            }
            if (this.player.direction == this.direction.down) {
                this.movePlayer(0, 1);
            }

        }
    },

    movePlayer: function(xMod, yMod) {

        var targetX = this.player.position.x + xMod;
        var targetY = this.player.position.y + yMod;

        //  don't let us move off the edge of the map
        if (targetX < 0 || targetX >= this.map[0].length) return;
        if (targetY < 0 || targetY >= this.map.length) return;

        //  check to see if the player can move in this direction
        var targetTile = this.map[targetY].charAt(targetX);
        if (!(targetTile == '.' || targetTile == '7' || targetTile == '8')) {
            return;
        }

        //  now set the target to the new position
        this.player.target.x = targetX;
        this.player.target.y = targetY;
        this.player.startMoveTime = new Date();
        this.player.isMoving = true;

        this.setSourceTile(this.player.position.x, this.player.position.y, '.');
    },

    moveRight: function() {
        this.movePlayer(1, 0);
    },

    moveLeft: function() {
        this.movePlayer(-1, 0);
    },

    moveUp: function() {
        this.movePlayer(0, -1);
    },

    moveDown: function() {
        this.movePlayer(0, 1);
    },

    setSourceTile: function(x, y, type) {

        var mapRow = this.map[y];
        mapRow = mapRow.substr(0,x) + type + mapRow.substr(x+1,9999);
        this.map[y] = mapRow;

        var tile = control.map[y].charAt(x);
        if (tile == '.') {
            control.sourceMapCTX.beginPath();
            control.sourceMapCTX.rect(x*64, y*64, 64, 64);
            control.sourceMapCTX.fill();
        } else {
            offset = parseInt(control.map[y].charAt(x), 10)*65;
            control.sourceMapCTX.drawImage(control.tiles, offset, 0, 64, 64, x*64, y*64, 64, 64);
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