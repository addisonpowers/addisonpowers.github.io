ig.module(
    'game.entities.musicNote'
)
    .requires(
        'impact.entity'
    )
    .defines(function() {
        EntityMusicNote = ig.Entity.extend({
            size: {x: 8, y: 14},
            offset: {x: 4, y: 1},
            animSheet: new ig.AnimationSheet('media/musicNote.png', 16, 16),
            gravityFactor: 0,
            // maxVel: {x: 100, y: 100},
            maxVel: {x: 600, y: 100},
            speed: 50,
            flip: false,
            flipY: false,
            startMovingRight: false,
            startMovingDown: false,
            startPosition: null,
            xDistance: 150,
            yDistance: 150,
            moveXDirection: false,
            moveYDirection: false,

            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.A,
            //check against none for testing:
            // checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.NEVER,

            init: function (x, y, settings) {
                this.startPosition = {x:x,y:y};
                this.parent(x, y, settings);
                this.addAnim('idle', 1, [0]);
            },

            update: function () {
                this.parent();

                if (this.moveXDirection) {
                    this.moveX();
                }
                if (this.moveYDirection) {
                    this.moveY();
                }
            },

            handleMovementTrace: function( res ) {
                // This completely ignores the trace result (res) and always
                // moves the entity according to its velocity
                if (ig.game.levelNum !== 3) {
                    this.pos.x += this.vel.x * ig.system.tick;
                    this.pos.y += this.vel.y * ig.system.tick;
                } else {
                    this.parent(res);
                    if (res.collision.x || res.collision.y) {
                        this.kill();
                    }
                }
            },

            check: function (other) {
                other.receiveDamage(20);
                ig.game.stats.score -= 20;
                this.kill();
            },

            moveX: function() {

                if (this.startMovingRight) {
                    if (this.pos.x <= this.startPosition.x) {
                        this.flip = true;
                    } else if (this.pos.x >= this.startPosition.x + this.xDistance) {
                        this.flip = false;
                    }
                } else {
                    if (this.pos.x >= this.startPosition.x) {
                        this.flip = false;
                    } else if (this.pos.x <= this.startPosition.x - this.xDistance) {
                        this.flip = true;
                    }
                }
                var xdir = this.flip ? 1 : -1;
                this.vel.x = this.speed * xdir;
                this.currentAnim.flip.x = this.flip;
            },

            moveY: function() {

                if (this.startMovingDown) {
                    if (this.pos.y <= this.startPosition.y) {
                        this.flipY = true;
                    } else if (this.pos.y >= this.startPosition.y + this.yDistance) {
                        this.flipY = false;
                    }
                } else {
                    if (this.pos.y >= this.startPosition.y) {
                        this.flipY = false;
                    } else if (this.pos.y <= this.startPosition.y - this.yDistance) {
                        this.flipY = true;
                    }
                }
                var ydir = this.flipY ? 1 : -1;
                this.vel.y = this.speed * ydir;
                // this.currentAnim.flip.x = this.flip;
            },

            kill: function() {
                this.parent();
                // ig.game.stats.score += 20;
            }
        });
    });