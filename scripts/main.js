//var exhibit;
var renderer;

var museum;
var pointer_locked = false;
var compass;

window.onload = function() {
    museum = new Museum();
    museum.load();

    // Set up the HUD elements
    compass = new Compass(museum.camera);
    compass.load();

    let w = window.innerWidth;
    let h = window.innerHeight;
    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);

    document.addEventListener('keydown', (event) => museum.key_pressed(event));

    //set up the mouse
    renderer.domElement.onclick = init_mouse;

    animate();
}

init_mouse = function() {
    let element = renderer.domElement;
    element.requestPointerLock();
    element.addEventListener('mousemove', mouse_move);
}

let mouse_move = function(event) {
    let x = event.movementX;
    let y = -event.movementY;
    museum.camera.rotate_view(new THREE.Vector2(x, y));
}

let animate = function() {
    requestAnimationFrame(animate);

    museum.update();
    museum.render(renderer);

    compass.update();
    compass.render(renderer);
}
