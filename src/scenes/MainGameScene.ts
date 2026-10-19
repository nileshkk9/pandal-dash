import Phaser from 'phaser';

export class MainGameScene extends Phaser.Scene {
    constructor() {
        super('MainGameScene');
    }

    preload() {}

    create() {
        this.add.text(400, 300, 'Welcome to Pandal Dash!', { fontSize: '48px', color: '#ffcc00' }).setOrigin(0.5);
        this.add.text(400, 360, 'The engine is ready.', { fontSize: '24px', color: '#fff' }).setOrigin(0.5);
    }

    update() {}
}
