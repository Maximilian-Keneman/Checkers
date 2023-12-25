var form = document.getElementById('modalform');
var modal = document.getElementById('modalbackground');
var usericon = document.getElementById('avatar');

function OpenForm() {
    modal.classList.add('show');
}
function CloseForm() {
    modal.classList.remove('show');
}

function ChangeFormStat() {
    if (modal.classList.contains('show'))
        CloseForm();
    else
        OpenForm();
}

window.onclick = function (event) {
    if (event.target == form)
        CloseForm();
}


function getIcon(letter) {
    var canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 50;
    var context = canvas.getContext('2d');
    let red = Math.random() * 255;
    let green = Math.random() * 255;
    let blue = Math.random() * 255;
    let yiq = ((red * 299) + (green * 587) + (blue * 114)) / 1000;
    context.fillStyle = "rgb(" + red + ", " + green + ", " + blue + ")";
    context.beginPath();
    context.arc(25, 25, 24, 0, 2 * Math.PI);
    context.fill();
    context.font = "25pt sans-serif";
    context.fillStyle = yiq >= 128 ? "black" : "white";
    context.fillText(letter, 12, 50 - 15);
    usericon.src = canvas.toDataURL("image/png");
}