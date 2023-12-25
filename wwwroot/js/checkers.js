class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

const gamebox = document.getElementById("gamebox");
const context = gamebox.getContext("2d");
const CellSize = 60;
const Game = new GameStat(1);

const showCell = new Point(-1, -1);
const selectedCell = new Point(-1, -1);
var possibleCells = [];
var turnContinue = false;

startGame();

function startGame() {
    Game.fillDefault();
    drawTable();
    if (!Game.checkTurn())
        botTurn();
}

gamebox.addEventListener("mousemove", function (e) {
    showCell.x = Math.floor(Math.abs(e.pageX - this.offsetLeft) / CellSize);
    showCell.y = Math.floor(Math.abs(e.pageY - this.offsetTop) / CellSize);
    drawTable();
});
gamebox.addEventListener("mouseup", function (e) {
    if (Game.checkTurn()) {
        if (Game.checkChecker(showCell.x, showCell.y)) {
            if (!turnContinue)
                if (selectedCell.x === showCell.x &&
                    selectedCell.y === showCell.y)
                    deselectChecker();
                else
                    selectChecker();
        }
        else if (possibleCells.findIndex(p => p.point.x === showCell.x && p.point.y === showCell.y) !== -1)
            selectTurn(possibleCells.find(p => p.point.x === showCell.x && p.point.y === showCell.y).attack);
        drawTable();
    }
});

function deselectChecker() {
    selectedCell.x = -1;
    selectedCell.y = -1;
    possibleCells = [];
}
function selectChecker() {
    selectedCell.x = showCell.x;
    selectedCell.y = showCell.y;
    possibleCells = Game.getPossibleTurnsFor(selectedCell);
}
function selectTurn(attack) {
    if (Game.moveChecker(selectedCell.x, selectedCell.y, showCell.x, showCell.y, attack)) {
        deselectChecker();
        turnContinue = false;
    }
    else {
        selectChecker();
        turnContinue = true;
    }
    drawTable();
    if (!Game.checkTurn())
        setTimeout(botTurn, 500);
}
function botTurn() {
    function checkVariant(game, turn, count, counter = 0) {
        let mind = game.clone();
        if (mind.moveChecker(turn.check.x, turn.check.y, turn.point.x, turn.point.y, turn.attack) && !mind.checkTurn()) {
            counter++;
            if (counter >= count)
                return mind.getBalance();
        }
        let variants = mind.getAllPossibleTurns();
        for (let i = 0; i < variants.length; i++) {
            checkVariant(mind, variants[i], count, counter)
        }
        return mind.getBalance();
    }
    let variants = Game.getAllPossibleTurns();
    let chose = { min: Game.getBalance(), variants: [] };
    for (let i = 0; i < variants.length; i++) {
        let s = checkVariant(Game, variants[i], 5);
        if (s == chose.min) {
            chose.variants.push(variants[i]);
        }
        else if (s < chose.min) {
            chose.min = s;
            chose.variants = [variants[i]];
        }
    }

    variants = chose.variants;
    let nextmin = 100;
    variants.forEach(v => {
        let bal = checkVariant(Game, v, 1);
        if (bal < nextmin)
            nextmin = bal;
    });
    variants = variants.filter(v => checkVariant(Game, v, 1) == nextmin && (
        0 <= v.point.x && v.point.x < 8 &&
        0 <= v.point.y && v.point.y < 8)
    );
    let ch = Math.floor(Math.random() * variants.length);
    Game.moveChecker(variants[ch].check.x, variants[ch].check.y, variants[ch].point.x, variants[ch].point.y, variants[ch].attack);
    if (!Game.checkTurn())
        botTurn();
    drawTable();
}
function SaveGameResult(isPlayerWin) {
    $.ajax({
        url: 'GameEnd',
        data: { isPlayerWin: isPlayerWin }
    });
    drawTable();
    alert(isPlayerWin ? 'You win!' : 'You lose!');
    Game.setPlayer(1);
    startGame();
}