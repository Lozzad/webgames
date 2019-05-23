class Chunk {
	constructor(scene, x, y) {
		this.scene = scene;
		this.x = x;
		this.y = y;
		this.tiles = this.scene.add.group();
		this.isLoaded = false;
	}

	unload() {
		if (this.isLoaded) {
			this.tiles.clear(true, true);

			this.isLoaded = false;
		}
	}

	load() {
		if (!this.isLoaded) {
			for (var y = 0; y < this.scene.chunkSize; y++) {
				for (var x = 0; x < this.scene.chunkSize; x++) {


					var tileX = (this.x * (this.scene.chunkSize * this.scene.tileSize)) + (x * this.scene.tileSize);
					var tileY = (this.y * (this.scene.chunkSize * this.scene.tileSize)) + (y * this.scene.tileSize);

					var perlinValue = noise.perlin2(tileX / 100, tileY / 100);

					var key = "";
					var animationKey = "";

					if (perlinValue < 0.03) {
						//key = "deepWater_spr";
					}
					else if (perlinValue >= 0.03 && perlinValue < 0.06) {
						key = "shallowWater_spr";
					}
					else if (perlinValue >= 0.06 && perlinValue < 0.09) {
						key = "sand_spr";
					}
					else if (perlinValue >= 0.09 && perlinValue < 0.145) {
						key = "lowLand_spr";
					}
					else if (perlinValue >= 0.145 && perlinValue < 0.4) {
						key = "highLand_spr";
					}
					else if (perlinValue >= 0.4 && perlinValue < 0.5) {
						key = "lowMtn_spr";
					}
					else if (perlinValue >= 0.5) {
						key = "highMtn_spr";
					}

					if (key !== "") {
						var tile = new Tile(this.scene, tileX, tileY, key);

						if (animationKey !== "") {
							tile.play(animationKey);
						}

						this.tiles.add(tile);
					}
				}
			}

			this.isLoaded = true;
		}
	}
}

class Tile extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, key) {
		super(scene, x, y, key);
		this.scene = scene;
		this.scene.add.existing(this);
		this.setOrigin(0);
	}
}
