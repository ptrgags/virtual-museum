struct PointLight {
    vec3 color;
    vec3 position; // in view space
    float distance;
};

uniform PointLight pointLights[NUM_POINT_LIGHTS];

struct SpotLight {
    vec3 color;
    vec3 position;
    vec3 direction;
    float distance;
    float coneCos;
    float penumbraCos;
    float decay;
};

uniform SpotLight spotLights[NUM_SPOT_LIGHTS];

varying vec3 fPositionView;
varying vec3 fNormalView;
varying vec2 fUv;

void main() {
    vec3 N = normalize(fNormalView);

    // Try Silhouette Edge Detection
    vec3 V = normalize(-fPositionView); 
    float VN = dot(V, N);

    // Apply lighting
    vec3 color = vec3(0.0);

    // Ignore the default lights, they tend to wash out the colors
    const int FIRST_LIGHT = 8;
    const float BIAS = 0.1;
    const float DIST_BLUR = 0.2;

    // Lambert shading for point lights
    for (int i = FIRST_LIGHT; i < NUM_POINT_LIGHTS; i++) {
        vec3 diff = pointLights[i].position - fPositionView;
        float dist = length(diff);
        vec3 L = normalize(diff);

        vec3 brightened = pointLights[i].color + BIAS;

        vec3 lambert = brightened * max(dot(L, N), 0.0);

        float cutoff_dist = pointLights[i].distance;
        float dist_mask = smoothstep(
            cutoff_dist + DIST_BLUR, cutoff_dist, dist);

        color += dist_mask * lambert;
    }

    // Lambert shading with spot lights
    for (int i = 0; i < NUM_SPOT_LIGHTS; i++) {
        vec3 L = normalize(spotLights[i].position - fPositionView);
        vec3 S = normalize(-spotLights[i].direction);

        float inside_cone = float(dot(L, S) < spotLights[i].coneCos);
        float intensity = max(dot(L, N), 0.0);
        // TODO: Add model diffuse color
        vec3 diffuse = intensity * spotLights[i].color;

        color += inside_cone * diffuse;
    }


    // For toon shading, bucket the color into a few buckets
    // TODO: Make these into parameters
    const float NUM_BUCKETS = 4.0;
    vec3 toon = floor(color * NUM_BUCKETS) / NUM_BUCKETS;

    // Compute the silhouette for later
    const float SILHOUETTE_AMOUNT = 0.3;
    const vec3 SILHOUETTE_COLOR = vec3(0.0, 0.0, 0.0);
    float silhouette = 1.0 - step(SILHOUETTE_AMOUNT,  abs(VN));

    color = mix(toon, SILHOUETTE_COLOR, silhouette);

    gl_FragColor = vec4(color, 1.0);
}
