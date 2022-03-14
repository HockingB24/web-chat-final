const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const dotenv = require('dotenv');
var bodyParser = require('body-parser');
var logger = require('morgan');
const path = require('path');
//const chalk = require('chalk');


app.use(bodyParser.urlencoded({
  extended: true
}));

var userRouter = require('./Routes/userRoutes');
var messageRouter = require('./Routes/messageRoutes');
dotenv.config({path: '.env'});
const mongoose = require('mongoose');

/**
 * Connect to MongoDB.
 */

 mongoose.connect(process.env.MONGODB_URI);
 mongoose.connection.on('error', (err) => {
   console.error(err);
   console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
   process.exit();
 });


 //Primary app routes 

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/chat.js', (req, res) => {
  res.sendFile(__dirname + '/chat.js');
});

app.get('/Stylesheets/styles.css', (req, res) =>{
  res.sendFile(__dirname + '/Stylesheets/styles.css');
});


app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/users', userRouter);
app.use('/messages', messageRouter);





io.on('connection', (socket) => {
  console.log('User connected.');
  socket.on('disconnect', () => {
    console.log('User disconnected.');
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) =>
  {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  })
})

io.on('connection', (socket) => {
  socket.on('message load', (msg) =>
  {
    console.log('message: ' + msg);
    socket.emit('chat message', msg);
  });
  socket.on('clear messages', (msg) =>
  {
    io.emit('clear messages', msg);
  })
})


server.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', '✓', app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});