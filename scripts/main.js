var scene;
var camera;
var renderer;
var cube;
var start_time;

window.onload = function() {

    scene = new THREE.Scene();

    camera = new FirstPersonCamera();

    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    /*
    let material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
        },
        vertexShader: document.getElementById('vert').textContent,
        fragmentShader: document.getElementById('frag').textContent
    });
    */

    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    let w = window.innerWidth;
    let h = window.innerHeight;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);

    start_time = new Date().getTime();

    document.addEventListener('keydown', key_pressed);

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

let animate = function() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    //cube.material.uniforms.time.value = (new Date().getTime() - start_time) / 1000;

    renderer.render(scene, camera.camera);
}
