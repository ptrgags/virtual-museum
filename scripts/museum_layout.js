class MuseumLayout {
    constructor(width=8, height=8) {
        // maximum size of the museum in # rooms in each direction
        this.map_width = width;
        this.map_height = height;

        // Start out with an empty museum
        this.layout = this.make_empty_layout(); 

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
        for (let i = 0; i < this.map_height; i++) {
            let row = Array(this.map_width).fill(null);
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
     * Convert 2D -> 1D index
     * This is useful for the minimap shader
     */
    get_index(coords) {
        // x = row, y = col
        return coords.x + this.map_width + coords.y;
    }

    /**
     * Check if indices are within the bounds of the map
     */
    validate_coords(indices) {
        let row_valid = 0 <= indices.x && indices.x < this.map_height;
        let col_valid = 0 <= indices.y && indices.y < this.map_width;

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
            return this.get_exhibit(neighbor);
        } catch(err) {
            return null;
        }
    }

    /**
     * For a given location, get a list of which directions
     * lead to a room
     */
    get_door_info(pos) {
        let info = [];
        for (let dir of ['east', 'north', 'west', 'south']) {
            let adjacent = this.get_neighbor(pos, dir);
            if (adjacent) {
                // TODO: Also push the adjacent room's label
                info.push(dir); 
            }
        }
        return info;
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
