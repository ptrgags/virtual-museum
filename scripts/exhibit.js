/**
 * The Exhibit is the base class for exits
 */
class Exhibit {
    constructor() {
        this.DIRECTIONS = new Map([
            ['east', 0],
            ['north', Math.PI / 2.0],
            ['west', Math.PI],
            ['south', 3.0 * Math.PI / 2.0]
        ]);

        // Distance from center to side of the room
        this.ROOM_SIZE = 20.0;
        this.HALF_PI = Math.PI / 2.0

        // Set up variables in a function so we can
        // discard everything easily
        this.reset();
    }

    /**
     * Start asynchronous stuff for loading shaders/etc here
     */
    load(door_info) {
        this.is_loading = true;


        // Gather up promises for resources
        let texture_requests = this.make_texture_requests();
        let shader_requests = this.make_shader_requests();

        let door_directions = door_info.map(([dir, ]) => dir);

        
        Promise.all(texture_requests)
            .then((textures) => this.store_textures(textures))
            .then(() => Promise.all(shader_requests))
            .then((shaders) => this.make_materials(shaders))
            .then(() => this.setup_scene(door_directions))
            .then(() => this.sign_maker.load())
            .then(() => this.make_signs(door_info))
            .then(() => this.is_loading = false)
            .catch(console.error);
    }

    reset() {
        // Table of materials available
        this.materials = new Map([
            ['default', new THREE.MeshPhongMaterial({
                color: 0xffffff,
                specular: 0x050505,
                shininess: 30
            })],
            // TODO: Make a procedural wood shader
            ['door', new THREE.MeshPhongMaterial({
                color: 0xCCB797,
                specular: 0x010101,
                shininess: 20
            })],
            ['floor', new THREE.MeshPhongMaterial({
                color: 0x553300,
                specular: 0x020202,
                shininess: 40
            })]
        ]);
        this.textures = new Map();

        this.scene = new THREE.Scene();

        this.sign_maker = new SignMaker();

        // When loading
        this.is_loading = false;

        // Lists of objects that need bounding boxes
        this.doors = new Map();
        this.walls = [];
        this.main_objs = [];
    }

    make_texture_requests() {
        return []
    }

    /**
     * Store textures in a map that can be accessed when making materials 
     */
    store_textures(textures) {
        // Update thhis.textures() herre
    }

    /**
     * In subclasses, return a list of ajax() promises for shader files
     */
    make_shader_requests() {
        return [];
    }

    /**
     * Given an array of all the vert/frag shaders in the same order
     * specified in make_shader_requests(), add materials to this.materials
     */
    make_materials(shader_text) {
        // update this.materials() here.
    }

    make_bbox(obj) {
        let bbox = new THREE.Box3();
        bbox.setFromObject(obj);
        return bbox;
    }

    get wall_bboxes() {
        let walls = [...this.walls.values()];
        return walls.map((x) => this.make_bbox(x));
    }

    get obj_bboxes() {
        return this.main_objs.map((x) => this.make_bbox(x));
    }

