let teams = [];
let currentTeamIndex = 0;
let currentRound = 1;
let numRounds = 1;
let unlimitedRounds = false;
let timer;
let timerValue = document.getElementById('timer-value').value;
let timeLeft = parseInt(timerValue);
let pausedTime;
let originalTeamsOrder = [];
const timerElement = document.getElementById('timer');
const buzzSound = document.getElementById('buzz-sound');
const startTimerButton = document.getElementById('start-timer');
const stopTimerButton = document.getElementById('stop-timer');
const pauseTimerButton = document.getElementById('pause-timer');
const unpauseTimerButton = document.getElementById('unpause-timer');

function startGame() {
    const numTeams = document.getElementById('num-teams').value;
    const selectedRounds = document.getElementById('num-rounds').value;
    timerValue = document.getElementById('timer-value').value;

    if (numTeams === "" || selectedRounds === "" || timerValue === "") {
        alert("Please select the number of teams, the number of rounds, and the timer value before starting the game.");
        return;
    }

    for (let i = 0; i < numTeams; i++) {
        const teamName = document.getElementById(`team-name-${i}`).value.trim();
        if (teamName === "") {
            alert(`Please enter a name for Team ${i + 1}.`);
            return;
        }
    }

    numRounds = selectedRounds === 'unlimited' ? Infinity : parseInt(selectedRounds);
    unlimitedRounds = selectedRounds === 'unlimited';

    teams = [];
    originalTeamsOrder = []; // Clear and set up the original order array
    for (let i = 0; i < numTeams; i++) {
        const teamName = document.getElementById(`team-name-${i}`).value;
        const team = { name: teamName, score: 0 };
        teams.push(team);
        originalTeamsOrder.push(team); // Store the original order
    }

    document.getElementById('setup-section').style.display = 'none';
    document.getElementById('scoreboard-section').style.display = 'block';
    showTimerButtons();
    updateScoreboard();
}

function updateScoreboard() {
    const teamsContainer = document.getElementById('teams-container');
    if (teamsContainer) {
        teamsContainer.innerHTML = '';
        teams.forEach((team, index) => {
            const teamElement = document.createElement('div');
            teamElement.className = 'team' + (index === currentTeamIndex ? ' active' : '');
        teamElement.innerHTML = `<span>${index === currentTeamIndex ? 'Current Team&nbsp - &nbsp' : ''}${team.name}: ${team.score} points</span>`;
            teamsContainer.appendChild(teamElement);
        });

        const currentRoundElement = document.getElementById('current-round');
        if (currentRoundElement) {
            currentRoundElement.textContent = currentRound;
        }
    }
}

function updateScore(change) {
    teams[currentTeamIndex].score += change;
    updateScoreboard();
}

function nextTurn() {
    currentTeamIndex = (currentTeamIndex + 1) % teams.length;
    if (currentTeamIndex === 0) {
        currentRound++;
    }

    if (currentRound > numRounds) {
        gameOver();
    } else {
        updateScoreboard();
    }
}

function gameOver() {
    const roundHeader = document.getElementById('round-header');
    if (roundHeader) {
        roundHeader.textContent = 'GAME OVER';
    }

    const buttonContainer = document.getElementById('button-container');
    if (buttonContainer) {
        buttonContainer.style.display = 'none';
    }

    const nextTurnButton = document.querySelector('button[onclick="nextTurn()"]');
    if (nextTurnButton) {
        nextTurnButton.style.display = 'none';
    }

    hideTimerButtons();

    teams.sort((a, b) => b.score - a.score);

    const teamsContainer = document.getElementById('teams-container');
    if (teamsContainer) {
        teamsContainer.innerHTML = '';
        teams.forEach((team, index) => {
            let place;
            if (index === 0) {
                place = '1st Place: ';
            } else if (index === 1) {
                place = '2nd Place: ';
            } else if (index === 2) {
                place = '3rd Place: ';
            } else {
                place = `${index + 1}th Place: `;
            }
            const teamElement = document.createElement('div');
            teamElement.className = 'team';
            if (index === 0) {
                teamElement.classList.add('winner');
            }
            teamElement.innerHTML = `<span>${place}${team.name}: ${team.score} points</span>`;
            teamsContainer.appendChild(teamElement);
        });
    }

    const resetButton = document.getElementById('reset-scoreboard');
    if (resetButton) {
        resetButton.style.display = 'inline';
    }

    const playAgainButton = document.getElementById('play-again');
    if (playAgainButton) {
        playAgainButton.style.display = 'inline';
    }
}

function playAgain() {
    teams = originalTeamsOrder.map(team => ({ ...team, score: 0 }));
    currentRound = 1;
    currentTeamIndex = 0;

    const roundHeader = document.getElementById('round-header');
    if (roundHeader) {
        roundHeader.innerHTML = 'Round: <span id="current-round">1</span>';
    }

    const resetButton = document.getElementById('reset-scoreboard');
    if (resetButton) {
        resetButton.style.display = 'none';
    }

    const playAgainButton = document.getElementById('play-again');
    if (playAgainButton) {
        playAgainButton.style.display = 'none';
    }

    const buttonContainer = document.getElementById('button-container');
    if (buttonContainer) {
        buttonContainer.style.display = 'flex';
    }

    const nextTurnButton = document.querySelector('button[onclick="nextTurn()"]');
    if (nextTurnButton) {
        nextTurnButton.style.display = 'inline';
    }

    document.getElementById('setup-section').style.display = 'none';
    document.getElementById('scoreboard-section').style.display = 'block';

    showTimerButtons();

    updateScoreboard();
}

function resetScoreboard() {
    if (confirm('Are you sure you want to reset the scoreboard?')) {
        location.reload();
    }
}

document.getElementById('num-teams').addEventListener('change', function() {
    const numTeams = this.value;
    const teamSetupContainer = document.getElementById('team-setup');
    teamSetupContainer.innerHTML = '';

    for (let i = 0; i < numTeams; i++) {
        const teamInput = document.createElement('div');
        const defaultTeamName = `Team ${i + 1}`;
        teamInput.innerHTML = `
            <label for="team-name-${i}">Team ${i + 1} Name:</label>
            <input type="text" id="team-name-${i}" value="${defaultTeamName}">
        `;
        teamSetupContainer.appendChild(teamInput);
    }
});

function startTimer() {
    console.log("Starting timer...");
    timeLeft = parseInt(timerValue);
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

function showTimerButtons() {
    startTimerButton.style.display = 'inline';
    stopTimerButton.style.display = 'none';
    pauseTimerButton.style.display = 'none';
    unpauseTimerButton.style.display = 'none';
}

function hideTimerButtons() {
    startTimerButton.style.display = 'none';
    stopTimerButton.style.display = 'none';
    pauseTimerButton.style.display = 'none';
    unpauseTimerButton.style.display = 'none';
}