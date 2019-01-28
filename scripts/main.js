var exhibit;
var scene;
var camera;
var renderer;
var cube;
var start_time;

window.onload = function() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);

    camera = new FirstPersonCamera();

    exhibit = new ToonExhibit();

/*
    //let geometry = new THREE.BoxGeometry(1, 1, 1);
    //let geometry = new THREE.TorusGeometry(1.0, 0.4, 16, 100);
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

    let light = new THREE.PointLight(0xFFFFFF, 1.0, 100);
    light.position.set(1.0, 1.0, 1.0);
    scene.add(light);

    let light2 = new THREE.PointLight(0x00FFFF, 1.0, 100);
    light2.position.set(-0.5, 0.0, 2.0);
    scene.add(light2);

    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    */

    let w = window.innerWidth;
    let h = window.innerHeight;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);

    start_time = new Date().getTime();

    document.addEventListener('keydown', key_pressed);
    document.addEventListener('mousemove', mouse_move);

    animate();
}

let key_pressed = function(event) {
    switch (event.code) {
        case "KeyW":
            camera.move_parallel(1);
            break;
        case "KeyS":
            camera.move_parallel(-1);
            break;
        case "KeyA":
            camera.move_perpendicular(-1);
            break;
        case "KeyD":
            camera.move_perpendicular(1);
            break;
    }
}

let mouse_move = function(event) {
    let x = event.clientX;
    let y = (window.innerHeight - 1) - event.clientY;
    camera.rotate_view(new THREE.Vector2(x, y));
}

let animate = function() {
    requestAnimationFrame(animate);
    /*

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    cube.material.uniforms.time.value = (new Date().getTime() - start_time) / 1000;
    */

    renderer.render(exhibit.scene, camera.camera);
}
