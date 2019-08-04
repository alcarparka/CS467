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


/*app.get('/', function (req, res){
    res.sendFile(__dirname);
});*/

app.post('/', function (req, res){

        var form = new formidable.IncomingForm();

        form.parse(req);

        form.on('fileBegin', function (name, file) {
            //file.path = __dirname + '/uploads/' + file.name;
           //if (getExtension(file)=='txt')
	   if (file.name.split('.').pop()=="txt")
	   {
		file.path = __dirname + '/uploads/' + 'inputFile.txt';
	   }
           //if (getExtension(file)=='csv')
           if (file.name.split('.').pop()=="csv")
	   {
		file.path = __dirname + '/uploads/' + 'inputFile.csv';
	   }
           //file.path = __dirname + '/uploads/' + 'inputFile';
        });

        form.on('file', function (name, file) {
            console.log('Uploaded ' + file.name);
        });

        res.sendFile(__dirname + '/views/home.handlebars');
});


// New

app.get('/inputFileValidate', validateInputFile); 
  
function validateInputFile(req, res) { 
	
	console.log(__dirname);

	var spawn = require("child_process").spawn; 

	var process = spawn('python3', ["./validateInputFile.py"]); 

    	process.stdout.on('data', function(data) { 
        	res.send(data.toString());
    	} )
} 

/*
app.get('/name', callName); 
  
function callName(req, res) { 

var spawn = require("child_process").spawn; 

var process = spawn('python3',["./hello.py", 
                            req.query.firstname, 
                            req.query.lastname] ); 

process.stdout.on('data', function(data) { 
        res.send(data.toString()); 
    } ) 
}   
*/
// New Function ^

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
