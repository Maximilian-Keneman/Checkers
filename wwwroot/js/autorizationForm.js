function changeForm() {
    $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
}

const password = document.getElementById('regpsw');
const repeatPassword = document.getElementById('rpsw');

repeatPassword.addEventListener("input", function (e) {
    if (repeatPassword.value !== password.value)
        repeatPassword.setCustomValidity('Passwords not equals');
    else
        repeatPassword.setCustomValidity('');
});