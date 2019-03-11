precision highp float;
#define MAX_ITERATIONS 500.0
#define EPSILON 0.0001
#define ASPECT_RATIO 2.0
#define FOUR_PI 12.56637


// Uniforms ==================================================

// Time for animation
uniform float time;

// Position of the eye relative to the center of the room (normalized so
// the room height is 1
uniform vec3 eye;

// Angle that measures how much the room is rotated from the standard
// definition where the raymarch wall is facing north
uniform float room_angle;

varying vec2 fUv;

// Signed Distance Field Geometry ====================================

// CSG Operations
#define sdf_union min
#define sdf_intersecion max
#define sdf_sub(a, b) max((a), -(b))

// use mod() to repeat the scene forever in all three directions.
vec3 repeat_domain(vec3 pos, float modulo) {
    return mod(pos + 0.5 * modulo, modulo) - modulo * 0.5;
}

// like repeat_domain, but only in the x and z directions
vec3 repeat_xz(vec3 pos, float modulo) {
    vec2 grid = mod(pos.xz + 0.5 * modulo, modulo) - modulo * 0.5; 
    return vec3(grid.x, pos.y, grid.y);
}

// Distance to the sphere
float sdf_sphere(vec3 pos, float radius) {
    return length(pos) - radius;
}

/**
 * Distance to infinite cylinder with axis in the y direction
 */
float sdf_cylinder(vec3 pos, float radius) {
    float s = length(pos.xz);
    return s - radius;
}

float sdf_cube(vec3 pos, float radius) { 
    // Mirror across all axes
    vec3 quadrant1 = abs(pos);

    return length(max(quadrant1 - radius, 0.0));
    
    //float max_coord = max(pos.x, max(pos.y, pos.z));
    //return max_coord - radius;
}

// Infinite slab in the xz-plane
float sdf_slab(vec3 pos, float center, float half_thickness) {
    return abs(pos.y - center) - half_thickness;
}

// Signed distance function represents the distance
// to the nearest surface in the scene
// + means outside, - means inside
//
// The actual scene's signed distance function will be defined in the
// footer of this shader
float sdf(vec3 pos);


mat3 rotate_y(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        c, 0, -s,
        0, 1, 0,
        s, 0, c);
}

mat3 rotate_z(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        c, s, 0,
        -s, 0, 0,
        0, 0,  1);
}

/**
 * Numerically compute the gradient to compute the normal
 */
vec3 get_normal(vec3 pos) {
    const float h = 0.001; 

    // Only computing the forward difference quotient since it saves
    // sdf lookups
    float f_here = sdf(pos);
    vec3 diff = vec3(
        sdf(pos + vec3(h, 0, 0)) - sdf(pos + vec3(-h, 0, 0)),
        sdf(pos + vec3(0, h, 0)) - sdf(pos + vec3(0, -h, 0)),
        sdf(pos + vec3(0, 0, h)) - sdf(pos + vec3(0, 0, -h)));

    // No need to divide by h if we're going to normalize it anyway
    return normalize(diff);
}

// Sinusoid that varies on the range [0, 1]
float haversin(float x) {
    return 0.5 - 0.5 * cos(x);
}

/**
 * Pick a color for each cell
 */
vec3 cell_color(vec3 pos) {
    vec3 coords = floor(pos - 0.5);
    float r = haversin(coords.x * 30.0 - 0.5 * time);
    float g = haversin(coords.y * 11.0 - 0.5 * time);
    float b = haversin(coords.z * 19.0 - 0.5 * time);
    return vec3(r, g, b);
}

// ===================================================================

// Capture information about the rendered scene
struct RaymarchResults {
    float iters;
    float depth;
    vec3 pos;
    vec3 color;
};
 
// Perform raymarching.
RaymarchResults raymarch(vec3 eye, vec3 direction) {
    float t = 0.0;
    
    RaymarchResults results;
    for (float i = 0.0; i < MAX_ITERATIONS; i++) {
        // Where is the ray now?
        vec3 ray = eye + t * direction;
        
        // use the signed-distance function to
        // find how close we are to something in the scene
        float dist = sdf(ray);
        
        if (dist < EPSILON) {
            // If we've reached the surface, return
            // iteration count, distance along the
            // ray (depth), and the surface location in space
            results.iters = i;
            results.depth = t;
            results.pos = ray;
            results.color = cell_color(results.pos);
            return results;
            
        } else {
            // based on the distance field, we know
            // that within a sphere of dist units from
            // the current location, there is nothing
            // in our way. So jump forward that much.
            t += dist;
        }
    }
    
    // Stop if the ray goes off into the background
    results.iters = MAX_ITERATIONS;
    results.depth = t;
    results.pos = eye + t * direction;
    results.color = vec3(0.0);
	return results;
}

/**
 * March from surface to light surface and see if we hit anything
 * return 0 if we hit something, 1 otherwise
 */
float is_visible(vec3 pos, vec3 light_dir) {
    float t = 5.0 * EPSILON;
    float max_t = length(light_dir);
    vec3 L = normalize(light_dir);
    const int MAX_STEPS = 50;
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 ray = pos + t * L;
        float dist = sdf(ray);
        if (dist < EPSILON) {
            return 0.0;
        } else {
            t += dist;
        }

        if (t >= max_t)
            break;
    }
    return 1.0;
}


/**
 * Apply simple lambert shading to a point in the scene
 */
vec3 lambert_shading(vec3 pos, vec3 box_pos, vec3 surface_color, float scale) {
    vec3 N = get_normal(pos);

    // lights are specified relative to the current box position
    const int NUM_LIGHTS = 6;
    vec3 LIGHTS[NUM_LIGHTS];
    LIGHTS[0] = vec3(-1.0, 0.0, -1.0);
    LIGHTS[1] = vec3(1.0, 0.0, -1.0);
    LIGHTS[2] = vec3(-1.0, 1.0, -1.0);
    LIGHTS[3] = vec3(1.0, 1.0, -1.0);
    LIGHTS[4] = vec3(0.0, 0.0, -1.0);
    LIGHTS[5] = vec3(0.0, 1.0, -1.0);

    const float LIGHT_INTENSITY = 0.3;
    const vec3 AMBIENT_LIGHT = vec3(0.3);

    // Lambert shading
    vec3 color = 0.1 * surface_color;
    for (int i = 0; i < NUM_LIGHTS; i++) {
        vec3 light_dir = box_pos + scale * LIGHTS[i] - pos;
        vec3 L = normalize(light_dir);
        float dist_sqr = dot(light_dir, light_dir);

        //float visibility = is_visible(pos, light_dir); 

        float lambert = LIGHT_INTENSITY /** visibility*/ * max(dot(L, N), 0.0);
        color += surface_color * lambert / dist_sqr;
    }
    return color;
}

/**
 * Simplee Fog equation based on Íñigo Quíles' article:
 *
 * http://www.iquilezles.org/www/articles/fog/fog.htm
 */
vec3 fog(vec3 color, float dist, float scale) {
    float fog_amount = 1.0 - exp(-dist * scale);
    vec3 fog_color = vec3(0.5);
    return mix(color, fog_color, fog_amount);

}


/**
 * Wall coordinate relative to the room center in the standard orientation
 * of down the z axis.
 */
vec3 wall_coord() {
    float x = 2.0 * fUv.x - 1.0;
    float y = fUv.y;
    float z = -1.0;
    return vec3(x, y, z);
}

vec3 standardize_eye() {
    return rotate_y(-room_angle) * eye;
}
