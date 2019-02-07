#define TOTAL_ROOMS 64
uniform vec2 map_dims;
uniform float map_data[TOTAL_ROOMS];
uniform float entrance;
uniform float current_room;

varying vec2 fUv;

/**
 * Check if there is a room
 */
float room_exists(vec2 cell_coords) {
    int room_index = int(cell_coords.y * map_dims.x +  cell_coords.x);
    // Because GLSL doesn't allow non-constant array indices
    for (int i = 0; i < TOTAL_ROOMS; i++) {
        if (i == room_index)
            return map_data[i];
    }
    return 0.0;
}

float brackets(vec2 uv) {
    vec2 centered = uv - 0.5;
    vec2 quadrant1 = abs(centered);
    float min_coord = min(quadrant1.x, quadrant1.y);
    float max_coord = max(quadrant1.x, quadrant1.y);

    float angle = step(0.35, max_coord);
    float bounds = step(0.15, min_coord);
    return angle * bounds;
}

void main() {
    // Make a grid of cells.
    vec2 cell_coords = floor(fUv * map_dims);
    vec2 cell_uv = fract(fUv * map_dims);

    // Flip the grid's y coordinate since the array is in rows and columns
    cell_coords.y = (map_dims.y - 1.0) - cell_coords.y;

    // Check if there is a room at the current grid cell
    float show_room = room_exists(cell_coords);

    // Put brackets around each valid room
    float bracket_mask = brackets(cell_uv);

    const vec3 BACKGROUND_COLOR = vec3(0.0, 0.2, 0.5);
    const vec3 OUTLINE_COLOR = vec3(1.0);
    vec3 image = BACKGROUND_COLOR;
    image = mix(image, OUTLINE_COLOR, show_room * bracket_mask);

    gl_FragColor = vec4(image, 0.5);
}
