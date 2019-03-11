/**
 * Triangle wave in 3 directions
 *
 * tri(0) = 1
 * tri(-1) = tri(1) = 1
 */
vec3 tri(vec3 v) {
    return abs(mod(v, 2.0) - 1.0);
}

vec3 repeat(vec3 v, float num_cells) {
    return 1.0 - tri(num_cells * v);
}

float sdf(vec3 pos) {
    // Subdivide space into cells
    vec3 cells = repeat(pos, 1.0);

    // Make a 3D lattice of cubes
    const float CUBE_SIZE = 0.5;
    float cubes = sdf_cube(cells, CUBE_SIZE);

    // Make 2D lattices of cylinders that intersects the cubes 
    const float TUBE_RADIUS = 0.3;
    float tube_x = sdf_cylinder(cells.zxy, TUBE_RADIUS);
    float tube_z = sdf_cylinder(cells.yzx, TUBE_RADIUS);
    float tube = sdf_union(tube_x, tube_z);

    // Make a slightly thinner versionn of the tube 
    float thinner_tube = tube + 0.1;

    // Combine the cubes and big cylinder lattice, then cut out a tunnel
    float tubes_n_cubes = sdf_union(tube, cubes);
    tubes_n_cubes = sdf_sub(tubes_n_cubes, thinner_tube);

    // Slice off the top of the layer that goes through the origin, this
    // makes a halfpipe so we can see out
    float slab = sdf_slab(pos, 0.3, 0.3); 
    float halfpipe = sdf_sub(tubes_n_cubes, slab);

    return halfpipe;
}

void main() {
    // Standardize the wall and eye position so the wall with the screen
    // is considered the -z direction
    vec3 standard_wall = wall_coord();
    vec3 standard_eye = standardize_eye();

    const float ROOM_SCALE = 0.01;
    standard_wall *= ROOM_SCALE;
    standard_eye *= ROOM_SCALE;

    // Direction from eye to the wall coordinate
    vec3 direction = normalize(standard_wall - standard_eye);

    // Move through the field of spheres
    vec3 aisle_offset = vec3(1.0, 0.0, 1.0);
    vec3 movement = 0.01 * time * vec3(0.0, 1.0, 0.0);
    vec3 box_pos = aisle_offset + movement;
    RaymarchResults results = raymarch(box_pos + standard_eye, direction);

    // Apply diffuse lighting and fog
    vec3 shaded = lambert_shading(results.pos, box_pos, results.color, ROOM_SCALE);
    vec3 foggy = fog(shaded, results.depth, 0.05);
   
    // Output to screen
    gl_FragColor = vec4(foggy, 1.0); 
}
