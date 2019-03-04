
/**
 * Room where one wall is a raymarched scene
 *
 * Lights, camera, and thee 
 */
class RaymarchExhibit extends Exhibit {
    // Pass in a map of
    // wall direction (north|south|east|west) -> shader URL
    constructor(wall, url, museum) {
        super();
        this.shader_wall = wall;
        this.shader_url = url;
        this.museum = museum;

        this.start_time = performance.now();
    }

    make_shader_requests() {
        return [
            ajax('shaders/uv_quad.vert'),
            ajax('shaders/raymarch_infinite.frag'),
            ajax(this.shader_url),
        ];
    };

    /**
     * Get eye coord as a percentage of the room size
     */
    get eye() {
        let eye_world = this.museum.camera.eye;
        return eye_world.clone().divideScalar(this.ROOM_SIZE);
    }

    get room_angle() {
        // The box camera will have its standard orientation pointing
        // down the negative z axis, so north = 0, west = 90, etc
        return this.DIRECTIONS.get(this.shader_wall) - Math.PI / 2.0;
    }

    make_materials(shader_text) {
        let [uv_vert, raymarch_header, raymarch_frag] = shader_text;
        let frag_shader = raymarch_header + '\n' + raymarch_frag;


        let raymarch_mat = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib['lights'],
                {
                    eye: {value: this.eye},
                    time: {value: 0.0},
                    room_angle: {value: this.room_angle},
                }
            ]),
            vertexShader: uv_vert,
            fragmentShader: frag_shader,
            lights: true,
        });
        this.materials.set('raymarch', raymarch_mat);
    }

    make_walls() {
        let walls = super.make_walls();
        let raymarch_wall = walls.get(this.shader_wall);
        raymarch_wall.material = this.materials.get('raymarch');
        return walls;
    }

    get uniforms() {
        return this.materials.get('raymarch').uniforms;
    }

    update() {
        if (this.is_loading)
            return;

        this.uniforms.eye.value = this.eye;
        this.uniforms.time.value = (performance.now() - this.start_time) / 1000.0;
    }
}
