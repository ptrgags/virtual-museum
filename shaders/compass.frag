#define PI 3.1415

// Unit vector that defines what direction the camera is pointing
uniform vec3 direction;

varying vec2 fUv;

/**
 * Create a rotation matrix from a given angle in radians
 */
mat2 rotate(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat2(c, s, -s, c);
}

void main() {
    // Get a circle mask for the background of the compass
    const float CIRCLE_RADIUS = 0.4;
    vec2 centered_uv = fUv - vec2(0.5);
    float dist_from_center = length(centered_uv);
    float circle_mask = 0.5 * smoothstep(
        CIRCLE_RADIUS + 0.01, CIRCLE_RADIUS, dist_from_center);

    // Get an angle that points to where north is.
    // the -z is to flip the coordinates so north is positive z
    // the x is so we get an angle to the north, not the current
    // angle
    float north_angle = atan(-direction.z, -direction.x);

    // Rotate the UV coordinates so 0 degrees is pointing to where
    // north is
    vec2 rotated = rotate(-north_angle) * centered_uv; 
    float uv_angle = atan(rotated.y, rotated.x);

    // Draw a diamond for the compass by drawing
    vec2 quadrant1 = abs(rotated);
    const vec2 LINE_NORMAL = CIRCLE_RADIUS * vec2(0.3, 0.9);
    float line = dot(quadrant1, LINE_NORMAL);
    const float ISO_SURFACE = 0.035;
    float pointer = smoothstep(ISO_SURFACE + 0.01, ISO_SURFACE, line);

    // Divide the diamond in half so we can color the forward end
    // red and the other black
    float fwd_mask = step(0.0, rotated.x);
    float bwd_mask = 1.0 - fwd_mask;

    // Composite the image together
    const vec3 BACK_COLOR = vec3(0.8);
    const vec3 POINTER_FWD = vec3(1.0, 0.0, 0.0);
    const vec3 POINTER_BWD = vec3(0.0);
    vec3 image = BACK_COLOR;
    image = mix(image, POINTER_FWD, fwd_mask * pointer);
    image = mix(image, POINTER_BWD, bwd_mask * pointer);

    // Draw the image.  Make the background around the

    gl_FragColor = vec4(image, circle_mask);
}
