import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { ChromaticAberrationShader } from './shaders.js';
import { CONFIG } from './config.js';

/**
 * Manages post-processing effects and rendering
 */
export class PostProcessingManager {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.composer = null;
        this.passes = {};
        
        this.init();
    }

    init() {
        this.createComposer();
        this.addRenderPass();
        this.addBloomPass();
        this.addFilmPass();
        this.addChromaticAberrationPass();
        this.addOutputPass();
        
        this.updateSize();
    }

    createComposer() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.setPixelRatio(window.devicePixelRatio);
    }

    addRenderPass() {
        this.passes.render = new RenderPass(this.scene, this.camera);
        this.composer.addPass(this.passes.render);
    }

    addBloomPass() {
        this.passes.bloom = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            CONFIG.BLOOM.STRENGTH,
            CONFIG.BLOOM.RADIUS,
            CONFIG.BLOOM.THRESHOLD
        );
        this.composer.addPass(this.passes.bloom);
    }

    addFilmPass() {
        this.passes.film = new FilmPass(
            CONFIG.FILM.NOISE_INTENSITY,
            CONFIG.FILM.SCANLINE_INTENSITY,
            CONFIG.FILM.SCANLINE_COUNT,
            CONFIG.FILM.GRAYSCALE
        );
        this.composer.addPass(this.passes.film);
    }

    addChromaticAberrationPass() {
        // Set up chromatic aberration uniforms
        ChromaticAberrationShader.uniforms.offset.value = new THREE.Vector2(
            CONFIG.CHROMATIC_ABERRATION.OFFSET,
            CONFIG.CHROMATIC_ABERRATION.OFFSET
        );
        ChromaticAberrationShader.uniforms.opacity.value = CONFIG.CHROMATIC_ABERRATION.OPACITY;
        
        this.passes.chromaticAberration = new ShaderPass(ChromaticAberrationShader);
        this.composer.addPass(this.passes.chromaticAberration);
    }

    addOutputPass() {
        this.passes.output = new OutputPass();
        this.composer.addPass(this.passes.output);
    }

    updateSize() {
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    onWindowResize() {
        this.updateSize();
        
        // Update bloom pass resolution if needed
        if (this.passes.bloom) {
            this.passes.bloom.setSize(window.innerWidth, window.innerHeight);
        }
    }

    render() {
        this.composer.render();
    }

    // Effect parameter controls
    setBloomStrength(strength) {
        if (this.passes.bloom) {
            this.passes.bloom.strength = strength;
        }
    }

    setBloomRadius(radius) {
        if (this.passes.bloom) {
            this.passes.bloom.radius = radius;
        }
    }

    setBloomThreshold(threshold) {
        if (this.passes.bloom) {
            this.passes.bloom.threshold = threshold;
        }
    }

    setChromaticAberrationOffset(offset) {
        if (this.passes.chromaticAberration) {
            this.passes.chromaticAberration.uniforms.offset.value.set(offset, offset);
        }
    }

    dispose() {
        if (this.composer) {
            this.composer.dispose();
        }
        
        Object.values(this.passes).forEach(pass => {
            if (pass.dispose) {
                pass.dispose();
            }
        });
    }
}
