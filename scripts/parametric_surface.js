/**
 * Container for the parameters for a Super Seashell
 */
class SuperSeashell{
    constructor() {
        this.uniforms = {
            seashell_params: {value: this.default_params}
        }
    }

    get default_params() {
        return {
            coil_radius: vec2(1.0, 0),
            coil_angle: vec2(0, 8 * Math.PI),
            coil_z: vec2(-4, 3),
            coil_m: vec2(0.8, 2),
            coil_n: vec2(0.8, 2),
            cross_section_radius: vec2(0.5, 0), 
            cross_section_twist: vec2(0, 0),
            cross_section_m: vec2(5, 2),
            cross_section_n: vec2(5, 2),
        }
    }

    set_uniform(name, new_val) {
        this.uniforms.seashell_params[name].value = new_val;
    }
};
