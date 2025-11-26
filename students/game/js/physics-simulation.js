class PhysicsGame {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.world = new CANNON.World();
        this.objects = new Map();
        this.players = new Map();
        this.currentTopic = null;
        this.mode = null;
        this.controls = null;

        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.getElementById('game-container').appendChild(this.renderer.domElement);

        // Setup physics world
        this.world.gravity.set(0, -9.82, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;

        // Setup camera
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        // Add lighting
        this.setupLighting();

        // Add ground
        this.createGround();

        // Setup window resize handler
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Start animation loop
        this.animate();
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }

    createGround() {
        // Three.js ground
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.3,
            roughness: 0.4,
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Cannon.js ground
        const groundBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Plane()
        });
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.addBody(groundBody);
    }

    startTopic(topic, mode) {
        this.currentTopic = topic;
        this.mode = mode;

        // Clear existing objects
        this.clearScene();

        // Initialize topic-specific setup
        switch (topic) {
            case 'mechanics':
                this.setupMechanics();
                break;
            case 'waves':
                this.setupWaves();
                break;
            case 'electricity':
                this.setupElectricity();
                break;
            case 'thermodynamics':
                this.setupThermodynamics();
                break;
        }
    }

    setupMechanics() {
        // Create interactive objects for mechanics
        this.camera.position.set(0, 15, 30);
        
        // Add ramp
        const ramp = this.createRamp();
        
        // Add spheres for rolling experiments
        this.createSphere({ x: -5, y: 10, z: 0 }, 1, 0xff0000);
        this.createSphere({ x: 0, y: 10, z: 0 }, 1, 0x00ff00);
        this.createSphere({ x: 5, y: 10, z: 0 }, 1, 0x0000ff);

        // Add control panel
        this.addControlPanel([
            { type: 'slider', label: 'Gravity', min: 0, max: 20, value: 9.82, onChange: (v) => this.world.gravity.y = -v },
            { type: 'slider', label: 'Friction', min: 0, max: 1, value: 0.3, onChange: (v) => this.updateFriction(v) },
            { type: 'button', label: 'Reset', onClick: () => this.resetMechanics() }
        ]);
    }

    setupWaves() {
        this.camera.position.set(0, 20, 20);
        
        // Create wave particles
        const particles = [];
        const spacing = 0.5;
        const width = 20;
        
        for (let x = -width/2; x <= width/2; x += spacing) {
            for (let z = -width/2; z <= width/2; z += spacing) {
                const particle = this.createParticle({ x, y: 0, z }, 0.2, 0x00ffff);
                particles.push(particle);
            }
        }

        // Add wave controls
        this.addControlPanel([
            { type: 'slider', label: 'Frequency', min: 0.1, max: 2, value: 1, onChange: (v) => this.updateWaveFrequency(v) },
            { type: 'slider', label: 'Amplitude', min: 0, max: 2, value: 1, onChange: (v) => this.updateWaveAmplitude(v) }
        ]);
    }

    setupElectricity() {
        this.camera.position.set(0, 10, 20);

        // Create circuit components
        const components = {
            battery: this.createCircuitComponent('battery', { x: -5, y: 1, z: 0 }),
            resistor: this.createCircuitComponent('resistor', { x: 0, y: 1, z: 0 }),
            bulb: this.createCircuitComponent('bulb', { x: 5, y: 1, z: 0 })
        };

        // Add connecting wires
        this.createWire(components.battery, components.resistor);
        this.createWire(components.resistor, components.bulb);
        this.createWire(components.bulb, components.battery);

        // Add circuit controls
        this.addControlPanel([
            { type: 'slider', label: 'Voltage', min: 0, max: 12, value: 6, onChange: (v) => this.updateVoltage(v) },
            { type: 'slider', label: 'Resistance', min: 1, max: 100, value: 10, onChange: (v) => this.updateResistance(v) }
        ]);
    }

    setupThermodynamics() {
        this.camera.position.set(0, 10, 20);

        // Create container
        const container = this.createContainer({ width: 10, height: 10, depth: 10 });

        // Add particles
        const particles = [];
        for (let i = 0; i < 100; i++) {
            const particle = this.createParticle({
                x: Math.random() * 8 - 4,
                y: Math.random() * 8 - 4,
                z: Math.random() * 8 - 4
            }, 0.2, 0xff0000);
            particles.push(particle);
        }

        // Add temperature controls
        this.addControlPanel([
            { type: 'slider', label: 'Temperature', min: 0, max: 100, value: 50, onChange: (v) => this.updateTemperature(v) },
            { type: 'slider', label: 'Pressure', min: 1, max: 10, value: 1, onChange: (v) => this.updatePressure(v) }
        ]);
    }

    // Helper methods for creating objects
    createRamp() {
        const geometry = new THREE.BoxGeometry(20, 0.5, 10);
        const material = new THREE.MeshStandardMaterial({ color: 0x666666 });
        const ramp = new THREE.Mesh(geometry, material);
        ramp.rotation.z = -Math.PI / 6;
        ramp.position.y = 5;
        ramp.castShadow = true;
        this.scene.add(ramp);

        const rampBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(10, 0.25, 5))
        });
        rampBody.quaternion.setFromEuler(-Math.PI / 6, 0, 0);
        rampBody.position.copy(ramp.position);
        this.world.addBody(rampBody);

        return { mesh: ramp, body: rampBody };
    }

    createSphere(position, radius, color) {
        const geometry = new THREE.SphereGeometry(radius);
        const material = new THREE.MeshStandardMaterial({ color });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(position);
        sphere.castShadow = true;
        this.scene.add(sphere);

        const sphereBody = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Sphere(radius)
        });
        sphereBody.position.copy(position);
        this.world.addBody(sphereBody);

        sphere.userData.body = sphereBody;
        return { mesh: sphere, body: sphereBody };
    }

    createParticle(position, radius, color) {
        return this.createSphere(position, radius, color);
    }

    createCircuitComponent(type, position) {
        const geometry = new THREE.BoxGeometry(2, 1, 1);
        const material = new THREE.MeshStandardMaterial({ 
            color: type === 'battery' ? 0xff0000 : type === 'resistor' ? 0x00ff00 : 0xffff00 
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.castShadow = true;
        this.scene.add(mesh);
        return mesh;
    }

    createWire(from, to) {
        const points = [
            new THREE.Vector3(from.position.x, from.position.y, from.position.z),
            new THREE.Vector3(to.position.x, to.position.y, to.position.z)
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0x000000 });
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        return line;
    }

    createContainer(dimensions) {
        const geometry = new THREE.BoxGeometry(dimensions.width, dimensions.height, dimensions.depth);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x444444,
            transparent: true,
            opacity: 0.3
        });
        const container = new THREE.Mesh(geometry, material);
        container.position.y = dimensions.height / 2;
        this.scene.add(container);
        return container;
    }

    // UI Controls
    addControlPanel(controls) {
        const panel = document.createElement('div');
        panel.className = 'absolute bottom-4 left-4 bg-black/50 p-4 rounded-lg text-white';
        
        controls.forEach(control => {
            const controlDiv = document.createElement('div');
            controlDiv.className = 'mb-2';
            
            const label = document.createElement('label');
            label.textContent = control.label;
            controlDiv.appendChild(label);

            if (control.type === 'slider') {
                const input = document.createElement('input');
                input.type = 'range';
                input.min = control.min;
                input.max = control.max;
                input.value = control.value;
                input.step = 'any';
                input.className = 'w-full';
                input.addEventListener('input', () => control.onChange(parseFloat(input.value)));
                controlDiv.appendChild(input);
            } else if (control.type === 'button') {
                const button = document.createElement('button');
                button.textContent = control.label;
                button.className = 'bg-blue-500 px-4 py-2 rounded';
                button.addEventListener('click', control.onClick);
                controlDiv.appendChild(button);
            }

            panel.appendChild(controlDiv);
        });

        document.getElementById('game-ui').appendChild(panel);
    }

    clearScene() {
        // Remove all objects except ground and lights
        while(this.scene.children.length > 3) {
            const object = this.scene.children[3];
            this.scene.remove(object);
        }

        // Remove all physics bodies except ground
        while(this.world.bodies.length > 1) {
            const body = this.world.bodies[1];
            this.world.remove(body);
        }

        // Clear control panels
        const gameUI = document.getElementById('game-ui');
        const panels = gameUI.querySelectorAll('.absolute');
        panels.forEach(panel => panel.remove());
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update physics
        this.world.step(1/60);

        // Update object positions
        this.scene.children.forEach(child => {
            if (child.userData.body) {
                child.position.copy(child.userData.body.position);
                child.quaternion.copy(child.userData.body.quaternion);
            }
        });

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}