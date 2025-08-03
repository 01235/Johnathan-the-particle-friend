import * as THREE from 'three';
import { CONFIG } from './config.js';
import { MathUtils } from './utils.js';

/**
 * Manages particle creation, positioning, and animation
 */
export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.startPositions = new Float32Array(CONFIG.PARTICLE_COUNT * 3);
        this.endPositions = new Float32Array(CONFIG.PARTICLE_COUNT * 3);
        this.originalPositions = new Float32Array(CONFIG.PARTICLE_COUNT * 3);
        this.points = null;
        
        // Animation state
        this.currentState = CONFIG.ANIMATION_STATES.WAITING;
        this.progress = 0;
        this.resetProgress = 0;
        
        this.init();
    }

    init() {
        const positions = this.createParticles();
        this.createPointsMesh(positions);
    }

    createParticles() {
        const positions = new Float32Array(CONFIG.PARTICLE_COUNT * 3);
        
        for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
            // Generate base spherical position
            const basePosition = MathUtils.generateSpherePoint(CONFIG.SPHERE_RADIUS);
            
            // Add entropy (randomness)
            const entropy = new THREE.Vector3(
                (Math.random() - 0.5) * CONFIG.ENTROPY_FACTOR * CONFIG.SPHERE_RADIUS,
                (Math.random() - 0.5) * CONFIG.ENTROPY_FACTOR * CONFIG.SPHERE_RADIUS,
                (Math.random() - 0.5) * CONFIG.ENTROPY_FACTOR * CONFIG.SPHERE_RADIUS
            );
            
            const currentPosition = basePosition.clone().add(entropy);
            
            // Store positions
            positions[i * 3] = currentPosition.x;
            positions[i * 3 + 1] = currentPosition.y;
            positions[i * 3 + 2] = currentPosition.z;
            
            // Initialize state arrays
            this.startPositions[i * 3] = currentPosition.x;
            this.startPositions[i * 3 + 1] = currentPosition.y;
            this.startPositions[i * 3 + 2] = currentPosition.z;
            
            this.endPositions[i * 3] = currentPosition.x;
            this.endPositions[i * 3 + 1] = currentPosition.y;
            this.endPositions[i * 3 + 2] = currentPosition.z;
            
            this.originalPositions[i * 3] = currentPosition.x;
            this.originalPositions[i * 3 + 1] = currentPosition.y;
            this.originalPositions[i * 3 + 2] = currentPosition.z;
            
            // Store particle object
            this.particles.push({
                position: currentPosition,
                basePosition: currentPosition.clone()
            });
        }
        
        return positions;
    }

    createPointsMesh(positions) {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: CONFIG.COLORS.PARTICLE,
            size: 0.0,
            blending: THREE.AdditiveBlending,
            transparent: true,
            visible: false // Explicitly hide particles
        });
        
        this.points = new THREE.Points(geometry, material);
    }

    startNewCycle(reset = false) {
        // Previous end positions become new start positions
        this.startPositions.set(this.endPositions);

        if (!reset) {
            // Generate new transformation matrices
            const matrix1 = MathUtils.createRandomMatrix();
            const matrix2 = MathUtils.createRandomMatrix();

            // Randomly assign particles to groups
            const particleGroups = new Array(CONFIG.PARTICLE_COUNT);
            for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
                particleGroups[i] = Math.random() < 0.5 ? 0 : 1;
            }

            // Calculate new target positions
            const tempVec = new THREE.Vector3();
            for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
                tempVec.fromArray(this.startPositions, i * 3);

                // Apply transformation based on group
                if (particleGroups[i] === 0) {
                    tempVec.applyMatrix4(matrix1);
                } else {
                    tempVec.applyMatrix4(matrix2);
                }

                this.endPositions[i * 3] = tempVec.x;
                this.endPositions[i * 3 + 1] = tempVec.y;
                this.endPositions[i * 3 + 2] = tempVec.z;
            }
        } else {
            // Reset to original positions
            this.endPositions.set(this.originalPositions);
        }
    }

    update(deltaTime) {
        const positionAttribute = this.points.geometry.attributes.position;

        switch (this.currentState) {
            case CONFIG.ANIMATION_STATES.MOVING:
                this.updateMovingState(deltaTime, positionAttribute);
                break;
            case CONFIG.ANIMATION_STATES.WAITING:
                this.updateWaitingState(deltaTime);
                break;
        }

        positionAttribute.needsUpdate = true;
    }

    updateMovingState(deltaTime, positionAttribute) {
        this.progress += deltaTime / CONFIG.MOVE_DURATION;
        const linearProgress = Math.min(this.progress, 1.0);
        const easedProgress = MathUtils.easeInOutQuint(linearProgress);

        // Interpolate particle positions
        const tempVecStart = new THREE.Vector3();
        const tempVecEnd = new THREE.Vector3();
        const finalPos = new THREE.Vector3();

        for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
            tempVecStart.fromArray(this.startPositions, i * 3);
            tempVecEnd.fromArray(this.endPositions, i * 3);

            finalPos.lerpVectors(tempVecStart, tempVecEnd, easedProgress);
            positionAttribute.setXYZ(i, finalPos.x, finalPos.y, finalPos.z);

            // Update particle object positions
            this.particles[i].position.copy(finalPos);
        }

        // Check if movement is complete
        if (this.progress >= 1.0) {
            this.progress = 0;
            this.currentState = CONFIG.ANIMATION_STATES.WAITING;
        }
    }

    updateWaitingState(deltaTime) {
        this.progress += deltaTime / CONFIG.WAIT_DURATION;

        if (this.progress >= 1.0) {
            this.resetProgress++;
            
            const shouldReset = this.resetProgress >= CONFIG.RESET_CYCLE_COUNT;
            if (shouldReset) {
                this.resetProgress = 0;
                this.startNewCycle(true);
            } else {
                this.startNewCycle(false);
            }
            
            this.progress = 0;
            this.currentState = CONFIG.ANIMATION_STATES.MOVING;
        }
    }

    getMesh() {
        return this.points;
    }

    getParticles() {
        return this.particles;
    }

    dispose() {
        if (this.points) {
            this.points.geometry.dispose();
            this.points.material.dispose();
        }
    }
}
