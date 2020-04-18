var pass = document.getElementById("password");
var pass2 = document.getElementById("password2");
var email = document.getElementById("email");
var username = document.getElementById("username");
var firstname = document.getElementById("firstname");
var lastname = document.getElementById("lastname");
var checkbox = document.getElementById("checkboye");
function checkeer() {

    if (pass2.value == '') {
        $('#password2').css("border-color", "#00ADff");

    }
    else if (pass.value != pass2.value) {
        $('#password2').css("border-color", "red");
    }
    else if (pass.value == pass2.value) {
        $('#password2').css("border-color", "#00ADff");
    }
}
function validateemail() {
    if (email.value == "") {
        $('#email').css("border-color", "#00ADff");
    }
    else if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value))) {
        $('#email').css("border-color", "#00ADff");
    }
    else {
        $('#email').css("border-color", "red");
    }
}

function openterms() {
    document.getElementById("termholder").style.display = "flex";
}

function closeterms() {
    document.getElementById("termholder").style.display = "none";
}

function checkval() {
    if (pass.value == "" || pass2.value == "" || email.value == "" || username.value == "" || lastname.value == "" || firstname.value == "") {
        alert("Some fields are empty");
        if (checkbox.checked == false) {
            alert("Check the terms and conditions");
        }
    }

}

function phonecheck() {
    var phoneno = /^[0-9]+$/;
    if (username.value.match(phoneno)) {
        $('#username').css("border-color", "#00ADff");
    }
    else {

        $('#username').css("border-color", "red");
    }
}
