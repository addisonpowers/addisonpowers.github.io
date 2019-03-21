ig.module(
    'game.entities.diploma'
)
    .requires(
        'impact.entity'
    )
    .defines(function() {
        EntityDiploma = ig.Entity.extend({
            size: {x: 16, y: 8},
            offset: {x: 0, y: 4},
            animSheet: new ig.AnimationSheet('media/diploma.png', 16, 16),
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
                ig.game.diplomaCollected = true;
                this.kill();
            },

            kill: function() {
                this.parent();
                ig.game.stats.score += 10;
            }
        });
    });