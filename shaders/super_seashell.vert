#define PI 3.141593
#define TWO_PI 6.283185

/**
 * Super Seashell Shader (try saying that five times fast!)
 *
 * Parametric surface that's a seashell surface (really a conical helix)
 * except the cross section is a superellipse instead of a circle.
 *
 * The input vertices to this shader can be any shape as long as UV
 * coordinates are defined. a quad with many segments is a fine choices
 * of model.
 *
 * This shader is designed to be compatible with the toon shader
 * and hopefully other 
 */

/**
 * Parameters for the super seashell.
 * most are vec2s where the x component represents the initial value
 * and the y component represents the final value. These values are
 * linearly interpolated unless otherwise noted
 */
struct SuperSeashell {
    // Coil dimensions ==========================================

    // The initial and final radii for the main coil of the seashell.
    // Setting the final radius smaller adds a taper characteristic of 
    // seashells
    vec2 coil_radius;
    // The intiial and final angles for the main coil of the seashell.
    // The final angle can be larger than 2pi. This is necessary to get
    // helices and seashells of multiple turns
    vec2 coil_angle;
    // bottom and top z-coordinates of the seashell
    vec2 coil_z;
    // The coil is in the shape of a superellipse, not a circle like a
    // typical helix. The two exponents can be controlled independently.
    // Exponents are interpolated linearly in logarithmic space
    vec2 coil_p;
    vec2 coil_q;

    // Cross Section Dimensions ======================================

    // Initial and final radius of the cross section. This can be
    // used to taper the thickness of the seashell
    vec2 cross_section_radius;
    // Unlike the coil which may curl around many times, the cross section
    // will always go through exactly one turn. However, the initial
    // angle can change over the length of the shell. This adds an additional
    // twist to the shape.
    vec2 cross_section_twist;
    // The cross section is also a superellipse. The exponents can be
    // controled independently, and are interpolated in log space
    vec2 cross_section_n;
    vec2 cross_section_m;
};

uniform SuperSeashell seashell_params;

varying vec3 fPositionView;
varying vec3 fNormalView;
varying vec2 fUv;

/**
 * Generalized form of a cosine function used in the parametric equation
 * for superellipses. I'm not sure if there's a name for this so I'm calling
 * it a supercosine wave
 *
 * sgn(cos x)|cos x|^(2 / n)
 */
float supercos(float x, float n) {
    float c = cos(x);
    float exponent = 2.0 / n;
    return sign(c) * pow(abs(c), exponent);
}

/**
 * Generalized form of a sine function used for superellipses
 */
float supersin(float x, float n) {
    float s = sin(x);
    float exponent = 2.0 / n;
    return sign(s) * pow(abs(s), exponent);
}

/**
 * Superellipse with radius
 */
vec2 superellipse(float theta, float n, float m) {
    float x = supercos(theta, n);
    float y = supersin(theta, m);
    return vec2(x, y);
}

/**
 * Linearly interpolate a parameter
 * start = param.x
 * finish = param.y
 * mix start and finish with the value 
 */
float lerp(vec2 param, float t) {
    return mix(param.x, param.y, t);
}

/**
 * linear interpolation in log space,
 * or whatever it's called when you compute exp(lerp(ln(start), ln(end), t))
 *
 * This simplifies to 
 * 
 * start^(1 - t) * finish^t
 */
float loglerp(vec2 param, float t) {
    return pow(param.x, 1.0 - t) * pow(param.y, t);
}

mat2 rotate(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat2(c, s, -s, c);
}

vec3 seashell(vec2 uv) {     
    // the u direction circulates around the cross section, though not
    // always in a circle ;)
    // The v direction goes along the coil of the seashell, a path which
    // depends highly on the parameters

    // Compute the cross section (a superellipse) of the coil
    float theta = TWO_PI * uv.x;
    float r = lerp(seashell_params.cross_section_radius, uv.y);
    float m = loglerp(seashell_params.cross_section_m, uv.y); 
    float n = loglerp(seashell_params.cross_section_n, uv.y); 
    // cross section is really measured in cylindrical coordinates:
    // cross_section.x -> radial direction
    // cross_section.y -> z direction
    vec2 cross_section = r * superellipse(theta, m, n);

    // As an added twist (literally), rotate the cross section over the
    // course of the spiral
    float twist_amount = lerp(seashell_params.cross_section_twist, uv.y);
    vec2 twisted = rotate(twist_amount) * cross_section;

    // Compute the center of the winding coil
    float phi = lerp(seashell_params.coil_angle, uv.y);
    float R = lerp(seashell_params.coil_radius, uv.y);
    float p = loglerp(seashell_params.coil_p, uv.y);
    float q = loglerp(seashell_params.coil_q, uv.y);
    vec2 coil_shape = superellipse(phi, p, q);
    float z = lerp(seashell_params.coil_z, uv.y);

    // Combine the above while fixing the coordinates so y is up instead
    // of z
    return vec3(
        (R + twisted.x) * coil_shape.x,
        z + twisted.y,
        (R + twisted.x) * -coil_shape.y);        
}

/**
 * Compute the normal numerically
 */
vec3 compute_normal(vec3 surface_point) {
    const float h = 0.0001;
    vec3 u_neighbor = seashell(uv + vec2(h, 0.0));
    vec3 v_neighbor = seashell(uv + vec2(0.0, h));
    vec3 u_deriv = (u_neighbor - surface_point) / h;
    vec3 v_deriv = (v_neighbor - surface_point) / h;
    vec3 normal = cross(u_deriv, v_deriv);
    return normalize(normal);
}

void main() {
    // Ingore the coordinates of the seashell and use the uv coordinates
    // to find a point on the seashell
    vec3 seashell_model = seashell(uv);

    // TODO: Compute vertex normals analytically. This will be fun...
    vec3 seashell_normal = compute_normal(seashell_model);

    // Now apply the matricies as usual
    fPositionView = vec3(modelViewMatrix * vec4(seashell_model, 1.0));
    fNormalView = vec3(modelViewMatrix * vec4(seashell_normal, 0.0));

    // Flip the normal if it's facing away from the camera, this is
    // a hollow surface
    float normal_backwards = float(
        dot(fNormalView, vec3(0.0, 0.0, 1.0)) < 0.0);
    fNormalView = mix(fNormalView, -fNormalView, normal_backwards);

    fUv = uv;
    gl_Position = projectionMatrix * vec4(fPositionView, 1.0);
}
