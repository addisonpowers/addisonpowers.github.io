ig.module(
    'game.entities.notDoorTrigger'
)
    .requires(
        'impact.entity'
    )
    .defines(function() {
        EntityNotDoorTrigger = ig.Entity.extend({

            size: {x:16, y:16},
            offset: {x:0, y:0},
            gravityFactor: 0,

            _wmDrawBox: true,
            _wmBoxColor: 'red',
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
                other.isInFrontOfDoor = false;
                other.isInFrontOfDoor2 = false;
                other.isInFrontOfArch = false;
            },
            draw:function(){
                this.parent();
            },
        });
    });