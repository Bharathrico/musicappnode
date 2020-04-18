var fixed = 0;
var lWidth = document.getElementById("seeker").offsetWidth;
var lengthleft = document.getElementById("seeker").offsetLeft;
var fill = document.getElementById("fill");
var idval = 1;
var highval = $(".songbutton").first().attr("data-id");
var playsvg = `<svg id="play" viewBox="0 0 75 86.6"><polygon points="75 43.3 0 0 0 86.6 75 43.3" fill="#a3a3a3"/></svg>`;
var pausesvg = `<svg id="pause" viewBox="0 0 110.62 195.32">
                    <path fill="#a3a3a3" d="M216.66,225.63v131H182.15v-131Zm41.6,0v131h34.51v-131Z"
                        transform="translate(-182.15 -225.63)" />
                </svg>`;
window.onresize = function () {
    lWidth = document.getElementById("seeker").offsetWidth;
    lengthleft = document.getElementById("seeker").offsetLeft;
}
function getref() {
    $('#fixedstuff').css("display", "flex");
    $('#fixedstuff').css("animation", "animvalbox 0.9s 1s ease backwards,animval 0.5s ease backwards");
    $('body').css("padding-bottom", "15vmin");
    $('#upload').css("margin-top", "70vmin");
    $('#fixedstuff').css("bottom", "0vmin");
    $('#mini').css("margin-top", "80vmin");
    $('#downarr').css("transform", "rotate(0deg)");
    fixed = 1;

}
function minify() {
    if (fixed == 1) {
        $('#fixedstuff').css("bottom", "-40vmin");
        // $('#fixedstuff').css("display", "none");
        $('#mini').css("margin-top", "90vmin");
        $('#downarr').css("transform", "rotate(180deg)");
        $('#upload').css("margin-top", "80vmin");
        $('body').css("padding-bottom", "0vmin");
        $('#fixedstuff').css("animation", "");
        fixed = 0;
    }
    else {
        fixed = 1;
        getref();
    }
}
var song = new Audio();
var lWidth = document.getElementById("seeker").offsetWidth;
var lengthleft = document.getElementById("seeker").offsetLeft;

function playsong(songname) {
    song.src = "../uploads/" + songname.getAttribute("data-song");
    song.load();
    $("#songname").html(songname.getAttribute("data-name"));
    $("#artistname").html(songname.getAttribute("data-album"));
    $("#playpause").html(pausesvg);
    idval = songname.getAttribute("id");
    console.log(idval + "highval");
    song.play();

}

function playsongfixed() {
    if (song.src == "") {
        $("#" + highval).click();
    }
    else {
        if (song.paused) {
            song.play();
            $("#playpause").html(pausesvg);

        }
        else {
            song.pause();
            $("#playpause").html(playsvg);
        }
    }
}
var fill = document.getElementById("fill");
var currentsongtime = document.getElementById("currenttime");
var durationtime = document.getElementById("durationa");
song.addEventListener('timeupdate', function () {
    var position = song.currentTime / song.duration;
    fill.style.width = position * 100 + '%';
    console.log(song.duration)
    converttime(Math.round(song.currentTime));
    durationtimecheck(Math.round(song.duration));
    idval = songname.getAttribute("id");
    if (song.currentTime == song.duration) {
        if (idval == 0) {
            nextsong();
        }
        else {
            if (idval - 1 >= 0) {
                presong();
            }
        }
    }

});
function durationtimecheck(value) {

    let min = Math.floor(value / 60);
    let sec = value % 60;
    min = (min < 10) ? "0" + min : min;
    sec = (sec < 10) ? "0" + sec : sec;
    durationtime.textContent = min + ":" + sec + " ";

}
function converttime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
    min = (min < 10) ? "0" + min : min;
    sec = (sec < 10) ? "0" + sec : sec;
    currentsongtime.textContent = min + ":" + sec + " ";
}
$('#seeker').click(function (event) {
    var lWidth = document.getElementById("seeker").offsetWidth;
    var lengthleft = document.getElementById("seeker").offsetLeft;
    var fill = document.getElementById("fill");
    console.log(event.pageX);
    console.log(lengthleft + " " + lWidth);
    var positionval = ((event.pageX - lengthleft) / lWidth * 100) - 1;
    fill.style.width = (positionval) + "%";
    console.log(positionval);
    song.currentTime = (positionval / 100) * song.duration;

});

function nextsong() {
    if ((idval - 1) >= 0) {
        idval = idval - 1;
        $("#" + idval).click();
    }
    else {
        idval = highval;
        $("#" + idval).click();
    }
}
function presong() {

    if ((+idval + 1) <= highval) {
        idval = +idval + 1;
        $("#" + idval).click();
    }
    else {
        idval = 0;
        $("#" + idval).click();
    }
}

function likepress(heart) {
    // $("#").css("fill", "red");
    // $("#").css("stroke", "none");
    if (heart.getAttribute("data-liked") == 0) {
        $("#" + heart.getAttribute("data-like") + "button").addClass("liked");
        $("#" + heart.getAttribute("data-like") + "buttonhol").css("animation", "likeanim 2s forward");
        $.ajax({
            url: 'home/' + heart.getAttribute("data-like") + '/' + heart.getAttribute("data-liked"),
            type: "POST",
            success: () => {
                console.log("sentda")
            }
        });
        heart.setAttribute("data-liked", "1");

    }
    else if (heart.getAttribute("data-liked") == 1) {
        $("#" + heart.getAttribute("data-like") + "button").removeClass("liked");
        $.ajax({
            url: 'home/' + heart.getAttribute("data-like") + '/' + heart.getAttribute("data-liked"),
            type: "POST",
            success: () => {
                console.log("sentda")
            }
        });
        heart.setAttribute("data-liked", "0");
        $("#" + heart.getAttribute("data-like") + "buttonhol").css("animation", "");
    }

    console.log();
}

$('document').ready(() => {
    $.ajax({
        url: 'likedata/',
        type: 'GET',
        success: (data) => { for (var i = data.length - 1; i >= 0; i--) { $("#" + data[i] + "button").addClass("liked"); $("#" + data[i] + "buttonhol").attr("data-liked", 1); } }
    });
});