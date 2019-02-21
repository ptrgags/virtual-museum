let ajax = function(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => resolve(xhr.responseText));
        xhr.addEventListener('error', reject);
        xhr.open('GET', url);
        xhr.send();
    });
};

let vec2 = function(x, y) {
    return new THREE.Vector2(x, y);
}

let vec3 = function(x, y, z) {
    return new THREE.Vector3(x, y, z);
}
