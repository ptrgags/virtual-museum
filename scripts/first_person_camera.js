class FirstPersonCamera {
    constructor() {
        this.ASPECT = window.innerWidth / window.innerHeight;
        //this.ASPECT = 1.0;
        this.FOV = 45;
        this.NEAR = 0.1;
        this.FAR = 100;
        this.camera = new THREE.PerspectiveCamera(
            this.FOV, this.ASPECT, this.NEAR, this.FAR);

        this.camera.position.z = 5.0;
        this.camera.position.y = 5.0;

        this.MOVE_DELTA = 0.4;
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
}
