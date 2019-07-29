var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var formidable = require('formidable');
var bodyParser = require('body-parser');
var request = require('request');                       //Reqire request
var path = require('path');
const fs = require('fs');
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


app.get('/', function (req, res){
    res.sendFile(__dirname);
});

app.post('/', function (req, res){

    if(req.body['Add File'])
    {
        var form = new formidable.IncomingForm();

        form.parse(req);

        form.on('fileBegin', function (name, file){
            file.path = __dirname + '/uploads/' + file.name;
        });

        form.on('file', function (name, file){
            console.log('Uploaded ' + file.name);
        });

        res.sendFile(__dirname);
        return;
    }

    if(req.body['Calculate']) {
        console.log('Create text file');

        var xmax = document.getElementById(xmax);
        var ymax = document.getElementById(ymax);
        var zmax = document.getElementById(zmax);

        var xmin = document.getElementById(xmin);
        var ymin = document.getElementById(ymin);
        var zmin = document.getElementById(zmin);

        var maxLength = document.getElementById(maxLength);
        var minLength = document.getElementById(minLength);

        var binNum = document.getElementById(binNum);

        let data = new Buffer(
            '\rX Maximum:' + xmax.value + '\r\n' +
            'Y Maximum: ' + ymax.value + '\r\n' +
            'Z Maximum: ' + zmax.value + '\r\n\r\n' +
            'X Minimum: ' + xmin.value + '\r\n' +
            'Y Minimum: ' + ymin.value + '\r\n' +
            'Z Minimum: ' + zmin.value + '\r\n\r\n' +
            'Maximum Correlation Length: ' + maxLength.value + '\r\n' +
            'Minimum Correlation Length: ' + minLength.value + '\r\n' +
            'Number of bins: ' + binNum.value);

        let path = '/uploads/datafile.txt'

        fs.open(path, 'w', function (err, fd) {
            if (err) {
                throw 'could not open file: ' + err;
            }

            fs.write(fd, data, 0, data.length, null, function (err) {
                if (err) throw 'error writing file: ' + err;
                fs.close(fd, function () {
                    console.log('wrote the file successfully');
                });
            });
        });
    };
});



/*app.get('/', function (req, res){
    res.sendFile(__dirname + '/myGraphs');
    console.log('in app.Get');
});

app.post('/', function (req, res){
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploads/' + file.name;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    });

    res.sendFile(__dirname + '/myGraphs');
    console.log('in app.Post');
});



app.post('/userSubmitFile', (req, res) => {
  new formidable.IncomingForm().parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error', err)
      throw err
    }
    console.log('Fields', fields)
    console.log('Files', files)
    files.map(file => {
      console.log(file)
    })
  })
})

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
})*/

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


