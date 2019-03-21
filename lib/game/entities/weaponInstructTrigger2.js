ig.module(
    'game.entities.weaponInstructTrigger2'
)
    .requires(
        'impact.entity'
    )
    .defines(function() {
        EntityWeaponInstructTrigger2 = ig.Entity.extend({
            // animSheet: new ig.AnimationSheet('media/lava.png', 8, 8),

            size: {x:16, y:16},
            offset: {x:0, y:0},
            gravityFactor: 0,

            _wmDrawBox: true,
            _wmBoxColor: 'green',
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

                other.didTriggerWeaponInstructions2 = true;
            },
            draw:function(){
                this.parent();
            },
        });
    });