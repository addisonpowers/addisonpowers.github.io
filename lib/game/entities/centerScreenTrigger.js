ig.module(
    'game.entities.centerScreenTrigger'
)
    .requires(
        'impact.entity'
    )
    .defines(function() {
        EntityCenterScreenTrigger = ig.Entity.extend({
            // animSheet: new ig.AnimationSheet('media/lava.png', 8, 8),

            size: {x:16, y:16},
            offset: {x:0, y:0},
            gravityFactor: 0,

            _wmDrawBox: true,
            _wmBoxColor: 'rgba(155,0,0,0.5)',
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
                if (!ig.game.professorKilled) {
                    ig.game.centerScreenLevel3 = true;
                } else {
                    ig.game.centerScreenLevel3 = false;
                }
            },
            draw:function(){
                this.parent();
            },
        });
    });