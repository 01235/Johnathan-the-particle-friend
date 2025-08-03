import { ParticleSystemApp } from './ParticleSystemApp.js';

/**
 * Application entry point
 */
class App {
    constructor() {
        this.particleApp = null;
        this.init();
    }

    async init() {
        try {
            // Show loading state
            this.showLoading();
            
            // Get container
            const container = document.getElementById('app');
            if (!container) {
                throw new Error('App container not found');
            }

            // Initialize particle system
            this.particleApp = new ParticleSystemApp(container);
            
            // Hide loading state
            this.hideLoading();
            
            // Show controls
            this.createControls();
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError(error.message);
        }
    }

    showLoading() {
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.id = 'loading';
        loading.innerHTML = '<div class="loading-text">Loading Particle System...</div>';
        document.body.appendChild(loading);
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.remove();
        }
    }

    showError(message) {
        this.hideLoading();
        const error = document.createElement('div');
        error.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            z-index: 1000;
        `;
        error.textContent = `Error: ${message}`;
        document.body.appendChild(error);
    }

    createControls() {
        const controls = document.createElement('div');
        controls.className = 'controls';
        controls.innerHTML = `
            <h3>Controls</h3>
            <div>
                <button id="btn-dynamic">Dynamic Connections (D)</button>
                <button id="btn-persistent">Persistent Connections (P)</button>
            </div>
            <div>
                <button id="btn-reset">Reset Connections (R)</button>
                <button id="btn-pause">Pause/Resume (Space)</button>
            </div>
            <div style="margin-top: 10px; font-size: 12px;">
                <div>Mouse: Orbit camera</div>
                <div>Wheel: Zoom</div>
            </div>
        `;
        
        document.body.appendChild(controls);
        
        // Add event listeners
        document.getElementById('btn-dynamic').addEventListener('click', () => {
            this.particleApp.setConnectionMode('DYNAMIC');
        });
        
        document.getElementById('btn-persistent').addEventListener('click', () => {
            this.particleApp.setConnectionMode('PERSISTENT');
        });
        
        document.getElementById('btn-reset').addEventListener('click', () => {
            this.particleApp.resetConnections();
        });
        
        document.getElementById('btn-pause').addEventListener('click', () => {
            this.particleApp.toggleAnimation();
        });
    }
}

// Initialize application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new App());
} else {
    new App();
}
