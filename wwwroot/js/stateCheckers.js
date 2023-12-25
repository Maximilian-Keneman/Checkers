class GameStat {
    #Checkers = [];
    #Turn;
    #PlayerTurn;
    #Orientation;
    #IsClon = false;
    clone(turn) {
        let state = new GameStat(this.#PlayerTurn);
        for (let i = 0; i < 32; i++)
            state.#Checkers[i] = this.#Checkers[i];
        state.#Turn = turn;
        state.#Orientation = this.#Orientation;
        state.#IsClon = true;
        return state;
    }
    getBalance() {
        let s = 0;
        for (let i = 0; i < 32; i++)
            s += this.#Checkers[i];
        return s;
    }

    constructor(player = 1) {
        for (let i = 0; i < 32; i++)
            this.#Checkers[i] = 0;
        this.#Turn = 1;
        this.#PlayerTurn = player;
        this.#Orientation = player;
    }
    setPlayer(player) {
        this.#PlayerTurn = player;
        this.#Orientation = player;
        this.fillDefault();
    }

    toString() {
        return this.#Checkers.join("").concat(this.#Turn, this.#PlayerTurn);
    }
    checkTurn() {
        return this.#Turn === this.#PlayerTurn;
    }
    checkChecker(x, y) {
        let c = this.getChecker(x, y);
        return c === this.#Turn ||
            c === (2 * this.#Turn);
    }
    checkFalseChecker(x, y) {
        let c = this.getChecker(x, y);
        return c === -this.#Turn ||
            c === -(2 * this.#Turn);
    }
    getAllPossibleTurns() {
        let possibleCells = [];
        for (let x = 0; x < 8; x++)
            for (let y = 0; y < 8; y++)
                if (this.#corectPoint(x, y) && this.checkChecker(x, y)) {
                    let turns = this.getPossibleTurnsFrom(x, y);
                    for (let i = 0; i < turns.length; i++)
                        possibleCells.push(turns[i]);
                }
        return possibleCells.filter((val, i, arr) => arr.some(v => v.attack) == val.attack);
    }
    getPossibleTurnsFor(checkerPoint) {
        return this.getAllPossibleTurns().filter(val => (val.check.x === checkerPoint.x && val.check.y === checkerPoint.y));
    }
    getPossibleTurnsFrom(x, y) {
        function checkPoint(game, left, forward) {
            let forwardTurn = game.#Turn === game.#Orientation ? 1 : -1;
            let p = new Point(x + (left ? -1 : 1), y + (forward ? -forwardTurn : forwardTurn));
            let c = game.getChecker(p.x, p.y);
            if (c === 0 && forward)
                possibleCells.push({ check: new Point(x, y), point: p, attack: false });
            else if (game.checkFalseChecker(p.x, p.y) && !game.checkDiedCell(p.x, p.y)) {
                p.x = p.x + (left ? -1 : 1);
                p.y = p.y + (forward ? -forwardTurn : forwardTurn);
                if (0 <= p.x && p.x < 8 &&
                    0 <= p.y && p.y < 8 &&
                    game.getChecker(p.x, p.y) === 0)
                    possibleCells.push({ check: new Point(x, y), point: p, attack: true });
            }
        }
        function checkQuenPoint(game, left, forward) {
            let p = new Point(x, y);
            let a = false;
            let c;
            while (0 <= p.x && p.x < 8 &&
                   0 <= p.y && p.y < 8) {
                p.x = p.x + (left ? -1 : 1);
                p.y = p.y + (forward ? -1 : 1);
                if (0 > p.x || p.x >= 8 ||
                    0 > p.y || p.y >= 8)
                    break;
                c = game.getChecker(p.x, p.y);
                if (c === 0)
                    possibleCells.push({ check: new Point(x, y), point: new Point(p.x, p.y), attack: a });
                else if (game.checkFalseChecker(p.x, p.y) && !game.checkDiedCell(p.x, p.y)) {
                    if (a)
                        break;
                    else
                        a = true;
                }
                else if (game.checkChecker(p.x, p.y))
                    break;
            }
        }
        let checker = this.getChecker(x, y);
        let possibleCells = [];
        if (checker === 2 || checker === -2) {
            checkQuenPoint(this, true, true);
            checkQuenPoint(this, false, true);
            checkQuenPoint(this, true, false);
            checkQuenPoint(this, false, false);
        }
        else if (checker === 1 || checker === -1) {
            checkPoint(this, true, true);
            checkPoint(this, false, true);
            checkPoint(this, true, false);
            checkPoint(this, false, false);
        }
        return possibleCells;
    }
    #corectPoint(x, y) {
        return x >= 0 && x < 8 &&
            y >= 0 && y < 8 &&
            (x + y) % 2 === 1;
    }
    #getIndex(x, y) {
        return (y * 4) + Math.floor(x / 2);
    }
    getChecker(x, y) {
        if (this.#corectPoint(x, y)) {
            return this.#Checkers[this.#getIndex(x, y)];
        }
        else
            return 0;
    }
    setChecker(x, y, c) {
        if (this.#corectPoint(x, y) &&
            -2 <= c && c <= 2)
            this.#Checkers[this.#getIndex(x, y)] = c;
    }
    #DiedCells = [];
    checkDiedCell(x, y) {
        return this.#DiedCells.some(p => p.x === x && p.y === y);
    }
    moveChecker(x1, y1, x2, y2, attack = false) {
        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);
        if (this.#corectPoint(x1, y1) &&
            this.#corectPoint(x2, y2) &&
            dx === dy) {
            let newc;
            if (this.#Turn === this.#Orientation && y2 === 0)
                newc = 2 * this.#Turn;
            else if (this.#Turn !== this.#Orientation && y2 === 7)
                newc = -2 * this.#Turn;
            else
                newc = this.getChecker(x1, y1);
            this.setChecker(x2, y2, newc);
            this.setChecker(x1, y1, 0);
            let minX = Math.min(x1, x2);
            let minY = minX === x1 ? y1 : y2;
            let di = minY === Math.min(y1, y2) ? 1 : -1;
            for (let i = 1; i < dx; i++) {
                let p = new Point(minX + i, minY + di * i);
                if (this.checkFalseChecker(p.x, p.y))
                    this.#DiedCells.push(p);
            }
            if (attack && this.getPossibleTurnsFrom(x2, y2).some(v => v.attack))
                return false;
            else {
                for (let i = 0; i < this.#DiedCells.length; i++) {
                    this.setChecker(this.#DiedCells[i].x, this.#DiedCells[i].y, 0);
                }
                this.#DiedCells = [];
                if (this.#Checkers.some(c => c === -this.#Turn || c === (-2 * this.#Turn))) {
                    this.#Turn = -this.#Turn;
                    if (this.getAllPossibleTurns().length === 0 && !this.#IsClon)
                        SaveGameResult(this.#PlayerTurn !== this.#Turn);
                }
                else if (!this.#IsClon)
                    SaveGameResult(this.#PlayerTurn === this.#Turn);
                return true;
            }
        }
    }
    fillDefault() {
        for (let i = 0; i < 32; i++) {
            if (i < 12)
                this.#Checkers[i] = -this.#Orientation;
            else if (i > 19)
                this.#Checkers[i] = this.#Orientation;
            else
                this.#Checkers[i] = 0;
        }
        this.#Turn = 1;
    }
}