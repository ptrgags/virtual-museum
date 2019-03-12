/**
 * 16 superseashell shapes designed for the toon room
 */
let TOON_SHELLS = [
    {
        name: 'squagel',
        seashell_params: {
            coil_radius: vec2(0.7, 0.7),
            coil_logarithm: vec2(0, 0),
            coil_angle: vec2(0, 2.3 * Math.PI),
            coil_z: vec2(0, 0),
            coil_p: vec2(10, 10),
            coil_q: vec2(10, 10),
            cross_section_radius: vec2(0.4, 0.4), 
            cross_section_twist: vec2(0, 0),
            cross_section_m: vec2(8, 8),
            cross_section_n: vec2(8, 8),
        },
        rotate_x: true,
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
            coil_logarithm: vec2(2.5, 2.5),
            coil_angle: vec2(0, 9.0 * Math.PI),
            coil_z: vec2(0, 0),
            coil_p: vec2(2, 2),
            coil_q: vec2(2, 2),
            cross_section_radius: vec2(0, 0.3), 
            cross_section_twist: vec2(0, 0),
            cross_section_m: vec2(2, 2),
            cross_section_n: vec2(2, 2),
        },
        rotate_x: true,
        v_resolution: 200
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
        },
        rotate_x: true,
        v_resolution: 200
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
        },
        
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
        },
        v_rresolution: 200
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
        },
        v_resolution: 200
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
        },
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
        },
        u_resolution: 100
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
        },
        v_resolution: 200,
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
        },
        u_resolution: 50,
        v_resolution: 200
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
        },
    },
    {
        name: 'manhattan-cone',
        seashell_params: {
            coil_radius: vec2(0.8, 0),
            coil_logarithm: vec2(0, 0),
            coil_angle: vec2(0, 8.0 * Math.PI),
            coil_z: vec2(0, 1.25),
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
        },
        u_resolution: 50,
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
            cross_section_twist: vec2(0, 2.0 * Math.PI),
            cross_section_m: vec2(1, 1),
            cross_section_n: vec2(1, 1),
        },
        rotate_x: true,
        u_resolution: 50,
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
                    seashell_params: {value: {}},
                    diffuse: {value: vec3(1.0, 1.0, 1.0)}
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

    rand_color() {
        return vec3(
            Math.random(),
            Math.random(),
            Math.random());
    }

    make_materials(shader_text) {
        let [seashell_vert, toon_frag] = shader_text;

        let seashell_mat = this.make_template_material(
            seashell_vert, toon_frag);

        for (let seashell of TOON_SHELLS) {
            let mat_name = `toon-${seashell.name}`;
            let mat = seashell_mat.clone();
            mat.uniforms.seashell_params.value = seashell.seashell_params;
            mat.uniforms.diffuse.value = this.rand_color();
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
        this.shells = [];
        for (let [i, pos] of this.grid_coords.entries()) {
            let seashell = TOON_SHELLS[i];
            let mat_name = `toon-${seashell.name}`;
            let material = this.materials.get(mat_name);
            material.name = mat_name;

            let u_res = seashell.u_resolution || 24;
            let v_res = seashell.v_resolution || 100;
            let geometry = new THREE.PlaneGeometry(1, 1, u_res, v_res);

            let mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
        
            mesh.position.copy(pos);
            mesh.position.y = 0.2 * this.ROOM_SIZE;

            let scale = this.ROOM_SIZE / 16
            mesh.scale.x = scale;
            mesh.scale.y = scale;
            mesh.scale.z = scale;

            if (seashell.rotate_x) {
                mesh.rotation.x = Math.PI / 2.0;
            }

            this.shells.push(mesh);
        }
        return this.shells;
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

    make_spotlights() {
        let lights = [];
        let helpers = [];
        /** Add four spotlights  on the ceiling, illuminating the models */
        // Spotlight settings
        const SPOTLIGHT_COLOR = 0xFFFFDD;
        const SPOTLIGHT_INTENSITY = 0.3;
        const SPOTLIGHT_DIST = 2.0 * this.ROOM_SIZE;
        const SPOTLIGHT_RADIUS = 0.9 * this.ROOM_SIZE / 2.0; 
        const SPOTLIGHT_ANGLE = Math.atan2(SPOTLIGHT_RADIUS, this.ROOM_SIZE);
        const SPOTLIGHT_DECAY = 0.2;

        // 2x2 grid of spotlights
        const ROWS = 2;
        const COLS = 2;
        const ORIGIN = vec3(-0.5, 1, -0.5).multiplyScalar(this.ROOM_SIZE);
        const DELTA = vec3(1, 0, 1).multiplyScalar(this.ROOM_SIZE);
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                let coord = vec3(j, 0, i);
                let pos = ORIGIN.clone();
                pos.add(DELTA.clone().multiply(coord));

                // Position the light on the ceiling
                let light = new THREE.SpotLight(
                    SPOTLIGHT_COLOR,
                    SPOTLIGHT_INTENSITY,
                    SPOTLIGHT_DIST,
                    SPOTLIGHT_ANGLE,
                    SPOTLIGHT_DECAY);
                //light.castShadow = true;
                light.position.copy(pos);
                lights.push(light);

                // Point the light straight down at the floor
                light.target.position.copy(pos);
                light.target.position.y = 0;
                light.target.updateMatrixWorld();

                // For debugging, show where the spotlight is
                let helper = new THREE.SpotLightHelper(light);
                helpers.push(helper);
            }
        }

        return [lights, helpers];
    }

    make_colored_lights() {
        this.x_lights = [];
        this.colored_lights = [];
        this.colored_light_helpers = [];

        const LIGHT_HEIGHT = this.ROOM_SIZE / 4.0;
        const LIGHT_INTENSITY = 0.3;
        const LIGHT_DIST = this.ROOM_SIZE / 2.0;
        const LIGHT_OFFSET = this.ROOM_SIZE / 2.0;
        const HELPER_SIZE = 0.5;
        for (let i = -1; i <= 1; i++) {
            // Random light that moves in the x-direction
            let x_color = Math.random() * 0x1000000;
            let x_light = new THREE.PointLight(
                x_color, LIGHT_INTENSITY, LIGHT_DIST);
            x_light.position.set(0, LIGHT_HEIGHT, i * LIGHT_OFFSET);

            // Add properties about the light's animation
            x_light.animation = {
                dir: 'x',
                phase: Math.random() * 2.0 * Math.PI,
            };

            let x_helper = new THREE.PointLightHelper(x_light, HELPER_SIZE);

            this.colored_lights.push(x_light);
            this.colored_light_helpers.push(x_helper);

            // Same thing but in the z direction
            let z_color = Math.random() * 0x1000000;
            let z_light = new THREE.PointLight(
                z_color, LIGHT_INTENSITY, LIGHT_DIST);
            z_light.position.set(i * LIGHT_OFFSET, LIGHT_HEIGHT, 0);

            // Add properties about the light's animation
            z_light.animation = {
                dir: 'z',
                phase: Math.random() * 2.0 * Math.PI,
            };

            let z_helper = new THREE.PointLightHelper(z_light, HELPER_SIZE);

            this.colored_lights.push(z_light);
            this.colored_light_helpers.push(z_helper);

        }

        return [this.colored_lights, this.colored_light_helpers];
    }

    make_lights() {
        let lights = [];
        let helpers = [];

        // Keep the default room lighting  so the room isn't too dark
        let default_lights = super.make_lights();

        let [spotlights, spotlight_helpers] = this.make_spotlights();
        let [colored_lights, colored_light_helpers] = 
            this.make_colored_lights(); 

        lights = lights.concat(spotlights, colored_lights);
        helpers = helpers.concat(spotlight_helpers, colored_light_helpers);

        return default_lights.concat(lights, colored_light_helpers);
    }

    update(t) {
        let FREQ = 0.3;
        for (let light of this.colored_lights) {
            let anim_params = light.animation;
            let offset = 0.9 * this.ROOM_SIZE * Math.sin(
                FREQ * t + anim_params.phase);
            light.position[anim_params.dir] = offset;

        }

        for (let helper of this.colored_light_helpers)
            helper.update();

        const SHELL_HEIGHT = 0.21 * this.ROOM_SIZE;
        const MOTION_AMP = 0.5;


        //TODO: Add custom animations
        for (let shell of this.shells) {
            shell.rotation.y -= 0.01;
            let phase = shell.position.x + shell.position.z;
            shell.position.y = 
                SHELL_HEIGHT + MOTION_AMP * Math.sin(t + phase);
        }
    }
}
