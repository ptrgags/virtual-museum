#define MAX_ITERATIONS 500.0
#define EPSILON 0.0001
#define ASPECT_RATIO 2.0

//uniform vec3 eye;
uniform float time;

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
    float sphere = sdf_sphere(cells, 0.5);
    return sphere;
}

// Capture information about the rendered scene
struct RaymarchResults {
    float iters;
    float depth;
    vec3 pos;
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

void main() {
    // Center the UV coordinates and account for the aspect ratio
    vec2 centered_uv = fUv - 0.5;
    centered_uv.x *= ASPECT_RATIO;

    // TODO: Use the real wall dimensions and eye instead of a constant
	// one so the scene reacts to the player
    vec3 fake_eye = vec3(0.0, 0.0, -6.5);
    vec3 image = vec3(centered_uv, -3.5);
    vec3 direction = normalize(image - fake_eye);
    vec3  aisle = vec3(1.0, 0.0, 0.0);
    vec3 movement = time * vec3(0.0, 1.0, 10.0);
    
    RaymarchResults results = raymarch(fake_eye + aisle + movement, direction);
   
    float mask = 1.0 - step(MAX_ITERATIONS, results.iters);
    
    // Color by how close the surface is to the camera.
    float depth_gradient = mod(results.depth, 50.0) / 50.0;
    // Color by the number of iterations
    float iter_gradient = min(results.iters / (0.1 * MAX_ITERATIONS), 1.0);
    
    vec3 color = mix(
        vec3(0.0, 0.5, 1.0),
        vec3(1.0, 0.5, 0.0),
        depth_gradient);
	color *= mask * iter_gradient;

    // Output to screen
    gl_FragColor = vec4(color, 1.0);
}
