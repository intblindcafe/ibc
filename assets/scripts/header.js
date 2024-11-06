document.addEventListener("DOMContentLoaded", function () {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            document.dispatchEvent(new Event('headerLoaded')); // Dispatch a custom event
        });
});
