class TitleScreen extends Phaser.Scene {
	constructor() {
		super({ key: "TitleScreen" });
	}

	//preload the assets
	preload() {
		this.load.image("deepWater_spr", "content/deepWater_spr.png");
		this.load.image("shallowWater_spr", "content/shallowWater_spr.png");
		this.load.image("sand_spr", "content/sand_spr.png");
		this.load.image("lowLand_spr", "content/lowLand_spr.png");
		this.load.image("highLand_spr", "content/highLand_spr.png");
		this.load.image("lowMtn_spr", "content/lowMtn_spr.png");
		this.load.image("highMtn_spr", "content/highMtn_spr.png");
		this.load.image("logo_spr", "content/logo2.png");
	}

	create() {
		/* this.anims.create({
			key: "deepWater_spr",
			frames: this.anims.generateFrameNumbers("deepWater_spr"),
			frameRate: 4,
			repeat: -1
		}); */

		this.background = this.add.tileSprite(0, 0, game.scale.width, game.scale.height, "deepWater_spr").setOrigin(0);
		this.background.setScrollFactor(0);

		this.logo = this.add.image(0, 0,'logo_spr');
		this.logo.setScrollFactor(0);

		this.chunkSize = 16;
		this.tileSize = 16;
		this.cameraSpeed = 1;
		this.renderRadius = 4;

		this.cameras.main.setZoom(1);
		this.followPoint = new Phaser.Math.Vector2(
			this.cameras.main.worldView.x + (this.cameras.main.worldView.width * 0.5),
			this.cameras.main.worldView.y + (this.cameras.main.worldView.height * 0.5)
		);

		this.chunks = [];

		this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

		//start the game
		this.input.on('pointerdown', () => this.scene.start('MainGame'));
		this.input.keyboard.on('keydown-SPACE', () => this.scene.start('MainGame'));
	}

	getChunk(x, y) {
		let chunk = null;
		for (var i = 0; i < this.chunks.length; i++) {
			if (this.chunks[i].x == x && this.chunks[i].y == y) {
				chunk = this.chunks[i];
			}
		}
		return chunk;
	}

	update() {
		let snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.x / (this.chunkSize * this.tileSize));
		let snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.y / (this.chunkSize * this.tileSize));

		snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
		snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;

		for (let x = snappedChunkX - this.renderRadius; x < snappedChunkX + this.renderRadius; x++) {
			for (let y = snappedChunkY - this.renderRadius; y < snappedChunkY + this.renderRadius; y++) {
				let existingChunk = this.getChunk(x, y);

				if (existingChunk == null) {
					let newChunk = new Chunk(this, x, y);
					this.chunks.push(newChunk);
				}
			}
		}

		for (let i = 0; i < this.chunks.length; i++) {
			let chunk = this.chunks[i];

			if (Phaser.Math.Distance.Between(
				snappedChunkX,
				snappedChunkY,
				chunk.x,
				chunk.y
			) < 3) {
				if (chunk !== null) {
					chunk.load();
				}
			}
			else {
				if (chunk !== null) {
					chunk.unload();
				}
			}
		}

		//this section controls the scrolling of the map (with or without input)
		if (this.keyW.isDown) {
			this.followPoint.y -= this.cameraSpeed;
			this.background.tilePositionY -= this.cameraSpeed / 2;
		} 
		else if (this.keyS.isDown) {
			this.followPoint.y += this.cameraSpeed;
			this.background.tilePositionY += this.cameraSpeed / 2;
		} 
		else {
			this.followPoint.y -= this.cameraSpeed / 2;
			this.background.tilePositionY -= this.cameraSpeed / 8;
		}

		if (this.keyA.isDown) {
			this.followPoint.x -= this.cameraSpeed;
			this.background.tilePositionX -= this.cameraSpeed / 2;
		} 
		else if (this.keyD.isDown) {
			this.followPoint.x += this.cameraSpeed;
			this.background.tilePositionX += this.cameraSpeed / 2;
		} 
		else {
			this.followPoint.x -= this.cameraSpeed / 2;
			this.background.tilePositionX -= this.cameraSpeed / 8;
		}

		this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
	}
}
