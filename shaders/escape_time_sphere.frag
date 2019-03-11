#define PI 3.1415
#define MAX_ITERATIONS 200
varying vec2 fUv;

uniform float escape_radius;

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
    float escaped;
};

// Function to iterate
vec2 f(vec2 z);

EscapeTimeResults escape_time(vec2 z) {
    float radius_squared = escape_radius * escape_radius;
    vec2 pos = z;
    EscapeTimeResults results;
    for (int i = 0; i < MAX_ITERATIONS; i++) {
        pos = f(pos);
        if (dot(pos, pos) > radius_squared) {
            results.iterations = float(i);
            results.position = pos;
            results.escaped = 1.0;
            return results;
        }
    }
    results.iterations = float(MAX_ITERATIONS);
    results.position = pos;
    results.escaped = 0.0;
    return results; 
}

