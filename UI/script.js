var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var fs = require('fs');
var formidable = require('formidable');
var bodyParser = require('body-parser');
var request = require('request');                       //Reqire request
var path = require('path');
app.use(bodyParser.urlencoded({ extended: false }));

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

app.post('/submit-form', (req, res) => {
    const xmax = req.body.xmax;
    const ymax = req.body.ymax;
    const zmax = req.body.zmax;
    const xmin = req.body.xmin;
    const ymin = req.body.ymin;
    const zmin = req.body.zmin;
    const maxLength = req.body.maxLength;
    const binNum = req.body.binNum;

    if ( typeof xmax !== 'undefined' && xmax && typeof ymax !== 'undefined' && ymax && typeof zmax !== 'undefined' && zmax && typeof xmin !== 'undefined' && xmin && typeof ymin !== 'undefined' && ymin && typeof zmin !== 'undefined' && zmin && typeof maxLength !== 'undefined' && maxLength && typeof binNum !== 'undefined' && binNum)
    {
        if (xmax < 0 || ymax < 0 || zmax < 0 || xmin < 0 || ymin < 0 || zmin < 0 || maxLength < 0 || binNum < 0)
        {
            var message = "Error! Please enter non-zero values!!";
            res.render('home', {message:message});
        }
        else if (xmax <= xmin || ymax <= ymin || zmax <= zmin)
        {
            var message = "Error! Max values must be greater than min values!";
            res.render('home', {message:message});
        }
        else
        {
            var data = xmax + " " + ymax + " " + zmax + " " +  xmin + " " + ymin + " " + zmin + " " + maxLength + " " + binNum;

            fs.truncate("data.txt", 0, function() {
                fs.writeFile("data.txt", data, (err) => {
                    if(err) console.log(err);
                    console.log("Successfully Written to File.");
                });
            });

            res.redirect('/');

            res.end();
        }
    }
    else
    {
        var message = "Error! Please fill out all values in the form!";
        res.render('home', {message:message});
    }


});


// New
/*
app.get("/inputFileValidate", function(req, res, next){
    res.render('inputFileValidate');
});*/


app.get('/inputFileValidate', validateInputFile); 
  
function validateInputFile(req, res) { 
        
        //res.render('inputFileValidate'); 
	
	console.log(__dirname);

	var spawn = require("child_process").spawn; 

	var process = spawn('python3', ["./validateInputFile.py"]); 
      
        var dataString = ""; 

	//var results = {"id":"YoMama"};
        //fs.readFile('__dirname/UI/uploads/inputFile.txt', 'utf8', function(err, contents) {
        //console.log(contents);
        //});
 
        //console.log('after calling readFile');
      
    	process.stdout.on('data', function(data) { 
        	//res.send(data.toString());

                res.render('inputFileValidate', {results: data.toString()});
                
        	//dataString=data.toString();
                //console.log(dataString);
    	})

        
/*function populatePre(url) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        document.getElementById('contents').textContent = this.responseText;
    };
    xhr.open('GET', url);
    xhr.send();
}
populatePre('__dirname/uploads/inputFile.txt');*/

} 

function goHome(req, res) {

setTimeout(function(){
        console.log("in goHome Function");
        res.redirect('/');
        }, 10000);
}



/*app.get('inputFileValidate2', validateInputFile);
{

console.log(__dirname);

        var spawn = require("child_process").spawn;

        var process = spawn('python3', ["./validateInputFile.py"]);*/

        /*process.stdout.on('data', function(data) { 
                 res.send(data.toString());
                          })*/
        //res.render('inputFileValidate');


/*<script>
<html>
<head>
        <title></title>
</head>
<body>



<input type="button" id="btn" value="validate results" onclick="populatePre(); log();">

<p id="fooBar"> Results of Input File Data Validation: </p>

<pre id="contents"></pre>

<script>
function populatePre(url) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        document.getElementById('contents').textContent = this.responseText;
    };
    xhr.open('GET', url);
    xhr.send();
}
populatePre('__dirname/uploads/inputFile.txt');
</script>

<script>
function log() {
console.log(__dirname);}
</script>

</body>
</html>
</script>*/


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
