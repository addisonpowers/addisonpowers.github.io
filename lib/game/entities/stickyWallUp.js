ig.module(
    'game.entities.stickyWallUp'
)
    .requires(
        'impact.entity'
    )
    .defines(function() {
        EntityStickyWallUp = ig.Entity.extend({

            size: {x:8, y:8},
            offset: {x:0, y:0},
            gravityFactor: 0,
            friction: {x:1500, y:1500},

            _wmDrawBox: true,
            _wmBoxColor: 'blue',
            _wmScalable: true,

            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.PASSIVE,

            init: function(x, y, settings) {
                this.parent(x, y, settings);

                //Add the animations
                // this.addAnim('idle', 1, [0]);
            },

            update: function() {
                this.parent();
            },
            check: function(other) {
                other.inContactWithStickyWallUp = true;
            },
            draw:function(){
                this.parent();
            },
        });
    });