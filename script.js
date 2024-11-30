const board = {
    a: '', b: '', c: '',
    d: '', e: '', f: '',
    g: '', h: '', i: ''
  };
  
const winningCombinations = [
    ['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i'],
    ['a', 'd', 'g'], ['b', 'e', 'h'], ['c', 'f', 'i'],
    ['a', 'e', 'i'], ['c', 'e', 'g']
  ];

//show the button grid and get difficulty. and call difficulty_check() with difficulty input.
function start() {
    let selected_difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    const hiddenPage = document.getElementById('grid-container');
    const radio_button = document.getElementById('difficulty');
    const startbutton = document.getElementById("start_button");
    const restart_button = document.querySelector(".reset_buttons")
    if (hiddenPage.style.display === 'none' || hiddenPage.style.display === '') {
        hiddenPage.style.display = 'grid';
        startbutton.style.display = 'none';
        radio_button.style.display = 'none';
        restart_button.style.display = "block"
    }
    difficulty_check(selected_difficulty)
}
//check difficulty chosen by player and call function depending on the input
function difficulty_check(selected_difficulty) {
    switch (selected_difficulty) {
        case 'easy':
            player_input(1)
            break;
        case 'medium':
            player_input(2)
            break;
        case 'hard':
            player_input(3)
            break;
    }
}


function isBoardFull() {
    return Object.values(board).every(cell => cell !== '');
}

function checkWinner(player) {
    return winningCombinations.some(combination =>
        combination.every(cell => board[cell] === player)
    );
}

function disableBoard() {
    Object.keys(board).forEach(id => {
        const cell = document.getElementById(id);
        cell.classList.add('taken');
    });
}

function resetGame() {
    Object.keys(board).forEach(id => {
        board[id] = '';
        const cell = document.getElementById(id);
        cell.textContent = '';
        cell.classList.remove('taken');
    });
    document.getElementById('status').textContent = '';
    currentPlayer = 'X';
}


//handle player input. append x into the board input
function player_input(difficulty) {
    // Button event listeners
    const buttons = [
        { id: "a" },
        { id: "b" },
        { id: "c" },
        { id: "d" },
        { id: "e" },
        { id: "f" },
        { id: "g" },
        { id: "h" },
        { id: "i" }
    ];
  
    buttons.forEach(button => {
        document.getElementById(button.id).onclick = () => {
            if (document.getElementById(button.id).textContent != "x" && document.getElementById(button.id).textContent != "o") {
            document.getElementById(button.id).textContent = "x";
            board[button.id] = "x";
  
            if (checkWinner("x")) {
                document.getElementById('status').textContent = 'You win!';
                alert('You win!');
                disableBoard();
            } else if (isBoardFull()) {
                document.getElementById('status').textContent = 'It\'s a draw!';
                alert('It\'s a draw!');
            } else {
                if (difficulty == 1) {
                    bot_easy()
                } else if (difficulty == 2) {
                    bot_medium()
                } else if (difficulty == 3) {
                    bot_hard()
                }
            }
        }
        };
    });
}
//handle bot input. append o into the board array
function bot_input(input) {
    if (board[input] === '') {
        document.getElementById(input).textContent = "o";
        board[input] = "o";
    }
}



//easy bot
function bot_easy() {
    // Find available spots
    let availableSpots = Object.keys(board).filter(key => board[key] === '');
    if (availableSpots.length > 0) {
        // Choose a random empty spot
        let randomIndex = Math.floor(Math.random() * availableSpots.length);
        let chosenSpot = availableSpots[randomIndex];
        bot_input(chosenSpot);
  
        if (checkWinner("o")) {
            document.getElementById('status').textContent = 'Bot wins!';
            alert('Bot wins!');
            disableBoard();
        } else if (isBoardFull()) {
            document.getElementById('status').textContent = 'It\'s a draw!';
            alert('It\'s a draw!');
        }
    }
}
//medium bot
function bot_medium() {
    
}
//hard bot
function bot_hard() {
    
}


//restart(change difficulty) button
const playagain = document.getElementById("change_difficulty");
playagain.addEventListener("click", () => location.reload());
