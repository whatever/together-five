/**
 * Server
 */
var express = require("express"),
    app = express(),
    http = require("http"),
    https = require("https"),
    server = http.createServer(app).listen(process.env.PORT),
    io = require("socket.io").listen(server),
    fs = require("fs")
    ;

app.use(express.bodyParser());
app.use('/public', express.static(__dirname + '/public'));
app.use('/public/css', express.static(__dirname + '/public/css'));
app.use('/public/js', express.static(__dirname + '/public/js'));
app.use('/public/img', express.static(__dirname + '/public/img'));

app.use(express.favicon(__dirname + '/public/favicon.ico', { maxAge: 2592000000 }))

app.get("/", function (req, resp) {
  resp.render("index.ejs");
});

app.get('/humans.txt', function (req, resp) {
  fs.readFile("public/humans.txt", "utf-8", function (err, data) {
    resp.set('Content-Type', 'text/plain');
    resp.send(data);
  });
});

app.get('/robots.txt', function (req, resp) {
  fs.readFile("public/robots.txt", "utf-8", function (err, data) {
    resp.set('Content-Type', 'text/plain');
    resp.send(data);
  });
});
