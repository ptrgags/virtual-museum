struct PointLight {
    vec3 color;
    vec3 position; // in view space
    float distance;
};

uniform PointLight pointLights[NUM_POINT_LIGHTS];

varying vec3 fPositionView;
varying vec3 fNormalView;
varying vec2 fUv;

void main() {
    vec3 N = normalize(fNormalView);

    vec3 color = vec3(0.0);

    // Simple Lambert shading
    for (int i = 0; i < NUM_POINT_LIGHTS; i++) {
        vec3 L = normalize(pointLights[i].position - fPositionView);
        vec3 lambert = pointLights[i].color * max(dot(L, N), 0.0);
        color += lambert;
    }

    const float NUM_BUCKETS = 4.0;
    vec3 toon = floor(color * NUM_BUCKETS) / NUM_BUCKETS;

    // Try Silhouette Edge Detection
    vec3 V = normalize(-fPositionView); 
    float VN = dot(V, N);

    const float SILHOUETTE_AMOUNT = 0.3;
    const vec3 SILHOUETTE_COLOR = vec3(0.0, 0.0, 0.0);
    float silhouette = 1.0 - step(SILHOUETTE_AMOUNT,  abs(VN));

    //color = mix(toon, SILHOUETTE_COLOR, silhouette);
    color = vec3(fUv, 0.0);
    gl_FragColor = vec4(color, 1.0);
}
