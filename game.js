function Game(ship, scoreboard) {
	this.debug = false;
  
	this.ship = ship;
	this.scoreBoard = scoreboard;
  
	this.reset = function() {
	  this.gameActive = false;
	  this.scoreBoard.reset();
	  this.meteors = [];
	  this.projectiles = [];
  
	  this.meteorsDensity = 0.985;
	  this.meteorsDensityInc = 0.0001;
  
	  this.meteorsMinSpeed = 0.25;
	  this.meteorsMinSpeedInc = 0.0001;
  
	  this.meteorsMaxSpeed = 1;
	  this.meteorsMaxSpeedInc = 0.0001;
  
	  this.meteorsMinSize = 100;
	  this.meteorsMaxSize = 125;
	}
  
	this.isActive = function() {
	  return this.gameActive;
	}
  
	this.start = function() {
	  this.gameActive = true;
	  
	}
  
	this.showWelcomeScreen = function() {
	  background(255);
	  textFont("Courier New");
	  fill(0);
	  noStroke();
	  textAlign(CENTER);
	  welcome_msg = "Learn By Playing...";
	  textSize(random(65, 68));
	  text(welcome_msg, width / 2, height / 2);
	  action_msg = "Click to start, click to play.";
	  textSize(25);
	  text(action_msg, width / 2, height / 4);
	  score_msg = "Your previous score was " + scoreBoard.score + ".";
	  textSize(25);
	  text(score_msg, width / 2, height / 4 * 3);
	  credits_msg = "team - 51";
	  textSize();
	  text(credits_msg, width / 2, height / 4 * 3.75);
	}
  
	this.createNewMeteor = function() {
		if (random() > this.meteorsDensity && this.meteors.length < 5) {
			// Pick random color, speed, size, and horizontal position
			var col = color(random(255), random(255), random(255), 50);
			var speed = random(this.meteorsMinSpeed, this.meteorsMaxSpeed);
			var size = random(this.meteorsMinSize, this.meteorsMaxSize);
			var x = random(0 + size / 2, width - size / 2);
			var y = -size / 2;
			var crazyness = random(0.5, 1.5);
		
			// Check for collision with existing meteors
			var overlapping = false;
			for (var i = 0; i < this.meteors.length; i++) {
			  var d = dist(x, y, this.meteors[i].x, this.meteors[i].y);
			  var minDist = (size + this.meteors[i].size) / 2;
			  if (d < minDist) {
				overlapping = true;
				break;
			  }
			}
		
			// Create a new meteor only if there is no overlap
			if (!overlapping && this.meteors.length < 3) {
			  this.meteors.push(new Bubble(x, y, size, speed, col, crazyness, "hello"));
			}
		  }
	};
  
	this.updateAndDisplayMeteors = function() {
	  for (var i = this.meteors.length - 1; i >= 0; i--) {
		this.meteors[i].move();
		this.meteors[i].display();
	  }
	};
  
	this.updateAndDisplayProjectiles = function() {
	  for (var i = this.projectiles.length - 1; i >= 0; i--) {
		this.projectiles[i].move();
		this.projectiles[i].display();
	  }
	};
  
	this.updateAndDisplayShip = function() {
	  this.ship.updatePosition();
	  this.ship.display();
	};
  
	this.displayScoreboard = function() {
	  this.scoreBoard.display();
	};
  
	this.shoot = function() {
	  this.projectiles.push(this.ship.shoot());
	}
  
	this.stopIfMeteorHitGround = function() {
	  // iterate through all the meteors
	  for (var i = this.meteors.length - 1; i >= 0; i--) {
		// when a meteor hits the ground, it's game over
		if (this.meteors[i].y > height) {
		  this.gameActive = false;
		}
	  }
	};
  
	this.removeLostProjectiles = function() {
	  // iterate through all the projectiles
	  for (var i = this.projectiles.length - 1; i >= 0; i--) {
		// if a projectile passes the screen top, it's lost (can delete it)
		if (this.projectiles[i].y < 0)
		  this.projectiles.splice(i, 1);
	  }
	};
  
	this.detectSuccessfullShots = function() {
	  // iterate through all the meteors
	  for (var i = this.meteors.length - 1; i >= 0; i--) {
		// for each meteor, now consider all projectiles
		for (var j = this.projectiles.length - 1; j >= 0; j--) {
		  // is there a hit?
		  if (this.meteors[i].intersects(this.projectiles[j])) {
			// destroy both projectile and meteor
			this.meteors[i].destroy();
			this.projectiles[j].destroy();
			// increment score! 
			this.scoreBoard.incrementScore();
			// increment game difficulty! :)
			this.meteorsMinSpeed += this.meteorsMinSpeedInc;
			this.meteorsMaxSpeed += this.meteorsMaxSpeedInc;
			this.meteorsDensity -= this.meteorsDensityInc;
		  }
		}
	  }
	};
  
	this.removeKilledMeteors = function() {
	  // remove meteors scheduled for removal
	  for (var i = this.meteors.length - 1; i >= 0; i--) {
		if (!this.meteors[i].alive)
		  this.meteors.splice(i, 1);
	  }
	};
  
	this.removeUsedProjectiles = function() {
	  for (var i = this.projectiles.length - 1; i >= 0; i--) {
		if (!this.projectiles[i].alive)
		  this.projectiles.splice(i, 1);
	  }
	};
  
	this.setDebug = function(v) {
	  this.debug = v;
	}
  
	this.showDebugInfo = function() {
	  if (this.debug == true) {
		print("# meteors: " + this.meteors.length);
		print("# projectiles: " + this.projectiles.length);
	  }
	}
  }
  