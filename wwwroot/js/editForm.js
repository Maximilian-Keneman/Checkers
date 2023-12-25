const check = document.getElementById('pswch');
const password = document.getElementById('psw');
const repeatPassword = document.getElementById('rpsw');

repeatPassword.addEventListener("input", function (e) {
    if (repeatPassword.value !== password.value)
        repeatPassword.setCustomValidity('Passwords not equals');
    else
        repeatPassword.setCustomValidity('');
});

check.addEventListener("change", (e) => {
    if (e.currentTarget.checked) {
        password.removeAttribute('disabled');
        repeatPassword.removeAttribute('disabled');
    }
    else {
        password.setAttribute('disabled', 'disabled');
        repeatPassword.setAttribute('disabled', 'disabled');
    }
});

function DeleteProfile() {
    if (confirm("Do you want delete your profile? It is permonent action and can't undo!"))
        document.location = 'Profile/Delete';
}