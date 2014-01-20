var express = require('express');
var app     = express();
var http    = require('http');
var server  = http.createServer(app).listen(process.env.PORT || 5000);

app.use(express.bodyParser());

app.use('/public',      express.static(__dirname + '/public'));
app.use('/public/css',  express.static(__dirname + '/public/css'));
app.use('/public/js',   express.static(__dirname + '/public/js'));
app.use('/public/img',  express.static(__dirname + '/public/img'));

app.use(express.favicon(__dirname + '/public/favicon.ico', { maxAge: 2592000000 }))

app.get('/', function (req, resp) {
  resp.render('together-basic.ejs');
});
