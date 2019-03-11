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
    // Distance of a polygonal line through each iteration
    float poly_dist;
    // Maximum distance the iterated point achieved (squared)
    float max_dist_sqr;
};

// Function to iterate
vec2 f(vec2 z);

EscapeTimeResults escape_time(vec2 z) {
    float radius_squared = escape_radius * escape_radius;

    // Keep track of the two most recent points
    vec2 prev = z;
    vec2 pos = z;

    EscapeTimeResults results;
    results.poly_dist = 0.0;
    results.max_dist_sqr = 0.0;
    
    for (int i = 0; i < MAX_ITERATIONS; i++) {
        // Move forward one iteration
        prev = pos;
        pos = f(pos);

        float modulus_squared = dot(pos, pos);

        // Update the distance traveled and max distance from origin
        results.poly_dist += length(pos - prev);
        results.max_dist_sqr = max(results.max_dist_sqr, modulus_squared);

        // Check if we escaped the circle
        if (modulus_squared > radius_squared) {
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

