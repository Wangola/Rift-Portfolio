precision mediump float;

uniform vec3 uColorStart;
uniform vec3 uColorEnd;

varying vec2 vUv;
// For some reason uTime uniform was not working so hard to transfer as varying
varying float vTime;

void main() {

    // Mix amount based on time
    float mixAmount = abs(sin(vTime * 0.5));

    vec3 finalColor = mix(uColorStart, uColorEnd, mixAmount);

    gl_FragColor = vec4(finalColor, 1.0);
}