var animation = bodymovin.loadAnimation({
    container: document.getElementById('anim'),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: '../assets/data.json'
})
var email = document.getElementById("email");
var pass = document.getElementById("pass");
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

function checkval() {
    if (email.value == "" || pass.value == "") {
        alert("fields are empty");
    }
}