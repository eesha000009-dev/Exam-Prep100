class PhysicsExperiments {
    constructor(game) {
        this.game = game;
        this.currentExperiment = null;
        this.experiments = {
            projectileMotion: this.setupProjectileMotion.bind(this),
            simpleHarmonic: this.setupSimpleHarmonic.bind(this),
            electricity: this.setupElectricity.bind(this),
            waves: this.setupWaves.bind(this),
            thermodynamics: this.setupThermodynamics.bind(this)
        };
    }

    setupProjectileMotion() {
        // Clear existing objects
        this.game.clearExperimentObjects();

        // Create launcher
        const launcher = this.game.createPhysicsObject({
            x: -10,
            y: 1,
            z: 0
        }, {
            width: 1,
            height: 0.5,
            depth: 0.5
        }, 0x4444ff);

        // Add UI controls
        const controls = {
            angle: 45,
            velocity: 10,
            height: 1
        };

        this.game.addExperimentControls([
            {
                type: 'slider',
                label: 'Angle (degrees)',
                min: 0,
                max: 90,
                value: controls.angle,
                onChange: (value) => {
                    controls.angle = value;
                    launcher.mesh.rotation.z = value * Math.PI / 180;
                }
            },
            {
                type: 'slider',
                label: 'Initial Velocity (m/s)',
                min: 1,
                max: 20,
                value: controls.velocity,
                onChange: (value) => controls.velocity = value
            },
            {
                type: 'button',
                label: 'Launch',
                onClick: () => {
                    const projectile = this.game.createPhysicsObject({
                        x: launcher.mesh.position.x,
                        y: launcher.mesh.position.y,
                        z: launcher.mesh.position.z
                    }, { radius: 0.2 }, 0xff0000);

                    const angle = controls.angle * Math.PI / 180;
                    const velocity = controls.velocity;

                    projectile.body.velocity.set(
                        velocity * Math.cos(angle),
                        velocity * Math.sin(angle),
                        0
                    );

                    // Track trajectory
                    const trajectory = [];
                    const trackerInterval = setInterval(() => {
                        if (projectile.mesh.position.y <= 0) {
                            clearInterval(trackerInterval);
                            this.drawTrajectory(trajectory);
                        }
                        trajectory.push(projectile.mesh.position.clone());
                    }, 50);
                }
            }
        ]);
    }

    setupSimpleHarmonic() {
        // Create pendulum
        const pivot = new THREE.Vector3(0, 5, 0);
        const bob = this.game.createPhysicsObject({
            x: 2,
            y: 3,
            z: 0
        }, { radius: 0.3 }, 0xff0000);

        // Add constraint
        const constraint = new CANNON.PointToPointConstraint(
            bob.body,
            new CANNON.Vec3(0, 0, 0),
            this.game.world.bodies[0], // ground body
            new CANNON.Vec3(pivot.x, pivot.y, pivot.z)
        );
        this.game.world.addConstraint(constraint);

        // Draw string
        const string = new THREE.Line(
            new THREE.BufferGeometry(),
            new THREE.LineBasicMaterial({ color: 0xffffff })
        );
        this.game.scene.add(string);

        // Update string position
        this.game.addUpdateCallback(() => {
            const points = [pivot, bob.mesh.position];
            string.geometry.setFromPoints(points);
        });

        // Add UI controls
        this.game.addExperimentControls([
            {
                type: 'button',
                label: 'Reset Position',
                onClick: () => {
                    bob.body.position.set(2, 3, 0);
                    bob.body.velocity.set(0, 0, 0);
                }
            },
            {
                type: 'button',
                label: 'Add Energy',
                onClick: () => {
                    bob.body.applyImpulse(
                        new CANNON.Vec3(5, 0, 0),
                        bob.body.position
                    );
                }
            }
        ]);
    }

    setupElectricity() {
        // Create circuit components
        const battery = this.createCircuitComponent('battery', { x: -2, y: 1, z: 0 });
        const resistor = this.createCircuitComponent('resistor', { x: 0, y: 1, z: 0 });
        const ammeter = this.createCircuitComponent('ammeter', { x: 2, y: 1, z: 0 });

        // Add UI controls for voltage and resistance
        this.game.addExperimentControls([
            {
                type: 'slider',
                label: 'Voltage (V)',
                min: 0,
                max: 12,
                value: 6,
                onChange: (value) => this.updateCircuit()
            },
            {
                type: 'slider',
                label: 'Resistance (Ω)',
                min: 1,
                max: 100,
                value: 10,
                onChange: (value) => this.updateCircuit()
            }
        ]);
    }

    setupWaves() {
        // Create wave medium
        const particles = [];
        const spacing = 0.2;
        const width = 20;

        for (let x = -width/2; x <= width/2; x += spacing) {
            const particle = this.game.createPhysicsObject({
                x: x,
                y: 3,
                z: 0
            }, { radius: 0.1 }, 0x00ff00);
            particles.push(particle);

            if (x > -width/2) {
                const prevParticle = particles[particles.length - 2];
                const constraint = new CANNON.DistanceConstraint(
                    particle.body,
                    prevParticle.body,
                    spacing
                );
                this.game.world.addConstraint(constraint);
            }
        }

        // Add UI controls
        this.game.addExperimentControls([
            {
                type: 'slider',
                label: 'Frequency (Hz)',
                min: 0.1,
                max: 2,
                value: 1,
                onChange: (value) => this.updateWaveFrequency(value)
            },
            {
                type: 'slider',
                label: 'Amplitude',
                min: 0,
                max: 2,
                value: 1,
                onChange: (value) => this.updateWaveAmplitude(value)
            }
        ]);
    }

    setupThermodynamics() {
        // Create container with particles
        const particles = [];
        const containerSize = { width: 4, height: 4, depth: 4 };

        // Create container walls
        this.createContainer(containerSize);

        // Add particles
        for (let i = 0; i < 50; i++) {
            const particle = this.game.createPhysicsObject({
                x: Math.random() * containerSize.width - containerSize.width/2,
                y: Math.random() * containerSize.height,
                z: Math.random() * containerSize.depth - containerSize.depth/2
            }, { radius: 0.1 }, 0xff0000);
            
            particles.push(particle);
        }

        // Add UI controls
        this.game.addExperimentControls([
            {
                type: 'slider',
                label: 'Temperature',
                min: 0,
                max: 100,
                value: 50,
                onChange: (value) => this.updateParticleEnergy(particles, value)
            },
            {
                type: 'slider',
                label: 'Volume',
                min: 50,
                max: 150,
                value: 100,
                onChange: (value) => this.updateContainerSize(containerSize, value/100)
            }
        ]);
    }

    // Helper methods
    createContainer(size) {
        // Create invisible walls with collision
        const wallThickness = 0.1;
        const walls = [
            // Bottom
            { pos: { x: 0, y: 0, z: 0 }, size: { w: size.width, h: wallThickness, d: size.depth } },
            // Top
            { pos: { x: 0, y: size.height, z: 0 }, size: { w: size.width, h: wallThickness, d: size.depth } },
            // Left
            { pos: { x: -size.width/2, y: size.height/2, z: 0 }, size: { w: wallThickness, h: size.height, d: size.depth } },
            // Right
            { pos: { x: size.width/2, y: size.height/2, z: 0 }, size: { w: wallThickness, h: size.height, d: size.depth } },
            // Front
            { pos: { x: 0, y: size.height/2, z: -size.depth/2 }, size: { w: size.width, h: size.height, d: wallThickness } },
            // Back
            { pos: { x: 0, y: size.height/2, z: size.depth/2 }, size: { w: size.width, h: size.height, d: wallThickness } }
        ];

        walls.forEach(wall => {
            this.game.createPhysicsObject(
                wall.pos,
                wall.size,
                0x444444,
                0 // mass = 0 for static objects
            );
        });
    }

    updateParticleEnergy(particles, temperature) {
        const energyScale = temperature / 50; // normalize to default temperature
        particles.forEach(particle => {
            const randomVel = new CANNON.Vec3(
                (Math.random() - 0.5) * energyScale,
                (Math.random() - 0.5) * energyScale,
                (Math.random() - 0.5) * energyScale
            );
            particle.body.velocity.copy(randomVel);
        });
    }

    drawTrajectory(points) {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
        const line = new THREE.Line(geometry, material);
        this.game.scene.add(line);
    }

    createCircuitComponent(type, position) {
        const geometry = new THREE.BoxGeometry(1, 0.5, 0.5);
        const material = new THREE.MeshPhongMaterial({ color: 0x444444 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position.x, position.y, position.z);
        this.game.scene.add(mesh);
        return mesh;
    }
}