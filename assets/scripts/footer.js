document.addEventListener("DOMContentLoaded", function() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;

            // Now that the footer is loaded, set the current year
            const currentYear = new Date().getFullYear();
            document.getElementById('currentYear').textContent = currentYear;
        });
});