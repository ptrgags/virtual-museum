/**
 * Class that handles constructing signs to put on the doors of the museum
 *
 * The signs support up to 32x32
 */
class SignMaker {
    constructor() {
        this.sign_geom = new THREE.PlaneGeometry(2, 2);
    }

    /**
     * Fetch resources for this sign maker and
     * set up promises to store them when received.
     */
    load() {
        let requests = [
            get_texture('textures/font.png'),
            ajax('shaders/uv_quad.vert'),
            ajax('shaders/sign.frag')];

        return Promise.all(requests)
            .then((x) => this.store_resources(x));
        
    }

    store_resources(resources) {
        let [tex, vert, frag] = resources;
        this.texture = tex;
        this.vert = vert;
        this.frag = frag;
    }

    /**
     * Set up a material for a specific text
     *
     * text: a string of ascii text, no longer than 256 characters
     */
    make_text_material(text, settings) {
        let baked_text = this.encode_text(text);

        return new THREE.ShaderMaterial({
            uniforms: {
                text: {value: baked_text},
                fg_color: {value: settings.fg_color},
                bg_color: {value: settings.bg_color},
                font_texture: {value: this.texture},
                text_dimensions: {value: settings.text_dimensions}
            },
            name: 'sign',
            vertexShader: this.vert,
            fragmentShader: this.frag,
        });
    }

    /**
     * Turn a string of ASCII characters into an array of integers
     */
    encode_text(text) {
        return text.split("").map((x) => x.charCodeAt(0));
    }

    /**
     * Make a mesh for the sign.
     * pass the material this class created back in, since the caller
     * may have stored it somewhere else
     */
    make_sign(text, settings) {
        let material = this.make_text_material(text, settings)
        let quad = new THREE.Mesh(this.sign_geom, material);
        return quad;
    }
}
