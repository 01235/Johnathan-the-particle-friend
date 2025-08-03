/**
 * Configuration constants for the particle system
 */
export const CONFIG = {
    // Particle system
    PARTICLE_COUNT: 500,
    SPHERE_RADIUS: 10,
    ENTROPY_FACTOR: 0.20,
    CONNECTION_DISTANCE: 3.2,
    JITTER_AMOUNT: 0.2,
    
    // Animation timing
    MOVE_DURATION: 5.0,    // seconds
    WAIT_DURATION: 0.1,    // seconds
    RESET_CYCLE_COUNT: 5,  // cycles before reset
    
    // Bloom effect
    BLOOM: {
        STRENGTH: 0.18,
        RADIUS: 0.1,
        THRESHOLD: 0.09
    },
    
    // Film effect
    FILM: {
        NOISE_INTENSITY: 0.7,
        SCANLINE_INTENSITY: 0.8,
        SCANLINE_COUNT: 323,
        GRAYSCALE: false
    },
    
    // Chromatic aberration
    CHROMATIC_ABERRATION: {
        OFFSET: 0.0005,
        OPACITY: 1.0
    },
    
    // Connection modes
    CONNECTION_MODES: {
        DYNAMIC: 'DYNAMIC',
        PERSISTENT: 'PERSISTENT'
    },
    
    // Animation states
    ANIMATION_STATES: {
        WAITING: 'WAITING',
        MOVING: 'MOVING'
    },
    
    // Colors
    COLORS: {
        BACKGROUND: 0x284843,
        PARTICLE: 0xFFFFFF,
        CONNECTION_PRIMARY: 0xd18234
    }
};
