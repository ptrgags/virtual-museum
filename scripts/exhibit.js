/**
 * The Exhibit is the base class for exits
 */
class Exhibit {
    constructor() {
        this.DEFAULT_MATERIAL = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x050505,
            shininess: 30
        });
        // Distance from center to side of the room
        this.ROOM_SIZE = 20.0;
        this.HALF_PI = Math.PI / 2.0


        this.scene = new THREE.Scene();
        this.setup_scene();
    }

    setup_scene() {

        let lights = this.make_lights();
        let floor = this.make_floor();
        let walls = this.make_walls();
        let ceiling = this.make_ceiling();
        let main_objs = this.make_main_objs();

        let objs = lights.concat(floor, walls, ceiling, main_objs);

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
        let plane = new THREE.Mesh(geom, this.DEFAULT_MATERIAL);
        plane.scale.x = this.ROOM_SIZE;
        plane.scale.y = this.ROOM_SIZE;
        plane.rotation.x = -this.HALF_PI;

        return [plane];
    }

    make_walls() {
        let walls = [];
        const NUM_WALLS = 4;
        for (let i = 0; i < NUM_WALLS; i++) {
            // Unit square has width 2
            let geom = new THREE.PlaneGeometry(2, 2, 16);
            let plane = new THREE.Mesh(geom, this.DEFAULT_MATERIAL);
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
        let plane = new THREE.Mesh(geom, this.DEFAULT_MATERIAL);
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
}

class ToonExhibit extends Exhibit {
    make_main_objs() {
        let geometry = new THREE.TorusKnotGeometry(1.0, 0.1, 100, 16, 2, 5);
        let material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib['lights'],
                {
                    time: { value: 0.0 },
                }
            ]), 
            vertexShader: document.getElementById('vert').textContent,
            fragmentShader: document.getElementById('frag').textContent,
            lights: true
        });

        let knot = new THREE.Mesh(geometry, material); 
        knot.position.y = this.ROOM_SIZE / 4;
        return [knot];
    }
}
