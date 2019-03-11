#define MAX_DEGREE 3
#define NUM_TERMS (MAX_DEGREE + 1)

/**
 * Complex conjugation:
 * (a + bi)* = (a - bi)
 */
vec2 conj(vec2 z) {
    return vec2(z.x, -z.y);
}

/**
 * Complex multiplication
 * 
 * (a + bi)(c + di) = (ac - bd) + (ad + bc)i
 *
 * The matrix representation trick I learned from Fabrice Neyret's
 * Shadertoy Unofficial Wordpress site:
 * https://shadertoyunofficial.wordpress.com/2019/01/02/programming-tricks-in-shadertoy-glsl/
 */
vec2 cmult(vec2 z, vec2 w) {
    return mat2(z.xy, -z.y, z.x) * w;
}

/**
 * Complex inverse:
 *
 * 1/z = z* / |z|^2
 *
 * and |z|^2 = z * z* = (a^2 + b^2) = dot(z, z)
 */
vec2 cinv(vec2 z) {
    return conj(z) / dot(z, z);
}

/**
 * Complex division:
 *
 * z / w = z * (1 / w)
 */
vec2 cdiv(vec2 z, vec2 w) {
    return cmult(z, cinv(w));
}

/**
 * Coefficients for f(z)
 */
uniform float numerator_coeffs[NUM_TERMS];
uniform float denominator_coeffs[NUM_TERMS];

/**
 * Point in the complex plane
 */
uniform vec2 c;

/**
 * Compute the powers
 * z^0, z^1, ... z^n and store them in a buffer
 */
void compute_powers(inout vec2[NUM_TERMS] powers, vec2 z) {
    powers[0] = vec2(1.0, 0.0);
    powers[1] = z;
    for (int i = 2; i < NUM_TERMS; i++) {
        powers[i] = cmult(z, powers[i - 1]);
    }
}

/**
 * Compute
 *
 * f(z) = az^3 + bz^2 + cz + d + C
 *
 * Where C is the current position and the other variables are coefficients
 * passed in from JavaScript
 */
vec2 f(vec2 z) {
    vec2 powers[NUM_TERMS];
    compute_powers(powers, z);

    vec2 top_sum = vec2(0.0);
    vec2 bottom_sum = vec2(0.0);
    for (int i = 0; i < NUM_TERMS; i++) {
        top_sum += numerator_coeffs[i] * powers[i];
    }

    return top_sum + c;
}

float haversin(float x) {
    return 0.5 + 0.5 * cos(x);
}

void main() {
    // Compute the julia set
    vec2 angles = to_angles(fUv);
    vec2 z = to_complex(angles);
    EscapeTimeResults results = escape_time(z);

    // Coloring for points outside the julia set

    // Odd/even iteration count
    float iter_mask = 0.5 + 0.5 * mod(results.iterations, 2.0);

    // Escape angle
    float angle = atan(results.position.y, results.position.x); 
    float angle_norm = fract(angle / PI);

    vec3 outside_color = iter_mask * vec3(angle_norm, 0.0, 0.0);

    // Coloring 3: Odd/even max radius
    float max_r_mask = 0.5 + 0.5 * mod(results.max_dist_sqr, 2.0);

    // Coloring 4: Polyline Distance
    float dist = fract(results.poly_dist);
    vec3 inside_color = iter_mask * vec3(0.0, dist, 0.0);

    vec3 color = mix(inside_color, outside_color, results.escaped);

    gl_FragColor = vec4(color, 1.0);
}
