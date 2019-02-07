#define TOTAL_ROOMS 64
uniform vec2 map_dims;
uniform float map_data[TOTAL_ROOMS];
uniform int entrance;
uniform int current_room;

varying vec2 fUv;

/**
 * Convert 2D indices -> 1D indices
 */
int coords_to_index(vec2 cell_coords) {
    return int(cell_coords.y * map_dims.x + cell_coords.x);
}

/**
 * Check if there is a room at the current index
 */
float room_exists(int room_index) {
    // Because GLSL doesn't allow non-constant array indices :(
    for (int i = 0; i < TOTAL_ROOMS; i++) {
        if (i == room_index)
            return map_data[i];
    }
    return 0.0;
}

/**
 * Draw brackets in the corners of the 
 */
float brackets(vec2 uv) {
    // Center the UV coordinates on the center of the cell
    vec2 centered = uv - 0.5;

    // The brackets will have 4-fold rotational symmetry, soo
    // use this to our advantage by usinng abs()
    vec2 quadrant1 = abs(centered);

    // Start by drawing a border around the entire cell
    // ---------
    // |       |
    // |       |
    // |       |
    // ---------
    float max_coord = max(quadrant1.x, quadrant1.y);
    float border_mask = step(0.35, max_coord);

    // We don't want the entire border, so make a square mask that's
    // flush with the far corners of the cell. 
    // +++   +++
    // +++   +++
    //
    // +++   +++
    // +++   +++
    float min_coord = min(quadrant1.x, quadrant1.y);
    float corner_mask = step(0.15, min_coord);

    // Intersect the two masks. This makes a border with a hole in each
    // side like this:
    // ---   ---
    // |       |
    //
    // |       |
    // ---   ---
    return border_mask * corner_mask;
}

void main() {
    // Make a grid of cells.
    vec2 cell_coords = floor(fUv * map_dims);
    vec2 cell_uv = fract(fUv * map_dims);

    // Flip the grid's y coordinate since the array is in rows and columns
    cell_coords.y = (map_dims.y - 1.0) - cell_coords.y;

    // Check if there is a room at the current grid cell
    int room_index = coords_to_index(cell_coords);
    float show_room = room_exists(room_index);

    // Put brackets around each valid room in white. The only exception
    // is if this room is the entrance, then color the brackets green
    float bracket_mask = brackets(cell_uv);
    float entrance_mask = float(room_index == entrance);

    // Draw a yellow circle in the current room as a "you are here" marker
    float current_mask = float(room_index == current_room);
    float dist_center = length(cell_uv - 0.5);
    float you_are_here = 1.0 - step(0.25, dist_center);

    // Composite the layers of the image
    const vec3 BACKGROUND_COLOR = vec3(0.0, 0.2, 0.5);
    const vec3 OUTLINE_COLOR = vec3(1.0);
    const vec3 ENTRANCE_COLOR = vec3(0.0, 1.0, 0.0);
    const vec3 YOU_ARE_HERE_COLOR = vec3(1.0, 1.0, 0.0);
    vec3 image = BACKGROUND_COLOR;
    image = mix(image, OUTLINE_COLOR, show_room * bracket_mask);
    image = mix(image, ENTRANCE_COLOR, entrance_mask * bracket_mask);
    image = mix(image, YOU_ARE_HERE_COLOR, current_mask * you_are_here);

    // Make the minimap partially transparent
    gl_FragColor = vec4(image, 0.5);
}
