uniform float uTime;

varying vec2 vUv;
varying float vTime;


void main(){

    // Applies transformation relative to the Mesh (position, rotation, scale)
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Applies transformation relative to the camera (position, rotation, field of view, near, far)
    vec4 viewPosition = viewMatrix * modelPosition;
    
    // Transforms the coordinates into the clip space coordinates
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition; 

    // Declaring uv
    vUv = uv;
    vTime = uTime;
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
