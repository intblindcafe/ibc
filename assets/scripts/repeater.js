document.addEventListener('DOMContentLoaded', () => {
    let intervalId;
    let speechSynthesis = window.speechSynthesis;

    const messageInput = document.getElementById('message');
    const intervalInput = document.getElementById('interval');
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');

    // Hide Stop button on page load
    stopButton.style.display = 'none';

    startButton.addEventListener('click', () => {
        let message = messageInput.value;
        let interval = parseInt(intervalInput.value, 10) * 1000;

        if (!message || isNaN(interval) || interval <= 0) {
            alert("Please enter a valid message and interval.");
            return;
        }

        speakMessage(message); // Speak immediately on start
        intervalId = setInterval(() => {
            speakMessage(message);
        }, interval);

        // Hide Start button and show Stop button
        startButton.style.display = 'none';
        stopButton.style.display = 'inline-block';

        // Grey out the inputs while repetition is active
        messageInput.disabled = true;
        intervalInput.disabled = true;
        messageInput.style.backgroundColor = '#e0e0e0';
        intervalInput.style.backgroundColor = '#e0e0e0';
    });

    stopButton.addEventListener('click', () => {
        clearInterval(intervalId); // Stop the repetition

        // Show Start button and hide Stop button
        startButton.style.display = 'inline-block';
        stopButton.style.display = 'none';

        // Re-enable inputs when repetition is stopped
        messageInput.disabled = false;
        intervalInput.disabled = false;
        messageInput.style.backgroundColor = '';
        intervalInput.style.backgroundColor = '';
    });

    function speakMessage(message) {
        let utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);
    }
});
