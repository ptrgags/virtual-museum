class Museum {
    constructor() {
        this.layout = new MuseumLayout();
        this.make_exhibits();

        // Specify the starting room in index space
        this.ENTRANCE = new THREE.Vector2(4, 4);
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

    make_exhibits() {
        // make the exhibits
        let exhibits = [
            [[4, 4], new Exhibit()],
            [[3, 4], new ToonExhibit()]
        ];

        // Register the exhibits
        for (let [coords, exhibit] of exhibits) {
            let coord_vec = new THREE.Vector2(...coords);
            this.layout.register_exhibit(coord_vec, exhibit); 
        }
    }

    /*
    move(direction) {
        this.layout.move(direction);
    }
    */

    get current_exhibit() {
        return this.layout.get_exhibit(this.current_room);
    }

    get door_info() {
        let pos = this.current_room;
        return this.layout.get_door_info(pos);
    }

    load() {
        this.current_exhibit.load(this.door_info);
    }

    collide_obstacles() {
        let camera = this.camera.bbox;
        let walls = this.current_exhibit.wall_bboxes;
        let objs = this.current_exhibit.obj_bboxes;
        let obstacles = walls.concat(objs)  

        for (let bbox of obstacles) {
            if (camera.intersectsBox(bbox)) {
                console.log("Hit an obstacle!");
            }
        }
    }

    collide_doors() {
        let camera = this.camera.bbox;
        let doors = this.current_exhibit.door_bboxes;

        for (let [dir, bbox] of doors) {
            if (camera.intersectsBox(bbox)) {
                console.log(`Opened the ${dir} door!`);
            }
        }
    }

    check_collisions() {
        this.collide_obstacles();
        this.collide_doors();
    }

    update() {
        this.check_collisions();
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
