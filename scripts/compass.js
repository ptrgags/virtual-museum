class Compass {
    constructor(camera) {
        // reference to the first person camera
        this.fp_camera = camera;

        // 2D quad that displays the compass
        this.compass = null;

        // Set up a 2D camera to view a square from -1 to 1
        this.camera_2d = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100); 
        this.camera_2d.position.z = 5.0;

        // Set up a 3D scene
        this.scene = new THREE.Scene();
        this.scene.background = null;
    }
    
    load() { 
        let requests = [
            ajax('shaders/uv_quad.vert'),
            ajax('shaders/compass.frag'),
        ];

        Promise.all(requests)
            .then((shaders) => this.make_compass(shaders))
            .catch(console.error);
    }

    make_compass(shaders) {
        let [vert_shader, frag_shader] = shaders;

        let quad = new THREE.PlaneGeometry(2, 2);
        let material = new THREE.ShaderMaterial({
            uniforms: {
                direction: {value: this.fp_camera.forward}
            },
            vertexShader: vert_shader,
            fragmentShader: frag_shader,
        });
        material.transparent = true;

        this.compass = new THREE.Mesh(quad, material);
        this.scene.add(this.compass);
    }

    get uniforms() {
        return this.compass.material.uniforms;
    }

    update() {
        if (this.compass)
            this.uniforms.direction.value = this.fp_camera.forward;
    }

    render(renderer) {
        if (this.compass) {
            // Render in a small box on top of the screen
            renderer.setViewport(0, 0, 100, 100);
            renderer.autoClear = false;
            renderer.render(this.scene, this.camera_2d);

            // Reset the renderer's state
            renderer.autoClear = true;
            renderer.setViewport(
                0, 0, renderer.domElement.width, renderer.domElement.height);
        }
    }
}
