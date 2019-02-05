class FirstPersonCamera {
    constructor() {
        this.ASPECT = window.innerWidth / window.innerHeight;
        this.FOV = 45;
        this.NEAR = 0.1;
        this.FAR = 100;
        this.camera = new THREE.PerspectiveCamera(
            this.FOV, this.ASPECT, this.NEAR, this.FAR);

        this.camera.position.z = 5.0;
        this.camera.position.y = 5.0;

        this.MOVE_DELTA = 0.5;

        // Store the last mouse position
        this.last_mouse_pos = new THREE.Vector2(
            window.innerWidth / 2, window.innerHeight / 2);
        this.DEGREES_PER_PIXEL = 0.0025;


        this.camera.rotation.order = 'YXZ';

        // Current yaw and pitch of the camera in degrees
        this.yaw_pitch = new THREE.Vector2(0, 0);
    }

    get forward() {
        let dir = new THREE.Vector3();
        this.camera.getWorldDirection(dir);
        
        // Motion will only happen in thhe x-z plane
        dir.y = 0.0;
        dir.normalize();

        return dir;
    }

    get right() {
        let fwd = this.forward;

        // Rotate the forward direction 90 degrees clockwise about
        // the vertical to get a vector pointing to the camera's right
        return new THREE.Vector3(-fwd.z, 0, fwd.x);
    }

    /**
     * Move parallel to the direction the camera is pointing
     */
    move_parallel(direction) {
        let fwd = this.forward;

        // Scale the direction by the movement amount;
        fwd.multiplyScalar(this.MOVE_DELTA * direction)

        // Move the camera
        this.camera.position.add(fwd);
    }

    move_perpendicular(direction) {
        let right = this.right;

        // Scale the direction by the movement amount;
        right.multiplyScalar(this.MOVE_DELTA * direction)

        // Move the camera
        this.camera.position.add(right);
        
    }

    /**
     * Rotate the view using the change in mouse position
     *
     * NOTE: mouse_pos must be specified relative to the *bottom left*
     * corner of the screen
     *
     * Mouse control based on
     * https://learnopengl.com/Getting-started/Camera
     */
    rotate_view(mouse_pos) {
        // Offset of the yaw/pitch vector
        let offset = mouse_pos.clone();
        offset.sub(this.last_mouse_pos);

        // The offset is really 2 Euler angles so change scale
        offset.multiplyScalar(this.DEGREES_PER_PIXEL);

        this.yaw_pitch.add(offset);
        this.last_mouse_pos = mouse_pos; 

        this.camera.rotation.y = -this.yaw_pitch.x;
        this.camera.rotation.x = this.yaw_pitch.y;
    }

    key_pressed(key_code) {
        switch (key_code) {
            case "KeyW":
                this.move_parallel(1);
                break;
            case "KeyS":
                this.move_parallel(-1);
                break;
            case "KeyA":
                this.move_perpendicular(-1);
                break;
            case "KeyD":
                this.move_perpendicular(1);
                break;
        }
    }

    get bbox() {
        let bbox = new THREE.Box3();
        bbox.setFromObject(this.camera);

        const OFFSET = new THREE.Vector3(0.5, 0.5, 0.5);
        let center = this.camera.position.clone();
        let min_coords = center.clone().sub(OFFSET);
        let max_coords = center.clone().add(OFFSET);
        return new THREE.Box3(min_coords, max_coords);
    }
}
