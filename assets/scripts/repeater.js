document.addEventListener('DOMContentLoaded', () => {
    let intervalId;
    let speechSynthesis = window.speechSynthesis;

    const messageInput = document.getElementById('message');
    const intervalInput = document.getElementById('interval');
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');

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

        // Disable and grey out inputs while repetition is active
        messageInput.disabled = true;
        intervalInput.disabled = true;
        messageInput.style.backgroundColor = '#e0e0e0';
        intervalInput.style.backgroundColor = '#e0e0e0';

        startButton.disabled = true;
        stopButton.disabled = false;
    });

    stopButton.addEventListener('click', () => {
        clearInterval(intervalId);

        // Re-enable inputs
        messageInput.disabled = false;
        intervalInput.disabled = false;
        messageInput.style.backgroundColor = '';
        intervalInput.style.backgroundColor = '';

        startButton.disabled = false;
        stopButton.disabled = true;
    });

    function speakMessage(message) {
        let utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);
    }
});
