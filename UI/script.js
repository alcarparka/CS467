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


/* New */
var currentDir = require('path').join(__dirname);
app.use(express.static(currentDir));
//


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

app.get("/results", function(req, res, next){
    res.render('results');
});

app.post('/', function (req, res){

        var form = new formidable.IncomingForm();

        form.parse(req);

        form.on('fileBegin', function (name, file) {
           
           // for .txt
	   if (file.name.split('.').pop()=="txt")
	   {
		file.path = __dirname + '/uploads/' + 'inputFile.txt';
	   }
           
	   // for .csv
           if (file.name.split('.').pop()=="csv")
	   {
		file.path = __dirname + '/uploads/' + 'inputFile.csv';
	   }
           
        });

        form.on('file', function (name, file) {
            console.log('Uploaded ' + file.name);
        });

        
        //res.sendFile(__dirname + '/views/home.handlebars');

});


app.post('/submit-form', (req, res) => {
    const xmax = parseFloat(req.body.xmax);
    const ymax = parseFloat(req.body.ymax);
    const zmax = parseFloat(req.body.zmax);
    const xmin = parseFloat(req.body.xmin);
    const ymin = parseFloat(req.body.ymin);
    const zmin = parseFloat(req.body.zmin);
    const maxLength = req.body.maxLength;
    const binNum = req.body.binNum;

    var xdist = xmax - xmin;
    var ydist = ymax - ymin;
    var zdist = zmax - zmin;

    //If x distance is greatest
    if(xdist > ydist && xdist > zdist)
    {
        var distance = xdist;
    }
    //If y distance is greatest
    else if(ydist > xdist && ydist > zdist)
    {
        var distance = ydist;
    }
    //If z distance is greatest
    else if(zdist > xdist && zdist > ydist)
    {
        var distance = zdist;
    }
    //If x distance is equal to y distance but larger than z distance
    else if(xdist == ydist && xdist > zdist)
    {
        var distance = xdist;
    }
    //If y distance is equal to z distance but larger than x distance
    else if(ydist == zdist && ydist > xdist)
    {
        var distance = ydist;
    }
    //If z distance is equal to x distance but larger than y distance
    else if(zdist == xdist && zdist > ydist)
    {
        var distance = zdist;
    }


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
        else if (distance < maxLength)
        {
            var message = "Error! Maximum correlation length must be smaller than longest axis!";
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



app.get('/inputFileValidate', validateInputFile);

function validateInputFile(req, res) {


        console.log(__dirname);

        var spawn = require("child_process").spawn;

        var process = spawn('python3', ["./validateInputFileFinal.py"]);

        process.stdout.on('data', function(data) {

		 res.render('home', {results: data.toString()});


        })
}

/*
app.get('/calculations', calculateCorrelation);

function calculateCorrelation(req, res) {


        console.log(__dirname);

        var spawn = require("child_process").spawn;

        var process = spawn('python3', ["./wrapper.py"]);

        process.stdout.on('data', function(data) {

                res.render('home', {calculations: data.toString()});

        })
}
*/

app.get('/calculations', calculateCorrelation);

function calculateCorrelation(req, res) {


        console.log(__dirname);

        var spawn = require("child_process").spawn;

        var process = spawn('python3', ["./wrapper.py"]);

        process.stdout.on('data', function(data) {

                res.render('results', {calculations: data.toString()});

        })
}

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
