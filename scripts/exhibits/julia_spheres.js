/**
 * Exhibit to demonstrate toon shading.
 *
 * I also use it as a way to showcase my superseashells, which will
 * likely become a motif throughout the exhibit
 */
class JuliaSphereExhibit extends Exhibit {
    make_shader_requests() {
        return [
           ajax('shaders/uv_quad.vert'),
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
                c: {value: vec2(.285, .01)}
            },
            name: 'julia_sphere',
            vertexShader: vert,
            fragmentShader: frag,
        });
    }

    get obj_bboxes() {
        return [];
    }

    make_materials(shader_text) {
        let [vert, frag] = shader_text;

        let base_mat = this.make_template_material(vert, frag);

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
        sphere.position.y = this.ROOM_SIZE / 2.0;
        sphere.scale.multiplyScalar(3.0);

        return [sphere];
    }

    update() {
    }
}
