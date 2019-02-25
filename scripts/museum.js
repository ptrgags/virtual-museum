class Museum {
    constructor() {
        this.layout = new MuseumLayout();
        this.make_exhibits();

        // Specify the starting room in index space
        this.ENTRANCE = new THREE.Vector2(4, 5);
        this.current_room = this.ENTRANCE;

        // Keep a single moveable camera around.
        this.camera = new FirstPersonCamera();
    }

    /**
     * For the minimap shader, get the index of the current room
     */
    get current_room_index() {
        return this.layout.get_index(this.current_room);
    }

    /**
     * Also for the minimap, get the index of the entrance
     */
    get entrance_index() {
        return this.layout.get_index(this.ENTRANCE);
    }

    get minimap_buffer() {
        return this.layout.minimap_buffer;
    }

    get map_dims() {
        return this.layout.dimensions;
    }

    make_exhibits() {
        // make the exhibits
        let exhibits = [
            [[4, 5], new JuliaSphereExhibit()],
            [[3, 4], new ToonExhibit()],
            [[4, 4], new RaymarchExhibit(
                'west', 'shaders/raymarch_infinite.frag', this)],
            [[4, 6], new Exhibit()],
            [[3, 6], new Exhibit()],
            [[2, 6], new Exhibit()],
        ];

        // Register the exhibits
        for (let [coords, exhibit] of exhibits) {
            let coord_vec = new THREE.Vector2(...coords);
            this.layout.register_exhibit(coord_vec, exhibit); 
        }
    }

    get current_exhibit() {
        return this.layout.get_exhibit(this.current_room);
    }

    get door_info() {
        let pos = this.current_room;
        return this.layout.get_door_info(pos);
    }


    load() {
        this.current_exhibit.reposition_camera(this.camera, 'north');
        this.current_exhibit.load(this.door_info);
    }

    /**
     * Move to the next room in a given direction (north|south|east|west)
     */
    move(dir) { 
        // save a reference to the current exhibit
        let exhibit = this.current_exhibit;

        // Move the cursor to the new room
        let [next_pos, next_exhibit] = 
            this.layout.get_neighbor(this.current_room, dir);
        this.current_room = next_pos;

        // Reposition the camera on the other side of the door
        next_exhibit.reposition_camera(this.camera, dir);

        // Load the new room
        next_exhibit.load(this.door_info);

        // Reset the old exhibit to a pristine state
        exhibit.reset();
        
    }

    collide_obstacles() {
        let camera = this.camera.bbox;
        let walls = this.current_exhibit.wall_bboxes;
        let objs = this.current_exhibit.obj_bboxes;
        let obstacles = walls.concat(objs)  

        for (let bbox of obstacles) {
            if (camera.intersectsBox(bbox)) {
                // Move to the previous position
                this.camera.backtrack();
            }
        }
    }

    collide_doors() {
        let camera = this.camera.bbox;
        let doors = this.current_exhibit.door_bboxes;

        for (let [dir, bbox] of doors) {
            if (camera.intersectsBox(bbox)) {
                this.move(dir);
            }
        }
    }

    check_collisions() {
        this.collide_obstacles();
        this.collide_doors();
    }

    update() {
        if (!this.current_exhibit.is_loading) { 
            this.check_collisions();
        }
    }

    render(renderer) {
        let exhibit = this.current_exhibit;

        if (!exhibit.is_loading) {
            exhibit.render(renderer, this.camera.camera);
        }
    }

    key_pressed(event) {
        switch (event.code) {
            case "KeyW":
            case "KeyS":
            case "KeyA":
            case "KeyD":
                this.camera.key_pressed(event.code);
                break;
        }
    }
}
