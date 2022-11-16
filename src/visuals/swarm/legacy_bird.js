
// CONST -------------------------------------------------------------------------------------------

const WORLD = {
	BIRD_COUNT: 50,
	CLOSE_TO_POINT_DISTANCE: 40,
	LEADER_POINT_BOUNDS: 140,
	CLOSE_TO_EDGE_BOUNDS: 40
}

const BIRD = {
	// SHAPE
	HEIGHT_MAX: 20,
	ANGLE: -.25,
	// SPEED
	BEZIER_DISTANCE: 40,
	VELOCITY_MAX: 4,
	ANGULAR_VELOCITY_MIN: .08, // .04,
	ANGULAR_VELOCITY_MAX: .28, // .1,
	// BRAIN
	CHANGE_MIND_TIMEOUT_MIN: 800,
	CHANGE_MIND_TIMEOUT_MAX: 8000,
	CHANGE_FROM_IS_FOLLOWING_LIKELIHOOD: .2,
	CHANGE_FROM_NOT_FOLLOWING_LIKELIHOOD: .8,
	CHANGE_LEADER_LIKELIHOOD: .2
}

// WORLD -------------------------------------------------------------------------------------------

class World {
	constructor(ctx, width, height) {
		this.ctx = ctx;
		this.W = width;
		this.H = height;
		this.D = (width + height) / 2; // this is the 3d part of this that doesn't work
		this.birds = [];
		this.max = distance({ x: this.W, y: this.H, z: this.D }, { x: 0, y: 0, z: 0 });
	}

	// INIT

	init() {
		this.initLeaderBounds();
		this.drawBackground();
		this.initBirds();
		this.drawBirds();
	}

	initBirds() {
		for (var i = 0; i < WORLD.BIRD_COUNT; i++) {
			this.birds.push(new Bird(this, this.ctx, i));
		}
	}

	initLeaderBounds() {
		this.leaderMaxX = this.W - WORLD.LEADER_POINT_BOUNDS;
		this.leaderMaxY = this.H - WORLD.LEADER_POINT_BOUNDS;
		this.leaderMaxZ = this.D - WORLD.LEADER_POINT_BOUNDS;
	}

	// ANIMATE

	run() {
		const world = this;

		for (let i = WORLD.BIRD_COUNT - 1; i >= 0; i--) {
			this.birds[i].run(); // starts the bird brain
		}

		window.requestAnimationFrame(this.animate.bind(this))
	}

	animate() {
		const world = this;
		this.drawBackground();
		this.drawBirds();
		window.requestAnimationFrame(this.animate.bind(this))
	}

	stop() {
		clearInterval(this.interval);
	}

	// DRAW

	drawBackground() {
		this.ctx.rect(0, 0, this.W, this.H);
		this.ctx.fillStyle = "#FFF"; // "#1c1c1c";
		this.ctx.fill();
	}

	drawPoint({ x, y }) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, WORLD.CLOSE_TO_POINT_DISTANCE, 0, Math.TWO_PI, false);
		this.ctx.fillStyle = '#0004';
		this.ctx.fill();
	}

	drawBirds() {
		const sortedBirds = _.sortBy(this.birds, function (b) {
			return -b.z;
		})
		// const sortedBirds = this.birds;
		for (let i = WORLD.BIRD_COUNT - 1; i >= 0; i--) {
			const bird = sortedBirds[i];
			bird.draw();
			bird.move();
		}
	}

	// HELPER

	getRandomCoords() {
		return {
			x: randomInt(0, this.W),
			y: randomInt(0, this.H),
			z: randomInt(0, this.D)
		};
	}

	getRandomLeaderCoords() {
		return {
			x: randomInt(WORLD.LEADER_POINT_BOUNDS, this.leaderMaxX),
			y: randomInt(WORLD.LEADER_POINT_BOUNDS, this.leaderMaxY),
			z: randomInt(WORLD.LEADER_POINT_BOUNDS, this.leaderMaxZ)
		}
	}

	isCloseToEdge({ x, y, z }) {
		return (
			x < 0 || x > this.W ||
			y < 0 || y > this.H ||
			z < 0 || z > this.D
		)
	}

	getBird(i) {
		return this.birds[i];
	}

	randomBird() {
		return randomInt(0, WORLD.BIRD_COUNT);
	}

	zScale(z) {
		return .5 * (z / this.D) + .5;
	}

	getMax() {
		return this.max;
	}
}

// BIRD --------------------------------------------------------------------------------------------

// rather than globally set leaders, birds should pick thier own points to go to
// birds pick leaders in the area around them or points to go to
// when that point or leader expires birds pick a new point or leader
// if a bird gets too close to the edge it should "panic" and go back towards the center (choose a new point)
// if a bird gets to a point before it expires it should go to another point

