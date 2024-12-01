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
    //event listeners
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
//for hard bot
function minimax(newBoard, depth, isMaximizing) {
    const availableSpots = Object.keys(newBoard).filter(key => newBoard[key] === '');
  
    if (checkWinner("x")) {
        return { score: -10 + depth };
    } else if (checkWinner("o")) {
        return { score: 10 - depth };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }
  
    if (isMaximizing) {
        let bestMove = { score: -Infinity };
  
        availableSpots.forEach(spot => {
            newBoard[spot] = "o";
            let result = minimax(newBoard, depth + 1, false);
            newBoard[spot] = '';
            result.cell = spot;
  
            if (result.score > bestMove.score) {
            bestMove = result;
            }
        });
  
        return bestMove;
    } else {
        let bestMove = { score: Infinity };
  
        availableSpots.forEach(spot => {
            newBoard[spot] = "x";
            let result = minimax(newBoard, depth + 1, true);
            newBoard[spot] = '';
            result.cell = spot;
  
            if (result.score < bestMove.score) {
            bestMove = result;
            }
        });
  
        return bestMove;
    }
}


//easy bot
function bot_easy() {
    //find available spots
    let availableSpots = Object.keys(board).filter(key => board[key] === '');
    if (availableSpots.length > 0) {
        //choose a random empty spot
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
    const availableSpots = Object.keys(board).filter(key => board[key] === '');
  
    //try to win
    for (let spot of availableSpots) {
        board[spot] = "o"; //simulate move
        if (checkWinner("o")) {
            bot_input(spot); //is the move win, take the place
            return;
        }
        board[spot] = ''; //undo wrone move
    }
  
    //block the player winning
    for (let spot of availableSpots) {
        board[spot] = "x"; // simulate move
        if (checkWinner("x")) {
            bot_input(spot); //if the move block the player, block.
            return;
        }
        board[spot] = ''; //undo wrone move
    }
  
    //take the center if available
    if (board["e"] === '') {
        bot_input("e");
        return;
    }
  
    //take a corner if available
    const corners = ["a", "c", "g", "i"];
    const availableCorners = corners.filter(corner => board[corner] === '');
    if (availableCorners.length > 0) {
        const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
        bot_input(randomCorner);
        return;
    }
  
    //take any random available spot
    const randomSpot = availableSpots[Math.floor(Math.random() * availableSpots.length)];
    bot_input(randomSpot);
  }
//hard bot
function bot_hard() {
    const bestMove = minimax(board, 0, true);
    bot_input(bestMove.cell);
  
    if (checkWinner("o")) {
        document.getElementById('status').textContent = 'Bot wins!';
        disableBoard();
    } else if (isBoardFull()) {
        document.getElementById('status').textContent = 'It\'s a draw!';
    }
}


//restart(change difficulty) button
const playagain = document.getElementById("change_difficulty");
playagain.addEventListener("click", () => location.reload());
