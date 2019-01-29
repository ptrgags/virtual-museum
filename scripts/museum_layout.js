class MuseumLayout {
    constructor() {
        // maximum size of the museum in # rooms in each direction
        this.MAP_WIDTH = 8;
        this.MAP_HEIGHT = 8;

        // Start out with an empty museum
        this.layout = this.make_empty_layout();
 
        // Specify the starting room in index space
        this.ENTRANCE = new THREE.Vector2(4, 4);
        this.current_room = this.ENTRANCE;

        // Index space offsets for the cardinal directions
        this.OFFSETS = new Map([
            ['north', new THREE.Vector2(-1, 0)],
            ['south', new THREE.Vector2(1, 0)],
            ['east', new THREE.Vector2(0, 1)],
            ['west', new THREE.Vector2(0, -1)]
        ]);
    }

    make_empty_layout() {
        let rows = [];
        for (let i = 0; i < this.MAP_HEIGHT; i++) {
            let row = Array(8).fill(null);
            rows.push(row);
        }
        return rows;
    }

    /**
     * Iterate over the layout and get a flattened array of booleans
     * that specify if there's a room at that location
     *
     * This is intended to be passed to the minimap shader as a uniform
     * so it knows where to draw the rooms
     */
    get minimap_buffer() {
        let buf = [];
        for (let row of this.layout) {
            for (let room of row)
                buf.push(room !== null);
        }
    }

    /**
     * For the minimap shader, get the index of the current room
     */
    get current_room_index() {
        let row = this.current_room.x;
        let col = this.current_room.y;
        return row * this.MAP_WIDTH + col;
    }

    /**
     * For the minimap shader, get the index of the entrance
     */
    get entrance_index() {
        let row = this.ENTRANCE.x;
        let col = this.ENTRANCE.y;
        return row * this.MAP_WIDTH + col;
    }

    /**
     * Check if indices are within the bounds of the map
     */
    validate_coords(indices) {
        let row_valid = 0 <= indices.x && indices.x < this.MAP_HEIGHT;
        let col_valid = 0 <= indices.y && indices.y < this.MAP_WIDTH;

        if (!row_valid || !col_valid) {
            throw new Error(`Invalid coords! ${json.stringify(indices)}`);
        }
    }

    /**
     * Add a room to the museum. The position is specified as
     * (row, col), not (x, y)
     */
    register_exhibit(pos, exhibit) {
        // Make sure we get integer coordinates in bounds
        let indices = pos.clone().floor();
        this.validate_coords(indices);

        let row = indices.x;
        let col = indices.y;
        this.layout[row][col] = exhibit;
    }

    /**
     * Get an exibit at the giveen row, column.
     */
    get_exhibit(pos) {
        // Make sure we get integer coordinates in bounds
        let indices = pos.clone().floor();
        this.validate_coords(indices);

        let row = indices.x;
        let col = indices.y;

        return this.layout[row][col];
    }

    /**
     * Get the currently selected exhibit
     */
    get current_exhibit() {
        let row = this.current_room.x;
        let col = this.current_room.y;
        return this.layout[row][col];
    }

    /**
     * Return a neighbor exhibit if there is one, otherwise return null.
     *
     * direction is one of north|south|east|west as a string
     */
    get_neighbor(pos, direction) {
        // Move one step in a given direction
        let offset = this.OFFSETS.get(direction);
        let neighbor = pos.clone().add(offset);

        try {
            this.get_exhibit(neighbor);
        } catch(err) {
            return null;
        }
    }

    /**
     * Move to an adjacent room. The direction must be a valid exit of
     * the current room
     */
    move(direction) {
        let offset = this.OFFSETS.get(direction);
        this.current_room.add(offset);
    }
}
