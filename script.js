let level = 1;
let bestLevel = 1;
let answer;
let username = '';
const userRecords = JSON.parse(localStorage.getItem('userRecords')) || {};

// Function to update the status
function updateGameStatus(status) {
    document.getElementById('status').innerHTML = status;
}

// Function to update the level text
function updateLevelText() {
    bestLevel = Math.max(level, bestLevel);
    document.getElementById('level').innerHTML = `Current Level: ${level}&nbsp;&nbsp;&nbsp;Best Level: ${bestLevel}`;
}

// Function to run the question (flashing buttons)
async function runQuestion(answerArr) {
    for (const color of answerArr) {
        const button = document.querySelector(`button[data-key="${color}"]`);
        button.classList.add(button.getAttribute('data-light'));
        await sleep(1000);
    }
    document.getElementById('start').disabled = false;
}

// Function to start the game
function startGame() {
    updateLevelText();
    updateGameStatus('');
    document.getElementById('start').disabled = true;
    answer = [];
    for (let i = 0; i < level; i++) {
        const color = Math.floor(Math.random() * 4);
        answer.push(color);
    }
    runQuestion(answer);
}

// Function to check the answer
function checkAnswer() {
    if (answer === undefined || answer.length === 0) {
        updateGameStatus('Please click start to play the game!');
        return;
    }

    const ans = answer.splice(0, 1);

    if (this.getAttribute('data-key') === String(ans)) {
        if (answer.length === 0) {
            level += 1;
            updateGameStatus(`Good Job! Click Start to begin level ${level} challenge!`);
        }
    } else {
        // Save the best score for the user
        userRecords[username] = Math.max(userRecords[username] || 0, bestLevel);
        localStorage.setItem('userRecords', JSON.stringify(userRecords));
        updateUserRecords();

        level = 1; // reset level
        answer = [];
        updateGameStatus('Game Over! Click Start to restart the game!');
        updateLevelText();
    }
}

// Function to update the list of user records
function updateUserRecords() {
    const recordList = document.getElementById('user-records');
    recordList.innerHTML = '';

    for (const user in userRecords) {
        const listItem = document.createElement('li');
        listItem.textContent = `${user}: Best Level - ${userRecords[user]}`;
        recordList.appendChild(listItem);
    }
}

// Function to handle sleep (pauses between flashes)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to handle user name submission
function handleUserName() {
    username = document.getElementById('username').value;
    if (username) {
        document.getElementById('user-form').style.display = 'none';
        document.getElementById('game').style.display = 'block';
        updateUserRecords();
    }
}

// Add event listeners on page load
window.onload = function () {
    document.getElementById('submit-name').onclick = handleUserName;
    document.getElementById('start').onclick = startGame;

    // Add transitionend to buttons for color flashing effect
    document.querySelectorAll('button[data-light]').forEach((button) => {
        button.addEventListener('transitionend', (e) => {
            e.target.classList.remove(button.getAttribute('data-light'));
        });
        button.addEventListener('click', checkAnswer);
    });
};