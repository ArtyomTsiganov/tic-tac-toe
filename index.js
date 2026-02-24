const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let player = CROSS;

const Direction = {
    ROW: "ROW",
    COL: "COL",
    DIAG: "DIAG"
}

let n = parseInt(prompt("Введите число строк: "));

let grid = []

let movesCount = 0;
let HasWon = false;

let rows = new Array(n).fill(0)
let cols = new Array(n).fill(0)
let diags = new Array(2).fill(0)

const container = document.getElementById('fieldWrapper');
startGame();
addResetListener();

function startGame () {
    renderGrid(n);
    for(let i = 0; i < n; i++) {
        grid[i] = [];
    }
    fillGrid(EMPTY);
}

function smartAI() {
    player = (player === CROSS) ? ZERO : CROSS;
    const toAdd = player === CROSS ? 1 : -1;
    let i_random = -1, j_random = -1;

    for(let i = 0; i < n; i++) {
        for(let j = 0; j < n; j++) {
            if (grid[i][j] === EMPTY) {
                if (Math.random() <= 0.5 || i_random === -1) {
                    i_random = i;
                    j_random = j;
                }

                grid[i][j] = player;
                
                rows[i] += toAdd;
                cols[j] += toAdd;

                if(i === j) {
                    diags[0] += toAdd;
                } 
                if(j === n - i) {
                    diags[1] += toAdd;
                }

                if (checkWinCondition()) {
                    HasWon = true;
                    //renderSymbolInCell(player, i, j);

                    setTimeout(function() {
                        alert(`Победили ${player}`);
                        }, 250);
                    return;
                }

                rows[i] -= toAdd;
                cols[j] -= toAdd;

                if(i === j) {
                    diags[0] -= toAdd;
                } 
                if(j === n - 1 - i) {
                    diags[1] -= toAdd;
                }

                grid[i][j] = EMPTY;
            }         
        }
    }

    grid[i_random][j_random] = player;

    rows[i_random] += toAdd;
    cols[j_random] += toAdd;

    if(i_random === j_random) {
        diags[0] += toAdd;
    } 

    if(j_random === n - 1- i_random) {
        diags[1] += toAdd;
    }

    renderSymbolInCell(player, i_random, j_random);

    if (checkWinCondition()) {
        HasWon = true;
        setTimeout(function() {
                        alert(`Победили ${player}`);
                        }, 250);
        return;
    } 
}


function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function fillGrid(cellType) {
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < n; j++) {
            grid[i][j] = cellType;
        }
    }
}
function cellClickHandler (row, col) {
    if(HasWon) {
        return;
    }
    console.log(`Clicked on cell: ${row}, ${col}`);

    if(grid[row][col] !== EMPTY) {
        return;
    } 

    movesCount++;
    grid[row][col] = player;
    renderSymbolInCell(player, row, col);
    const toAdd = player === CROSS ? 1 : -1;
    rows[row] += toAdd;
    cols[col] += toAdd;
    if(col === row) {
        diags[0] += toAdd;
    } 
    if(col === n - 1 - row) {
        diags[1] += toAdd;
    }

    if(checkWinCondition()) {
        HasWon = true;
        setTimeout(function() {
                alert(`Победили ${player}`);
                }, 250);
    } else {
        smartAI();
    }

    player = (player === CROSS) ? ZERO : CROSS;
}


function checkWinCondition() {
    if(movesCount === n * n) {
        setTimeout(function() {
            alert(`Победила Дружба!`);
        }, 250);
    }
    for (let i = 0; i < n; i++) {
        if (Math.abs(rows[i]) === n) {
            paintWinnerDirection(Direction.ROW, i);
            return true;
        }
        if (Math.abs(cols[i]) === n) {
            paintWinnerDirection(Direction.COL, i);
            return true;
        }
    }

    if (Math.abs(diags[0]) === n) {
        paintWinnerDirection(Direction.DIAG, 0);
        return true;
    }

    if (Math.abs(diags[1]) === n) {
        paintWinnerDirection(Direction.DIAG, 1);
        return true;
    }

    return false;
}
function checkWinCondition() {
    if(movesCount === n * n) {
        setTimeout(function() {
                alert('Победила Дружба!');
                }, 250);
        return false;
    }

    for (let i = 0; i < n; i++) {
        if (Math.abs(rows[i]) === n) {
            paintWinnerDirection(Direction.ROW, i);
            return true;
        }
        if (Math.abs(cols[i]) === n) {
            paintWinnerDirection(Direction.COL, i);
            return true;
        }
    }

    if (Math.abs(diags[0]) === n) {
        paintWinnerDirection(Direction.DIAG, 0);
        return true;
    }

    if (Math.abs(diags[1]) === n) {
        paintWinnerDirection(Direction.DIAG, 1);
        return true;
    }

    return false;
}

function paintWinnerDirection(direction, idx) {
    const winColor = "red";

    if (direction === Direction.ROW) {
        for (let col = 0; col < n; col++) {
            renderSymbolInCell(grid[idx][col], idx, col, winColor);
        }
    }

    if (direction === Direction.COL) {
        for (let row = 0; row < n; row++) {
            renderSymbolInCell(grid[row][idx], row, idx, winColor);
        }
    }

    if (direction === Direction.DIAG) {

        if (idx === 0) {
            for (let i = 0; i < n; i++) {
                renderSymbolInCell(grid[i][i], i, i, winColor);
            }
        } else {
            for (let i = 0; i < n; i++) {
                renderSymbolInCell(grid[i][n - 1 - i], i, n - 1 - i, winColor);
            }
        }
    }
}
function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    player = CROSS;
    movesCount = 0;
    HasWon = false;
    rows.fill(0);
    cols.fill(0);
    diags.fill(0);
    fillGrid(EMPTY);
    renderGrid(n);
    alert('reset!');
}

function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

function testDraw () {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
