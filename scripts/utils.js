let ajax = function(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => resolve(xhr.responseText));
        xhr.addEventListener('error', reject);
        xhr.open('GET', url);
        xhr.send();
    });
};
