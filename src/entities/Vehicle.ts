import Phaser from 'phaser';

export interface VehicleConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    width: number;
    height: number;
}

export class Vehicle {
    private scene: Phaser.Scene;
    private body: any;
    private sprite: Phaser.GameObjects.Rectangle;
    
    private acceleration: number = 0.002; 
    private rotationSpeed: number = 0.05;

    constructor(config: VehicleConfig) {
        this.scene = config.scene;

        // 1. Create the Matter body
        this.body = this.scene.matter.add.rectangle(config.x, config.y, config.width, config.height);
        this.body.setFrictionAir(0.05);
        this.body.setAngularDamping(0.1);

        // 2. Create a visual placeholder
        this.sprite = this.scene.add.rectangle(config.x, config.y, config.width, config.height, 0xff0000);
        
        // Link sprite to body for rendering
        this.scene.events.on('update', this.updateBody, this);
    }

    private updateBody = () => {
        // Sync sprite position/rotation with physics body
        this.sprite.x = this.body.position.x;
        this.sprite.y = this.body.position.y;
        this.sprite.rotation = this.body.angle;
    };

    public update(input: { up: boolean, down: boolean, left: boolean, right: boolean, drift: boolean }) {
        const { up, down, left, right, drift } = input;

        // Basic Movement Logic
        let forceX = 0;
        let forceY = 0;

        // Calculate direction based on current rotation
        if (up) {
            forceX = Math.cos(this.body.angle) * this.acceleration;
            forceY = Math.sin(this.body.angle) * this.acceleration;
        } else if (down) {
            forceX = -Math.cos(this.body.angle) * this.acceleration;
            forceY = -Math.sin(this.body.angle) * this.acceleration;
        }

        // Apply forces
        this.body.applyForce({ x: forceX, y: forceY });

        // Steering
        let turnSpeed = this.rotationSpeed;
        if (drift) {
            turnSpeed *= 1.5; // Faster turning when drifting
        }

        if (left) {
            this.body.angularVelocity = -turnSpeed;
        } else if (right) {
            this.body.angularVelocity = turnSpeed;
        } else {
            this.body.angularVelocity *= 0.9; // Dampen rotation
        }
    }

    public getBody() {
        return this.body;
    }
}
