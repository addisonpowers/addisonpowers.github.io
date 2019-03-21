ig.module(
    'game.entities.door1Trigger'
)
    .requires(
        'impact.entity'
    )
    .defines(function() {
        EntityDoor1Trigger = ig.Entity.extend({
            // animSheet: new ig.AnimationSheet('media/lava.png', 8, 8),

            size: {x:16, y:16},
            offset: {x:0, y:0},
            gravityFactor: 0,

            _wmDrawBox: true,
            _wmBoxColor: 'blue',
            _wmScalable: true,
            target: {},

            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.PASSIVE,

            init: function(x, y, settings) {
                this.parent(x, y, settings);
            },

            update: function() {
                this.parent();
            },
            check: function(other) {
                if (ig.game.levelNum == 1) {
                    other.isInFrontOfDoor = true;
                } else if (ig.game.levelNum == 2) {
                    other.isInFrontOfDoor2 = true;
                }
            },
            draw:function(){
                this.parent();
            },
        });
    });