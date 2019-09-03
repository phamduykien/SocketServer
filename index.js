var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var AWS = require('aws-sdk');
var uuid = require('uuid');
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
  var creds = new AWS.Credentials('akid', 'secret');
  var options = {
    endpoint: "https://b-c74ec17e-9b0a-4ef4-bc91-40ef295ae9b2-1.mq.ap-southeast-1.amazonaws.com:8162",
    //credentials: creds
  };
  var mq = new AWS.MQ(options);
  mq.createBroker({ Users: [{ Password: "123456789", Username: "pdkien" }] }, function (err, data) {
    if (err) {
      // an error occurred
      console.log(err, err.stack);
    }
    else {
      // successful response
      console.log(data);
    }
  });
}