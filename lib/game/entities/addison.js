ig.module(
    'game.entities.addison'
)
.requires(
    'impact.entity',
    'game.entities.alec'
)
.defines(function() {
    EntityAddison = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/addison.png', 96, 96),

        size: {x:14, y:30},
        offset: {x:41, y:33},
        // size: {x:96, y: 96},
        // offset: {x: 0, y: 0},
        flip: false,
        flipY: false,
        maxVel: {x:100, y:200},
        friction: {x:600, y:0},
        accelGround: 400,
        accelAir: 200,
        jump:120,
        bounceVelocity: 200,
        wallJump: 155,
        health: 100,
        maxHealth: 100,
        jumpVar: 0,
        entityGuitarSlamHitBox1: null,
        entityGuitarSlamHitBox2: null,
        // bounciness: 6,

        font: new ig.Font('media/04b03.font.png'),

        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.PASSIVE,

        startPosition: null,

        //For centering the player:
        centerPlayer: false,
        dontCenter: false,

        //For opening a door:
        isInFrontOfDoor: false,
        keyCollected: false,
        messageTimer: null,
        doorMsgX: 0,
        doorMsgY: 0,

        //Level 2 Sticky wall:
        inContactWithStickyWallRight: false,
        inContactWithStickyWallLeft: false,
        inContactWithStickyWallUp: false,
        isWallJumping: false,
        stickyWallMessageTimer: null,
        didTriggerStickyWallMsg: false,
        firstTimeWithStickyWallMsg: true,
        msg: null,

        isInFrontOfDoor2: false,


        //Weapon instructions
        didTriggerWeaponInstructions: false,
        firstTimeWithWeaponInstruct1: true,
        firstTimeWithWeaponInstruct2: true,
        didTriggerWeaponInstructions2: false,


        //for loading level 3:
        isInFrontOfArch: false,

        //Picks:
        pickTimer: null,

        init: function(x, y, settings) {

            if (ig.game.levelNum === 3.5) {
                //start next to the arch
                this.startPosition = {x: 900, y: y};
            } else if (ig.game.levelNum === 2.5) {
                //start next to the door to get into the building
                this.startPosition = {x: 480, y: y};
            } else {
                this.startPosition = {x: x, y: y};
            }

            ig.game.playerHealth = this.health;

            this.parent(this.startPosition.x, this.startPosition.y, settings);


            if (ig.game.levelNum === 3.5) {
                ig.game.spawnEntity(EntityAlec, 190, 497);
            }


            //Add the animations
            this.addAnim('idle', 1, [0]);
            this.addAnim('run', 0.2, [1,2,3,4,5]);
            this.addAnim('jump', 1, [6]);
            this.addAnim('fall', 1, [7]);
            this.addAnim('climb', 0.3, [8, 9]);
            this.addAnim('guitarSlam', .025,
                [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], true);

            //For moving to the second level right away:
            // this.keyCollected = true;
            // ig.game.hasTalkedToStranger1 = true;
        },

        update: function() {

            ig.game.playerHealth = this.health;

            if (!this.inContactWithStickyWallRight && !this.inContactWithStickyWallLeft) {
                if (this.inContactWithStickyWallUp) {
                    this.accel.y = -ig.game.gravity;
                    this.flipY = true;
                    this.vel.y = 0;
                } else {
                    this.accel.y = 0;
                    this.gravityFactor = 1;
                    this.flipY = false;
                }
            } else {
                this.accel.x = 0;
                this.vel.x = 0;
                this.gravityFactor = 0.3;
            }


            //Check for contact with wall left, wall right, or ground to exit wall jumping state
            //when wall jumping, the right and left inputs have no modified on x acceleration
            if (this.inContactWithStickyWallLeft || this.inContactWithStickyWallRight || this.standing
                || this.inContactWithStickyWallUp) {
                this.isWallJumping = false;
            }

            //if wall jumping, all contacts with sticky walls should be false:
            // if (this.isWallJumping) {
            //     this.inContactWithStickyWallUp = false;
            //     this.inContactWithStickyWallRight = false;
            //     this.inContactWithStickyWallLeft = false;
            // }

            if (ig.game.stopAddison) {
                this.currentAnim = this.anims.idle;
                this.accel.x = 0;
                this.vel.x = 0;
                this.accel.y = 0;
                this.vel.y = 0;
                this.parent();
                return;
            }

            var accel = this.standing ? this.accelGround : this.accelAir;

            if (ig.input.state('left')) {
                this.inContactWithStickyWallRight = false;

                //when wall jumping or in contact with left sticky wall,
                //the left input has half the effect (wall jumping) or no effect on x acceleration
                if (!this.inContactWithStickyWallLeft) {
                    if (this.isWallJumping) {
                        this.accel.x = -accel/2;
                    } else {
                        this.accel.x = -accel;
                    }
                }
                this.flip = true;
            } else if (ig.input.state('right')) {
                this.inContactWithStickyWallLeft = false;

                //when wall jumping or in contact with right sticky wall,
                //the right input has half the effect (wall jumping) or no effect on x acceleration
                if (!this.inContactWithStickyWallRight) {
                    if (this.isWallJumping) {
                        this.accel.x = accel/2;
                    } else {
                        this.accel.x = accel;
                    }
                }
                this.flip = false;
            } else {
                this.accel.x = 0;
            }

            //Sticky wall jump:
            if (ig.input.pressed('up')) {
                if (this.inContactWithStickyWallRight) {
                    this.inContactWithStickyWallRight = false;
                    this.isWallJumping = true;
                    this.vel.y = -this.wallJump;
                    this.vel.x = -this.accelAir * 1.6;
                    this.flip = true;
                } else if (this.inContactWithStickyWallLeft) {
                    this.inContactWithStickyWallLeft = false;
                    this.isWallJumping = true;
                    this.vel.y = -this.wallJump;
                    this.vel.x = this.accelAir * 1.6;
                    this.flip = false;
                } else if (this.inContactWithStickyWallUp) {
                    this.inContactWithStickyWallUp = false;
                    this.isWallJumping = true;
                    this.vel.y = this.wallJump;
                    // this.pos.y += 5;
                    // this.vel.x = 0;
                    // this.flipY = false;
                }
            }

            //jump
            if (ig.input.pressed('up') && this.standing) {

                //If addison is in front of the door when the up arrow key is pressed
                if (this.isInFrontOfDoor || this.isInFrontOfDoor2 || this.isInFrontOfArch) {
                    return;
                }

                this.vel.y = -this.jump;
                this.jumpVar = 1;
            }
            if (ig.input.state('up')) {
                this.vel.y -= this.jump*0.1*this.jumpVar;

                if (this.jumpVar > 0.1)
                    this.jumpVar *= 0.92;
                else
                    this.jumpVar = 0;
            }


            if (ig.input.pressed('guitarSlam') && this.currentAnim != this.anims.guitarSlam) {
                this.currentAnim = this.anims.guitarSlam.rewind();
                // ig.game.spawnEntity(EntityGuitarSlamHitBox, this.pos.x+this.size.x, this.pos.y);
            }
            //For shooting:
            else if (ig.input.pressed('switch')) {
                ig.game.weaponNum = (ig.game.weaponNum == 0) ? 1 : 0;
            } else if( ig.input.pressed('shoot') ) {

                if (ig.game.weaponNum === 1) {

                    if (this.pickTimer === null || this.pickTimer.delta() >= 0) {
                        //Can shoot!:

                        ig.game.spawnEntity(EntityPicks, this.pos.x, this.pos.y, {flip: this.flip});
                        this.startPickTimer();
                    }

                } else {
                    if (this.pickTimer === null || this.pickTimer.delta() >= 0) {
                        //Can shoot!:

                        ig.game.spawnEntity(EntityPick, this.pos.x, this.pos.y,
                            {flip:this.flip, yVel: 0, xDist: 200});
                        this.startPickTimer();
                    }

                }
            }

            if (this.currentAnim == this.anims.guitarSlam) {

                if (this.currentAnim.frame == 6 && this.entityGuitarSlamHitBox1 == null) {
                    var y = this.flipY ? this.pos.y+27 : this.pos.y-25;
                    var x = this.flip ? this.pos.x-20 : this.pos.x;
                    this.entityGuitarSlamHitBox1 = ig.game.spawnEntity(EntityGuitarSlamHitBox, x, y);
                }

                //In the middle of the animation (frame == 13), spawn the attack hitbox
                if (this.currentAnim.frame == 12 && this.entityGuitarSlamHitBox2 == null) {

                    //destroy hitbox 1
                    if (this.entityGuitarSlamHitBox1) {
                        this.entityGuitarSlamHitBox1.kill();
                        this.entityGuitarSlamHitBox1 = null;
                    }

                    var x = this.flip ? this.pos.x-35: this.pos.x+this.size.x;
                    var y = this.pos.y;
                    this.entityGuitarSlamHitBox2 = ig.game.spawnEntity(EntityGuitarSlamHitBox, x, y);
                }

                if (this.currentAnim.loopCount) {
                    //animation has played through:

                    //destroy hitbox 2
                    if (this.entityGuitarSlamHitBox2) {
                        this.entityGuitarSlamHitBox2.kill();
                        this.entityGuitarSlamHitBox2 = null;
                    }

                    this.currentAnim = this.anims.idle;
                }
            } else {

                if (this.vel.y < 0) {
                    this.currentAnim = this.anims.jump;
                } else if (this.vel.y > 0) {
                    this.currentAnim = this.anims.fall;
                } else if (this.vel.x != 0) {
                    this.currentAnim = this.anims.run;
                } else {
                    // this.currentAnim = this.anims.guitarSlam;
                    this.currentAnim = this.anims.idle;
                }

                if (this.inContactWithStickyWallLeft || this.inContactWithStickyWallRight) {
                    this.currentAnim = this.anims.climb;
                }
            }

            this.currentAnim.flip.x = this.flip;
            this.currentAnim.flip.y = this.flipY;

            //move!
            this.parent();


            //CAMERA-----------------------------------------------------------
            //Adjusting the camera according to the player position:
            // if (this.pos.x >= ig.system.width) {
            //     console.log("true");
            //     ig.game.screen.x = 600;
            // }
            if (this.pos.x >= ig.system.width/2 - this.size.x*2.5) {
                ig.game.screen.x = this.pos.x + this.size.x / 2 - ig.system.width / 2;
            } else if (this.pos.x < ig.system.width/2 - this.size.x*2.5) {
                ig.game.screen.x = -30;
            }

            // ig.game.screen.x = this.pos.x + this.size.x / 2 - ig.system.width / 4;
           // ig.game.screen.x = -30;

            //Centering camera for the boss battle:
            if (ig.game.centerScreenLevel3) {
                ig.game.screen.x = 1070/ig.system.scale;
            }

            ig.game.screen.y = this.pos.y + this.size.y/2 - (ig.system.height - ig.system.height/4);
        },


        startPickTimer: function() {
            this.pickTimer = new ig.Timer(0.5);
        },



        draw: function() {
            this.parent();

            //If addison is in front of the door when the up arrow key is pressed
            // and addison HAS TALKED TO Stranger 1
            if (this.isInFrontOfDoor && ig.game.hasTalkedToStranger1) {
                if (ig.input.pressed('up') && this.standing) {
                    if (this.keyCollected) {
                        // ig.game.part1Completed = true;

                        // ig.game.toggleStats();
                        ig.game.levelNum = 2;
                        ig.game.loadLevelDeferred(LevelLevel2);
                    } else {
                        this.startMessageTimer();
                    }
                }
            }

            if (this.isInFrontOfDoor2) {
                if (ig.input.pressed('up') && this.standing) {
                    if (ig.game.diplomaCollected) {
                        ig.game.toggleStats();
                        // ig.game.levelNum = 2.5;
                        // ig.game.loadLevelDeferred(LevelLevel1);
                    } else {
                        this.startStickyWallMessageTimer('I think I saw a diploma he dropped\n' +
                                                        'back that way. I don\'t want to\n' +
                                                        'leave without that..', 4);
                    }
                }
            }

            if (this.isInFrontOfArch) {
                if (ig.input.pressed('up') && this.standing) {
                    console.log("level = "  + ig.game.levelNum);
                    if (ig.game.levelNum === 1 || ig.game.levelNum === 2.5) {
                        if (ig.game.diplomaCollected) {
                            // ig.game.toggleStats();
                            ig.game.levelNum = 3;
                            ig.game.loadLevelDeferred(LevelLevel3);
                        } else {
                            this.startStickyWallMessageTimer('I can\'t go through without a diploma..', 4);
                        }
                    } else if (ig.game.levelNum === 3) { //3rd level
                        ig.game.toggleStats();
                        // ig.game.levelNum = 3.5;
                        // ig.game.loadLevelDeferred(LevelLevel1);

                    } else if (ig.game.levelNum === 3.5) {
                        //do nothing
                    }
                }
            }


            //Instructional weapon note:
            if (this.didTriggerWeaponInstructions && this.firstTimeWithWeaponInstruct1) {
                this.startStickyWallMessageTimer('Use \'V\' to shoot guitar picks!\n' +
                    'Switch between Single-Shot and Multi-Shot with \'Q\'.\n' +
                    'Try shooting these music notes', 6);
                this.didTriggerWeaponInstructions = false;
                this.firstTimeWithWeaponInstruct1 = false;
            }

            if (this.didTriggerWeaponInstructions2 && this.firstTimeWithWeaponInstruct2) {
                this.startStickyWallMessageTimer('Good! Now use \'C\' for a Guitar Slam!', 6);
                this.didTriggerWeaponInstructions2 = false;
                this.firstTimeWithWeaponInstruct2 = false;
            }

            //Display an instructional note to Addison when he reaches the sticky wall:
            if (this.didTriggerStickyWallMsg && this.firstTimeWithStickyWallMsg) {
                this.startStickyWallMessageTimer('Use the up arrow to wall jump up these sticky walls!', 4);
                this.didTriggerStickyWallMsg = false;
                this.firstTimeWithStickyWallMsg = false;
            }

            if (this.messageTimer != null) {
                if (this.messageTimer.delta() <= 0) {
                    this.font.draw('Looks like the door is locked...', this.doorMsgX, this.doorMsgY, ig.Font.ALIGN.CENTER);
                } else {
                    this.messageTimer = null;
                }
            }

            if (this.stickyWallMessageTimer != null) {
                if (this.stickyWallMessageTimer.delta() <= 0) {
                    this.font.draw(this.msg,
                        this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y + 50, ig.Font.ALIGN.CENTER);
                } else {
                    this.stickyWallMessageTimer = null;
                }
            }
        },

        startMessageTimer: function() {
            this.messageTimer = new ig.Timer(3);
            this.doorMsgX = this.pos.x - ig.game.screen.x;
            this.doorMsgY = this.pos.y - ig.game.screen.y + 50;
        },

        startStickyWallMessageTimer: function(message, seconds) {
            this.stickyWallMessageTimer = new ig.Timer(seconds);
            this.msg = message;
        },

        kill: function() {
            this.parent();

            if (ig.game.levelNum === 3) {
                ig.game.respawnPosition = {x: 664, y: this.startPosition.y};
            } else {
                ig.game.respawnPosition = this.startPosition;
            }

            ig.game.spawnEntity(EntityDeathExplosion, this.pos.x,
                this.pos.y, {callBack:this.onDeath} );

            ig.game.stats.deaths ++;
            ig.game.stats.score -= 100;

            // ig.game.playerHealth = 0;
            // ig.game.lives -= 1;
        },

        onDeath: function() {
            // ig.game.stats.deaths++;
            ig.game.playerHealth = 0;
            ig.game.lives--;
            if (ig.game.lives < 0) {
                ig.game.gameOver();
            } else {
                ig.game.spawnEntity(EntityAddison, ig.game.respawnPosition.x,
                    ig.game.respawnPosition.y);
            }
        }
    });

    EntityPicks = ig.Entity.extend({
        numPicks: 3,

       init: function(x, y, settings) {
            this.parent(x, y, settings);

            var yVelocity = -32;
            for (var i = 0; i < this.numPicks; i++) {
                ig.game.spawnEntity(EntityPick, this.pos.x, this.pos.y,
                                {flip:settings.flip, yVel: yVelocity, xDist: 100});
                yVelocity += 32;
            }
       }
    });

    EntityPick = ig.Entity.extend({
        size: {x: 4, y: 4},
        animSheet: new ig.AnimationSheet( 'media/pick.png', 4, 4),
        maxVel: {x: 200, y: 20},
        flip: false,
        startPosition: null,
        xDistanceTraveled: 0,
        maxXDistance: 200,
        gravityFactor: 0,

        //For multiple picks:
        yVelo: 0,
        xDistance: 0,

        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,

        init: function( x, y, settings ) {
            this.startPosition = {x: x + (settings.flip ? -4 : 8),y: y+10};
            this.parent(this.startPosition.x, this.startPosition.y, settings);

            this.maxXDistance = settings.xDist;

            this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);

            this.yVelo = settings.yVel;
            this.vel.y = this.accel.y = this.yVelo;

            this.flip = settings.flip;

            var frameID = Math.round(Math.random()*2);
            this.addAnim('idle', 0.2, [frameID]);
        },

        update: function() {

            this.vel.y = this.accel.y = this.yVelo;

            //Kill pick once it has traveled a distance of 200
            this.xDistanceTraveled = this.flip ? (this.startPosition.x - this.pos.x) :
                                                 (this.pos.x - this.startPosition.x);
            if (this.xDistanceTraveled > this.maxXDistance) {
                this.kill();
            }

            this.currentAnim.flip.x = this.flip;

            this.parent();
        },

        check: function( other ) {

            if( other && other instanceof EntityEvilMan ) {
                other.receiveDamage(2);
            } else {
                //MUSIC NOTE:
                if (other.health <= 5) {
                    ig.game.stats.score += 20;
                }
                other.receiveDamage( 5, this );

            }

            this.kill();

        },

        handleMovementTrace: function( res ) {
            this.parent( res );
            if( res.collision.x || res.collision.y ){
                this.kill();
            }
        }
    });

    EntityGuitarSlamHitBox = ig.Entity.extend({
        gravityFactor: 0,

        // animSheet: new ig.AnimationSheet('media/hitbox.png', 35, 25),
        // _wmDrawBox: true,
        // _wmBoxColor: 'orange',

        size: {x: 35, y: 25},

        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // this.addAnim('idle', 1, [0]);
        },

        check: function(other) {
            if( other && other instanceof EntityEvilMan ) {
                other.receiveDamage(0.75);
            } else {
                //MUSIC NOTE
                ig.game.stats.score += 20;
                other.kill();
            }
        }
    });

    EntityDeathExplosion = ig.Entity.extend({
        lifetime: 1,
        callBack: null,
        particles: 25,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            for (var i = 0; i < this.particles; i++)
                ig.game.spawnEntity(EntityDeathExplosionParticle, x, y,
                    {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
            this.idleTimer = new ig.Timer();
        },
        update: function () {
            if (this.idleTimer.delta() > this.lifetime) {
                this.kill();
                if (this.callBack)
                    this.callBack();
                return;
            }
        }
    });

    EntityDeathExplosionParticle = ig.Entity.extend({
        size: {x: 2, y: 2},
        maxVel: {x: 160, y: 200},
        lifetime: 2,
        fadetime: 1,
        bounciness: 0,
        vel: {x: 100, y: 30},
        friction: {x:100, y: 0},
        collides: ig.Entity.COLLIDES.LITE,
        colorOffset: 0,
        totalColors: 7,
        animSheet: new ig.AnimationSheet( 'media/blood.png', 2, 2 ),
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            // var frameID = Math.round(Math.random()*this.totalColors) +
            //     (this.colorOffset * (this.totalColors+1));
            var frameID = Math.round(Math.random()*7);
            this.addAnim( 'idle', 0.2, [frameID] );
            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
        },
        update: function() {
            if( this.idleTimer.delta() > this.lifetime ) {
                this.kill();
                return; }
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime,
                1, 0
            );
            this.parent();
        }
    });
});