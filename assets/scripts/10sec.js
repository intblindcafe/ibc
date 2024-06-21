let shuffledQuestions = [];
let currentQuestionIndex = 0;
let timer;
let timeLeft;
let pausedTime;

const startGameButton = document.getElementById('start-game');
const nextQuestionButton = document.getElementById('next-question');
const reshuffleQuestionsButton = document.getElementById('reshuffle-questions');
const startTimerButton = document.getElementById('start-timer');
const stopTimerButton = document.getElementById('stop-timer');
const pauseTimerButton = document.getElementById('pause-timer');
const unpauseTimerButton = document.getElementById('unpause-timer');
const questionElement = document.getElementById('question');
const timerElement = document.getElementById('timer');
const buzzSound = document.getElementById('buzz-sound');

startGameButton.addEventListener('click', startGame);
nextQuestionButton.addEventListener('click', displayNextQuestion);
reshuffleQuestionsButton.addEventListener('click', reshuffleQuestions);
startTimerButton.addEventListener('click', startTimer);
stopTimerButton.addEventListener('click', stopTimer);
pauseTimerButton.addEventListener('click', pauseTimer);
unpauseTimerButton.addEventListener('click', unpauseTimer);

function startGame() {
    startGameButton.style.display = 'none';
    nextQuestionButton.style.display = 'inline';
    fetchQuestionsAndStartGame();
}

function fetchQuestionsAndStartGame() {
    const filePath = `assets/data/10sec/10sec-questions.json`;

    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            shuffledQuestions = shuffleArray(data);
            currentQuestionIndex = 0;
            displayNextQuestion();
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            questionElement.textContent = 'Failed to load questions. Please try again later.';
        });
}

function displayNextQuestion() {
    clearInterval(timer);
    timerElement.textContent = "";
    timerElement.style.display = 'none';
    startTimerButton.style.display = 'inline';
    stopTimerButton.style.display = 'none';
    pauseTimerButton.style.display = 'none';
    unpauseTimerButton.style.display = 'none';

    if (currentQuestionIndex < shuffledQuestions.length) {
        const questionObj = shuffledQuestions[currentQuestionIndex++];
        questionElement.textContent = questionObj.question;
    } else {
        questionElement.textContent = "No more questions!";
        nextQuestionButton.style.display = 'none';
        reshuffleQuestionsButton.style.display = 'inline';
        startTimerButton.style.display = 'none';
        stopTimerButton.style.display = 'none';
        pauseTimerButton.style.display = 'none';
        unpauseTimerButton.style.display = 'none';
    }
}

function startTimer() {
    console.log("Starting timer...");
    timeLeft = 10;
    timerElement.style.display = 'block';
    startTimerButton.style.display = 'none';
    stopTimerButton.style.display = 'inline';
    pauseTimerButton.style.display = 'inline';
    unpauseTimerButton.style.display = 'none';

    timer = setInterval(() => {
        console.log("Timer tick...");
        timerElement.textContent = `Time left: ${timeLeft}s`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            console.log("Timer finished.");
            timerElement.textContent = "";
            buzzSound.play();
            resetTimerButtons();
        }
    }, 1000);
}

function stopTimer() {
    console.log("Stopping timer...");
    clearInterval(timer);
    timerElement.textContent = "";
    resetTimerButtons();
}

function pauseTimer() {
    console.log("Pausing timer...");
    clearInterval(timer);
    pausedTime = timeLeft;
    pauseTimerButton.style.display = 'none';
    unpauseTimerButton.style.display = 'inline';
}

function unpauseTimer() {
    console.log("Unpausing timer...");
    timeLeft = pausedTime;
    timer = setInterval(() => {
        console.log("Timer tick...");
        timerElement.textContent = `Time left: ${timeLeft}s`;
        timeLeft--;

        if (timeLeft < 0) {
            console.log("Timer finished.");
            clearInterval(timer);
            timerElement.textContent = "";
            buzzSound.play();
            resetTimerButtons();
        }
    }, 1000);
    pauseTimerButton.style.display = 'inline';
    unpauseTimerButton.style.display = 'none';
}

function resetTimerButtons() {
    console.log("Resetting timer buttons...");
    startTimerButton.style.display = 'inline';
    stopTimerButton.style.display = 'none';
    pauseTimerButton.style.display = 'none';
    unpauseTimerButton.style.display = 'none';
    timerElement.style.display = 'none';
    buzzSound.currentTime = 0;
}

function shuffleArray(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function reshuffleQuestions() {
    location.reload();
}
