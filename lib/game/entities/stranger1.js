ig.module(
    'game.entities.stranger1'
)
    .requires(
        'impact.entity',
        'game.entities.key'
    )
    .defines(function() {
        EntityStranger1 = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/stranger1.png', 32, 32),

            size: {x:32, y:32},
            offset: {x:0, y:0},
            flip: false,
            maxVel: {x:100, y:150},
            friction: {x:600, y:0},
            accelGround: 400,
            accelAir: 200,
            health: 100,
            jumpVar: 0,
            speed: 30,
            stop: false,
            font: new ig.Font('media/04b03.font.png'),
            messages: new Array(),
            spaceBarIndex: 0,
            msgX: 0,
            msgY: 0,

            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.PASSIVE,

            init: function(x, y, settings) {

                this.parent(x, y, settings);

                //Add the animations
                this.addAnim('idle', 1, [0]);
                this.addAnim('walk', 0.5, [1,2,3,4,5]);

                //Initialize the messages array:
                this.messages[0] = 'Addison: Excuse me sir, can I ask you a question?';
                this.messages[1] = 'Stranger: You just did dummy.';
                this.messages[2] = 'Addison: I guess you\'re right\n' +
                                            'Can I ask you 2 more questions?';
                this.messages[3] = 'Stranger: One to go..';
                this.messages[4] = 'Addison: Have you seen a guy walking around\n' +
                                                'with a guitar?';
                this.messages[5] = 'Stranger: You\'ll have to be more specific.';
                this.messages[6] = 'Addison: A bass guitar!';
                this.messages[7] = 'Stranger: Ohh, of course, of course.\n' +
                                    'I saw him walk through the arch.\n' +
                                    'Hopefully he had a diploma.\n' +
                                    'I hear bad things happen to those who\n' +
                                    'walk through it without a diploma\n';
                this.messages[8] = 'Addison: Oh no, he doesn\'t have one!!';
                this.messages[9] = 'Stranger: You better go save him then!';
                this.messages[10] = 'Addison: I don\'t have a diploma either!';
                this.messages[11] = 'Stranger: I hear there\'s an evil professor\n' +
                                'that takes diplomas away from students so\n' +
                                'they have to stay for the summer.  Maybe\n' +
                                'you could sneak a diploma from him!';
                this.messages[12] = 'Addison: That\'s awful! Where could I find him?';
                this.messages[13] = 'Stranger: He likes to hang out in that\n' +
                                        'building next to the music theatre in the corner.';
                this.messages[14] = 'Addison: Great, thanks for the help!';


            },

            update: function() {

                if (this.stop) {
                    if (ig.input.pressed('space') && this.spaceBarIndex < this.messages.length-2) {
                        this.spaceBarIndex += 1;
                    } else if (ig.input.pressed('space') && this.spaceBarIndex >= this.messages.length-2) {

                        // RESUME PLAYERS HERE:

                        this.stop = false;
                        this.checkAgainst = ig.Entity.TYPE.NONE;
                        ig.game.stopAddison = false;
                        ig.game.hasTalkedToStranger1 = true;

                        //spawn key:
                        ig.game.spawnEntity(EntityKey, 1368, 497);
                    }

                    this.currentAnim = this.anims.idle;
                    this.parent();
                    return;
                }

                //near an edge? return!
                // if (!ig.game.collisionMap.getTile(
                //     this.pos.x + (this.flip ? +4 : this.size.x -4),
                //     this.pos.y + this.size.y+1
                // )
                if (this.pos.x > 1500 || this.pos.x < 1200) {
                    this.flip = !this.flip;
                }
                var xdir = this.flip ? -1 : 1;
                this.vel.x = this.speed * xdir;
                this.currentAnim.flip.x = this.flip;

                this.currentAnim =  this.anims.walk;

                this.parent();
            },

            check: function(other) {

                if (this.spaceBarIndex <= this.messages.length-1) {
                    this.stop = true;
                    // other.stop = true;
                    ig.game.stopAddison = true;

                    if (this.pos.x > other.pos.x) {
                        this.flip = true;
                        other.flip = false;
                    } else {
                        this.flip = false;
                        other.flip = true;

                    }
                    this.currentAnim.flip.x = this.flip;
                    other.currentAnim.flip.x = other.flip;
                }
            },

            draw: function() {
                this.parent();
                // if (this.stop && this.spaceBarIndex <= this.messages.length-1) {
                if (this.stop) {
                    if (this.spaceBarIndex == 0) {
                        this.font.draw('Press spacebar', this.pos.x-ig.game.screen.x, this.pos.y-ig.game.screen.y-this.size.y*4, ig.Font.ALIGN.CENTER);
                    } else if (this.spaceBarIndex >= this.messages.length-1) {
                        return;
                    }

                    if (this.spaceBarIndex % 2 == 0) {
                        this.msgX = this.pos.x-ig.game.screen.x;
                    } else {
                        this.msgX = this.pos.x-ig.game.screen.x + 100;
                    }

                    this.msgY = this.pos.y-ig.game.screen.y-this.size.y*2;

                    this.font.draw(this.messages[this.spaceBarIndex], this.msgX, this.msgY, ig.Font.ALIGN.CENTER);
                }
            }
        });
    });