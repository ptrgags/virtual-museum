#define MAX_ITERATIONS 500.0
#define EPSILON 0.0001
#define ASPECT_RATIO 2.0

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

// Capture information about the rendered scene
struct RaymarchResults {
    float iters;
    float depth;
    vec3 pos;
};

// Point lights provided by Three.js
struct PointLight {
    vec3 color;
    vec3 position; // in view space
    float distance;
};

//uniform vec3 eye;
uniform PointLight pointLights[NUM_POINT_LIGHTS];
uniform float time;
uniform vec3 eye;
uniform float room_angle;

varying vec2 fUv;

// use mod() to repeat the scene forever in all three directions.
vec3 repeat_domain(vec3 pos, float modulo) {
    return mod(pos + 0.5 * modulo, modulo) - modulo * 0.5;
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

#define sdf_union min
#define sdf_intersecion max
#define sdf_sub(a, b) max((a), -(b))

// Signed distance function represents the distance
// to the nearest surface in the scene
// + means outside, - means inside
float sdf(vec3 pos) {
    vec3 cells = repeat_domain(pos, 2.0);
    float sphere = sdf_sphere(cells, 0.5);

    // Make an infininite lattice of cylinders 
    const float GRID_THICKNESS = 0.06;
    vec3 cells2 = repeat_domain(pos, 0.25);
    float cyl_y = sdf_cylinder(cells2, GRID_THICKNESS);
    float cyl_z = sdf_cylinder(cells2.yzx, GRID_THICKNESS);
    float cyl_x = sdf_cylinder(cells2.zxy, GRID_THICKNESS);
    float cylinders = sdf_union(cyl_y, cyl_z);
    cylinders = sdf_union(cylinders, cyl_x);

    return sdf_sub(sphere, cylinders);
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
	return results;
}


/**
 * Apply simple lambert shading to a point in the scene
 */
vec3 lambert_shading(vec3 pos) {
    vec3 N = get_normal(pos);

    // Lambert shading
    vec3 color = vec3(0.0);
    for (int i = 0; i < NUM_POINT_LIGHTS; i++) {
        vec3 L = normalize(pointLights[i].position - pos);
        vec3 lambert = pointLights[i].color * max(dot(L, N), 0.0);
        color += lambert;
    }

    return color;
}

/**
 * Simplee Fog equation based on Iñigo Quìles' article:
 *
 * http://www.iquilezles.org/www/articles/fog/fog.htm
 */
vec3 fog(vec3 color, float dist, float scale) {
    float fog_amount = 1.0 - exp(-dist * scale);
    vec3 fog_color = vec3(0.5, 0.5, 0.5);
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


void main() {
    // Standardize the wall and eye position so the wall with the screen
    // is considered the -z direction
    vec3 standard_wall = wall_coord();
    vec3 standard_eye = rotate_y(-room_angle) * eye;

    // Direction from eye to the wall coordinate
    vec3 direction = normalize(standard_wall - standard_eye);

    // Move through the field of spheres
    vec3 aisle_offset = vec3(0.0, -0.25, 0.0);
    vec3 movement = time * vec3(0.0, 0.0, -1.0);
    RaymarchResults results = raymarch(standard_eye + aisle_offset + movement, direction);

    // Apply diffuse lighting and fog
    vec3 shaded = lambert_shading(results.pos);
    vec3 foggy = fog(shaded, results.depth, 0.05);
   
    // Output to screen
    gl_FragColor = vec4(foggy, 1.0); 
}
