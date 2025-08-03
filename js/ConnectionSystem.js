import * as THREE from 'three';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { CONFIG } from './config.js';
import { MathUtils } from './utils.js';

/**
 * Manages connections between particles
 */
export class ConnectionSystem {
    constructor() {
        this.connectionMode = CONFIG.CONNECTION_MODES.DYNAMIC;
        this.persistentConnections = new Set();
        this.lines = null;
        this.lineMaterial = null;
        this.linePositions = [];
        this.lineColors = [];
        
        this.init();
    }

    init() {
        this.createLineMaterial();
        this.createLinesMesh();
    }

    createLineMaterial() {
        this.lineMaterial = new LineMaterial({
            color: CONFIG.COLORS.CONNECTION_PRIMARY,
            linewidth: 3.0,
            transparent: true,
            opacity: 0.95,
            resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
            vertexColors: true
        });
    }

    createLinesMesh() {
        const geometry = new LineSegmentsGeometry();
        // Ensure geometry starts completely empty to prevent any initial rendering
        geometry.setPositions([]);
        geometry.setColors([]);
        this.lines = new LineSegments2(geometry, this.lineMaterial);
    }

    setConnectionMode(mode) {
        this.connectionMode = mode;
        
        if (mode === CONFIG.CONNECTION_MODES.PERSISTENT) {
            this.initializePersistentConnections();
        } else if (mode === CONFIG.CONNECTION_MODES.DYNAMIC) {
            this.persistentConnections.clear();
        }
    }

    initializePersistentConnections(particles) {
        if (!particles) return;
        
        this.persistentConnections.clear();
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = particles[i].position.distanceTo(particles[j].position);
                
                if (dist < CONFIG.CONNECTION_DISTANCE) {
                    this.persistentConnections.add(MathUtils.getConnectionKey(i, j));
                }
            }
        }
    }

    addLineSegment(particles, i, j, dist, isDynamic = false) {
        // Add positions for line segment
        this.linePositions.push(
            particles[i].position.x, particles[i].position.y, particles[i].position.z,
            particles[j].position.x, particles[j].position.y, particles[j].position.z
        );

        if (isDynamic) {
            // Distance-based coloring for dynamic connections
            const normalizedDist = dist / CONFIG.CONNECTION_DISTANCE;
            const proximity = 1.0 - normalizedDist;
            
            const r = Math.max(0.3, 0.7 + proximity * 0.2);
            const g = Math.max(0.3, 0.3 + proximity * 0.8);
            const b = Math.max(0.3, 0.3 + proximity * 0.8);

            this.lineColors.push(r, g, b, r, g, b);
        } else {
            // Default coloring for persistent connections
            const intensity = Math.max(0.3, 1.0 - (dist / CONFIG.CONNECTION_DISTANCE));
            this.lineColors.push(
                intensity, intensity * 0.5, 0.2,
                intensity, intensity * 0.5, 0.2
            );
        }
    }

    updateDynamicConnections(particles) {
        this.linePositions = [];
        this.lineColors = [];

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = particles[i].position.distanceTo(particles[j].position);
                
                if (dist < CONFIG.CONNECTION_DISTANCE) {
                    this.addLineSegment(particles, i, j, dist, true);
                }
            }
        }
    }

    updatePersistentConnections(particles) {
        this.linePositions = [];
        this.lineColors = [];

        // Check for new connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = particles[i].position.distanceTo(particles[j].position);
                const key = MathUtils.getConnectionKey(i, j);

                if (dist < CONFIG.CONNECTION_DISTANCE && !this.persistentConnections.has(key)) {
                    this.persistentConnections.add(key);
                }
            }
        }

        // Draw all persistent connections
        for (const key of this.persistentConnections) {
            const i = (key >> 16) & 0xFFFF;
            const j = key & 0xFFFF;
            const dist = particles[i].position.distanceTo(particles[j].position);
            this.addLineSegment(particles, i, j, dist, false);
        }

        // Reset material properties for persistent connections
        this.lineMaterial.opacity = 0.95;
        this.lineMaterial.linewidth = 3.0;
        this.lineMaterial.needsUpdate = true;
    }

    update(particles) {
        switch (this.connectionMode) {
            case CONFIG.CONNECTION_MODES.DYNAMIC:
                this.updateDynamicConnections(particles);
                break;
            case CONFIG.CONNECTION_MODES.PERSISTENT:
                this.updatePersistentConnections(particles);
                break;
        }

        this.updateGeometry();
    }

    updateGeometry() {
        if (this.linePositions.length > 0) {
            const newLineCount = this.linePositions.length / 6;
            const currentLineCount = this.lines.geometry.attributes.position ? 
                this.lines.geometry.attributes.position.count / 2 : 0;

            // Recreate geometry if line count changed significantly
            if (Math.abs(newLineCount - currentLineCount) > currentLineCount * 0.1) {
                const newGeometry = new LineSegmentsGeometry();
                newGeometry.setPositions(this.linePositions);
                newGeometry.setColors(this.lineColors);

                this.lines.geometry.dispose();
                this.lines.geometry = newGeometry;
            } else {
                // Update existing geometry
                this.lines.geometry.setPositions(this.linePositions);
                this.lines.geometry.setColors(this.lineColors);
            }
        } else {
            // No lines to draw
            const emptyGeometry = new LineSegmentsGeometry();
            this.lines.geometry.dispose();
            this.lines.geometry = emptyGeometry;
        }
    }

    resetConnections() {
        this.persistentConnections.clear();
    }

    onWindowResize() {
        this.lineMaterial.resolution.set(window.innerWidth, window.innerHeight);
    }

    getMesh() {
        return this.lines;
    }

    dispose() {
        if (this.lines) {
            this.lines.geometry.dispose();
            this.lineMaterial.dispose();
        }
    }
}
