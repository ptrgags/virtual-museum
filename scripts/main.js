//var exhibit;
var scene;
var renderer;
var cube;
var start_time;

var museum;

window.onload = function() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);

    museum = new Museum();
    museum.load();

    let w = window.innerWidth;
    let h = window.innerHeight;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);

    start_time = new Date().getTime();

    document.addEventListener('keydown', (event) => museum.key_pressed(event));
    document.addEventListener('mousemove', mouse_move);

    animate();
}

/** TODO: Delegate some of this to the museum and camera */
let mouse_move = function(event) {
    let x = event.clientX;
    let y = (window.innerHeight - 1) - event.clientY;
    museum.camera.rotate_view(new THREE.Vector2(x, y));
}

let animate = function() {
    requestAnimationFrame(animate);

    museum.update();
    museum.render(renderer);
}
