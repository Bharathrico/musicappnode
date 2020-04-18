var express = require('express');
var app = express();
var chalk = require('chalk');
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var session = require('express-session');
var multer = require('multer');
var ejs = require('ejs');
// var TWO_HOURS = 1000 * 60 * 60;
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "music"
});
connection.connect(function (error) {
    if (!!error) {
        console.log("error connecting to the database " + chalk.inverse.bold.red("make sure mysql is running"));

    }
    else {
        console.log(chalk.inverse.bold.blue("Database connected"));
        // let selectquery = "SELECT MAX(uploadid) AS maxval FROM uploads;"
        // connection.query(selectquery, (err, rows, fields) => {
        //     if (rows[0].maxval == null) {
        //         maxid = 1;
        //         console.log(rows[0].maxval);
        //     }
        //     else {
        //         maxid = rows[0].maxval + 1;
        //         console.log(maxid);
        //     }
        // });
    }
});
app.set('view engine', 'ejs');
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }
}));
app.post('/signup', function (req, res) {
    if (req.body.emailid == "" || req.body.pass == "" || req.body.username == "" || req.body.firstname == "" || req.body.repass == "" || req.body.lasttname == "") {
        res.redirect("/signup")
    }
    else {
        connection.query("SELECT * FROM `users` WHERE email='" + req.body.emailid + "';", function (err, rows, fields) {

            if (err || rows.length >= 1) {
                console.log("Emailid already taken");
                res.redirect("/signup")
            }
            else {

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.pass, salt, function (err, hash) {
                        // Store hash in your password DB.

                        let sendquery = " INSERT INTO `users`(`phone`, `email`, `pass`, `firstname`, `lastname`) VALUES('" + req.body.username + "','" + req.body.emailid + "','" + hash + "','" + req.body.firstname + "','" + req.body.lastname + "');";
                        connection.query(sendquery, function (err, rows, fields) {
                            if (!!err) {
                                console.log("error in query");
                            }
                            else {
                                res.redirect("/login");
                                console.log("\nsuccessfully new user added");
                                console.log(hash);
                            }
                        });
                    });
                });
            }

        });
    }
});
app.post("/login", function (req, resp) {
    if (req.body.emailid == "" || req.body.pass == "") {
        resp.redirect("/login")
    }
    else {
        let queryname = "SELECT `pass`,`id` FROM `users` WHERE `email`='" + req.body.emailid + "';";
        connection.query(queryname, function (err, rows, fields) {
            if (rows.length == 1) {
                let hash = rows[0].pass;
                bcrypt.compare(req.body.pass, hash, function (err, res) {
                    // res === true
                    if (res === true) {
                        console.log("NEW LOGIN");
                        req.session.userid = rows[0].id;
                        resp.redirect('/home')
                    }
                    else {
                        console.log("invalid");
                    }
                });
            }
            else {
                resp.send("invalid Username");
            }

        });
    }
});
app.get("/", function (req, res) {
    if (req.session.userid) {
        res.redirect("/home");
    }
    else {
        res.sendFile(__dirname + "/html/page.html");
    }
});
app.get('/signup', function (req, res) {
    if (req.session.userid) {
        res.redirect("/upload");
    }
    else {
        res.sendFile(__dirname + "/html/signup.html")
    }
});
app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        // cannot access session here

    })
    res.redirect("/");
}
);

app.get('/login', function (req, res) {
    if (req.session.userid) {
        res.redirect("/home");
    }
    else {
        res.sendFile(__dirname + "/html/login.html");
    }
});
app.get('/upload', function (req, res) {
    if (req.session.userid) {
        res.sendFile(__dirname + "/html/upload.html");
    }
    else {
        res.redirect("/");
    }
});
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, req.session.userid + "-" + Date.now() + file.originalname);
    }
});
const upload = multer({
    storage: storage
}).single('music');
app.post('/upload', function (req, res) {

    upload(req, res, (err) => {
        if (err) {
            res.send("no file");
        }
        else {
            let queryname = "SELECT `firstname` FROM `users` WHERE `id`='" + req.session.userid + "';";
            connection.query(queryname, function (err, rows, fields) {
                let queryname = "INSERT INTO `songlist`(`albumname`, `songname`, `filename`, `uploader`,`username`,`countval`,`genre`) VALUES('" + req.body.albumname + "', '" + req.body.songname + "', '" + req.file.filename + "', '" + req.session.userid + "', '" + rows[0].firstname + "', '" + 0 + "', '" + req.body.option + "'); ";
                connection.query(queryname, function (err, rowss, fields) {
                    if (!!err) {
                        console.log("error in query:" + err);
                    }
                    else {
                        console.log("succcessfully added");
                    }
                });
            });
            console.log(req.file.filename);
            res.redirect("/home");

        }
    });
});
app.get('/home', function (req, res) {
    if (req.session.userid) {
        let queryname = "SELECT `firstname` FROM `users` WHERE `id`='" + req.session.userid + "';";
        connection.query(queryname, function (err, rows, fields) {

            let queryname = "SELECT * FROM `songlist`;";
            connection.query(queryname, function (err, rowss, fields) {
                let queryname = "SELECT * FROM `likes`;";
                connection.query(queryname, function (err, rowsss, fields) {
                    console.log(rowss.length);
                    res.render(__dirname + "/html/main.ejs", { nameval: rows[0].firstname, rowssval: rowss, likesval: rowsss, idval: req.session.userid });
                });
            });
        });
    }
    else {
        res.redirect("/");
    }

});
app.get('/search/:id', function (req, res) {

});
app.listen(3000, () => {
    console.log("\nListening to port " + chalk.inverse.bold.green("3000") + "\n");
    console.log("RUNNING ON : " + chalk.underline.green("http://localhost:3000/") + "\n");
});

app.post("/home/:id/:liked", function (req, res) {
    if (req.session.userid) {
        if (req.params.liked == 0) {
            let queryname = "SELECT * FROM `likes` WHERE upid='" + req.session.userid + "' AND songid='" + req.params.id + "';"
            connection.query(queryname, function (err, rowss, fields) {
                if (err || rowss.length >= 1) {
                    console.log("error")

                }
                else {
                    let queryname = "INSERT INTO `likes`(`upid`,`songid`,`liked`) VALUES('" + req.session.userid + "','" + req.params.id + "','1'" + ");";
                    connection.query(queryname, function (err, rows, fields) {
                        if (!!err) { } else {
                            console.log("got it" + req.params.id);
                        }
                    });
                }
            });
        }
        else if (req.params.liked == 1) {
            let queryname = "DELETE FROM `likes` WHERE upid='" + req.session.userid + "' AND songid='" + req.params.id + "';";
            connection.query(queryname, function (err, rows, fields) {
                if (!!err) { console.log(err) } else {
                    console.log("deleted" + req.params.id);
                }
            });
        }
    }
});

app.get("/likedata", function (req, res) {
    let queryname = "SELECT * FROM `likes`;";
    connection.query(queryname, function (err, rows, fields) {
        var a = [];
        for (var i = rows.length - 1; i >= 0; i--) {
            if (rows[i].upid == req.session.userid) {
                a.push(rows[i].songid);
            }
        }
        res.send(a);
    });
});