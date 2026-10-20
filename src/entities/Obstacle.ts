import Phaser from 'phaser';

export interface ObstacleConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    width: number;
    height: number;
    color: number;
}

export class Obstacle {
    private scene: Phaser.Scene;
    private body: any;
    private sprite: Phaser.GameObjects.Rectangle;

    constructor(config: ObstacleConfig) {
        this.scene = config.scene;

        // 1. Create the Matter body
        this.body = this.scene.matter.add.rectangle(config.x, config.y, config.width, config.height);
        this.body.setStatic(true); // Obstacles don't move

        // 2. Create a visual placeholder
        this.sprite = this.scene.add.rectangle(config.x, config.y, config.width, config.height, config.color);
    }

    public getSprite() {
        return this.sprite;
    }
}
