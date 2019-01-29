varying vec3 fPositionView;
varying vec3 fNormalView;

void main() {
    fPositionView = vec3(modelViewMatrix * vec4(position, 1.0));
    fNormalView = vec3(modelViewMatrix * vec4(normal, 0.0));
    gl_Position = projectionMatrix * vec4(fPositionView, 1.0);
}
