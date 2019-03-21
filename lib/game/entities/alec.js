ig.module(
    'game.entities.alec'
)
    .requires(
        'impact.entity'
    )
    .defines(function() {
        EntityAlec = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/alec.png', 32, 32),

            size: {x:32, y:32},
            offset: {x:0, y:0},
            flip: true,
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

            startPosition: null,

            firstTimeTalkAfterProfessorKilled: true,

            init: function(x, y, settings) {

                console.log(x + " " + y);

                this.startPosition = {x:x,y:y};

                this.parent(x, y, settings);

                //Add the animations
                this.addAnim('idle', 1, [0]);
                this.addAnim('walk', 0.5, [1,2,3,4,5]);

                //Initialize the messages array:
                if (ig.game.levelNum === 3) {
                    this.messages[0] = 'Alec: Oh, hey Addison.';
                    this.messages[1] = 'Addison: There you are Alec! Let\'s get out of\n' +
                        'here. Our show starts in 30 minutes!';
                    this.messages[2] = 'Alec: I can\'t leave. There is an evil professor\n' +
                        'here that won\'t let the students leave without\n' +
                        'a diploma! I\'m going crazy!';
                    this.messages[3] = 'Addison: It\'s been 30 minutes..';
                    this.messages[4] = 'Alec: That\'s.. impossible!\n' +
                                        'I\'ve been here for 12 weeks!\n';
                    this.messages[5] = 'Addison: Time\'s a funny thing.';
                    // this.messages[3] = 'Addison: Oh no, I should have known Professor Professorson\n' +
                    //     'was responsible for your disappearance..';
                    // this.messages[4] = 'Alec: You know the guy?';
                    // this.messages[5] = 'Addison: Yeah, I\'m not a fan to say the least.';
                    this.messages[6] = 'Alec: Yeah, well I\'m stuck here until I can pass\n' +
                        'his evil calculus class';
                    this.messages[7] = 'Addison: Not if I can help it!';
                    this.messages[8] = 'Alec: What are you going to do??' +
                        'The man is pure evil!';
                    this.messages[9] = 'Addison: I\'m going to fight him and take\n' +
                        'his stolen diplomas!';
                    this.messages[10] = 'Alec: Ok. Good luck with that..';
                    this.messages[11] = 'Addison: Thanks cuz. I won\'t let you down.\n';
                        // 'Meet me at the arch.';
                } else {
                    this.messages = null;
                    this.messages = new Array();
                    this.messages[0] = 'Alec: Let\'s uhh.. rock!';
                }
            },

            update: function() {

                if (this.stop) {
                    if (ig.input.pressed('space') && this.spaceBarIndex < this.messages.length-1) {
                        this.spaceBarIndex += 1;
                    } else if (ig.input.pressed('space') && this.spaceBarIndex >= this.messages.length-1) {
                        // console.log("should be hree");
                        // console.log("stop = " + this.stop);
                        this.stop = false;
                        this.checkAgainst = ig.Entity.TYPE.NONE;
                        ig.game.stopAddison = false;

                        //WINNER!!!!
                        if (ig.game.levelNum === 3.5) {
                            ig.game.winner();
                        }

                        //Spawn the stranger:
                        if (ig.game.levelNum !== 3) {
                            ig.game.spawnEntity(EntityStranger1, 1300, 845);
                        }

                    }

                    this.currentAnim = this.anims.idle;
                    this.parent();
                    return;
                }

                //near an edge? return!
                if (!ig.game.collisionMap.getTile(
                    this.pos.x + (this.flip ? +4 : this.size.x -4),
                    this.pos.y + this.size.y+1
                )
                ) {
                    this.flip = !this.flip;
                }
                var xdir = this.flip ? -1 : 1;
                this.vel.x = this.speed * xdir;
                this.currentAnim.flip.x = this.flip;

                this.currentAnim =  this.anims.walk;

                this.parent();


                //IF the professor is killed in level 3, move alec to the arch:
                if (ig.game.professorKilled && ig.game.levelNum === 3) {
                    this.pos = {x: 1280, y: this.startPosition.y};
                    this.currentAnim = this.anims.idle;
                    this.vel.x = 0;
                    this.accel.x = 0;

                    if (this.firstTimeTalkAfterProfessorKilled) {
                        console.log("init messages 2");
                        this.spaceBarIndex = 0;
                        this.messages = null;
                        this.messages = new Array();
                        this.messages[0] = 'Alec: Alright let\'s go play this show.';
                        this.messages[1] = 'Addison: You\'re welcome..';
                        this.messages[2] = 'Alec: Oh yeah, thanks..';

                        this.checkAgainst =  ig.Entity.TYPE.A;
                        this.firstTimeTalkAfterProfessorKilled = false;
                    }
                }
            },

            check: function(other) {
                if (this.spaceBarIndex <= this.messages.length) {

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
                    } else if (this.spaceBarIndex >= this.messages.length) {
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