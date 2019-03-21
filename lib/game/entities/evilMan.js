ig.module(
    'game.entities.evilMan'
)
    .requires(
        'impact.entity',
        'game.entities.key'
    )
    .defines(function() {
        EntityEvilMan = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/evilMan.png', 320, 64),

            originalSize: {x:28, y:64},
            size: {x:28, y:64},
            offset: {x:146, y:0},
            flip: true,
            maxVel: {x:100, y:150},
            friction: {x:600, y:0},
            accelGround: 400,
            accelAir: 200,
            health: 200,
            maxHealth: 200,
            jumpVar: 0,
            speed: 130,
            stop: false,
            font: new ig.Font('media/04b03.font.png'),
            // font: new ig.Font('media/font1.png'),
            messages: new Array(),
            spaceBarIndex: 0,
            msgX: 0,
            msgY: 0,
            talkToAddison: true,

            runTimer: null,

            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.PASSIVE,


            talkToAddison2: false,
            firstTimeTalkToAddison2: true,

            fightTimer: null,
            waitTimer: null,
            waitTimerNumber: 0,

            direction: 1,

            //Long punch:
            entityLongPunchHitBox: null,
            longPunchY: 0,
            longPunchX: 0,

            currentFrame: 0,

            init: function(x, y, settings) {

                this.parent(x, y, settings);

                this.longPunchY = this.pos.y + this.size.y/2 + 3;
                this.longPunchX = this.flip ? this.pos.x : this.pos.x;

                if (ig.game.levelNum == 3) {
                    this.talkToAddison = false;
                }

                //Add the animations
                this.addAnim('idle', 1, [0]);
                this.addAnim('run', 0.1, [1,2,3,4]);
                this.addAnim('runBackwards', 0.1, [4,3,2,1]);
                this.addAnim('longPunch', 0.05, [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21], true);
                this.addAnim('openMouth', 1, [22]);

                //Initialize the messages array:
                if (this.talkToAddison) {
                    this.messages[0] = 'Professor Professorson: So you\'re the guitar player for the Powers.\n' +
                        'Someone told me you\'d be coming to steal one of my precious diplomas!';
                    this.messages[1] = 'Addison: Someone told me you like to watch students suffer.';
                    this.messages[2] = 'Professor Professorson: HAHAHAHAHA';
                    this.messages[3] = 'Addison: You\'re a madman! Hand the diplomas over!';
                    this.messages[4] = 'Professor Professorson: Never!';
                    this.messages[5] = 'Addison: Well I\'ll just have to take them from you!';
                    this.messages[6] = 'Professor Professorson: Good luck with that!!';
                } else if (ig.game.levelNum === 3) {
                    this.messages[0] = 'Professor Professorson: Welcome to summer school!!';
                    this.messages[1] = 'Addison: It\'s March.';
                    this.messages[2] = 'Professor Professorson: Not in these parts!';
                    this.messages[3] = 'Addison: Why don\'t you just hand the diplomas over!';
                    this.messages[4] = 'Professor Professorson: Why don\'t you just get a new bassist?\n' +
                                        'Yours will be here for a long time!';
                    this.messages[5] = 'Addison: Not an option';
                    this.messages[6] = 'Professor Professorson: Then let\'s settle this!';
                }


            },

            update: function() {

                if (this.talkToAddison || this.talkToAddison2) {
                    if (this.spaceBarIndex <= this.messages.length - 1) {
                        this.stop = true;
                        // other.stop = true;
                        ig.game.stopAddison = true;
                    }
                }

                if (this.stop) {

                    if (this.talkToAddison || this.talkToAddison2) {
                        if (ig.input.pressed('space') && this.spaceBarIndex < this.messages.length - 1) {
                            this.spaceBarIndex += 1;
                        } else if (ig.input.pressed('space') && this.spaceBarIndex >= this.messages.length - 1) {

                            // RESUME PLAYERS HERE:

                            this.stop = false;
                            // this.checkAgainst = ig.Entity.TYPE.NONE;
                            // ig.game.stopAddison = false;

                            if (this.talkToAddison) {
                                this.startRunTimer();
                                this.talkToAddison = false;
                            } else if (this.talkToAddison2){
                                this.startFightTimer(1);
                                this.talkToAddison2 = false;
                                ig.game.stopAddison = false;
                            }
                        }

                        this.currentAnim = this.anims.idle;
                        this.currentAnim.flip.x = this.flip;
                        this.parent();
                        return;
                    }
                }


                // this.currentAnim =  this.anims.idle;

                // if (this.currentAnim !== this.anims.longPunch) {
                //     this.currentAnim = this.anims.longPunch.rewind();
                // }

                if (this.currentAnim === this.anims.longPunch) {

                    //spawn hitbox:
                    if (this.currentAnim.frame === this.currentFrame && this.entityLongPunchHitBox === null) {
                        this.entityLongPunchHitBox = ig.game.spawnEntity(EntityLongPunchHitBox,
                            this.longPunchX, this.longPunchY);

                    } else if (this.currentAnim.frame !== this.currentFrame) {

                        //move on to next frame
                        if (this.currentFrame < 16) {
                            this.currentFrame++;
                            this.longPunchX = this.flip ? (this.longPunchX-9) : (this.longPunchX+9);
                        } else {
                            this.currentFrame = 0;
                            this.longPunchX = this.flip ? this.pos.x : this.pos.x;
                        }

                        if (this.entityLongPunchHitBox) {
                            this.entityLongPunchHitBox.kill();
                            this.entityLongPunchHitBox = null;
                        }
                    }


                    if (this.currentAnim.loopCount) {
                        //animation has played through:

                        //destroy hitbox
                        if (this.entityLongPunchHitBox) {
                            this.entityLongPunchHitBox.kill();
                            this.entityLongPunchHitBox = null;
                        }

                        this.currentAnim = this.anims.idle;
                    }
                }



                //TIMER STUFF:---------------------------------------------
                if (this.runTimer != null) {
                    if (this.runTimer.delta() >= 0) { // run timer is done
                        ig.game.stopAddison = false;
                        this.runTimer = null;
                        this.kill();
                    } else {
                        //Move Professor evilMan:
                        this.flip = false;
                        this.currentAnim = this.anims.run;

                        //Near an edge: return!
                        if (!ig.game.collisionMap.getTile(
                            this.pos.x + (this.flip ? +4 : this.size.x - 4),
                            this.pos.y + this.size.y + 1
                        )
                        ) {
                            this.flip = !this.flip;
                        }
                        var xdir = this.flip ? -1 : 1;
                        this.vel.x = this.speed * xdir;

                    }
                } else if (this.fightTimer != null) {

                    this.currentAnim = this.anims.openMouth;

                    if (this.fightTimer.delta() < 0) {
                        //fight timer is not done:

                        //1 in _ chance of shooting a music note
                        var shouldShootNote = Math.round(Math.random()*10);
                        if (shouldShootNote === 1) {

                            let randY = (Math.random()*(5*this.size.y/4)) + this.pos.y-this.size.y/4;
                            let note = ig.game.spawnEntity(EntityMusicNote, this.pos.x, randY);
                            note.moveXDirection = true;
                            note.xDistance = 1300;
                            note.speed = (Math.random() * 150) + 100;
                        }

                    } else {
                        //fight timer 1 is done:
                        this.fightTimer = null;
                        this.startWaitTimer(4);
                    }
                } else if (this.waitTimer != null) {

                    if (this.currentAnim !== this.anims.longPunch) {
                        //For each frame, 1 in _ chance of switching directions
                        let directionSwitchChance = Math.round(Math.random() * 25);

                        //switch direction!
                        if (directionSwitchChance === 1 || (this.pos.x > 1150 && this.direction === 1)
                            || (this.pos.x < 930 && this.direction === -1)) {
                            this.direction = -this.direction;
                        }

                        this.vel.x = (this.speed / 4) * this.direction;
                        this.currentAnim = (this.direction === 1) ? this.anims.run : this.anims.runBackwards;

                        if (this.waitTimer.delta() < 0) {
                            //wait timer is not done
                        } else {
                            //wait timer 1 is done
                            this.waitTimer = null;

                            if (this.waitTimerNumber < 2) {
                                this.waitTimerNumber += 1;
                                this.currentAnim = this.anims.longPunch.rewind();
                                this.startWaitTimer(4);
                            } else {

                                //reset wait timer number
                                this.waitTimerNumber = 0;
                                this.currentAnim = this.anims.idle;
                                this.startFightTimer(1.5);
                            }

                        }
                    }
                }
                //-END: TIMER STUFF--------------------------------------------------

                this.currentAnim.flip.x = this.flip;


                this.parent();
            },

            check: function(other) {
                other.receiveDamage(5);
                // console.log("touching");
            },

            startRunTimer: function() {
                // this.runTimer = new ig.Timer(4);
                this.runTimer = new ig.Timer(3);
            },
            startFightTimer: function(sec) {
                this.fightTimer = new ig.Timer(sec);
            },
            startWaitTimer: function(sec) {
                this.waitTimer = new ig.Timer(sec);
            },

            kill: function() {
                this.parent();


                if (ig.game.levelNum === 3) {
                    ig.game.spawnEntity(EntityDiplomaExplosion, this.pos.x,
                        this.pos.y);
                    ig.game.professorKilled = true;
                    ig.game.centerScreenLevel3 = false;

                    ig.game.stats.score += 600;
                }
            },

            draw: function() {


                //Health bar:
                // border/background
                ig.system.context.fillStyle = "rgb(0,0,0)";
                ig.system.context.beginPath();
                ig.system.context.rect(
                    (this.pos.x - ig.game.screen.x) * ig.system.scale,
                    (this.pos.y - ig.game.screen.y - 8) * ig.system.scale,
                    this.size.x * ig.system.scale,
                    4 * ig.system.scale
                );
                ig.system.context.closePath();
                ig.system.context.fill();

                // health bar
                ig.system.context.fillStyle = "rgb(255,0,0)";
                ig.system.context.beginPath();
                ig.system.context.rect(
                    (this.pos.x - ig.game.screen.x + 1) * ig.system.scale,
                    (this.pos.y - ig.game.screen.y - 7) * ig.system.scale,
                    ((this.size.x - 2) * (this.health / this.maxHealth)) * ig.system.scale,
                    2 * ig.system.scale
                );
                ig.system.context.closePath();
                ig.system.context.fill();



                this.parent();
                // if (this.stop && this.spaceBarIndex <= this.messages.length-1) {
                if (this.stop) {
                    if (this.spaceBarIndex == 0) {
                        if (this.talkToAddison2) {
                            this.font.draw('Press spacebar', this.pos.x - ig.game.screen.x-300, this.pos.y - ig.game.screen.y - this.size.y * 2, ig.Font.ALIGN.CENTER);
                        } else {
                            this.font.draw('Press spacebar', this.pos.x-ig.game.screen.x, this.pos.y-ig.game.screen.y-this.size.y*2, ig.Font.ALIGN.CENTER);
                        }
                    } else if (this.spaceBarIndex >= this.messages.length) {
                        return;
                    }

                    if (this.spaceBarIndex % 2 == 0) {
                        if (this.talkToAddison2) {
                            this.msgX = this.pos.x-ig.game.screen.x-120;
                        } else {
                            this.msgX = this.pos.x - ig.game.screen.x;
                        }
                    } else {
                        if (this.talkToAddison2){
                            this.msgX = this.pos.x-ig.game.screen.x - 350;
                        } else {
                            this.msgX = this.pos.x - ig.game.screen.x - 100;
                        }
                    }

                    this.msgY = this.pos.y-ig.game.screen.y-this.size.y;

                    this.font.draw(this.messages[this.spaceBarIndex], this.msgX, this.msgY, ig.Font.ALIGN.CENTER);
                }
            }
        });

        EntityLongPunchHitBox = ig.Entity.extend({
            gravityFactor: 0,

            // animSheet: new ig.AnimationSheet('media/hitbox.png', 35, 3),
            // _wmDrawBox: true,
            // _wmBoxColor: 'orange',

            size: {x: 35, y: 25},

            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.PASSIVE,

            init: function(x, y, settings) {
                this.parent(x, y, settings);

                // this.addAnim('idle', 1, [0]);
            },

            check: function(other) {
                if( other && other instanceof EntityAddison ) {
                    other.receiveDamage(2);
                }
            }
        });


        EntityDiplomaExplosion = ig.Entity.extend({
            // lifetime: 1,
            callBack: null,
            diplomas: 10,
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                for (var i = 0; i < this.diplomas; i++)
                    ig.game.spawnEntity(EntityDiplomaExplosionDiploma, x, y,
                        {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
                this.idleTimer = new ig.Timer();
            },
            update: function () {
                this.parent();
            }
        });

        EntityDiplomaExplosionDiploma = ig.Entity.extend({
            size: {x: 16, y: 8},
            offset: {x: 0, y: 4},
            maxVel: {x: 160, y: 200},

            bounciness: 0,
            vel: {x: 100, y: 30},
            friction: {x:100, y: 0},

            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.LITE,

            animSheet: new ig.AnimationSheet( 'media/diploma.png', 16, 16 ),
            init: function( x, y, settings ) {
                this.parent( x, y, settings );

                this.addAnim( 'idle', 0.2, [0] );
                this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
                this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
                // this.idleTimer = new ig.Timer();
            },
            update: function() {
                this.parent();
            },

            check: function(other) {
                this.kill();
            },

            kill: function() {
                this.parent();
                ig.game.stats.score += 10;
            }
        });
    });