ig.module(
    'game.entities.key'
)
    .requires(
        'impact.entity'
    )
    .defines(function() {
        EntityKey = ig.Entity.extend({
            size: {x: 16, y: 6},
            offset: {x: 0, y: 5},
            animSheet: new ig.AnimationSheet('media/key.png', 16, 16),
            gravityFactor: 0,

            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.PASSIVE,

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('idle', 1, [0]);
            },

            update: function () {
                this.parent();
            },

            check: function (other) {
                // other.receiveDamage(5, this);
                other.keyCollected = true;
                this.kill();
            }
        });
    });