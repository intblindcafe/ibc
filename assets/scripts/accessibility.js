// Initialize variables outside the event listener to store user preferences
let textSize = parseInt(localStorage.getItem('textSize')) || 150;
let contrastMode = localStorage.getItem('contrastMode') || 'default';

// Wait for 'headerLoaded' event to initialize elements and accessibility functions
document.addEventListener('headerLoaded', () => {
    // Get elements
    const accessibilityButton = document.getElementById('accessibility-button');
    const accessibilityPanel = document.getElementById('accessibility-panel');
    const announcement = document.getElementById('announcement');
    const decreaseTextSizeButton = document.getElementById('decrease-text-size');
    const increaseTextSizeButton = document.getElementById('increase-text-size');
    const textSizeLabel = document.getElementById('text-size-label');
    const contrastButtons = document.querySelectorAll('.contrast-mode-controls button');
    const resetButton = document.getElementById('reset');

    // Function to update text size label and apply text size
    function updateTextSizeLabel() {
        textSizeLabel.textContent = textSize === 150 ? 'Default' : `${textSize}%`;
        document.body.style.fontSize = `${textSize}%`; // Apply font size
        localStorage.setItem('textSize', textSize); // Save to localStorage
    }

    // Function to apply contrast mode
    function applyContrastMode(mode) {
        document.documentElement.className = mode;
        localStorage.setItem('contrastMode', mode); // Save to localStorage
    }

    // Toggle accessibility panel visibility
    accessibilityButton.addEventListener('click', () => {
        accessibilityPanel.style.display = accessibilityPanel.style.display === 'block' ? 'none' : 'block';
        accessibilityButton.textContent = accessibilityButton.textContent === 'Close Settings' ? 'Show Settings' : 'Close Settings';
        accessibilityButton.ariaLabel = accessibilityPanel.style.display === 'block' ? 'Close Settings' : 'Show Settings';
        announcement.textContent = accessibilityPanel.style.display === 'block' ? 'Accessibility Settings opened.' : 'Accessibility Settings closed.';
    });

    // Increase or decrease text size with limits
    decreaseTextSizeButton.addEventListener('click', () => {
        if (textSize > 100) {
            textSize = Math.max(100, textSize - 25);
            updateTextSizeLabel();
        }
        announcement.textContent = textSize === 150 ? 'Size now Default' : `Size now ${textSize}%`;
    });

    increaseTextSizeButton.addEventListener('click', () => {
        if (textSize < 300) {
            textSize = Math.min(300, textSize + 25);
            updateTextSizeLabel();
        }
        announcement.textContent = textSize === 150 ? 'Size now Default' : `Size now ${textSize}%`;
    });

    // Apply contrast mode when a button is clicked
    contrastButtons.forEach(button => {
        button.addEventListener('click', () => {
            contrastMode = button.id;
            applyContrastMode(contrastMode);
            announcement.textContent = `Contrast Mode set to ${contrastMode}`;
        });
    });

    // On click of Reset All, reset contrast and text size
    resetButton.addEventListener('click', () => {
        textSize = 150;
        updateTextSizeLabel();
        applyContrastMode('default');
        announcement.textContent = 'Accessibility Settings reset to Default.';
    });

    // On load, apply saved text size and contrast mode
    updateTextSizeLabel();
    applyContrastMode(contrastMode);

    // Set the selected contrast button based on saved contrast mode
    const activeButton = document.getElementById(contrastMode);
    if (activeButton) activeButton.classList.add('active');
});
