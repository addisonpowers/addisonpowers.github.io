ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.levels.level1',
	'game.levels.level2',
	'game.levels.level3',
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	gravity: 300,
	stopAddison: false,
	hasTalkedToStranger1: false,
	part1Completed: false,
	levelNum: 1,
	playerHealth: 0,
	playerMaxHealth: 100,
	lifeSprite: new ig.Image('media/lifeSprite.png'),
	healthSprite1: new ig.Image('media/healthSprite1.png'),
	healthSprite2: new ig.Image('media/healthSprite2.png'),
	pickSprite: new ig.Image('media/pickSprite.png'),
	picksSprite: new ig.Image('media/picksSprite.png'),

	statText: new ig.Font( 'media/04b03.font.png' ),
	showStats: false,
	statMatte: new ig.Image('media/statMatte.png'),
	levelTimer: new ig.Timer(),
	levelExit: null,
	stats: {time: 0, deaths: 0, score: 0},
	finalStats: {time: 0, deaths: 0, score: 0},

	weaponNum: 0,

	lives: 5,

	diplomaCollected: false,

	centerScreenLevel3: false,

	professorKilled: false,
	
	
	init: function() {

		//Bind keys
		ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind(ig.KEY.UP_ARROW, 'up');
		ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
		ig.input.bind(ig.KEY.SPACE, 'space');
		ig.input.bind(ig.KEY.C, 'guitarSlam');
		ig.input.bind(ig.KEY.V, 'shoot');
		ig.input.bind(ig.KEY.Q, 'switch');
		// ig.input.bind( ig.KEY.SPACE, 'continue' );

		//Load level
		this.levelNum = 1;
		this.loadLevel(LevelLevel1);

		// this.diplomaCollected = true;
		// this.levelNum = 2;
		// this.loadLevel(LevelLevel2);

		//Load level 2.5 right away:
		// this.levelNum = 2.5;
		// this.diplomaCollected = true;
		// this.loadLevel(LevelLevel1);

		//Load level 3 right away:
		// this.levelNum = 3;
		// this.loadLevel(LevelLevel3);

		// this.levelNum = 3.5;
		// this.loadLevel(LevelLevel1);

		// this.spawnEntity(EntityBarOfHealth, 30, 30);
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		// this.parent();

		if (!this.showStats) {
			this.parent();
		} else {
			if (ig.input.state('space')) {
				this.showStats = false;
				// this.levelExit.nextLevel();
				if (this.levelNum === 1) {
					ig.game.levelNum = 2;
					ig.game.loadLevelDeferred(LevelLevel2);
				} else if (this.levelNum === 2) {
					ig.game.levelNum = 2.5;
					ig.game.loadLevelDeferred(LevelLevel1);
				} else if (this.levelNum === 2.5) {
					ig.game.levelNum = 3;
					ig.game.loadLevelDeferred(LevelLevel3);
				} else if (this.levelNum === 3) {
					ig.game.levelNum = 3.5;
					ig.game.loadLevelDeferred(LevelLevel1);
				}
				this.parent();
			}
		}

	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();

		this.font.draw("Health", 25, 25);
		this.font.draw("Lives", 25, 50);

		this.font.draw("Score:", 25, 75);
		this.font.draw("" + ig.game.stats.score, 25, 85);

		for(var i=0; i < this.lives; i++)
			this.lifeSprite.draw(((this.lifeSprite.width + 2) * i)+25, 60);

		var j = 0;
		for (j = 0; j < Math.floor(this.playerHealth/10); j++) {
			this.healthSprite1.draw(((this.healthSprite1.width)*j)+25, 35);
		}
		for (var k = j; k < Math.floor(this.playerMaxHealth/10); k++) {
			this.healthSprite2.draw(((this.healthSprite2.width)*k)+25, 35);
		}


		if (ig.game.weaponNum == 0) {
			this.pickSprite.draw(25, 300);
		} else {
			this.picksSprite.draw(25, 300);
		}

		if(this.showStats){
			this.statMatte.draw(0,0);
			var x = ig.system.width/2;
			var y = ig.system.height/2 - 20;
			this.statText.draw('Level Complete', x, y, ig.Font.ALIGN.CENTER);
			this.statText.draw('Time: '+this.stats.time, x, y+30, ig.Font.ALIGN.CENTER);
			this.statText.draw('Score: '+this.stats.score, x, y+40, ig.Font.ALIGN.CENTER);
			this.statText.draw('Deaths: '+this.stats.deaths, x, y+50,
				ig.Font.ALIGN.CENTER);
			this. statText.draw('Press Spacebar to continue.', x, ig.system.height - 10,
				ig.Font.ALIGN.CENTER);
		}
	},

	loadLevel: function(data) {

		// if (this.levelNum === 2.5 || this.levelNum === 3.5) {
		this.finalStats.time += this.stats.time;
		this.finalStats.score += this.stats.score;
		this.finalStats.deaths += this.stats.deaths;
		// }

		this.stats = {time: 0, deaths: 0, score: 0};

		this.parent(data);
		this.levelTimer.reset();
	},

	toggleStats: function() {
		this.showStats = true;
		this.stats.time = Math.round(this.levelTimer.delta());
		// this.levelExit = levelExit;
	},

	// loadLevelDeferred: function(data) {
	// 	this.parent(data);
	// 	this.levelTimer.reset();
	// },

	gameOver: function() {
		this.finalStats.time += this.stats.time;
		this.finalStats.score += this.stats.score;
		this.finalStats.deaths += this.stats.deaths;

		ig.finalStats = ig.game.finalStats;
		ig.system.setGame(GameOverScreen);
	},

	winner: function() {
		ig.finalStats = ig.game.finalStats;
		ig.system.setGame(WinnerScreen);
	}
});

