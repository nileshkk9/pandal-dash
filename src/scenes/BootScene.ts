import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.add.text(400, 300, 'Loading Pandal Dash...', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    }

    create() {
        // Simulate a brief loading time
        this.time.delayedCall(2000, () => {
            this.scene.start('MainGameScene');
        });
    }
}
