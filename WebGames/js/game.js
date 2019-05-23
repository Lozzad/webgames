var config = {
  type: Phaser.AUTO,
  width: 640,
  height: 640,
  backgroundColor: "black",
  physics: {
    default: "arcade",
    arcade: {
	  gravity: { x: 0, y: 0 },
	  debug: true
	}
  },
  scene: [
	TitleScreen,
	MainGame
  ],
  pixelArt: true,
  roundPixels: true,
  fps: 30,
  antialias: false
};

const game = new Phaser.Game(config);
