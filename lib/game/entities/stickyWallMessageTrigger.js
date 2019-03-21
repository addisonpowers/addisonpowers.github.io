ig.module(
    'game.entities.stickyWallMessageTrigger'
)
    .requires(
        'impact.entity'
    )
    .defines(function() {
        EntityStickyWallMessageTrigger = ig.Entity.extend({
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
                // Iterate over all targets
                for( var t in this.target ) {
                    var ent = ig.game.getEntityByName( this.target[t] );

                    // Check if we got a player entity with the given name
                    if( ent && ent instanceof EntityAddison ) {
                        ent.didTriggerStickyWallMsg = true;
                    }
                }
            },
            draw:function(){
                this.parent();
            },
        });
    });