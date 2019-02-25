#define PI 3.1415
#define MAX_ITERATIONS 300
varying vec2 fUv;

/**
 * Convert uv coordinates to spherical coordinates
 * theta = zenith angle (angle from the north pole)
 * phi = azimuth angle (angle around the equator)
 */
vec2 to_angles(vec2 uv) {
    float theta = PI * (1.0 - uv.y);
    float phi = 2.0 * PI * uv.x;
    return vec2(theta, phi);
}

/**
 * Project the Riemann sphere to the complex plane to get a complex number.
 * the point on the sphere are given by the angles (theta, phi) (see to_angles)
 *
 * z = cot(theta/2) e^(i * theta)
 */
vec2 to_complex(vec2 angles) {
    // e^(i * theta)
    vec2 phase_factor = vec2(cos(angles.y), sin(angles.y));
    // r = cot(theta / 2)
    float modulus = 1.0 / tan(0.5 * angles.x);
    return modulus * phase_factor;
}

struct EscapeTimeResults {
    float iterations;
    vec2 position;
};

// Function to iterate
vec2 f(vec2 z);

EscapeTimeResults escape_time(vec2 z, float radius) {
    float radius_squared = radius * radius;
    vec2 pos = z;
    EscapeTimeResults results;
    for (int i = 0; i < MAX_ITERATIONS; i++) {
        pos = f(pos);
        if (dot(pos, pos) > radius_squared) {
            results.iterations = float(i);
            results.position = pos;
            return results;
        }
    }
    results.iterations = float(MAX_ITERATIONS);
    results.position = pos;
    return results; 
}

vec2 f(vec2 z) {
    return 1.0001 * z;
}

void main() {
    vec2 angles = to_angles(fUv);
    vec2 z = to_complex(angles);

    EscapeTimeResults results = escape_time(z, 2.0);

    //float circle = step(2.0, length(z));
    gl_FragColor = vec4(results.iterations, 0.0, 0.0, 1.0);
}
