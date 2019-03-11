/*
 *
 *        az^8 + bz^7 + cz^6 + dz^5 + ez^4 + ez^3 + fz^2 + gz + h
 * f(z) = -------------------------------------------------------
 *        iz^8 + jz^7 + kz^6 + lz^5 + mz^4 + nz^3 + oz^2 + pz + q
 */

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
 *        az^8 + bz^7 + cz^6 + dz^5 + ez^4 + ez^3 + fz^2 + gz + h
 * f(z) = ------------------------------------------------------- + C
 *        iz^8 + jz^7 + kz^6 + lz^5 + mz^4 + nz^3 + oz^2 + pz + q
 *
 * Where C is the current position
 */
vec2 f(vec2 z) {
    vec2 powers[NUM_TERMS];
    compute_powers(powers, z);

    vec2 top_sum = vec2(0.0);
    vec2 bottom_sum = vec2(0.0);
    for (int i = 0; i < NUM_TERMS; i++) {
        top_sum += numerator_coeffs[i] * powers[i];
        //bottom_sum += denominator_coeffs[i] * powers[i];
    }

    return top_sum + c; //cdiv(top_sum, bottom_sum) + c;
}

float haversin(float x) {
    return 0.5 + 0.5 * cos(x);
}

void main() {
    vec2 angles = to_angles(fUv);
    vec2 z = to_complex(angles);

    EscapeTimeResults results = escape_time(z);

    float percent = results.iterations / float(MAX_ITERATIONS);
    float angle = atan(results.position.y, results.position.x);
    float wave = sin(5.0 * angle);

    vec3 color = wave * vec3(0.0, 0.45, 0.33);



    //float circle = step(2.0, length(z));
    gl_FragColor = vec4(color, 1.0);
}
