#define TOTAL_ROOMS 64
uniform vec2 map_dims;
uniform vec2 map_data[TOTAL_ROOMS];
uniform float entrance;
uniform float current_room;

varying vec2 fUv;

void main() {
    vec2 cell_coords = floor(fUv * map_dims);
    cell_coords.y = (map_dims.y - 1.0) - cell_coords.y;
    vec2 cell_uv = fract(fUv * map_dims);

    gl_FragColor = vec4(cell_uv, 0.0, 1.0);
}
