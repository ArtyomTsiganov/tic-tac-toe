const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let player = CROSS;

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
    player = (player === CROSS) ? ZERO : CROSS;

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
    } else if(col == n - 1 - row) {
        diags[1] += toAdd;
    }

    if(checkWinCondition()) {
        HasWon = true;
        alert(player);
    } 

}
function checkWinCondition() {
    if(movesCount === n * n) {
        alert('Победила Дружба!');
        return false;
    }

    for(const row of rows)
    {
        if(Math.abs(row) === n)
            return true;
    }

    for(const col of cols)
    {
        if(Math.abs(col) === n)
            return true;
    }

    for(const diag of diags)
    {
        if(Math.abs(diag) === n)
            return true;
    }
    return false;
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
    console.log('reset!');
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
