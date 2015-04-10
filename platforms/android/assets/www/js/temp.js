var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();
var dataPreparer = require('./dataPreparer');
var dataProcessor = require('./dataUploader');


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({ 
    keepExtensions: true, 
    uploadDir: __dirname + '/tmp/incoming',
    limit: '20mb'
  }));
  app.use(express.methodOverride());  
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'tmp/upload')));
  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/T2SAdmin', function(req, res) {
  res.render('index');
});

app.get('/T2SAdmin/Users', function(req, res) {
  res.render('users');
});

app.post('/', function(req, res) {

     // deleteAfterUpload(req.files.myFile.path);
        console.log(req.files.myFile.path);
        dataProcessor.importToMongo(req.files.myFile.path);
        dataProcessor.moveCSVToLocation(req.files.myFile.path,req.files.myFile.path.replace(new RegExp("incoming","g"), "processed"));
        res.render('index');
        res.end();
});

var fs = require('fs');
app.post('/file-upload', function(req, res) {
    // get the temporary location of the file
    var tmp_path = req.files.attachment.path;
    console.log("Path :"+tmp_path);
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './tmp/upload/' + req.files.attachment.name;
    console.log("Target Path :"+target_path);
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.send('File uploaded to: ' + target_path + ' - ' + req.files.attachment.size + ' bytes');
        });
    });
});

dataPreparer.getMessageDataFromMongo();
//dataPreparer.getUserTemplateData();


var csvParser = require('csv');
app.get('/T2SAdmin/messageTemplate', function (req, res) {
  //res.attachment();
  res.writeHead(200, { 'Content-Type': 'text/csv' });
  //fs.createReadStream(csvReport).pipe(res);
  csvParser().from(csvMessageReport).to(res);
});
app.get('/T2SAdmin/usersTemplate', function (req, res) {
  //res.attachment();
  res.setHeader('Content-disposition', 'attachment; filename=UserTemplate.csv');
  res.writeHead(200, { 'Content-Type': 'text/csv' });
  //fs.createReadStream(csvReport).pipe(res);
  
  dataPreparer.getUserTemplateData();
  if(req.param('userType') == "Student")
      {
        setTimeout( function(){
        csvParser().from(csvUserTemplate).to(res);
        console.log("Prepared CSV data file for User Type : "+req.param('userType'));
        }, 5 * 1000);
      }
    if(req.param('userType') == "Parent")
      {
        setTimeout( function(){
        csvParser().from(csvUserTemplate).to(res);
        console.log("Prepared CSV data file for User Type : "+req.param('userType'));
        }, 5 * 1000);
      }
    if(req.param('userType') == "Teacher")
      {
        setTimeout( function(){
        csvParser().from(csvUserTemplate).to(res);
        console.log("Prepared CSV data file for User Type : "+req.param('userType'));
        }, 5 * 1000);
      }
    if(req.param('userType') == "Staff")
      {
        setTimeout( function(){
        csvParser().from(csvUserTemplate).to(res);
        console.log("Prepared CSV data file for User Type : "+req.param('userType'));
        }, 5 * 1000);
      }
  
  
});
app.get('/T2SAdmin/attendanceTemplate', function (req, res) {
  //res.attachment();
  
  res.writeHead(200, { 'Content-Type': 'text/csv' });
  //fs.createReadStream(csvReport).pipe(res);
  csvParser().from(csvReport).to(res);
});
app.get('/T2SAdmin/marksheetTemplate', function (req, res) {
  //res.attachment();
  res.writeHead(200, { 'Content-Type': 'text/csv' });
  //fs.createReadStream(csvReport).pipe(res);
  csvParser().from(csvReport).to(res);
});
app.get('/T2SAdmin/schoolCalendarTemplate', function (req, res) {
  //res.attachment();
  res.writeHead(200, { 'Content-Type': 'text/csv' });
  //fs.createReadStream(csvReport).pipe(res);
  csvParser().from(csvReport).to(res);
});
app.get('/T2SAdmin/schoolClassesSectionsTemplate', function (req, res) {
  //res.attachment();
  res.writeHead(200, { 'Content-Type': 'text/csv' });
  //fs.createReadStream(csvReport).pipe(res);
  csvParser().from(csvReport).to(res);
});

// Start the app

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

/* Private functions

var fs = require('fs');

var deleteAfterUpload = function(path) {
  setTimeout( function(){
    fs.unlink(path, function(err) {
      if (err) console.log(err);
      console.log('file successfully deleted');
    });
  }, 60 * 1000);
};
*/
