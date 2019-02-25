/**
 * 16 superseashell shapes designed for the toon room
 */
let TOON_SHELLS = [
    {
        name: 'squagel',
        seashell_params: {
            coil_radius: vec2(1, 1),
            coil_logarithm: vec2(0, 0),
            coil_angle: vec2(0, 2.3 * Math.PI),
            coil_z: vec2(0, 0),
            coil_p: vec2(10, 10),
            coil_q: vec2(10, 10),
            cross_section_radius: vec2(0.5, 0.5), 
            cross_section_twist: vec2(0, 0),
            cross_section_m: vec2(8, 8),
            cross_section_n: vec2(8, 8),
        }
    },
    {
        name: 'diamond-circle-helix',
        seashell_params: {
            coil_radius: vec2(0.8, 0.8),
            coil_logarithm: vec2(0, 0),
            coil_angle: vec2(0, 5.0 * Math.PI),
            coil_z: vec2(-1, 1),
            coil_p: vec2(2, 2),
            coil_q: vec2(2, 2),
            cross_section_radius: vec2(0.3, 0.3), 
            cross_section_twist: vec2(0, 0),
            cross_section_m: vec2(1, 2),
            cross_section_n: vec2(1, 2),
        }
    },
    {
        name: 'logarithmic-spiral',
        seashell_params: {
            coil_radius: vec2(0.1, 0.1),
            coil_logarithm: vec2(3, 3),
            coil_angle: vec2(0, 9.0 * Math.PI),
            coil_z: vec2(0, 0),
            coil_p: vec2(2, 2),
            coil_q: vec2(2, 2),
            cross_section_radius: vec2(0, 0.3), 
            cross_section_twist: vec2(0, 0),
            cross_section_m: vec2(2, 2),
            cross_section_n: vec2(2, 2),
        }
    }, 
    {
        name: 'archimedian-spiral',
        seashell_params: {
            coil_radius: vec2(1, 0),
            coil_logarithm: vec2(0, 0),
            coil_angle: vec2(0, 7.0 * Math.PI),
            coil_z: vec2(0, 0),
            coil_p: vec2(2, 2),
            coil_q: vec2(2, 2),
            cross_section_radius: vec2(0.2, 0), 
            cross_section_twist: vec2(0, 0),
            cross_section_m: vec2(2, 2),
            cross_section_n: vec2(2, 2),
        }
    },
    {
        name: 'cone-shell',
        seashell_params: {
            coil_radius: vec2(0.5, 0),
            coil_logarithm: vec2(0, 0),
            coil_angle: vec2(0, 10.0 * Math.PI),
            coil_z: vec2(-1, 2),
            coil_p: vec2(2, 2),
            coil_q: vec2(2, 2),
            cross_section_radius: vec2(0.4, 0), 
            cross_section_twist: vec2(0, 0),
            cross_section_m: vec2(2, 2),
            cross_section_n: vec2(2, 2),
        }
    },
    {
        name: 'star-coil',
        seashell_params: {
            coil_radius: vec2(1, 0),
            coil_logarithm: vec2(0, 0),
            coil_angle: vec2(0, 8.0 * Math.PI),
            coil_z: vec2(-1, 1),
            coil_p: vec2(0.8, 0.8),
            coil_q: vec2(0.8, 0.8),
            cross_section_radius: vec2(0.3, 0), 
            cross_section_twist: vec2(0, 0),
            cross_section_m: vec2(3, 3),
            cross_section_n: vec2(3, 3),
        }
    },
    {
        name: 'double-cone',
        seashell_params: {
            coil_radius: vec2(1, -1),
            coil_logarithm: vec2(0, 0),
            coil_angle: vec2(0, 10.0 * Math.PI),
            coil_z: vec2(-1, 1),
            coil_p: vec2(2, 2),
            coil_q: vec2(2, 2),
            cross_section_radius: vec2(0.1, 0.1), 
            cross_section_twist: vec2(0, 0),
            cross_section_m: vec2(2, 2),
            cross_section_n: vec2(2, 2),
        }
    },
    {
        name: 'exponential-twister',
        seashell_params: {
            coil_radius: vec2(0.1, 0.1),
            coil_logarithm: vec2(3, 3),
            coil_angle: vec2(0, 16.0 * Math.PI),
            coil_z: vec2(-1, 2),
            coil_p: vec2(2, 2),
            coil_q: vec2(2, 2),
            cross_section_radius: vec2(0, 0.1), 
            cross_section_twist: vec2(0, 0),
            cross_section_m: vec2(2, 2),
            cross_section_n: vec2(2, 2),
        }
    },
    {
        name: 'squarish-shell',
        seashell_params: {
            coil_radius: vec2(1, 0),
            coil_logarithm: vec2(0, 0),
            coil_angle: vec2(0, 7.0 * Math.PI),
            coil_z: vec2(-1, 1),
            coil_p: vec2(2, 2),
            coil_q: vec2(2, 2),
            cross_section_radius: vec2(0.3, 0), 
            cross_section_twist: vec2(0, 0),
            cross_section_m: vec2(10, 10),
            cross_section_n: vec2(10, 10),
        }
    },
    {
        name: 'twisty-helix',
        seashell_params: {
            coil_radius: vec2(1, 1),
            coil_logarithm: vec2(0, 0),
            coil_angle: vec2(0, 4.0 * Math.PI),
            coil_z: vec2(-1, 1),
            coil_p: vec2(2, 2),
            coil_q: vec2(2, 2),
            cross_section_radius: vec2(0.4, 0.4), 
            cross_section_twist: vec2(0, 8.0 * Math.PI),
            cross_section_m: vec2(0.8, 0.8),
            cross_section_n: vec2(0.8, 0.8),
        }
    },
    {
        name: 'exponent-spaghetti',
        seashell_params: {
            coil_radius: vec2(2, -1),
            coil_logarithm: vec2(4, 0.1),
            coil_angle: vec2(0, 8.0 * Math.PI),
            coil_z: vec2(-1, 1),
            coil_p: vec2(2, 2),
            coil_q: vec2(2, 2),
            cross_section_radius: vec2(0.3, 0.1), 
            cross_section_twist: vec2(0, 0),
            cross_section_m: vec2(2, 2),
            cross_section_n: vec2(2, 2),
        }
    },
    {
        name: 'asymmetric',
        seashell_params: {
            coil_radius: vec2(1, 0),
            coil_logarithm: vec2(0, 0),
            coil_angle: vec2(0, 8.0 * Math.PI),
            coil_z: vec2(-1, 1),
            coil_p: vec2(3, 3),
            coil_q: vec2(1, 1),
            cross_section_radius: vec2(0.3, 0), 
            cross_section_twist: vec2(0, 0),
            cross_section_m: vec2(3, 0.1),
            cross_section_n: vec2(0.1, 3),
        }
    },
    {
        name: 'vary-shape',
        seashell_params: {
            coil_radius: vec2(0.4, 1),
            coil_logarithm: vec2(0, 0),
            coil_angle: vec2(0, 8.0 * Math.PI),
            coil_z: vec2(-1, 1),
            coil_p: vec2(0.8, 3),
            coil_q: vec2(0.8, 3),
            cross_section_radius: vec2(0.3, 0), 
            cross_section_twist: vec2(0, 0),
            cross_section_m: vec2(2, 2),
            cross_section_n: vec2(2, 2),
        }
    },
    {
        name: 'manhattan-cone',
        seashell_params: {
            coil_radius: vec2(0.8, 0),
            coil_logarithm: vec2(0, 0),
            coil_angle: vec2(0, 8.0 * Math.PI),
            coil_z: vec2(0, 1),
            coil_p: vec2(2, 2),
            coil_q: vec2(2, 2),
            cross_section_radius: vec2(0.3, 0), 
            cross_section_twist: vec2(0, 0),
            cross_section_m: vec2(1, 1),
            cross_section_n: vec2(1, 1),
        }
    },
    {
        name: 'twisted-bar',
        seashell_params: {
            coil_radius: vec2(1, 1),
            coil_logarithm: vec2(0, 0),
            coil_angle: vec2(0, 2.0 * Math.PI),
            coil_z: vec2(-1, 1),
            coil_p: vec2(2, 2),
            coil_q: vec2(2, 2),
            cross_section_radius: vec2(0.3, 0), 
            cross_section_twist: vec2(0, 4.0 * Math.PI),
            cross_section_m: vec2(1, 1),
            cross_section_n: vec2(1, 1),
        }
    },
    {
        name: 'twisted-donut',
        seashell_params: {
            coil_radius: vec2(1, 1),
            coil_logarithm: vec2(0, 0),
            coil_angle: vec2(0, 2.1 * Math.PI),
            coil_z: vec2(0, 0),
            coil_p: vec2(2, 2),
            coil_q: vec2(2, 2),
            cross_section_radius: vec2(0.3, 0.3), 
            cross_section_twist: vec2(0, 2 * Math.PI),
            cross_section_m: vec2(1, 1),
            cross_section_n: vec2(1, 1),
        }
    }
];

