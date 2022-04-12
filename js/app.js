window.onload = function () {
    gameStart()
}

const cells = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const xClass = 'x-mark'
const oClass = 'o-mark'
const winUI = document.getElementById('game-state')
const winTitle = document.querySelector('[data-win-title]')
const winMessage = document.querySelector('[data-win-message]')
const resetButton = document.getElementById('reset-button')
const closeButton = document.getElementById('close-button')
const closedResetUI = document.getElementById('closed-reset')
const closedResetButton = document.getElementById('closed-reset-button')
let playerTurn

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

resetButton.addEventListener('click', gameStart)
closedResetButton.addEventListener('click', gameStart)
closeButton.addEventListener('click', () => {
    winUI.classList.remove('show'), closedResetUI.classList.add('show')
    board.classList.add('isDisabled')
})

/**
 * Gets board cells.
 * @param {object} cells - The board cells.
 */
function gameStart() {
    playerTurn = false // false = x, true = o
    cells.forEach((cell) => {
        cell.classList.remove(xClass)
        cell.classList.remove(oClass)
        cell.classList.remove('tile-active')
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, { once: true })
    })
    boardPlayerState()
    winUI.classList.remove('show')
    winTitle.classList.remove('x-mark')
    winTitle.classList.remove('o-mark')
    winTitle.classList.remove('draw')
    closedResetUI.classList.remove('show')
    board.classList.remove('isDisabled')
}

/**
 * Handles click event.
 * @param {event} e - The click event.
 */
function handleClick(e) {
    const cell = e.target

    if (board.classList.contains('isDisabled')) {
        return
    }

    const currentClass = playerTurn ? xClass : oClass

    placeMark(cell, currentClass)

    // Check Game State Win / Draw.
    if (checkWin(currentClass)) {
        endGame(false)
    } else if (isDraw()) {
        endGame(true)
    } else {
        rotateTurn()
        boardPlayerState()
    }
}
/**
 * @param {boolean} draw - True if the game is a draw.
 */
function endGame(draw) {
    if (draw) {
        winTitle.classList.add('draw')
        winTitle.innerHTML = "It's a draw!"
        winMessage.innerHTML = 'Why not give it another go?'
    } else {
        playerTurn
            ? winTitle.classList.add('x-mark')
            : winTitle.classList.add('o-mark')
        winTitle.innerHTML = `${playerTurn ? 'X Wins!' : 'O Wins!'}`
        winMessage.innerHTML = `${
            playerTurn
                ? "Unlucky o's, get em next time eh?"
                : "Unlucky x's, get em next time eh?"
        }`
    }
    winUI.classList.add('show')
}
/**
 * @return {boolean} - Returns true if the game is a draw.
 */
function isDraw() {
    return [...cells].every((cell) => {
        return (
            cell.classList.contains(xClass) || cell.classList.contains(oClass)
        )
    })
}

/**
 * @param {target} cell - The cell to place the mark.
 * @param {string} currentClass - The current player class.
 */
function placeMark(cell, currentClass) {
    cell.classList.add(currentClass)
    cell.classList.add('tile-active')
}

/**
 * The current player turn.
 */
function rotateTurn() {
    playerTurn = !playerTurn
}

/**
 * Board hover state.
 */
function boardPlayerState() {
    board.classList.remove(xClass)
    board.classList.remove(oClass)

    if (playerTurn) {
        board.classList.add(xClass)
    } else {
        board.classList.add(oClass)
    }
}
/**
 * @param  {string} currentClass - The current player class.
 * @return {boolean} - Returns true if the player has won.
 */
function checkWin(currentClass) {
    return winConditions.some((condition) => {
        return condition.every((index) => {
            return cells[index].classList.contains(currentClass)
        })
    })
}
