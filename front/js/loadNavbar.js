function loadHTML(id, url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error('Error al cargar el archivo:', error));
}

document.addEventListener("DOMContentLoaded", function() {
    loadHTML('navbar', 'navbar.html');
});
