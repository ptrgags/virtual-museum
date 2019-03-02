//var exhibit;
var renderer;

var museum;
var pointer_locked = false;
var compass;
var minimap;

window.onload = function() {
    museum = new Museum();
    museum.load();

    // Set up the HUD elements
    compass = new Compass(museum.camera);
    compass.load();
    minimap = new Minimap(museum);
    minimap.load();

    let w = window.innerWidth;
    let h = window.innerHeight;
    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(w, h);
    //renderer.shadowMap.enabled = true;
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

    // Render the main view
    museum.update();
    museum.render(renderer);
 
    // Determine where the HUD elements go given the current screen size 
    const COMPASS_DIMS = new THREE.Vector3(100, 100);
    const MINIMAP_DIMS = new THREE.Vector3(200, 200);
    let corner = new THREE.Vector3(window.innerWidth, window.innerHeight);
    let minimap_pos = corner.clone().sub(MINIMAP_DIMS);
    let compass_pos = corner.clone()
        .sub(new THREE.Vector3(MINIMAP_DIMS.x, 0.0))
        .sub(COMPASS_DIMS);

    // Renderr the HUD elements
    compass.update();
    compass.render(renderer, compass_pos, COMPASS_DIMS);
    minimap.update();
    minimap.render(renderer, minimap_pos, MINIMAP_DIMS);

    // Reset the renderer's state since the HUD elements change
    // some settings
    renderer.autoClear = true;
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
}
