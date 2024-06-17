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
const showAnswerButton = document.getElementById('show-answer');
const hideAnswerButton = document.getElementById('hide-answer');
const questionElement = document.getElementById('question');
const choicesElement = document.getElementById('choices');
const answerElement = document.getElementById('answer');
const timerElement = document.getElementById('timer');
const buzzSound = document.getElementById('buzz-sound');
const gameSelector = document.getElementById('game-selector');
const qsetSelector = document.getElementById('qset-selector');
const gameTypeInputs = document.getElementsByName('game-type');

startGameButton.addEventListener('click', startGame);
nextQuestionButton.addEventListener('click', displayNextQuestion);
reshuffleQuestionsButton.addEventListener('click', reshuffleQuestions);
startTimerButton.addEventListener('click', startTimer);
stopTimerButton.addEventListener('click', stopTimer);
pauseTimerButton.addEventListener('click', pauseTimer);
unpauseTimerButton.addEventListener('click', unpauseTimer);
showAnswerButton.addEventListener('click', showAnswer);
hideAnswerButton.addEventListener('click', hideAnswer);

function startGame() {
    const selectedGameType = Array.from(gameTypeInputs).find(input => input.checked)?.value;
    const selectedQSet = qsetSelector.value;

    if (selectedGameType && selectedQSet) {
        gameSelector.style.display = 'none';
        startGameButton.style.display = 'none';
        nextQuestionButton.style.display = 'inline';
        fetchQuestionsAndStartGame(selectedGameType, selectedQSet);
    } else {
        alert('Please select a game type and question set.');
    }
}

function fetchQuestionsAndStartGame(gameType, qSet) {
    const folder = gameType === 'mc' ? 'mc-combined' : 'orig-combined';
    const filePath = `assets/data/trivia/${folder}/${folder}-qset${qSet}.json`;

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

        choicesElement.innerHTML = ''; // Clear previous choices
        questionObj.choices.forEach(choice => {
            const p = document.createElement('p');
            p.textContent = choice;
            choicesElement.appendChild(p);
        });

        answerElement.textContent = `Correct Answer: ${questionObj.answer}`;
        answerElement.style.display = 'none';
        showAnswerButton.style.display = 'inline';
        hideAnswerButton.style.display = 'none';
    } else {
        questionElement.textContent = "No more questions!";
        choicesElement.innerHTML = "";
        answerElement.textContent = "";
        nextQuestionButton.style.display = 'none';
        reshuffleQuestionsButton.style.display = 'inline';
        showAnswerButton.style.display = 'none';
        hideAnswerButton.style.display = 'none';
        startTimerButton.style.display = 'none';
        stopTimerButton.style.display = 'none';
        pauseTimerButton.style.display = 'none';
        unpauseTimerButton.style.display = 'none';
    }
}

function showAnswer() {
    const questionObj = shuffledQuestions[currentQuestionIndex - 1];
    const answerIndex = questionObj.choices.findIndex(choice => choice.includes(questionObj.answer));
    const answerLetter = String.fromCharCode(65 + answerIndex); // ASCII code for 'A' is 65

    answerElement.innerHTML = `Correct Answer: &nbsp;&nbsp;&nbsp; ${answerLetter}. ${questionObj.answer}`;
    answerElement.style.display = 'block';
    showAnswerButton.style.display = 'none';
    hideAnswerButton.style.display = 'inline';
}


function hideAnswer() {
    answerElement.style.display = 'none';
    showAnswerButton.style.display = 'inline';
    hideAnswerButton.style.display = 'none';
}

function startTimer() {
    console.log("Starting timer...");
    timeLeft = 60;
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
    //buzzSound.pause();
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
