/**
 * Exhibit to demonstrate toon shading.
 *
 * I also use it as a way to showcase my superseashells, which will
 * likely become a motif throughout the exhibit
 */
class JuliaSphereExhibit extends Exhibit {
    constructor(museum) {
        super();
        this.museum = museum;
    }

    make_shader_requests() {
        return [
           ajax('shaders/uv_quad.vert'),
           ajax('shaders/escape_time_sphere.frag'),
           ajax('shaders/julia_sphere.frag'),
        ];
    }

    /**
     * Template material for the seashell. It will be cloned and the
     * uniforms updated
     */
    make_template_material(vert, frag) {
        return new THREE.ShaderMaterial({
            uniforms: {
                c: {value: vec2(.285, .01)},
                escape_radius: {value: 2.0},
                // z^2 + c 
                numerator_coeffs: {value: [0, 0, 1, 0]},
                //denominator_coeffs: {value: [0, 0, 1.5, 0]}
            },
            name: 'julia_sphere',
            vertexShader: vert,
            fragmentShader: frag,
            side: THREE.DoubleSide
        });
    }

    get obj_bboxes() {
        return [];
    }

    make_materials(shader_text) {
        let [vert, header_frag, footer_frag] = shader_text;

        let base_mat = this.make_template_material(
            vert, header_frag + '\n' + footer_frag);

        this.materials.set('julia', base_mat);

        /**
            TODO: Something like this but with 4 spheres
        for (let seashell of TOON_SHELLS) {
            let mat_name = `toon-${seashell.name}`;
            let mat = seashell_mat.clone();
            mat.uniforms.seashell_params.value = seashell.seashell_params;
            this.materials.set(mat_name, mat);
        }
        */
    }

    make_main_objs() {

        let geom = new THREE.SphereGeometry(1, 100, 100);
        let mat = this.materials.get('julia');

        let sphere = new THREE.Mesh(geom, mat);
        sphere.position.y = 0.5 * this.ROOM_SIZE;
        sphere.scale.multiplyScalar(5.0);


        return [sphere];
    }


    get complex_point() {
        let eye = this.museum.camera.eye.clone();
        const MAX_COORD = 2.0;
        eye.divideScalar(this.ROOM_SIZE).multiplyScalar(MAX_COORD);
        return vec2(eye.x, -eye.z);
    }

    make_coeffs(phase_offset) {
        let time_sec = performance.now() / 1000.0;
        let NUM_COEFFS = 4;
        let buf = [];
        for (let i = 0; i < NUM_COEFFS; i++) { 
            let freq = 0.17 * i;
            let val = haversin(freq * time_sec + phase_offset);
            buf.push(val);
        }
        return buf;
    }

    update() {
        let time = performance.now() / 1000.0;
        let freq = 0.1;
        let uniforms = this.materials.get('julia').uniforms;

        uniforms.numerator_coeffs.value = this.make_coeffs(0.1);

        uniforms.c.value = this.complex_point;
    }
}
