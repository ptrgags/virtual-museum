float sdf(vec3 pos) {
    // Subdivide space into cells
    vec3 cells = repeat_domain(pos, 2.0);

    // Put a sphere in each box
    float sphere = sdf_sphere(cells, 0.5);

    // Make an infinite lattice of thin, infinite cylinders in three directions
    const float GRID_THICKNESS = 0.06;
    vec3 cells2 = repeat_domain(pos, 0.25);
    float cyl_y = sdf_cylinder(cells2, GRID_THICKNESS);
    float cyl_z = sdf_cylinder(cells2.yzx, GRID_THICKNESS);
    float cyl_x = sdf_cylinder(cells2.zxy, GRID_THICKNESS);
    float cylinders = sdf_union(cyl_y, cyl_z);
    cylinders = sdf_union(cylinders, cyl_x);

    // Use the cylinder lattice to bore holes through the spheres.
    return sdf_sub(sphere, cylinders);
}

void main() {
    // Standardize the wall and eye position so the wall with the screen
    // is considered the -z direction
    vec3 standard_wall = wall_coord();
    vec3 standard_eye = standardize_eye();

    // Direction from eye to the wall coordinate
    vec3 direction = normalize(standard_wall - standard_eye);

    // Move through the field of spheres
    vec3 aisle_offset = vec3(0.0, -0.25, 0.0);
    vec3 movement = time * vec3(0.0, 0.0, -1.0);
    vec3 box_pos = aisle_offset + movement;
    RaymarchResults results = raymarch(box_pos + standard_eye, direction);

    // Apply diffuse lighting and fog
    const float ROOM_SCALE = 1.0;
    const float LIGHT_INTENSITY = 0.3;
    vec3 shaded = lambert_shading(
        results.pos, box_pos, results.color, ROOM_SCALE, LIGHT_INTENSITY);
    vec3 foggy = fog(shaded, results.depth, 0.05);
   
    // Output to screen
    gl_FragColor = vec4(foggy, 1.0); 
}
