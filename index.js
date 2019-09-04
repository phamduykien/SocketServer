var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uuid = require('uuid');
var amqp = require('amqplib');
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
  subscribeMQ();
});

/**
 * Nghe AWS MQ de nhan message
 */
function subscribeMQ() {
  amqp.connect("amqps://pdkien:12345678@b-c74ec17e-9b0a-4ef4-bc91-40ef295ae9b2-1.mq.ap-southeast-1.amazonaws.com:8162").then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  });

}