ig.module(
    'game.entities.thePowersLabel'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityThePowersLabel = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/thePowers.png', 200, 48),

        size: {x:200, y:48},
        offset: {x:0, y:0},
        flip: false,
        gravityFactor: 0,

        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        init: function(x, y, settings) {

            this.parent(x, y, settings);

            //Add the animations
            this.addAnim('idle', 1, [0]);
        },

        update: function() {

            //move!
            this.parent();
        },
    });
});