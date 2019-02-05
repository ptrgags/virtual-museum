/**
 * The Exhibit is the base class for exits
 */
class Exhibit {
    constructor() {
        // Table of materials available
        this.materials = new Map([
            ['default', new THREE.MeshPhongMaterial({
                color: 0xffffff,
                specular: 0x050505,
                shininess: 30
            })],
            // TODO: Make a procedural wood shader
            ['door', new THREE.MeshPhongMaterial({
                color: 0xffaa00,
                specular: 0x010101,
                shininess: 20
            })]
        ]);

        this.DIRECTIONS = new Map([
            ['east', 0],
            ['north', Math.PI / 2.0],
            ['west', Math.PI],
            ['south', 3.0 * Math.PI / 2.0]
        ]);

        // Distance from center to side of the room
        this.ROOM_SIZE = 20.0;
        this.HALF_PI = Math.PI / 2.0

        this.scene = new THREE.Scene();

        // When loading
        this.is_loading = false;

        // Lists of objects that need bounding boxes
        this.doors = new Map();
        this.walls = [];
        this.main_objs = [];
    }

    /**
     * Start asynchronous stuff for loading shaders/etc here
     */
    load(door_info) {
        // Request any shaders if needed
        // TODO: Probably will have another clause and/or parameter
        // for textures and other resources eventually
        let shader_requests = this.make_shader_requests();
        Promise.all(shader_requests)
            .then((shaders) => this.make_materials(shaders))
            .then(() => this.setup_scene(door_info))
            .catch(console.error);
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
        return this.walls.map((x) => this.make_bbox(x));
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

    // TODO: Consider a unload method if needed for resource-intensive exhibits

    setup_scene(door_info) {

        let lights = this.make_lights();
        let floor = this.make_floor();
        this.walls = this.make_walls();
        this.doors = this.make_doors(door_info);
        let ceiling = this.make_ceiling();
        this.main_objs = this.make_main_objs();

        let objs = lights.concat(
            floor, 
            this.walls, 
            [...this.doors.values()], 
            ceiling, 
            this.main_objs);

        for (let obj of objs) {
            this.scene.add(obj);
        }
    }

    make_lights() {
        let white_light = new THREE.PointLight(0xFFFFFF, 0.8, 100);
        white_light.position.set(3.0, 8.0, -3.0);

        let red_light = new THREE.PointLight(0x880000, 0.5, 100);
        red_light.position.set(-3.0, 1.0, 2.0);

        let blue_light = new THREE.PointLight(0x00CCFF, 0.4, 100);
        blue_light.position.set(4.0, 5.0, 5.0);

        return [white_light, red_light, blue_light];
    }

    make_floor() {
        // Unit square has width 2
        let geom = new THREE.PlaneGeometry(2, 2, 16);
        let plane = new THREE.Mesh(geom, this.materials.get('default'));
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

    make_walls() {
        let walls = [];
        const NUM_WALLS = 4;
        for (let i = 0; i < NUM_WALLS; i++) {
            // Unit square has width 2
            let geom = new THREE.PlaneGeometry(2, 2, 16);
            let plane = new THREE.Mesh(geom, this.materials.get('default'));
            plane.scale.x = this.ROOM_SIZE;
            plane.scale.y = this.ROOM_SIZE / 2.0; 
            plane.rotation.y = i * this.HALF_PI;

            let offset_direction = this.HALF_PI + i * this.HALF_PI;
            let x = this.ROOM_SIZE * Math.cos(offset_direction);
            let z = -this.ROOM_SIZE * Math.sin(offset_direction);
            plane.position.set(x, this.ROOM_SIZE / 2.0, z);

            walls.push(plane);
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

    render(renderer, camera) {
        this.update();
        renderer.render(this.scene, camera);
    }

    update() {
        // called once a frame
    }
}

class ToonExhibit extends Exhibit {
    make_shader_requests() {
        return [
           ajax('shaders/toon.vert'),
           ajax('shaders/toon.frag'),
        ];
    }

    make_materials(shader_text) {
        let [toon_vert, toon_frag] = shader_text;
        let toon_mat = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsLib['lights'],
            vertexShader: toon_vert,
            fragmentShader: toon_frag,
            lights: true
        });
        this.materials.set('toon', toon_mat);
    }

    make_main_objs() {
        let geometry = new THREE.TorusKnotGeometry(1.0, 0.1, 100, 16, 2, 5);
        let material = this.materials.get('toon')
        this.knot = new THREE.Mesh(geometry, material); 
        this.knot.position.y = this.ROOM_SIZE / 4;
        return [this.knot];
    }

    update() {
        // Make the knot rotate around
        if (this.knot) {
            this.knot.rotation.y += 0.01;
            this.knot.rotation.z += 0.01;
        }
    }
}
