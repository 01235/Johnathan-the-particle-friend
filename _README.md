# Dynamic Spherical Particle System

A sophisticated Three.js-based particle system featuring dynamic transformations, intelligent connection algorithms, and post-processing effects.

## Features

- **Dynamic Particle Animation**: Smooth transformations using easing functions
- **Intelligent Connection System**: Two modes - dynamic distance-based and persistent connections
- **Post-Processing Effects**: Bloom, chromatic aberration, and film grain
- **Interactive Controls**: Keyboard and mouse controls for real-time interaction
- **Performance Optimized**: Efficient geometry updates and memory management
- **Modular Architecture**: Clean, maintainable code structure

## Controls

- **D**: Switch to dynamic connections
- **P**: Switch to persistent connections  
- **R**: Reset connections
- **Space**: Pause/Resume animation
- **Mouse**: Orbit camera
- **Mouse Wheel**: Zoom

## File Structure

```
particle-system/
├── index.html                 # Main HTML file
├── styles/
│   └── main.css              # Styling and layout
└── js/
    ├── main.js               # Application entry point
    ├── config.js             # Configuration constants
    ├── utils.js              # Utility functions
    ├── shaders.js            # Custom GLSL shaders
    ├── ParticleSystem.js     # Particle management
    ├── ConnectionSystem.js   # Connection algorithms
    ├── PostProcessingManager.js # Rendering effects
    └── ParticleSystemApp.js  # Main application class
```

## Technical Details

### Particle System
- Spherical distribution with entropy factor for natural randomness
- Smooth interpolation between transformation states
- Efficient position buffering and updates

### Connection System
- **Dynamic Mode**: Real-time distance-based connections with color gradients
- **Persistent Mode**: Connections persist once established
- Optimized geometry updates to prevent memory leaks

### Post-Processing
- **Bloom Effect**: Configurable strength, radius, and threshold
- **Chromatic Aberration**: Adjustable offset for visual distortion
- **Film Grain**: Scanline and noise effects for cinematic feel

## Performance Considerations

- Uses `requestAnimationFrame` for smooth 60fps animation
- Efficient connection algorithms with spatial optimization
- Memory leak prevention through proper resource disposal
- Visibility API integration to pause when tab is inactive

## Browser Compatibility

- Modern browsers with WebGL 2.0 support
- Tested on Chrome, Firefox, Safari, and Edge
- Mobile browser support with touch controls

## Development

The code follows modern ES6+ patterns with:
- Modular class-based architecture
- Proper resource management
- Error handling and graceful degradation
- Comprehensive inline documentation

## License

MIT License - feel free to use and modify for your projects.
