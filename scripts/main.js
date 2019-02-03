//var exhibit;
var scene;
var camera;
var renderer;
var cube;
var start_time;

var museum;

window.onload = function() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);

    camera = new FirstPersonCamera();
    museum = new Museum();
    museum.move('north');
    museum.current_exhibit.load();

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

    let exhibit = museum.current_exhibit;

    if (!exhibit.is_loading) {
        exhibit.render(renderer, camera.camera);
    }
}
