const express = require('express');
const path = require('path');
const app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );

app.use(express.static(__dirname + '/dist/client'));
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname+'/dist/client/index.html'));
});

var listener = server.listen(process.env.PORT || 5000, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 5000
});