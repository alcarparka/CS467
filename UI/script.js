var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var session = require('express-session');
var formidable = require('formidable');
var bodyParser = require('body-parser');
var request = require('request');                       //Reqire request
var path = require('path');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:'SuperSecretPassword'}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 9293);

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res, next){
    res.render('home');
});

app.get("/resources", function(req, res, next){
    res.render('resources');
});

app.get('/myGraphs',function(req,res,next){
    var context = {};
    console.log(context);
    res.render('myGraphs', context);
});

app.post('/userFileSubmit', (req, res) => {
  new formidable.IncomingForm().parse(req)
    .on('field', (name, field) => {
      console.log('Field', name, field)
    })
    .on('file', (name, file) => {
      console.log('Uploaded file', name, file)
    })
    .on('aborted', () => {
      console.error('Request aborted by the user')
    })
    .on('error', (err) => {
      console.error('Error', err)
      throw err
    })
    .on('end', () => {
      res.end()
    })
})

app.use(function(req,res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Express started on port ' + app.get('port') + '; press Ctrl-C to terminate.');
});


