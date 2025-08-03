import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ParticleSystem } from './ParticleSystem.js';
import { ConnectionSystem } from './ConnectionSystem.js';
import { PostProcessingManager } from './PostProcessingManager.js';
import { CONFIG } from './config.js';

/**
 * Main application class that orchestrates the particle system
 */
export class ParticleSystemApp {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.clock = new THREE.Clock();
        
        // System components
        this.particleSystem = null;
        this.connectionSystem = null;
        this.postProcessing = null;
        
        // Animation state
        this.isRunning = false;
        
        this.init();
    }

    async init() {
        try {
            this.createScene();
            this.createCamera();
            this.createRenderer();
            this.createControls();
            this.createSystems();
            this.setupEventListeners();
            
            // Add particle system to scene
            this.scene.add(this.particleSystem.getMesh());
            
            // Initialize connections with current particle positions
            this.connectionSystem.update(this.particleSystem.getParticles());
            
            // Now add connection system to scene after it has been properly initialized
            this.scene.add(this.connectionSystem.getMesh());
            
            this.isRunning = true;
            this.animate();
            
            console.log('Particle system initialized successfully');
        } catch (error) {
            console.error('Failed to initialize particle system:', error);
            throw error;
        }
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(CONFIG.COLORS.BACKGROUND);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 25;
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
    }

    createControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        
        // Optional: Auto-rotate
        // this.controls.autoRotate = true;
        // this.controls.autoRotateSpeed = 0.3;
    }

    createSystems() {
        // Initialize particle system
        this.particleSystem = new ParticleSystem();
        
        // Initialize connection system
        this.connectionSystem = new ConnectionSystem();
        
        // Initialize post-processing
        this.postProcessing = new PostProcessingManager(
            this.renderer,
            this.scene,
            this.camera
        );
    }

    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        
        // Keyboard controls
        window.addEventListener('keydown', this.onKeyDown.bind(this), false);
        
        // Visibility change handling
        document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.postProcessing.onWindowResize();
        this.connectionSystem.onWindowResize();
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'KeyD':
                this.connectionSystem.setConnectionMode(CONFIG.CONNECTION_MODES.DYNAMIC);
                console.log('Switched to dynamic connections');
                break;
            case 'KeyP':
                this.connectionSystem.setConnectionMode(CONFIG.CONNECTION_MODES.PERSISTENT);
                this.connectionSystem.initializePersistentConnections(this.particleSystem.getParticles());
                console.log('Switched to persistent connections');
                break;
            case 'KeyR':
                this.connectionSystem.resetConnections();
                console.log('Reset connections');
                break;
            case 'Space':
                event.preventDefault();
                this.toggleAnimation();
                break;
        }
    }

    onVisibilityChange() {
        if (document.hidden) {
            this.isRunning = false;
        } else {
            this.isRunning = true;
            this.clock.getDelta(); // Reset delta time
            this.animate();
        }
    }

    toggleAnimation() {
        this.isRunning = !this.isRunning;
        if (this.isRunning) {
            this.clock.getDelta(); // Reset delta time
            this.animate();
        }
        console.log(`Animation ${this.isRunning ? 'started' : 'paused'}`);
    }

    animate() {
        if (!this.isRunning) return;
        
        requestAnimationFrame(this.animate.bind(this));
        
        const deltaTime = this.clock.getDelta();
        
        // Update systems
        this.particleSystem.update(deltaTime);
        this.connectionSystem.update(this.particleSystem.getParticles());
        this.controls.update();
        
        // Render
        this.postProcessing.render();
    }

    // Public API methods
    setConnectionMode(mode) {
        this.connectionSystem.setConnectionMode(mode);
        if (mode === CONFIG.CONNECTION_MODES.PERSISTENT) {
            this.connectionSystem.initializePersistentConnections(this.particleSystem.getParticles());
        }
    }

    resetConnections() {
        this.connectionSystem.resetConnections();
    }

    // Effect controls
    setBloomStrength(strength) {
        this.postProcessing.setBloomStrength(strength);
    }

    setBloomRadius(radius) {
        this.postProcessing.setBloomRadius(radius);
    }

    setBloomThreshold(threshold) {
        this.postProcessing.setBloomThreshold(threshold);
    }

    setChromaticAberrationOffset(offset) {
        this.postProcessing.setChromaticAberrationOffset(offset);
    }

    dispose() {
        this.isRunning = false;
        
        // Dispose systems
        if (this.particleSystem) this.particleSystem.dispose();
        if (this.connectionSystem) this.connectionSystem.dispose();
        if (this.postProcessing) this.postProcessing.dispose();
        
        // Remove event listeners
        window.removeEventListener('resize', this.onWindowResize);
        window.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
        
        // Dispose Three.js resources
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
        
        console.log('Particle system disposed');
    }
}
