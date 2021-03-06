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

                // I picked the parameters for the cosine color palettes
                // using this handy online editor by Karsten Schmidt:
                // http://dev.thi.ng/gradients/
                // https://github.com/thi-ng/color
                outside_palette: {value: {
                    bias: vec3(0.5, 0.5, 0.5),
                    amp: vec3(0.5, 0.5, 0.5),
                    freq: vec3(2.0, 1.0, 1.0),
                    phase: vec3(0, 0.1, 0.4),
                }},
                inside_palette: {value: {
                    bias: vec3(0.5, 0.5, 0.0),
                    amp: vec3(0.5, 0.2, 0.0),
                    freq: vec3(1.0, 1.0, 0.0),
                    phase: vec3(0, 0.1, 0.0),
                }}, 
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
    }

    make_main_objs() {

        let geom = new THREE.SphereGeometry(1, 100, 100);
        let mat = this.materials.get('julia');

        let sphere = new THREE.Mesh(geom, mat);
        sphere.position.y = 0.5 * this.ROOM_SIZE;
        sphere.scale.multiplyScalar(5.0);

        this.sphere = sphere;

        return [sphere];
    }


    get complex_point() {
        let eye = this.museum.camera.eye.clone();
        const MAX_COORD = 2.0;
        eye.divideScalar(this.ROOM_SIZE).multiplyScalar(MAX_COORD);
        return vec2(eye.x, -eye.z);
    }

    make_coeffs(t, phase_offset) {
        let NUM_COEFFS = 4;
        let buf = [];
        for (let i = 0; i < NUM_COEFFS; i++) { 
            let freq = 0.17 * i;
            let val = haversin(freq * t + phase_offset);
            buf.push(val);
        }
        return buf;
    }

    update(t) {
        let freq = 0.1;
        let uniforms = this.materials.get('julia').uniforms;

        uniforms.numerator_coeffs.value = this.make_coeffs(t, 0.0);

        const ROTATION_RATE = 0.25;
        this.sphere.rotation.y = ROTATION_RATE * t;

        uniforms.c.value = this.complex_point;
    }

    get label() {
        return [
            '        ',
            ' Julia  ',
            '  Set   ',
            '        ',
            'Fractal ',
            ' Sphere ',
            '        ',
            '        ',
        ].join('');
    }
}
