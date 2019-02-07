/**
 * Class for a generic quad rendered in 2D as an overlay on the
 * main window.
 */
class HUD {
    constructor() {
        this.quad = null;

        // Set up a 2D camera to view a square from -1 to 1
        this.camera_2d = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100); 
        this.camera_2d.position.z = 5.0;

        this.scene = new THREE.Scene();
        this.scene.background = null;
    }

    load() {
        let requests = this.make_shader_requests();
        Promise.all(requests)
            .then((shaders) => this.make_quad(shaders))
            .catch(console.error)
    }

    make_quad(shaders) {
        let [vert_shader, frag_shader] = shaders;

        let quad = new THREE.PlaneGeometry(2, 2);
        let material = new THREE.ShaderMaterial({
            // Uniforms depend on the HUD element
            uniforms: this.init_uniforms(),
            vertexShader: vert_shader,
            fragmentShader: frag_shader,
        });
        material.transparent = true;

        this.quad = new THREE.Mesh(quad, material);
        this.scene.add(this.quad);
    }

    get uniforms() {
        return this.quad.material.uniforms;
    }

    init_uniforms() {
        // In subclasses, return the object
        // that lists the uniforms
        return {};
    }

    update() {
        // Implement in subclass
    }

    render(renderer, pos, dims) {
        if (this.quad) {
            // Render in a small box on top of the screen
            renderer.setViewport(pos.x, pos.y, dims.x, dims.y);
            renderer.autoClear = false;
            renderer.render(this.scene, this.camera_2d);
        }
    }


}

class Compass extends HUD {
    constructor(camera) {
        super();
        // reference to the first person camera
        this.fp_camera = camera;
    }

    make_shader_requests() {
        return [
            ajax('shaders/uv_quad.vert'),
            ajax('shaders/compass.frag'),
        ];
    }

    init_uniforms() {
        return {
            direction: {value: this.fp_camera.forward}
        };
    }

    update() {
        if (this.quad)
            this.uniforms.direction.value = this.fp_camera.forward;
    }
}

class Minimap extends HUD {
    constructor(museum) {
        super();
        this.museum = museum;
    }

    make_shader_requests() {
        return [
            ajax('shaders/uv_quad.vert'),
            ajax('shaders/minimap.frag')
        ];
    }

    init_uniforms() {
        return {
            map_dims: {value: this.museum.map_dims},
            current_room: {value: this.museum.current_room_index},
            entrance: {value: this.museum.entrance_index}, 
            map_data: {value: this.museum.minimap_buffer},
        }
    }

    update() {
        if (this.quad) {
            this.uniforms.current_room.value = this.museum.current_room_index;
        }
    }
}
