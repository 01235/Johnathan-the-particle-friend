/**
 * Custom shaders for post-processing effects
 */

export const ChromaticAberrationShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'offset': { value: null },
        'opacity': { value: 1.0 }
    },
    
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 offset;
        uniform float opacity;
        varying vec2 vUv;
        
        void main() {
            vec2 uv = vUv;
            vec4 original = texture2D(tDiffuse, uv);
            float r = texture2D(tDiffuse, uv + offset).r;
            float g = texture2D(tDiffuse, uv).g;
            float b = texture2D(tDiffuse, uv - offset).b;
            vec4 aberration = vec4(r, g, b, 1.0);
            gl_FragColor = mix(original, aberration, opacity);
        }
    `
};

export const ProceduralBackgroundShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'time': { value: 0.0 },
        'amount': { value: 0.15 }
    },
    
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float time;
        uniform float amount;
        varying vec2 vUv;

        // Simple value noise function
        float rand(vec2 co) {
            return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            float a = rand(i);
            float b = rand(i + vec2(1.0, 0.0));
            float c = rand(i + vec2(0.0, 1.0));
            float d = rand(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            float n = noise(vUv * 10.0 + time * 0.05);
            vec3 noiseColor = vec3(n * 0.5 + 0.5);
            color.rgb = mix(color.rgb, noiseColor, amount);
            gl_FragColor = color;
        }
    `
};
