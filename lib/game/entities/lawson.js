ig.module(
    'game.entities.lawson'
)
    .requires(
        'impact.entity',
        'game.entities.stranger1'
    )
    .defines(function() {
        EntityLawson = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/lawson.png', 32, 32),

            size: {x:32, y:32},
            offset: {x:0, y:0},
            flip: false,
            maxVel: {x:100, y:150},
            friction: {x:600, y:0},
            accelGround: 400,
            accelAir: 200,
            health: 100,
            jumpVar: 0,
            speed: 30,
            stop: false,
            font: new ig.Font('media/04b03.font.png'),
            messages: new Array(),
            spaceBarIndex: 0,
            msgX: 0,
            msgY: 0,

            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.PASSIVE,

            init: function(x, y, settings) {

                console.log(x + ", " + y);

                this.parent(x, y, settings);

                //Add the animations
                this.addAnim('idle', 1, [0]);
                this.addAnim('walk', 0.5, [1,2,3,4,5]);

                //Initialize the messages array:
                if (ig.game.levelNum === 1) {
                    this.messages[0] = 'Lawson: Addison, thank goodness you\'re here!!\n' +
                        'We have an hour until our show starts\n' +
                        'and Alec is no where to be found.';
                    this.messages[1] = 'Addison: Well good thing bass players\n' +
                        'are expendable';
                    this.messages[2] = 'Lawson: ...';
                    this.messages[3] = 'Addison: Just joking around brother!';
                    this.messages[4] = 'Lawson: This is serious Addison! Stop\n' +
                        'with the dumb jokes!';
                    this.messages[5] = 'Addison: Ok, well then I\'ll go look for him\n' +
                        'while y\'all set up.';
                    this.messages[6] = 'Lawson: Alright, that sounds good.';
                } else {
                    this.messages = null;
                    this.messages = new Array();
                    this.messages[0] = 'Lawson: Yayayayaya!';
                }
            },

            update: function() {

                if (this.stop) {
                    if (ig.input.pressed('space') && this.spaceBarIndex < this.messages.length-1) {
                        this.spaceBarIndex += 1;
                    } else if (ig.input.pressed('space') && this.spaceBarIndex >= this.messages.length-1) {
                        // console.log("should be hree");
                        // console.log("stop = " + this.stop);
                        this.stop = false;
                        this.checkAgainst = ig.Entity.TYPE.NONE;
                        ig.game.stopAddison = false;

                        //Spawn the stranger:
                        ig.game.spawnEntity(EntityStranger1, 1300, 845);

                    }

                    this.currentAnim = this.anims.idle;
                    this.parent();
                    return;
                }

                //near an edge? return!
                if (!ig.game.collisionMap.getTile(
                    this.pos.x + (this.flip ? +4 : this.size.x -4),
                    this.pos.y + this.size.y+1
                )
                ) {
                    this.flip = !this.flip;
                }
                var xdir = this.flip ? -1 : 1;
                this.vel.x = this.speed * xdir;
                this.currentAnim.flip.x = this.flip;

                this.currentAnim =  this.anims.walk;

                this.parent();
            },

            check: function(other) {

                if (this.spaceBarIndex <= this.messages.length) {
                    this.stop = true;
                    // other.stop = true;
                    ig.game.stopAddison = true;

                    if (this.pos.x > other.pos.x) {
                        this.flip = true;
                        other.flip = false;
                    } else {
                        this.flip = false;
                        other.flip = true;

                    }
                    this.currentAnim.flip.x = this.flip;
                    other.currentAnim.flip.x = other.flip;
                }
            },

            draw: function() {
                this.parent();
                // if (this.stop && this.spaceBarIndex <= this.messages.length-1) {
                if (this.stop) {
                    if (this.spaceBarIndex == 0) {
                        this.font.draw('Press spacebar', this.pos.x-ig.game.screen.x, this.pos.y-ig.game.screen.y-this.size.y*4, ig.Font.ALIGN.CENTER);
                    } else if (this.spaceBarIndex >= this.messages.length) {
                        return;
                    }

                    if (this.spaceBarIndex % 2 == 0) {
                        this.msgX = this.pos.x-ig.game.screen.x;
                    } else {
                        this.msgX = this.pos.x-ig.game.screen.x + 100;
                    }

                    this.msgY = this.pos.y-ig.game.screen.y-this.size.y*2;

                    this.font.draw(this.messages[this.spaceBarIndex], this.msgX, this.msgY, ig.Font.ALIGN.CENTER);
                }
            }
        });
    });