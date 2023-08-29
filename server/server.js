const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose') 
const cors = require('cors');
const crypto = require('crypto');
const path = require("path");

const routes = require('./routes/BackOffice')

const app = express();
const PORT = 5002;
const url = 'mongodb://127.0.0.1:27017/ServerBank'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(cors());

app.use('/', routes);
const imagesFolderPath = path.join(__dirname, 'public', 'images');
// const imagesFolderPath = path.join('public', 'Images');
app.get('/get-image/:filename', (req, res) => {
    console.log(imagesFolderPath)
    const filename = req.params.filename;
    const imagePath = path.join(imagesFolderPath, filename);
    console.log(imagePath)
    res.sendFile(imagePath);
  });

app.listen(PORT, function(err) {
    if(err) throw err;
    console.log("Server Listening on Port", PORT)
})