StartScreen = ig.Game.extend({
	instructText: new ig.Font('media/04b03.font.png'),
	background: new ig.Image('media/startScreen.png'),
	init: function () {
		ig.input.bind(ig.KEY.SPACE, 'start');
	},
	update: function () {
		if (ig.input.pressed('start')) {
			ig.system.setGame(MyGame)
		}
		this.parent();
	},
	draw: function () {
		this.parent();
		this.background.draw(0, 0);
		var x = ig.system.width / 2,
			y = ig.system.height - 10;
		this.instructText.draw('Press Spacebar To Start', x, y,
			ig.Font.ALIGN.CENTER);
	}
});

GameOverScreen = ig.Game.extend({
	instructText: new ig.Font('media/04b03.font.png'),
	// background: new ig.Image('media/screen-bg.png'),
	gameOver: new ig.Image('media/gameOver.png'),
	stats: {},
	init: function () {
		ig.input.bind(ig.KEY.SPACE, 'start');
		this.stats = ig.finalStats;
	},
	update: function () {
		if (ig.input.pressed('start')) {
			ig.system.setGame(StartScreen)
		}
		this.parent();
	},

	draw: function () {
		this.parent();
		// this.background.draw(0, 0);
		var x = ig.system.width / 2;
		var y = ig.system.height / 2 - 20;
		this.gameOver.draw(0, 0);

		// var score = (this.stats.kills * 100) - (this.stats.deaths * 50);
		// this.instructText.draw('Total Kills: ' + this.stats.kills, x, y + 30,
		// 	ig.Font.ALIGN.CENTER);
		// this.instructText.draw('Total Deaths: ' + this.stats.deaths, x, y + 40,
		// 	ig.Font.ALIGN.CENTER);
		// this.instructText.draw('Score: ' + score, x, y + 50, ig.Font.ALIGN.CENTER);

		this.instructText.draw('Total Time: '+this.stats.time, x, y + 30,
			ig.Font.ALIGN.CENTER);
		this.instructText.draw('Total Score: '+this.stats.score, x, y + 40,
			ig.Font.ALIGN.CENTER);
		this.instructText.draw('Total Deaths: '+this.stats.deaths, x, y + 50, ig.Font.ALIGN.CENTER);
		this.instructText.draw('Press Spacebar To Continue.', x,
			ig.system.height - 10, ig.Font.ALIGN.CENTER);
	}
});


WinnerScreen = ig.Game.extend({
	instructText: new ig.Font('media/04b03.font.png'),
	// background: new ig.Image('media/screen-bg.png'),
	winner: new ig.Image('media/winner.png'),
	stats: {},
	init: function () {
		ig.input.bind(ig.KEY.SPACE, 'start');
		this.stats = ig.finalStats;
	},
	update: function () {
		if (ig.input.pressed('start')) {
			ig.system.setGame(StartScreen)
		}
		this.parent();
	},

	draw: function () {
		this.parent();
		// this.background.draw(0, 0);
		var x = ig.system.width / 2;
		var y = ig.system.height / 2 - 20;
		this.winner.draw(0, 0);

		// var score = (this.stats.kills * 100) - (this.stats.deaths * 50);
		// this.instructText.draw('Total Kills: ' + this.stats.kills, x, y + 30,
		// 	ig.Font.ALIGN.CENTER);
		// this.instructText.draw('Total Deaths: ' + this.stats.deaths, x, y + 40,
		// 	ig.Font.ALIGN.CENTER);
		// this.instructText.draw('Score: ' + score, x, y + 50, ig.Font.ALIGN.CENTER);

		this.instructText.draw('Total Time: '+this.stats.time, x, y + 30,
			ig.Font.ALIGN.CENTER);
		this.instructText.draw('Total Score: '+this.stats.score, x, y + 40,
			ig.Font.ALIGN.CENTER);
		this.instructText.draw('Total Deaths: '+this.stats.deaths, x, y + 50, ig.Font.ALIGN.CENTER);
		this.instructText.draw('Press Spacebar To Continue.', x,
			ig.system.height - 10, ig.Font.ALIGN.CENTER);
	}
});


// Start the Game with 60fps, a resolution of _, scaled
// up by a factor of 2
// ig.main( '#canvas', MyGame, 60, 650, 350, 2 );
	ig.main('#canvas', StartScreen, 60, 650, 350, 2);

});
