class Museum {
    constructor() {
        this.layout = new MuseumLayout();
        this.make_exhibits();
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

    move(direction) {
        this.layout.move(direction);
    }

    get current_exhibit() {
        return this.layout.current_exhibit;
    }
}
