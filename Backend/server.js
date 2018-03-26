const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const session = require('express-session');

// config
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://192.168.0.101:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-SESSION-TOKEN, Access-Control-Allow-Credentials');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    next()
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(fileUpload());

const sess = {
    secret: "YOUR$UP3R$3CR3T",
    resave: true,
    saveUninitialized: true
};
app.use(session(sess));

const port = 3001 // TODO: config

// routes
const GameController = require('./controllers/game')
app.use('/api/v1/game', GameController.router)

const server = {
    instance: null
}

//const socket = require('./modules/socket')

const start = () => {
    server.instance = app.listen(port, function () {
        console.log('Express server listening on port ' + port)
    })
    //socket.startServer()
}

exports.start = start