    /**
     * This one is slightly different. It returns not just an array of
     * bounding boxes, but an array of arrays:
     *
     * [direction, bbox] so we know which way to go
     */
    get door_bboxes() {
        let results = [];
        for (let [dir, door] of this.doors) {
            results.push([dir, this.make_bbox(door)]);
        }
        return results;
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
            this.scene.add(obj);
        }
    }

    make_lights() {
        let lights = [];
        let helpers = [];
        // A gentle light in each corner of the room
        for (let i of [1, -1]) {
            for (let j of [1, -1]) {
                for (let k of [1, -1]) {
                    let x = 0.8 * this.ROOM_SIZE * i;
                    let y = 0.5 * this.ROOM_SIZE + j * 0.4 * this.ROOM_SIZE;
                    let z = 0.8 * this.ROOM_SIZE * k;

                    let offset = vec3(x, y, z);
                    let light = new THREE.PointLight(
                        0xFFFFFF, 0.2, 2.0 * this.ROOM_SIZE);

                    light.position.copy(offset);
                    lights.push(light);

                    let helper = new THREE.PointLightHelper(light);
                    helpers.push(helper);
                }
            }
        }

        let ambient = new THREE.AmbientLight(0xFFFFFF, 0.5);
        lights.push(ambient);

        //return lights.concat(helpers);
        return lights;
    }

    make_floor() {
        // Unit square has width 2
        let geom = new THREE.PlaneGeometry(2, 2, 16);
        let plane = new THREE.Mesh(geom, this.materials.get('floor'));
        plane.receiveShadow = true;
        plane.scale.x = this.ROOM_SIZE;
        plane.scale.y = this.ROOM_SIZE;
        plane.rotation.x = -this.HALF_PI;

        return [plane];
    }

    make_doors(door_directions) {
        let doors = new Map();
        const DOOR_HEIGHT = 3.0 * this.ROOM_SIZE / 4.0;
        const DOOR_WIDTH = this.ROOM_SIZE / 2.0;
        const DOOR_THICKNESS = this.ROOM_SIZE / 20.0;
        const DOOR_POS_ALONG_NORMAL = this.ROOM_SIZE - DOOR_THICKNESS / 2.0;
        for (let dir of door_directions) {
            let geom = new THREE.BoxGeometry(1, 1, 1);
            let door = new THREE.Mesh(geom, this.materials.get('door'));
            door.scale.x = DOOR_WIDTH;
            door.scale.y = DOOR_HEIGHT;
            door.scale.z = DOOR_THICKNESS;

            // Figure out which side of the room to put the door at
            let offset_dir = this.DIRECTIONS.get(dir);
            let x = DOOR_POS_ALONG_NORMAL * Math.cos(offset_dir);
            let z = -DOOR_POS_ALONG_NORMAL * Math.sin(offset_dir);
            let y =  DOOR_HEIGHT / 2.0;
            door.position.set(x, y, z);

            // Rotate the door so it is always parallel to the wall
            door.rotation.y = offset_dir - Math.PI / 2.0;

            // Add a door to the map
            doors.set(dir, door);
        }
        return doors;
    }

    make_signs(door_info) {
        const FG_COLOR = vec3(0.0, 0.0, 0.0);
        const RADIUS = 0.94 * this.ROOM_SIZE;
        for (let [door_dir, label_settings] of door_info) {
            let sign = this.sign_maker.make_sign(
                label_settings.text, label_settings);

            let offset_dir = this.DIRECTIONS.get(door_dir);
            let x = RADIUS * Math.cos(offset_dir);
            let z = -RADIUS * Math.sin(offset_dir);
            let y = this.ROOM_SIZE / 2.0;

            sign.position.set(x, y, z);
            sign.rotation.y = offset_dir - Math.PI / 2.0;
            sign.scale.set(2, 2, 1);

            this.scene.add(sign);
        }
    }

    make_walls() {
        let walls = new Map();
        for (let dir of this.DIRECTIONS.keys()) {
            // direction to face to see the wall
            let offset_angle = this.DIRECTIONS.get(dir);

            // By default, PlaneGeometry has a normal in the +z direction.
            // it must be rotated by an angle 90 degrees out of phase
            // with the offset angle.
            let rotation_angle = offset_angle - this.HALF_PI;

            // Unit square has width 2
            let geom = new THREE.PlaneGeometry(2, 2, 16);
            let plane = new THREE.Mesh(geom, this.materials.get('default'));
            plane.scale.x = this.ROOM_SIZE;
            plane.scale.y = this.ROOM_SIZE / 2.0; 
            plane.rotation.y = rotation_angle;

            // Place the plane at the proper end of the room
            let x = this.ROOM_SIZE * Math.cos(offset_angle);
            let z = -this.ROOM_SIZE * Math.sin(offset_angle);
            plane.position.set(x, this.ROOM_SIZE / 2.0, z);

            // Add it to the  map
            walls.set(dir, plane);
        }

        return walls;
    }

    make_ceiling() {
        // Unit square has width 2
        let geom = new THREE.PlaneGeometry(2, 2, 16);
        let plane = new THREE.Mesh(geom, this.materials.get('default'));
        plane.scale.x = this.ROOM_SIZE;
        plane.scale.y = this.ROOM_SIZE;
        plane.rotation.x = this.HALF_PI;
        plane.position.y = this.ROOM_SIZE;

        return [plane];
    }

    // Main objects to display this exhibit
    make_main_objs() {
        return [];
    }

    /**
     * Reposition the camera in the room given the direction of the door
     * we just came through.
     *
     * e.g. if you just used the north door, pass in 'north'
     */
    reposition_camera(camera, dir) {
        // The camera should point in the direction through the door
        let forward_angle = this.DIRECTIONS.get(dir);

        // Now back up to the other side of the room
        const OFFSET_AMOUNT = 0.8 * this.ROOM_SIZE;
        const CAMERA_HEIGHT = 5.0;
        let backward_angle = -forward_angle;
        let x = -OFFSET_AMOUNT * Math.cos(backward_angle);
        let z = -OFFSET_AMOUNT * Math.sin(backward_angle);
        let offset = new THREE.Vector3(x, CAMERA_HEIGHT, z);

        camera.reposition(offset, forward_angle);
    }

    render(renderer, camera, t) {
        this.update(t);
        renderer.render(this.scene, camera);
    }

    update(t) {
        // called once a frame
    }

    get label() {
        return [
            '        ',
            ' Just a ',
            ' boring ',
            '  room  ',
            '        ',
            '        ',
            '        ',
            '        ',
        ].join('');
    }

    get text_dimensions() {
        return vec2(8, 8);
    }

    get label_settings() {
        return {
            text: this.label,
            fg_color: vec3(0.578, 0.527, 0.363),
            bg_color: vec3(0.941, 0.918, 0.839),
            text_dimensions: this.text_dimensions
        }
    }
}

class Entrance extends Exhibit {
    get label() {
        return [
            '        ',
            '        ',
            'Entrance',
            '        ',
            '        ',
            '        ',
            '        ',
            '        ',
        ].join('');
    }
}
