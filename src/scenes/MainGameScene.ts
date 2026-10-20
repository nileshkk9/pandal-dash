import Phaser from 'phaser';
import { Vehicle } from '../entities/Vehicle';
import { Obstacle } from '../entities/Obstacle';

export interface ObstacleConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    width: number;
    height: number;
    color: number;
}

export class MainGameScene extends Phaser.Scene {
    private vehicle: Vehicle | null = null;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    private spaceKey: Phaser.Input.Keyboard.Key | null = null;
    
    private obstacles: Obstacle[] = [];
    private scoreText: Phaser.GameObjects.Text | null = null;
    private lapText: Phaser.GameObjects.Text | null = null;
    private score: number = 0;
    private laps: number = 0;

    constructor() {
        super('MainGameScene');
    }

    preload() {
        // In a real scenario, we would load assets here.
    }

    create() {
        // 1. Setup World
        this.matter.world.setBounds(0, 0, 2000, 2000);

        // 2. Setup Inputs
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // 3. Initialize Vehicle
        this.vehicle = new Vehicle({
            scene: this,
            x: 400,
            y: 400,
            width: 40,
            height: 20
        });

        // 4. Create Obstacles (Festive Pandal/Street items)
        this.createLevel();

        // 5. Setup UI
        this.setupUI();

        // 6. Camera Setup
        this.cameras.main.setBounds(0, 0, 2000, 2000);
        this.cameras.main.startFollow(this.vehicle.getBody().gameObject as any, true, 0.1, 0.1);
    }

    private createLevel() {
        // Creating dummy "Pandals" and street obstacles with scene context
        const obstacleData = [
            { x: 600, y: 400, width: 100, height: 100, color: 0xff00ff }, // Pink Pandal
            { x: 800, y: 200, width: 80, height: 200, color: 0x00ff00 },  // Green Obstacle
            { x: 200, y: 800, width: 300, height: 50, color: 0xffff00 },  // Yellow Barrier
            { x: 1200, y: 1000, width: 150, height: 150, color: 0x0000ff }, // Blue Pandal
            { x: 1500, y: 500, width: 40, height: 40, color: 0xffffff },  // White Phuchka Stand
        ];

        obstacleData.forEach(data => {
            const obs = new Obstacle({
                scene: this,
                x: data.x,
                y: data.y,
                width: data.width,
                height: data.height,
                color: data.color
            });
            this.obstacles.push(obs);
        });
    }

    private setupUI() {
        this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '24px', color: '#ffffff' }).setScrollFactor(0);
        this.lapText = this.add.text(10, 40, 'Laps: 0', { fontSize: '24px', color: '#ffffff' }).setScrollFactor(0);
    }

    update() {
        if (this.vehicle && this.cursors) {
            const input = {
                up: this.cursors.up.isDown,
                down: this.cursors.down.isDown,
                left: this.cursors.left.isDown,
                right: this.cursors.right.isDown,
                drift: this.spaceKey ? this.spaceKey.isDown : false
            };

            this.vehicle.update(input);

            // Update score based on speed (simulating driving progress)
            const velocity = this.vehicle.getBody().velocity;
            const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
            
            if (speed > 2) {
                this.score += Math.floor(speed);
                if (this.scoreText) this.scoreText.setText(`Score: ${this.score}`);
            }
            
            // Placeholder for lap logic (e.g., if crosses a certain X coordinate)
            // For now just incrementing very slowly to show it's there
            if (this.vehicle.getBody().position.x > 1900) {
                this.laps++;
                this.vehicle.getBody().position.x = 100; // Reset position
                if (this.lapText) this.lapText.setText(`Laps: ${this.laps}`);
            }
        }
    }
}
