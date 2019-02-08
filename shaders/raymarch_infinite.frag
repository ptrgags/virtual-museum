#define MAX_ITERATIONS 500.0
#define EPSILON 0.0001
#define ASPECT_RATIO 2.0

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
uniform float time;
uniform PointLight pointLights[NUM_POINT_LIGHTS];

varying vec2 fUv;

// use mod() to repeat the scene forever in all three directions.
vec3 repeat_domain(vec3 pos, float modulo) {
    return mod(pos + 0.5 * modulo, modulo) - modulo * 0.5;
}

// Distance to the sphere
float sdf_sphere(vec3 pos, float radius) {
    return length(pos) - radius;
}

// Signed distance function represents the distance
// to the nearest surface in the scene
// + means outside, - means inside
float sdf(vec3 pos) {
    vec3 cells = repeat_domain(pos, 2.0);
    float sphere = sdf_sphere(cells, 0.45);
    return sphere;
}

vec3 get_normal(vec3 pos) {
    // Find the coordinates relative to the center of the current cell
    vec3 cells = repeat_domain(pos, 2.0);
    //For a sphere, the normal is radially outward from the center
    return normalize(cells);
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

void main() {
    // Center the UV coordinates and account for the aspect ratio
    vec2 centered_uv = fUv - 0.5;
    centered_uv.x *= ASPECT_RATIO;

    // TODO: Use the real wall dimensions and eye instead of a constant
	// one so the scene reacts to the player
    vec3 fake_eye = vec3(0.0, 0.0, -6.5);
    vec3 image = vec3(centered_uv, -3.5);
    vec3 direction = normalize(image - fake_eye);

    // Move the camera through an aisle between the infinite grid of shapes
    vec3 aisle = vec3(1.0, 0.0, 0.0);
    vec3 movement = time * vec3(0.0, 1.0, 10.0);
    
    // Do the raymarching
    RaymarchResults results = raymarch(fake_eye + aisle + movement, direction);

    // Apply diffuse lighting and fog
    vec3 shaded = lambert_shading(results.pos);
    vec3 foggy = fog(shaded, results.depth, 0.05);
   
    // Output to screen
    gl_FragColor = vec4(foggy, 1.0);
}
