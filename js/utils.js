import * as THREE from 'three';

/**
 * Utility functions for mathematical operations and transformations
 */
export class MathUtils {
    /**
     * Easing function for smooth animations
     * @param {number} t - Progress value between 0 and 1
     * @returns {number} Eased value
     */
    static easeInOutQuint(t) {
        return t < 0.5
            ? 16 * t * t * t * t * t
            : 1 - Math.pow(-2 * t + 2, 5) / 2;
    }

    /**
     * Generate a random number within a range
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number in range
     */
    static randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Generate a random transformation matrix
     * @returns {THREE.Matrix4} Random transformation matrix
     */
    static createRandomMatrix() {
        // Random translation
        const translation = new THREE.Vector3(
            this.randomInRange(-5, 5),
            this.randomInRange(-5, 5),
            this.randomInRange(-5, 5)
        );

        // Random rotation
        const rotation = new THREE.Euler(
            this.randomInRange(0, Math.PI * 2),
            this.randomInRange(0, Math.PI * 2),
            this.randomInRange(0, Math.PI * 2)
        );

        // Random uniform scale
        const scaleValue = this.randomInRange(0.5, 1.5);
        const scale = new THREE.Vector3(scaleValue, scaleValue, scaleValue);

        // Convert rotation to quaternion and compose matrix
        const quaternion = new THREE.Quaternion().setFromEuler(rotation);
        const matrix = new THREE.Matrix4();
        matrix.compose(translation, quaternion, scale);

        return matrix;
    }

    /**
     * Generate a unique key for a pair of indices
     * @param {number} i - First index
     * @param {number} j - Second index
     * @returns {number} Unique key
     */
    static getConnectionKey(i, j) {
        return i < j ? (i << 16) | j : (j << 16) | i;
    }

    /**
     * Generate spherical coordinates for particle distribution
     * @param {number} radius - Sphere radius
     * @returns {THREE.Vector3} Position vector
     */
    static generateSpherePoint(radius) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        return new THREE.Vector3(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
    }
}