class Bird {
	constructor(world, ctx, i) {
		this.i = i;
		this.ctx = ctx;
		this.world = world;

		const { x, y, z } = this.world.getRandomCoords();
		this.aXY = randomDec(-Math.PI, Math.PI);
		this.aZ = randomDec(-Math.PI, Math.PI);
		this.x = x;
		this.y = y;
		this.z = z;
		this.v = BIRD.VELOCITY_MAX;
		this.va = randomDec(BIRD.ANGULAR_VELOCITY_MIN, BIRD.ANGULAR_VELOCITY_MAX);

		// this.color = randomColor();

		this.isFollowing = randomOdds(BIRD.CHANGE_FROM_NOT_FOLLOWING_LIKELIHOOD);
		this.leader = this.world.randomBird();
		this.to = this.world.getRandomLeaderCoords();
	}

	run() {
		const bird = this;
		setTimeout(function () {
			bird.changeTo();
		}, randomInt(BIRD.CHANGE_MIND_TIMEOUT_MIN, BIRD.CHANGE_MIND_TIMEOUT_MAX));
	}


	// BRAIN: if they see someone follow them, if they see nobody then go back towards
	// average of the whole group
	changeTo() {
		if (this.isFollowing) {
			// if following someone but might change to not following someone
			if (randomOdds(BIRD.CHANGE_FROM_IS_FOLLOWING_LIKELIHOOD)) {
				this.isFollowing = false;
				this.to = this.world.getRandomLeaderCoords();
				this.va = randomDec(BIRD.ANGULAR_VELOCITY_MIN, BIRD.ANGULAR_VELOCITY_MAX)
			}
			// if follwoing someone but might switch leader
			else if (randomOdds(BIRD.CHANGE_LEADER_LIKELIHOOD)) {
				this.leader = this.world.randomBird();
			}
		}

		// if not following someone but might switch to leader
		else if (randomOdds(BIRD.CHANGE_FROM_NOT_FOLLOWING_LIKELIHOOD)) {
			this.isFollowing = true;
			this.leader = this.world.randomBird();
		}
		this.run();
	}

	isCloseToEdge() {
		const { x, y, z } = this;
		return this.world.isCloseToEdge({ x, y, z });
	}

	isCloseToPoint() {
		return distance(this, this.to) < WORLD.CLOSE_TO_POINT_DISTANCE;
	}

	chooseNewPoint() {
		this.isFollowing = false;
		this.to = this.world.getRandomLeaderCoords();
		this.va = randomDec(BIRD.ANGULAR_VELOCITY_MIN, BIRD.ANGULAR_VELOCITY_MAX)
	}

	getTo() {
		if (this.isFollowing) {
			return this.world.getBird(this.leader).getButt();
		}
		// if not following someone
		if (this.isCloseToPoint() || this.isCloseToEdge()) {
			this.chooseNewPoint();
		}
		return this.to;
	}

	getAngleTo(to) {
		const dx = this.x - to.x, dy = this.y - to.y, dz = this.z - to.z;
		return { 
      aXY: -1.0 * Math.atan2(dx, dy) + Math.HALF_PI, 
      // aZ: -1.0 * Math.atan2(dx, dz) 
    };
	}

	getDeltaAngle(to) {
		const { aXY, aZ } = this.getAngleTo(to);
		return { 
      daXY: this.va * (this.aXY - aXY) / 4, 
      // daZ: this.va * (this.aZ - aZ) / 4 
    };
	}

	move() {
		const to = this.getTo();

		const { daXY, daZ } = this.getDeltaAngle(to);
		this.aXY = this.aXY - daXY;
		// this.aZ = this.aZ - daZ;

		const vx = Math.cos(this.aXY) * this.v;
		const vy = Math.sin(this.aXY) * this.v;
		// const vz = Math.cos(this.aZ) * this.v;

		this.x = this.x - vx;
		this.y = this.y - vy;
		// this.z = this.z - vz;
	}

	draw() {
		const height = BIRD.HEIGHT_MAX * this.world.zScale(this.z);
		this.ctx.beginPath();
		this.ctx.moveTo(this.x, this.y);
		this.ctx.lineTo(this.x + Math.cos(this.aXY - BIRD.ANGLE) * height, this.y + Math.sin(this.aXY - BIRD.ANGLE) * height);
		this.ctx.lineTo(this.x + Math.cos(this.aXY + BIRD.ANGLE) * height, this.y + Math.sin(this.aXY + BIRD.ANGLE) * height);
		this.ctx.fillStyle = this.getColor();
		this.ctx.fill();
    this.ctx.closePath();
    

    const to = this.getTo();
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.strokeStyle = this.getColor() + "4";
    this.ctx.stroke();
		
	}

	getButt() {
		return {
			x: this.x + Math.cos(this.aXY) * BIRD.HEIGHT_MAX,
			y: this.y + Math.sin(this.aXY) * BIRD.HEIGHT_MAX,
			z: this.z
		}
	}

	getColor() {
		if (this.isFollowing) {
			return '#00F';
		}
		return '#F00';
		// return `rgba(0, 0, 0, ${this.world.zScale(this.z)})`;
	}
}

// MAIN --------------------------------------------------------------------------------------------

window.onload = function () {

	const canvas = document.getElementById("pix");
	const ctx = canvas.getContext("2d");

	const W = window.innerWidth, H = window.innerHeight;
	canvas.width = W;
	canvas.height = H;

	const world = new World(ctx, W, H);
	world.init();
	world.run();
}
