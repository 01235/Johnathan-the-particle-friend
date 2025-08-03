# Johnathan-the-particle-friend

This is a particle system called Johnathan with three.js ancestry. Starts as a sphere then does some sick breakdancing by continuosly splitting in two before having a rest. He's pretty chill :D

He was even chiller before I asked Claude for feedback on how "professional" the code is and Claude made somekind of crazy multifile setup I had to reverse engineer and make less terrible.  The original system is called "johnathan.html."  To run the full multifile setup you'll have to run some kind of local server.  I use "npm http-server."  

Disclaimer - I'm a terrible programmer.  Oh, and Claude told me a bunch of stuff to pass on to you about the multifile version, which I have left below.

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


