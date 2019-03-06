
/**
 * Room where one wall is a raymarched scene
 *
 * Lights, camera, and thee 
 */
class MirrorSphereExhibit extends Exhibit {
    // Pass in a map of
    // wall direction (north|south|east|west) -> shader URL
    constructor() {
        super();
    }

    reset() {
        super.reset();
        this.mirror_scene = new THREE.Scene();

        this.mirror_cam = this.make_cube_cam();
        this.mirror_scene.add(this.mirror_cam);
    }

    make_cube_cam() {
        let cam = new THREE.CubeCamera(1, 1000, 256);
        cam.position.y = this.ROOM_SIZE / 2.0;
        let tex = cam.renderTarget.texture;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipMapLinearFilter;
        return cam;
    }

    make_materials(shader_text) {
        let mirror_mat = new THREE.MeshBasicMaterial({
            envMap: this.mirror_cam.renderTarget.texture
        });
        this.materials.set('mirror', mirror_mat);

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
            ceiling, 
            this.main_objs);

        for (let obj of objs) {
            // Add the normal-color object to the mirror scene
            this.mirror_scene.add(obj);

            // Add a copy of the object with a gray material
            let grayscale_obj = obj.clone();
            if (grayscale_obj.type == 'Mesh')
                grayscale_obj.material = this.materials.get('gray');
            this.scene.add(grayscale_obj);
        }

        // Finally, add a mirrored oject
        let reflective_obj = this.make_mirrored_obj();
        this.scene.add(reflective_obj);
    }

    make_main_objs() {
        let geom = new THREE.CubeGeometry(2, 1, 1);
        let material = this.materials.get('door');
        let mesh = new THREE.Mesh(geom, material);
        mesh.position.set(1, 1, 1);
        mesh.rotation.x = 10.0;
        mesh.rotation.y = 30.0;
        return [mesh];
    }

    make_mirrored_obj() {
        let geom = new THREE.SphereGeometry(this.ROOM_SIZE / 4.0, 50, 50);
        let material = this.materials.get('mirror');
        let mesh = new THREE.Mesh(geom, material);
        mesh.position.y = this.ROOM_SIZE / 2.0;
        return mesh;
    }

    render(renderer, camera, t) {
        this.update(t);
        this.mirror_cam.update(renderer, this.mirror_scene);
        renderer.render(this.scene, camera);
    }
}
