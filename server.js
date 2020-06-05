const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/dist/client'));
app.getMaxListeners('/*', function(req, res) {
    res.sendFile(path.join(__dirname+'/dist/client/index.html'));
});

app.listen(process.env.port || 8080);

