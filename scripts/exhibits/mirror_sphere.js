
/**
 * Room where one wall is a raymarched scene
 *
 * Lights, camera, and thee 
 */
class MirrorSphereExhibit extends Exhibit {
    constructor() {
        super();
        this.NUM_CUBES = 12;
        this.ROOM_CENTER = vec3(0, this.ROOM_SIZE / 2.0, 0);
    }

    reset() {
        super.reset();
        this.mirror_scene = new THREE.Scene();

        this.mirror_cam = this.make_cube_cam();
        this.mirror_scene.add(this.mirror_cam);
    }

    make_cube_cam() {
        let cam = new THREE.CubeCamera(1, 1000, 512);
        cam.position.y = this.ROOM_SIZE / 2.0;
        let tex = cam.renderTarget.texture;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipMapLinearFilter;
        return cam;
    }

    make_materials(shader_text) {
        // Use the environment map as a texture for the mirrored sphere
        let mirror_mat = new THREE.MeshBasicMaterial({
            envMap: this.mirror_cam.renderTarget.texture
        });
        this.materials.set('mirror', mirror_mat);

        // Make a number of colored materials for the
        for (let i = 0; i < this.NUM_CUBES; i++) {
            let mat_name = `mat${i}`;
            let hue = i / this.NUM_CUBES;

            // Evenly distributed colors around the color wheel
            let color = new THREE.Color().setHSL(hue, 1.0, 0.5);

            let mat = new THREE.MeshPhongMaterial({
                color: color,
                specular: 0xDDDDDD,
                shininess: 80,
            });
            this.materials.set(mat_name, mat);
        }

        // Use a dark grey material for the "real" room
        let gray_mat = new THREE.MeshPhongMaterial({
                color: 0x555555,
                specular: 0xDDDDDD,
                shininess: 40
        });
        this.materials.set('gray', gray_mat); 
    }

    setup_scene(door_info) {
        let lights = this.make_lights();
        let floor = this.make_floor();
        this.walls = this.make_walls();
        this.doors = this.make_doors(door_info);
        let ceiling = this.make_ceiling();
        this.main_objs = this.make_main_objs();

        let objs = lights.concat(
            floor, 
            [...this.walls.values()], 
            [...this.doors.values()], 
            ceiling);

        for (let obj of objs) {
            // Add the normal-color object to the mirror scene
            this.mirror_scene.add(obj);

            // Add a copy of the object with a gray material
            let grayscale_obj = obj.clone();
            if (grayscale_obj.type == 'Mesh')
                grayscale_obj.material = this.materials.get('gray');
            this.scene.add(grayscale_obj);
        }

        // Do something similar with the cubes, however since it is a group
        // we have a different way of iterating
        let [cube_group] = this.main_objs;
        this.mirror_scene.add(cube_group);

        this.gray_cubes = cube_group.clone();
        for (let cube of this.gray_cubes.children) {
            cube.material = this.materials.get('gray');
        }
        this.scene.add(this.gray_cubes);


        // Finally, add a mirrored oject
        let reflective_obj = this.make_mirrored_obj();
        this.scene.add(reflective_obj);
    }

    /**
     * Create a ring of cubes around the sphere
     */
    make_main_objs() {
        // Create a parent object so we can rotate the entire ring of
        // cubes
        this.cubes = new THREE.Group();
        this.cubes.position.copy(this.ROOM_CENTER);

        let geom = new THREE.CubeGeometry(2, 2, 2);

        const RING_RADIUS = 10.0;
        const CUBE_SIZE = 1.0;
        for (let i = 0; i < this.NUM_CUBES; i++) {
            let mat_name = `mat${i}`;
            let material = this.materials.get(mat_name);
            let mesh = new THREE.Mesh(geom, material);

            // Position is a point on a circle relative to the rotation center
            let theta = 2.0 * Math.PI * i / this.NUM_CUBES;
            let x = RING_RADIUS * Math.cos(theta);
            let y = 0;
            let z = RING_RADIUS * -Math.sin(theta);
            mesh.position.set(x, y, z);
            mesh.rotation.y = theta;
            mesh.scale.multiplyScalar(CUBE_SIZE);

            // Add it to the group object
            this.cubes.add(mesh);
        }

        return [this.cubes];
    }

    make_mirrored_obj() {
        let geom = new THREE.SphereGeometry(this.ROOM_SIZE / 4.0, 50, 50);
        let material = this.materials.get('mirror');
        let mesh = new THREE.Mesh(geom, material);
        mesh.position.copy(this.ROOM_CENTER);
        return mesh;
    }

    // The player gets stuck when the cubes tilt too low. So let's just
    // disable collisions except with the walls.
    get obj_bboxes() {
        return [];
    }

    render(renderer, camera, t) {
        this.update(t);
        this.mirror_cam.update(renderer, this.mirror_scene);
        renderer.render(this.scene, camera);
    }

    update(t) {
        // Angular speed in radians/sec
        const Y_ROT_SPEED = 0.4;

        // Rotate the ring around the circle
        this.cubes.rotation.y = t * Y_ROT_SPEED;
        this.gray_cubes.rotation.y = t * Y_ROT_SPEED;

        // Tilt the ring back and forth
        const TILT_FREQ = 0.5;
        const MAX_TILT = Math.PI / 4.0;
        let tilt = MAX_TILT * Math.sin(TILT_FREQ * t);
        this.cubes.rotation.x = tilt;
        this.gray_cubes.rotation.x = tilt;
    }

    get label() {
        return [
            '        ',
            ' Mirror ',
            ' Sphere ',
            '        ',
            '        ',
            '        ',
            '        ',
            '        ',
        ].join('');
    }
}
