function drawTable() {
    const strokeStyle = context.strokeStyle;
    const lineWidth = context.lineWidth;
    const fillStyle = context.fillStyle;

    for (let x = 0; x < 8; x++)
        for (let y = 0; y < 8; y++) {
            if ((x + y) % 2 === 1)
                context.fillStyle = "#613404";
            else
                context.fillStyle = "#C27E36";
            context.fillRect(x * CellSize, y * CellSize, CellSize, CellSize);
            drawChecker(new Point(x, y), Game.getChecker(x, y));
        }

    strokeCell(selectedCell, "#AB0000", CellSize / 12);
    for (let i = 0; i < possibleCells.length; i++)
        strokeCell(possibleCells[i].point, "#FBFF00", CellSize / 12);
    strokeCell(showCell, "#2662A3", CellSize / 20);

    context.strokeStyle = "#000000";
    context.lineWidth = CellSize / 20;
    context.strokeRect(0, 0, 8 * CellSize, 8 * CellSize);

    context.strokeStyle = strokeStyle;
    context.lineWidth = lineWidth;
    context.fillStyle = fillStyle;
}
function strokeCell(position, color, width) {
    if (0 <= position.x && position.x < 8 &&
        0 <= position.y && position.y < 8) {
        context.strokeStyle = color;
        context.lineWidth = width;
        context.strokeRect(position.x * CellSize, position.y * CellSize, CellSize, CellSize);
    }
}
function drawChecker(position, checker) {
    const fillStyle = context.fillStyle;
    const strokeStyle = context.strokeStyle;
    const lineWidth = context.lineWidth;

    context.beginPath();
    context.arc((position.x + 0.5) * CellSize, (position.y + 0.5) * CellSize, CellSize * 0.4, 0, Math.PI * 2);
    context.closePath();
    switch (checker) {
        case -2:
            context.fillStyle = "#333333";
            context.fill();
            drawCrown(position, CellSize * 0.5, checker);
            break;
        case -1:
            context.fillStyle = "#333333";
            context.fill();
            break;
        case 1:
            context.fillStyle = "#DDDDDD";
            context.fill();
            break;
        case 2:
            context.fillStyle = "#DDDDDD";
            context.fill();
            drawCrown(position, CellSize * 0.5, checker);
            break;
        default:
            context.fillStyle = fillStyle;
            context.strokeStyle = strokeStyle;
            return;
    }
    if (Game.checkDiedCell(position.x, position.y))
        context.lineWidth = 2;
    context.strokeStyle = Game.checkDiedCell(position.x, position.y) ? "red" : (checker > 0 ? "black" : "#AAAAAA");
    context.stroke();

    context.fillStyle = fillStyle;
    context.strokeStyle = strokeStyle;
    context.lineWidth = lineWidth;
}
function drawCrown(position, crownSize, checker) {
    const fillStyle = context.fillStyle;
    const strokeStyle = context.strokeStyle;

    let originX = position.x * CellSize + (CellSize - crownSize) / 2;
    let originY = position.y * CellSize + (CellSize - crownSize) / 2;

    const crown = new Path2D();
    crown.moveTo(originX + 0.1 * crownSize, originY + crownSize);
    crown.lineTo(originX, originY);
    crown.lineTo(originX + 0.33 * crownSize, originY + 0.6 * crownSize);
    crown.lineTo(originX + 0.5 * crownSize, originY);
    crown.lineTo(originX + 0.67 * crownSize, originY + 0.6 * crownSize);
    crown.lineTo(originX + crownSize, originY);
    crown.lineTo(originX + 0.9 * crownSize, originY + crownSize);
    crown.closePath();

    if (checker === 2) {
        context.fillStyle = "#333333";
    }
    else if (checker === -2) {
        context.fillStyle = "#DDDDDD";
    }
    else {
        context.fillStyle = fillStyle;
        context.strokeStyle = strokeStyle;
        return;
    }
    context.fill(crown);
    context.strokeStyle = "#000000";
    context.stroke(crown);

    context.fillStyle = fillStyle;
    context.strokeStyle = strokeStyle;
}