/**
 * Exhibit to demonstrate toon shading.
 *
 * I also use it as a way to showcase my superseashells, which will
 * likely become a motif throughout the exhibit
 */
class ToonExhibit extends Exhibit {
    make_shader_requests() {
        return [
           ajax('shaders/super_seashell.vert'),
           ajax('shaders/toon.frag'),
        ];
    }

    /**
     * Template material for the seashell. It will be cloned and the
     * uniforms updated
     */
    make_template_material(vert, frag) {
        return new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib['lights'],
                {
                    seashell_params: {value: {}}
                }
            ]),
            name: 'seashell',
            vertexShader: vert,
            fragmentShader: frag,
            lights: true,
            side: THREE.DoubleSide
        });
    }

    get obj_bboxes() {
        return [];
    }

    make_materials(shader_text) {
        let [seashell_vert, toon_frag] = shader_text;

        let seashell_mat = this.make_template_material(
            seashell_vert, toon_frag);

        for (let seashell of TOON_SHELLS) {
            let mat_name = `toon-${seashell.name}`;
            let mat = seashell_mat.clone();
            mat.uniforms.seashell_params.value = seashell.seashell_params;
            this.materials.set(mat_name, mat);
        }
    }

    /**
     *
     */
    get grid_coords() {
        const ROWS = 4;
        const COLS = 4;
        const origin = vec3(-1, 0, -1).multiplyScalar(0.75 * this.ROOM_SIZE);
        const delta = vec3(1, 0, 1).multiplyScalar(0.5 * this.ROOM_SIZE);

        let results = [];
        for (let i = 0; i < ROWS * COLS; i++) { 
            // Compute coordinates in index space
            let z = Math.floor(i / COLS);
            let x = i % COLS;
            let y = 0;

            // Create an offset vector in world space
            let offset = vec3(x, 0, z).multiply(delta);
            let pos = origin.clone().add(offset);
            results.push(pos);
        }
        return results;
    }

    make_seashells() {
        let shells = [];
        for (let [i, pos] of this.grid_coords.entries()) {
            let seashell = TOON_SHELLS[i];
            let mat_name = `toon-${seashell.name}`;
            let material = this.materials.get(mat_name);
            material.name = mat_name;

            // TODO: Have the params control the u and v resolution;
            let geometry = new THREE.PlaneGeometry(1, 1, 24, 100);

            let mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
        
            mesh.position.copy(pos);
            mesh.position.y = 0.2 * this.ROOM_SIZE;

            let scale = this.ROOM_SIZE / 16
            mesh.scale.x = scale;
            mesh.scale.y = scale;
            mesh.scale.z = scale;

            shells.push(mesh);
        }
        return shells;
    }

    make_stands() {
        const STAND_SIZE = 0.1 * this.ROOM_SIZE;
        let mat = this.materials.get('default');
        let stands = [];
        for (let [i, pos] of this.grid_coords.entries()) {
            let geometry = new THREE.BoxGeometry(2, 2, 2);
            let mesh = new THREE.Mesh(geometry, mat);

            mesh.position.copy(pos);
            mesh.position.y = STAND_SIZE / 2.0;
            mesh.castShadow = true;

            stands.push(mesh);
        }
        return stands;
    }

    make_main_objs() {
        let seashells = this.make_seashells();
        let stands = this.make_stands();

        return seashells.concat(stands);
    }

    make_lights() {
        let lights = [];
        let helpers = [];

        let default_lights = super.make_lights();

        for (let [i, pos] of this.grid_coords.entries()) {
            let color = Math.floor(Math.random() * 0x1000000);
            let light = new THREE.PointLight(color, 0.1, 10.0);
            light.position.copy(pos);
            light.position.y = 0.45 * this.ROOM_SIZE;
            lights.push(light);

            let helper = new THREE.PointLightHelper(light);
            helpers.push(helper);
        }
        return lights.concat(default_lights, helpers);
    }

    update() {
    }
}